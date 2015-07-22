// Count number of passengers at bus stop
// client.run(busStopRiderCount, function(err, response){
//   $('#numRidersAtStop').html(response.result);
// });

// Funnel analysis to find out who is actually on the bus
var funnelPeople = new Keen.Query("funnel", {
  steps: [
    {
     "event_collection": "BusStop",
     "actor_property": "card",
     "timeframe": "this_1_days"
    },
    {
     "event_collection": "BusOn",
     "actor_property": "card",
     "timeframe": "this_1_days"
    },
    {
     "event_collection": "BusOff",
     "actor_property": "card",
     "timeframe": "this_1_days"
    }
  ]
});

// Check if stop '1234' has been requested
var hasStopBeenRequested = new Keen.Query("select_unique", {
  eventCollection: "stopRequest",
  targetProperty: "stopnum",
  timeframe: "this_2_minutes",
  timezone: "UTC"
});

client.run(hasStopBeenRequested, function(err, response){
  if ($.inArray('1234', response.result) !== -1) {
    $('.driver-stop-description.upcoming-stop').hide();
    $('.driver-stop-description.stop-requested').show();
    $('.driver-interface').addClass('driver-interface-stop-requested');
  }
});


client.run(funnelPeople, function(err, response){
  // if (err) handle the error
  var peopleAtStop = Number(response.result[0]);
  var peopleOnBus = Number(response.result[1]);
  var peopleOffBus = Number(response.result[2]);

  console.log(peopleOnBus);

  var numPeopleOnBoard = (peopleOnBus-peopleOffBus);
  $('#numOnBoard').html(numPeopleOnBoard);
  $('#numRidersAtStop').html(peopleAtStop);
});
