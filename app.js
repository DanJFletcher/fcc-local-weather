// Open Weather API Key:
// 10ca70fb75d57ae7608f05eeb97452ca

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.body.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      document.body.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      document.body.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      document.body.innerHTML = "An unknown error occurred."
      break;
  }
}

$(document).ready(function() {

  var celcius = true,
    description = "",
    temp = "",
    city = "",
    country = "",
    icon = "",
    lat = "25",
    lon = "30";

  $('#celcius').click(function() {
    celcius = true;
    updateWeather();
  });

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
    $(".content").html("<div class='city'>" + city + ", " + country + "</div>" +
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
