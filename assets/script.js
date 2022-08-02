

// loc ---> store loc ---> get data ---> check lat/lon ---> compare ----> return top 5
var beachList = [];
var poslat= ""
var poslon= ""

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}
//finding the entered lat/lon

$("#searchBeach").on("click", function (){
    var searchVal=$("#searchVal").val();
    var weatherAPIurl="http://api.openweathermap.org/geo/1.0/direct?q="+searchVal+"&appid=d572ae73424a51099cdef316a3e66b68"
    fetch(weatherAPIurl).then(function(res){
      return res.json();
    }).then(function(data){
      poslat= data[0].lat
      poslon= data[0].lon
      getBeachdata();
    })
      
   });

// function fetchCoords(url){

// }

//pulling data from the coastal api
function getBeachdata(){

$.ajax({
    url: "https://api.coastal.ca.gov/access/v1/locations/",
    method: "GET"    
}).then (function (res){
    

    
   

    for (var i = 0; i < res.length ; i++) {
        // if this location is within 0.1KM of the user, add it to the list
        if (distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K") <= 20) {
            // text += '<p>' + res[i].NameMobileWeb + " "+ distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K") +'</p>';
            // console.log(text)
            var beach= {
              beachName: res[i].NameMobileWeb,
              beachDistance: distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K"),            
            }
            beachList.push(beach);
        }
    }
    beachList.sort(function(a,b){
    return a.beachDistance-b.beachDistance
    })

  console.log(beachList)
  var text = ""
  for (var i = 0; i < 4 ; i++){
    text += '<p>' + beachList[i].beachName + " "+ beachList[i].beachDistance +'</p>';
  }

 $('#tempDisplay').append(text);   

  })};

var search = document.getElementById("searchVal");
var saveButton = document.getElementById("searchBeach");

  function saveSearch() {
    var searchSave = {
      search: search.value.trim()
    };
    localStorage.setItem("searchSave", JSON.stringify(searchSave));
  }
  function renderLastSearch() {
    var lastSearch = JSON.parse(localStorage.getItem("searchSave"));
    if (lastSearch !== null) {
    document.getElementById("saved-search").innerHTML = lastSearch.search;
    } else {
      return;
    }
  }
  saveButton.addEventListener("click", function(event) {
    event.preventDefault();
    saveSearch();
    renderLastSearch();
    });

    function init() {
      renderLastSearch();
    }
    init();

    $("#saved-search").on("click", function (){
      var searchVal=$("#searchVal").val();
      var weatherAPIurl="http://api.openweathermap.org/geo/1.0/direct?q="+searchVal+"&appid=d572ae73424a51099cdef316a3e66b68"
      fetch(weatherAPIurl).then(function(res){
        return res.json();
      }).then(function(data){
        poslat= data[0].lat
        poslon= data[0].lon
        getBeachdata();
      })
        
     });
  

  //Or this one

//   function distance(position1,position2){
//     var lat1=position1.latitude;
//     var lat2=position2.latitude;
//     var lon1=position1.longitude;
//     var lon2=position2.longitude;
//     var R = 6371000; // metres
//     var φ1 = lat1.toRadians();
//     var φ2 = lat2.toRadians();
//     var Δφ = (lat2-lat1).toRadians();
//     var Δλ = (lon2-lon1).toRadians();

//     var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//         Math.cos(φ1) * Math.cos(φ2) *
//         Math.sin(Δλ/2) * Math.sin(Δλ/2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//     var d = R * c;
//     return d;
// }

// var closest=locations[0];
// var closest_distance=distance(closest,position.coords);
// for(var i=1;i< 4 ;i++){
//     if(distance(locations[i],position.coords)<closest_distance){
//          closest_distance=distance(locations[i],position.coords);
//          closest=locations[i];

         
//     $('#tempDisplay').append(closest);

//     }
// }
 
