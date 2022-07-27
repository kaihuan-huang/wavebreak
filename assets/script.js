

// loc ---> store loc ---> get data ---> check lat/lon ---> compare ----> return top 5



//finding the entered lat/lon

$("#searchBeach").on("click", function (){
    var searchVal=$("#searchVal").val();
    var weatherAPIurl="http://api.openweathermap.org/geo/1.0/direct?q="+searchVal+"&appid=d572ae73424a51099cdef316a3e66b68"
    fetchCoords(weatherAPIurl);
});

// function fetchCoords(url){

// }

//pulling data from the coastal api

$.ajax({
    url: "https://api.coastal.ca.gov/access/v1/locations/",
    method: "GET"
}).then (function (res){
    console.log(res)});

    var beachLocations = res



    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }

// data.push ();