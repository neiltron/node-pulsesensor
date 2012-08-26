$(function () {
  var pulse = io.connect('/pulse'),
      pulse_data = [],
      plot,
      totalPoints = 100,
      lastPeak = Date.now(),
      peakDiffs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      freq = 0,
      y_min = 20,
      y_max = 50;

  pulse.on('pulse', function (data) {
    pulse_data.push(data)
    pulse_data.shift();

    plot.setData([ parse_data() ]);
    plot.draw();

    if (data < pulse_data[totalPoints - 2] - .2) {
      freq = Date.now() - lastPeak;
      lastPeak = Date.now();

      peakDiffs.push(freq);
      peakDiffs.shift();

      var peak_sum = 0;
      for (var i = 0; i < peakDiffs.length; i++) {
        peak_sum += peakDiffs[i];
      }
      heart_rate = ((peak_sum / peakDiffs.length) / 1000) * 60;
      console.log(heart_rate);
    }
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

    plot = $.plot($("#placeholder"), [ parse_data() ], options);
  }

  $('#placeholder').css({
    width: '100%',
    height: $('body').height() + 'px'
  })

  setup(y_min, y_max);
});