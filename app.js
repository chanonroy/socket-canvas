var express = require('express');
app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;

// Static
app.use(express.static(__dirname + '/public'));

// Controller
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// In-memory store for lines
var line_history = [];

// Socket Connections
io.on('connection', function (socket) {
  // send history to new client
  for (var i in line_history) {
   socket.emit('draw_line', { line: line_history[i] } );
  }
  // add handler for message type "draw_line"
  socket.on('draw_line', function (data) {
    // add received line to history
    line_history.push(data.line);
    // send line to all clients
    io.emit('draw_line', { line: data.line });
  });
});

server.listen(port);
console.log("Server running on port " + port);
