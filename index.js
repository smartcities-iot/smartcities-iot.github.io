var client = new Keen({
    projectId: "55907f6bd2eaaa236e17a521",
    readKey: "e21923dd742fe25ccdfe441827a502fb1db71888ad0444d11bfab92459aa1e103cdf1574f982de3f1da67191e7d5b397b7926791b8af60a2b59f964557b7d10dc8980d85abcbbe60e03008eb306557d8ac2297fb62d1362db0269b8854acacb6da744b5c4970c783a26db17ec28c58ca"
});

var stopCount = new Keen.Query("count_unique", {
  eventCollection: "BusStop",
  targetProperty: "stopnum"
});

var riderCount = new Keen.Query("count_unique", {
  eventCollection: "BusStop",
  eventCollection: "BusOn",
  eventCollection: "BusOff",
  targetProperty: "card"
});

var checkInCount = new Keen.Query("count_unique", {
    eventCollection: "BusStop",
    /*groupBy: "stopnum",*/
    targetProperty: "card",
    interval: "minutely",
    timeframe: "this_5_minutes"
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

var freqStopCount = new Keen.Quwey("count", {
  eventCollection: "BusStop",
  filters: [{"operator":"eq","property_name":"stopnum","property_value":1234}],
  groupBy: "card",
  targetProperty: "stopnum"
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
}

client.run(riderCountToday, function(err, response){
$('#ridersToday').html(response.result[0].value);
});

client.run(checkInCount, function(err, response){
  $('#riderCheckIn').html(response.result[0].value);
});
//Count number of passengers per bus
client.run(passengerCount, function(err, response){
  $('#numPassengers').html(response.result[0].result);
  $('#busNumber').html(response.result[0].stopnum);
  $('#numCars').html(Math.floor(response.result[0].result/1.5));
});

//Count number of times the user with card:"\u00026F007F51A8E9" was at a stopnum:12
client.run(freqStopCount, function(err, response){
  $('#checkIns').html(response.result[0].result);
  $('#riderID').html(response.result[0].card);

});

client.draw(count, document.getElementById("chart"), {
  chartType: "areachart",
    title: false,
    height: 250,
    width: "auto",
    chartOptions: {
      chartArea: {
        height: "75%",
        left: "10%",
        top: "5%",
        width: "60%"
      },
      isStacked: true
    }
});

// client.run(count, function(err, response){
//   // if (err) handle the error
//   $("body").html(response.result);
//   console.log(response.result); // 100
// });
