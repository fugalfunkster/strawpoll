/* jshint node: true */

'use strict';

function callback(data) {

  var parsedData = JSON.parse(data);

  var formatedData = parsedData[0].options.map(function(each) {
    return [each.name, each.count];
  });

  var xLabels = [];
  var yValues = [];
  for (var i = 0; i < formatedData.length; i++) {
    xLabels.push([i, formatedData[i][0]]);
    yValues.push([i, formatedData[i][1]]);
  }

  var votes = [yValues];

  Flotr.draw(document.getElementById('chart'), votes, {
    bars: {
      show: true,
      barWidth: 0.75,
      shadowSize: 0,
      fillOpacity: 1,
      lineWidth: 0
    },
    yaxis: {
      min: 0,
      tickDecimals: 0
    },
    xaxis: {
      ticks: xLabels
    },
    grid: {
      horizontalLines: false,
      verticalLines: false,
    }
  });

}
