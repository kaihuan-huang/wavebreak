
// var today = new Date();
// var date = today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear();
// console.log(today);
// $('.time').append(today);
var beachList = [];
var poslat = "";
var poslon = "";


//calculation for distance calculation

function distance(
  lat1, lon1, lat2, lon2, unit
) {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;

  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}

//finding the entered lat/lon with open weather api

$("#searchBeach").on("click", function (event) {
  event.preventDefault();
  var searchVal = $("#searchVal").val();
  console.log("searchVal", searchVal);
  var weatherAPIurl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    searchVal +
    "&appid=d572ae73424a51099cdef316a3e66b68";
  fetch(weatherAPIurl
  ).then(function (res) {
    return res.json();
  }
  ).then(
    function (data) {
      poslat = data[0].lat;
      poslon = data[0].lon;
      getBeachdata();
    });
});

//pulling data from the coastal api

function getBeachdata() {
  $.ajax({
    url: "https://api.coastal.ca.gov/access/v1/locations/",
    method: "GET",
  }).then(function (res) {
    console.log("beachData", res);
    $("#cardImage").html("")
    beachList = [];
    for (var i = 0; i < res.length; i++) {
      // if this location is within 0.1KM of the user, add it to the list
      if (distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K") <= 20) {
        // text += '<p>' + res[i].NameMobileWeb + " "+ distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K") +'</p>';
        // console.log(text)
        var beach = {
          beachName: res[i].NameMobileWeb,
          beachDistance: distance(poslat, poslon, res[i].LATITUDE, res[i].LONGITUDE, "K"),
          description: res[i].DescriptionMobileWeb,
          beachImage: res[i].Photo_1,
          beachDescription: res[i].DescriptionMobileWeb,
          beachParking: res[i].PARKING,
          beachDogs: res[i].DOG_FRIENDLY,
        };
        beachList.push(beach);
      }
    }
    beachList.sort(function (a, b) {
      return (
        a.beachDistance - b.beachDistance);
    });

    console.log("nearbyBeachList", beachList);

    //adds cards of beach data to html

    for (var i = 0; i < 6; i++) {

      var cardDiv = $('<div class="card">');
      var cardImage = $('<img>').attr('src', beachList[i].beachImage);
      var cardP = $('<p>').text("Beach Name: " + beachList[i].beachName);
      var cardDistance = $('<p>').text("Beach Distance: " + beachList[i].beachDistance.toFixed(1) + "Miles");
      var cardDescribe = $('<p>').text("Description: " + beachList[i].beachDescription);
      var cardDog = $('<p>').text("Dog Friendly: " + beachList[i].beachDogs);
      var cardParking = $('<p>').text("Parking: " + beachList[i].beachParking);
      cardDiv.append(cardImage, cardP, cardDistance, cardDescribe, cardDog, cardParking);
      console.log(cardDiv);
      $("#cardImage").append(cardDiv);

    }

  });
}


//saving the search value to button under searchbar

var search = document.getElementById("searchVal");
var saveButton = document.getElementById("searchBeach");

function saveSearch() {
  var searchSave = {
    search: search.value.trim()
  };
  localStorage.setItem("searchSave", JSON.stringify(searchSave));
}
function renderLastSearch() {
  var lastSearch = JSON.parse(localStorage.getItem("searchSave"))["search"];
  if (lastSearch) {
    // document.getElementById("saved-search").innerHTML = lastSearch.search;
    var button = document.createElement("button")
    button.setAttribute("data-val", lastSearch);
    button.classList.add("button")
    button.textContent = lastSearch
    var container = document.getElementById("saved-search")
    container.append(button)
  } else {
    return;
  }
}
saveButton.addEventListener("click", function (event) {
  event.preventDefault();
  saveSearch();
  renderLastSearch();
});

function init() {
  renderLastSearch();
}
init();

//making the added buttons clickable and usable

$(".historyButton").on("click", function (event) {
  console.log(event.target.getAttribute("data-val"));
  lastSearch = event.target.getAttribute("data-val");

  var weatherAPIurlHistory =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    lastSearch +
    "&appid=d572ae73424a51099cdef316a3e66b68";
  fetch(weatherAPIurlHistory
  ).then(function (res) {
    return res.json();
  }
  ).then(
    function (data) {
      poslat = data[0].lat;
      poslon = data[0].lon;
      getBeachdata();
    });
});

