$(function () {
  var pulse = io.connect('http://nodepulse.dev/pulse');
  var pulse_data = [];
  pulse.on('pulse', function (data) {
    pulse_data.push(data)
    pulse_data.shift();

    plot.setData([ parse_data() ]);
    plot.draw();
  });

  function parse_data () {
    var res = [];

    for (var i = 0; i < pulse_data.length; ++i) {
      res.push([i, pulse_data[i] ])
    }

    return res;
  }

  // pre-fill pulse_data with all zeroes
  var totalPoints = 50;
  while (pulse_data.length < totalPoints) {
    pulse_data.push(0);
  }

  // setup plot
  var options = {
      series: { shadowSize: 0 }, // drawing is faster without shadows
      yaxis: { min: 20, max: 50 },
      xaxis: { show: false }
  };

  var plot = $.plot($("#placeholder"), [ parse_data() ], options);
});