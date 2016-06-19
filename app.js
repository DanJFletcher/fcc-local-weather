// Open Weather API Key:
// 10ca70fb75d57ae7608f05eeb97452ca

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      $(".weather-view").html( "User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      $(".weather-view").html( "Location information is unavailable.");
      break;
    case error.TIMEOUT:
      $(".weather-view").html( "The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      $(".weather-view").html( "An unknown error occurred.");
      break;
  }
}

var celcius = true,
  description = "",
  temp = "",
  city = "",
  country = "",
  icon = "",
  lat = "25",
  lon = "30";

$(document).ready(function() {

// So here's what we want to do.
// Using the places autocomplete api we want to get
// The city, region and country from the user.
// From which we want to get geo locations using perhpas the google maps api
// Then we want to look up the city.list.json for the associated city _id
// Which gives us the most accurate weather results from the openweathermaps api.

// Algorithm for finding city _id based on geo location from google.
// First find a match for City and country code.
// Then get the lng and lat, round to some number wich is still TBD,
// to match against the google lng, and lat which will almost always
// differ from openweathermap's lng and lat.

// google places autocomplete api
var input = document.getElementById('search');
var options = {types: ['(cities)']};
autocomplete = new google.maps.places.Autocomplete(input, options);

// When the user selects an address from the dropdown, set the lat and lon attributes.
autocomplete.addListener('place_changed', placeChanged);
function placeChanged() {
  lat = autocomplete.getPlace().geometry.location.lat();
  lon = autocomplete.getPlace().geometry.location.lng();
  requestWeather();
}


  // If celcius button clicked
  // set to show degrees in celcius.
  $('#celcius').click(function() {
    celcius = true;
    updateWeather();
  });

  // If fehrenheit button is clicked,
  // set to show degrees in fehrenheit.
  $('#fehrenheit').click(function() {
    celcius = false;
    updateWeather();
  });

  if (navigator.geolocation) {
    var options = {
      timeout: 3000,
      enableHighAccuracy: false,
      maximumAge: 10000
    };
    navigator.geolocation.getCurrentPosition(function(pos) {

      lat = pos.coords.latitude;
      lon = pos.coords.longitude;

      requestWeather();
    }, showError);
  }

  var updateWeather = function() {
    // set temp to celcius or fehrenheit
    var newTemp = celcius ? temp + '&#8451;' :
    Math.round(temp * 9 / 5 + 32) + '&#8457;';
    $(".content p").html("");
    $(".weather-view").html("<div class='city'>" + city + ", " + country + "</div>" +
      "<div class='temp'>" + "<img src='http://openweathermap.org/img/w/" +
      icon + ".png' alt='weathericon'>" +
      newTemp + "</div>" +
      "<div class='description'>" + description + "</div>");
  }

  var requestWeather = function() {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&APPID=10ca70fb75d57ae7608f05eeb97452ca", function(json) {

      description = json.weather[0].description.toLowerCase();
      temp = Math.round(json.main.temp);
      city = json.name;
      country = json.sys.country;
      icon = json.weather[0].icon;

      updateWeather();

    });
  };

});
