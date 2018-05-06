/*
  Authors: Dillon de Silva (Codetilldrop)
           Buddhike de Silva (buddyspike)
*/

var ctx = document.getElementById("acceleration-chart").getContext("2d");
var highest_acc = document.getElementById("highest-acc");
var average_acc = document.getElementById("average-acc");
var highestAcceleration = 0;

highest_acc.innerHTML = highestAcceleration;
function init() {
  var chart;
  var accelerationData = [];
  var time = [];

  fetch('/stats')
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      var start = res.length - 50;
      start = Math.max(start, 0);
      for (var i = 0; i <= 50; i++) {
        time.push(i);
      }
      for (var i = start; i < res.length; i++) {
        accelerationData.push(res[i].acceleration);
      }
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: time,
          datasets: [{
            data: accelerationData,
            backgroundColor: '#4890CF',
            borderColor: '#4890CF',
            label: "Acceleration (mG)",
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              gridLines: [{
                display: false
              }]
            }],
            yAxes: [{
              gridLines: {
                display: false
              },
              display: true,
              ticks: {
                beginAtZero: true,
                steps: 100,
                stepValue: 50,
                max: 5000
              }
            }]
          },
        }
      })
    })
    .then(function () {
      var socket = new WebSocket('ws://localhost:9000/events', 'protocolOne');
      socket.onmessage = function (event) {
        var record = JSON.parse(event.data);
        if (record.acceleration > highestAcceleration) {
          highestAcceleration = record.acceleration;
          highest_acc.innerHTML = "Highest Acceleration Achieved: " + String(highestAcceleration);
        }

        if (accelerationData.length > 50) {
          accelerationData.shift();
        }

        var averageAcceleration = 0;
        for (var i in accelerationData) {
          averageAcceleration += accelerationData[i];
        }

        averageAcceleration = averageAcceleration / accelerationData.length;
        average_acc.innerHTML = "Average Acceleration (mG): " + String(averageAcceleration);
        accelerationData.push(record.acceleration);
        chart.update();
      };
    });
}

init();
