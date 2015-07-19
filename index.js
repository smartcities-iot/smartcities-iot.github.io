var client = new Keen({
    projectId: "55907f6bd2eaaa236e17a521",
    readKey: "e21923dd742fe25ccdfe441827a502fb1db71888ad0444d11bfab92459aa1e103cdf1574f982de3f1da67191e7d5b397b7926791b8af60a2b59f964557b7d10dc8980d85abcbbe60e03008eb306557d8ac2297fb62d1362db0269b8854acacb6da744b5c4970c783a26db17ec28c58ca",
    writeKey: "632fb8ad6f50f434a8d7d04b63a55da291a971e3b260df04cd4cb3809346870da9729f1ea7f8c40007cb96a726869808efff15ab174e982de77d1c70d55861142e2ee8a9efafb7f0b3010d96ba93bf23cc9eee5e794ebe233cca625fa95e244e6beba72ba1cd2b9d6686e83adc384da7"
});

var stopCount = new Keen.Query("count_unique", {
  eventCollection: "motion",
  targetProperty: "stopnum"
});

var busStopRiderCount = new Keen.Query("count_unique", {
  eventCollection: "stopRequest",
  targetProperty: "card"
});

var riderCount = new Keen.Query("count_unique", {
  eventCollection: "motion",
  targetProperty: "card"
});

var count = new Keen.Query("count", {
    eventCollection: "motion",
    groupBy: "stopnum",
    interval: "minutely",
    timeframe: {
      start: "2015-06-29T00:00:00.000Z",
      end: "2015-06-30T00:00:00.000Z"
    }
});

var passengerCount = new Keen.Query("count", {
  eventCollection: "BusOn",
  groupBy: "stopnum"
});

//Distance between two points
var travelTime = new Keen.Query("extraction", {
    eventCollection: "motion",
     filters: [{"operator":"eq","property_name":"stopnum","property_value":8679}],
      timeframe: {"end":"2015-07-09T23:00:00.000+00:00","start":"2015-07-02T22:06:00.000+00:00"}
});

//Declare variables of type Date
var date = new Date()
var currentTime = date.getTime(); //current time in milliseconds since 1970

client.run(stopCount, function(err, response){
  $('#numStops').html(response.result);
});

client.run(riderCount, function(err, response){
  $('#numRiders').html(response.result);
});

//Count number of passengers per bus
client.run(passengerCount, function(err, response){
  $('#numPassengers').html(response.result[0].result);
  $('#busNumber').html(response.result[0].stopnum);
  $('#numCars').html(Math.floor(response.result[0].result/1.5));
});

// Count number of passengers at bus stop
client.run(busStopRiderCount, function(err, response){
  $('#numRidersAtStop').html(response.result);
});

// Check if stop '1234' has been requested
var hasStopBeenRequested = new Keen.Query("select_unique", {
  eventCollection: "stopRequest",
  targetProperty: "stopnum",
  timeframe: "this_14_days",
  timezone: "UTC"
});

client.run(hasStopBeenRequested, function(err, response){
  console.log(response.result);
  if ($.inArray('1234', response.result) !== -1) {
    $('.driver-stop-description.upcoming-stop').hide();
    $('.driver-stop-description.stop-requested').show();
    $('.driver-interface').addClass('driver-interface-stop-requested');
  }
});

//Calculate distance, travel time, and arrival time between two points
client.run(travelTime, function(err, response){
  $('#latitude').html(response.result[0].latitude);
  $('#longitude').html(response.result[0].longitude);

  //Base Coordinates (UWaterloo): 43.4689° N, 80.5400° W
  var distance = 1000*Math.sqrt((Math.pow(110.57*(Number(response.result[0].latitude)+80.5400),2))+(Math.pow(111.32*(Number(response.result[0].longitude)-43.4689),2)));

  $('#distance').html(distance.toFixed(0));
  $('#time').html((1000*Math.sqrt((Math.pow(110.57*(Number(response.result[0].latitude)+80.5400),2))+(Math.pow(111.32*(Number(response.result[0].longitude)-43.4689),2))))/4.17);
  //Parse the time into hours, minutes, and seconds
  $('#hours').html(Math.floor(((1000*Math.sqrt((Math.pow(110.57*(Number(response.result[0].latitude)+80.5400),2))+(Math.pow(111.32*(Number(response.result[0].longitude)-43.4689),2))))/4.17)/3600));

  var minutes = Math.floor((((1000*Math.sqrt((Math.pow(110.57*(Number(response.result[0].latitude)+80.5400),2))+(Math.pow(111.32*(Number(response.result[0].longitude)-43.4689),2))))/4.17)%3600)/60);
  $('#minutes').html(minutes);
  if (minutes === 1) {
    $('.minutes-plural').hide();
  }
  $('#seconds').html(Math.floor((((1000*Math.sqrt((Math.pow(110.57*(Number(response.result[0].latitude)+80.5400),2))+(Math.pow(111.32*(Number(response.result[0].longitude)-43.4689),2))))/4.17)%3600)%60));

  var arrivalTime = new Date(((currentTime)+1000*((1000*Math.sqrt((Math.pow(110.57*(Number(response.result[0].latitude)+80.5400),2))+(Math.pow(111.32*(Number(response.result[0].longitude)-43.4689),2))))/4.17)))
  $('#arriveTime').html(arrivalTime)
});

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


// Map

var map;
var uWaterlooLocation = [43.468980, -80.5400]
function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 12,
    center: {lat: uWaterlooLocation[0], lng: uWaterlooLocation[1]}
  });

  // replace marker with latest GPS response location
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Bus location'
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
