var peak_detect_offset = 20;
var peak_mininum_interval = 300;

$(function () {
  var socket = io.connect('http://localhost:8082'),
      pulse_data = [],
      plot,
      totalPoints = 100,
      lastPeak = Date.now(),
      peakDiffs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      freq = 0,
      y_min = 20,
      y_max = 50;

  var drawFinished = true;

  socket.on('pulse', function (data) {
    if (!drawFinished) {
      return;
    }
    drawFinished = false;

    pulse_data.push(data)
    pulse_data.shift();

    plot.setData([ parse_data() ]);
    plot.draw();

    if (data > (pulse_data[totalPoints - 10] + peak_detect_offset)) {
      freq = Date.now() - lastPeak;
      // debounce
      if (freq > peak_mininum_interval) {
        lastPeak = Date.now();
        peakDiffs.push(freq);
        peakDiffs.shift();
        var heart_rate = parseInt(60 * 1000 / freq * 100 / 100, 10)
        // remove aberations
        if (heart_rate > 50 && heart_rate < 150) {
          $('#heartrate').html(heart_rate);
          $('span.heart').css('fontSize', '32pt');
          setTimeout(() => {
            $('span.heart').css('fontSize', '22pt');
          }, 100)
        } else {
          $('#heartrate').html("0");
        }
      }
    }
    drawFinished = true;
  });

  // pre-fill pulse_data with all zeroes
  while (pulse_data.length < totalPoints) {
    pulse_data.push(0);
  }

  var parse_data = function () {
    var res = [],
        min = max = pulse_data[0];

    for (var i = 0; i < pulse_data.length; ++i) {
      if (max < pulse_data[i]) { max = pulse_data[i]; }
      if (min < pulse_data[i]) { min = pulse_data[i]; }

      res.push([i, pulse_data[i] ])
    }

    //reset graph center if line is outside min/max range
    if (min - 10 < y_min || max + 5 > y_max) {
      setup(min - 10, max + 5);
    }

    return res;
  }

  var setup = function (min, max) {
    //save min/max to global cars so we can center the graph
    y_min = min;
    y_max = max;

    var options = {
        colors: [ '#333' ],
        series: {
          shadowSize: 0,
        },
        yaxis: { show: false, min: min, max: max },
        xaxis: { show: false },
        grid: { show: true, borderWidth: 0 },
    };
    if ($("#placeholder").height() > 0) {
      plot = $.plot($("#placeholder"), [ parse_data() ], options);
    }
  }

  $('#placeholder').css({
    width: '100%',
    height: '100%'
  })

  setup(y_min, y_max);
});
