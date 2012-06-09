var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8088);

function handler (req, res) {
  fs.readFile(__dirname + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + req.url);
    }
    res.writeHead(200);
    res.end(data);
  });
}

var uid = 1;
var rid = 1;
var onMessage = {
  'getuid': function(socket, data){
    socket.emit('message', { type: 'getuid', uid: uid++ });
  },
  'getrid': function(socket, data){
    socket.emit('message', { type: 'getrid', rid: rid++ });
  }
};


io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    // socket.emit('news', { hello: 'world' });
    var cb, data = JSON.parse(data);
    if(cb = onMessage[data.type]){
      cb(socket, data);
    }else{
      socket.emit('message', data);
    }
  });

  socket.on('disconnect', function (data) {
      // console.log(data);
  });
});
