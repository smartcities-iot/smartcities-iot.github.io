// Count number of passengers at bus stop
client.run(busStopRiderCount, function(err, response){
  $('#numRidersAtStop').html(response.result);
});
