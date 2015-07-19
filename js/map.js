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

// Google Maps map
var map;
var uWaterlooLocation = [43.468980, -80.5400]
function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 12,
    center: {lat: uWaterlooLocation[0], lng: uWaterlooLocation[1]}
  });

  // TODO: replace marker with latest GPS response location
  var marker = new google.maps.Marker({
      position: {lat: uWaterlooLocation[0], lng: uWaterlooLocation[1]},
      map: map,
      title: 'Bus location'
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
