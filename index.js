var client = new Keen({
    projectId: "55907f6bd2eaaa236e17a521",
    readKey: "e21923dd742fe25ccdfe441827a502fb1db71888ad0444d11bfab92459aa1e103cdf1574f982de3f1da67191e7d5b397b7926791b8af60a2b59f964557b7d10dc8980d85abcbbe60e03008eb306557d8ac2297fb62d1362db0269b8854acacb6da744b5c4970c783a26db17ec28c58ca"
});

var stopCount = new Keen.Query("count_unique", {
  eventCollection: "motion",
  targetProperty: "stopnum"
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

client.run(stopCount, function(err, response){
  $('#numStops').html(response.result);
});

client.run(riderCount, function(err, response){
  $('#numRiders').html(response.result);
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
// Jad's first push lol
// Jad has branched out
