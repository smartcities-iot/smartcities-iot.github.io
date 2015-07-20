// Count number of passengers at bus stop
client.run(busStopRiderCount, function(err, response){
  $('#numRidersAtStop').html(response.result);
});

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

client.run(funnelPeople, function(err, response){
  // if (err) handle the error
  var numPeopleOnBoard = (response.result[1]) - (response.result[2]);
  $('#numOnBoard').html(numPeopleOnBoard);
});
