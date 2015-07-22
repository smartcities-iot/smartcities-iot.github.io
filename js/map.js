// Click events
$('.change-stop-action-button').on('click', function() {
  $('.change-route-container').show();
});

$('.map-card-request-button').on('click', function() {
  var stopRequest = {
    card: '1234',
    stopnum: '1234',
    keen: {
      timestamp: new Date().toISOString()
    }
  }
  $('.map-card-request-button').html('Stop requested').attr('disabled', 'disabled');
  // Sends to "stopRequest" collection
  client.addEvent("stopRequest", stopRequest);
});

// Getting bus' latest location ping
var busLocationQuery = new Keen.Query("extraction", {
    eventCollection: "GPS",
    timeframe: "this_4_days",
    filters: [{"operator":"ne","property_name":"latitude","property_value":"0.0000000"}],
    latest: 700
});

//Count number of times the user with card:"\u00026F007F51A8E9" was at a stopnum:12
var freqStopCount = new Keen.Query("count", {
  eventCollection: "BusStop",
  groupBy: "card"
});


client.run(freqStopCount, function(err, response){
  var numCheckIns = response.result[0].result;
  $('#checkIns').html(numCheckIns);
  if (numCheckIns === 1) {
    $('.times-plural').hide();
  }
  // $('#riderID').html(response.result[0].card);
});



var busLocation; // default to uWaterloo

client.run(busLocationQuery, function(err, response) {
  var latestLocation = response.result[1];
  function initialize() {
    var busLocation = [Number(latestLocation.latitude), Number((-1)*latestLocation.longitude)];
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 16,
      center: {lat: 43.4726725, lng: -80.542215617}
    });

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        var infowindow = new google.maps.InfoWindow({
          map: map,
          position: pos,
          content: 'Location found using HTML5.'
        });

        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'Current location'
        });

        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
  function handleNoGeolocation(errorFlag) {
    var marker = new google.maps.Marker({
      position: {lat: 43.4726725, lng: -80.542215617},
      map: map,
      title: 'Current location'
    });
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }
  }

  var marker = new google.maps.Marker({
      position: {lat: busLocation[0], lng: busLocation[1]},
      map: map,
      title: 'Bus location'
  });

  var busCoordinates = [];
  for (i = 0; i < 600; i ++) {
    var locationMarker = response.result[i];
    var busLocation = [Number(locationMarker.latitude), Number((-1)*locationMarker.longitude)];
    busCoordinates[i] = new google.maps.LatLng(busLocation[0], busLocation[1]);

  }
  var busPath = new google.maps.Polyline({
    path: busCoordinates,
    geodesic: true,
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 5,
  });
  busPath.setMap(map);

  }

  var map;
  initialize();
});
