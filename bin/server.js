var five = require("johnny-five"),
    express = require("express"),
    app = express(),
    http = require("http"),
    server = require('http').Server(app);
    io = require('socket.io')(server);

app.use(express.static('public'));

server.listen(8082);

var board = new five.Board();

board.on("ready", function() {

  board.info('Board', 'ready');

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 10
  });

  sensor.scale([ 0, 100 ]).on("change", function() {
    io.sockets.emit('pulse', this.scaled)
  });

});
