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
var users = {};
var rooms = {};
var returnCode = {
	"succ":{"code": 0, "msg": "succ"},
	"error":{"code": 1, "msg": "error"}
};
var onMessage = {
	'getUid': function(socket, data){
		var type = data.type;
		var user = User.selectUser();
		user.socket = socket;
		user.login = true;
		var data = {
			"userInfo":{"uid":user.id, "nick":user.nick}
		};
		users[user.id] = user;
		socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
	},
	'getRid': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		user = User.selectUser(_uid);
		room = new Room(user);
		rooms[room.roomId] = room;
		var data = {
			"rid":room.roomId
		};
		socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
	},
    'join': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		var _rid = data.param.rid;
		room = Room.selectRoom(_rid);
		room.users[_uid] = User.selectUser(_uid);
		var data = {
			"rUid":room.rUid,
		};
		var j = 0;
		for(var i in room.users){
			data["userList"][j]["uid"] = room.users[i].id;
			data["userList"][j]["nick"] = room.users[i].nick;
			j++;
		}
		for(var i in room.users){
			room.users.socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
	},
	'start': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		var _rid = data.param.rid;
		var data = {};
		room = Room.selectRoom(_rid);
		if(_uid != room.rUid){
			socket.emit('message',  respond(returnCode.error.code, returnCode.error.msg, type, data));
			return false;
		}
		room.game
		var data = {
			"rUid":room.rUid,
		};
		var j = 0;
		for(var i in room.users){
			data["userList"][j]["uid"] = room.users[i].id;
			data["userList"][j]["nick"] = room.users[i].nick;
			j++;
		}
		for(var i in room.users){
			room.users.socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
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
	  socket
  });
});

/****************************************/
/*
/*
/*
/*/

function respond(code, msg, type, data){
	var pkg = {
		"returnCode":code,
		"returnMsg":msg,
		"type":type,
		"returnData":data,
	};
	return pkg;
}
function User(){
	this.id = uid++;
	this.nick = 'iguess_' + this.id;
	this.roomId = 0;
	this.socket = null;
	this.login;
};

User.selectUser = function(uid){
	if(uid){
		return users[uid];
	}
	for(var i in users){
		if(!users[i].login){
			return users;
		}
	}
	return new User();
};

function Room(user){
	this.maxNum = 5;
	this.roomId = rid++;
	this.rUid = user.id;
	this.lock = 0;
	this.game = null;
    this.users = {};
    this.users[user.id] = user;
}

Room.selectRoom = function(rid){
	return rooms[rid];
}

function Game(){
	this.totalRound = 10;
	this.round = 1;
	this.question = {};
	this.qUid = null;
	this.gUid = null;
}