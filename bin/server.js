var five = require("johnny-five"),
    express = require("express"),
    app = express(),
    http = require("http"),
    server = require('http').Server(app);
    io = require('socket.io')(server);

app.use(express.static('public'));
server.listen(8082);

var board = new five.Board({port: '/dev/cu.usbmodem1411'});

io.on('connection', function(socket){
  board.on("ready", function() {
    var sensor = new five.Sensor({
      pin: "A0",
      freq: 250
    });

    sensor.scale([ 0, 100 ]).on("change", function() {
      socket.emit('pulse', this.scaled)
    });
  });
});
