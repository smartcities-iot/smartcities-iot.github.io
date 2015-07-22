var client = new Keen({
    projectId: "55907f6bd2eaaa236e17a521",
    readKey: "e21923dd742fe25ccdfe441827a502fb1db71888ad0444d11bfab92459aa1e103cdf1574f982de3f1da67191e7d5b397b7926791b8af60a2b59f964557b7d10dc8980d85abcbbe60e03008eb306557d8ac2297fb62d1362db0269b8854acacb6da744b5c4970c783a26db17ec28c58ca",
    writeKey: "632fb8ad6f50f434a8d7d04b63a55da291a971e3b260df04cd4cb3809346870da9729f1ea7f8c40007cb96a726869808efff15ab174e982de77d1c70d55861142e2ee8a9efafb7f0b3010d96ba93bf23cc9eee5e794ebe233cca625fa95e244e6beba72ba1cd2b9d6686e83adc384da7"
});

var stopCount = new Keen.Query("count_unique", {
  eventCollection: "BusStop",
  targetProperty: "stopnum"
});

var busStopRiderCount = new Keen.Query("count_unique", {
  eventCollection: "BusStop",
  targetProperty: "card"
});

var riderCount = new Keen.Query("count_unique", {
  eventCollection: "BusStop",
  eventCollection: "BusOn",
  eventCollection: "BusOff",
  targetProperty: "card"
});

var checkInCount = new Keen.Query("count_unique", {
  eventCollection: "BusStop",
  /*groupBy: "stopnum", */
  targetProperty: "card",
  interval: "minutely",
  timeframe: "this_5_minutes"
});

var passengerCount = new Keen.Query("count", {
  eventCollection: "BusOn",
  groupBy: "stopnum"
});

var riderCountToday = new Keen.Query("count_unique", {
  eventCollection: "BusOff",
  targetProperty: "card",
  interval: "daily",
  timeframe: "this_day"
});

//Distance between two points
var travelTime = new Keen.Query("extraction", {
    eventCollection: "GPS",
    timeframe: "this_3_days",
    latest: 10
});

//Declare variables of type Date
var date = new Date()
var currentTime = date.getTime(); //current time in milliseconds since 1970

client.run(riderCountToday, function(err, response){
$('#ridersToday').html(response.result[0].value);
});

//Count number of passengers per bus
client.run(passengerCount, function(err, response){
  $('#numPassengers').html(response.result[0].result);
  $('#busNumber').html(response.result[0].stopnum);
  $('#numCars').html(Math.floor(response.result[0].result/1.5));
});

// client.run(stopCount, function(err, response){
//   $('#numStops').html(response.result);
// });

// client.run(riderCount, function(err, response){
//   $('#numRiders').html(response.result);
// });

//Count number of passengers per bus
client.run(passengerCount, function(err, response){
  $('#numPassengers').html(response.result[0].result);
  $('#busNumber').html(response.result[0].stopnum);
  $('#numCars').html(Math.floor(response.result[0].result/1.5));
});

client.run(checkInCount, function(err, response){
  $('#riderCheckIn').html(response.result[0].value);

  // Declares the number of people getting on at the next bus stop as busCheckInCount
  var busCheckInCount = response.result[0].value;

  client.run(busStopRiderCount, function(err, response){
      // Declares the number of people getting off the bus as busStopCount
      var busStopCount = response.result;

    //Calculate distance, travel time, and arrival time between two points
    client.run(travelTime, function(err, response){
      $('#latitude').html(response.result[0].latitude);
      $('#longitude').html(response.result[0].longitude);

      // Calculates distance between data point and base coordinates (43.4731° N, 80.5400° W) (E5 Computer lab)
      var distance = 1000*Math.sqrt((Math.pow(110.57*(Number(response.result[0].latitude)+80.5400),2))+(Math.pow(111.32*(Number(response.result[0].longitude)-43.4731),2)));
      // Assumes an average bus speed of 15 km/hour
      if ((busStopCount === 0) && (busCheckinCount === 0)) {
        var time = (distance/4.17);
      // Adds 5+1n seconds for every n offboarding passenger and n onboarding passenger
      } else {
        var time = ((distance/4.17)+5+busStopCount+busCheckInCount);
      }

      $('#distance').html(distance.toFixed(0));

      //Parse the time into minutes and seconds
      var minutes = Math.floor((time%3600)/60);
      $('#minutes').html(minutes);
      $('#toStopMinutes').html(minutes+2);
      if (minutes === 1) {
        $('.minutes-plural').hide();
      }

      var seconds = Math.floor((time%3600)%60)
      $('#seconds').html(seconds);
      if (seconds === 1) {
        $('.seconds-plural').hide();
      }

      // Determines the arrival time of the bus
      var arrivalTime = new Date(currentTime+1000*time)
      $('#arriveTime').html(arrivalTime)
    });
  });
});

if (Math.floor((Math.random() * 2) + 1) === 2) {
  $('.stat-num-cars').hide();
  $('.stat-num-riders').show();
} else {
  $('.stat-num-cars').show();
  $('.stat-num-riders').hide();
}
