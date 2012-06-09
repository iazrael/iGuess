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
			"userList":{}
		};
		for(var i in room.users){
			data["userList"][room.users[i].id] = {};
			data["userList"][room.users[i].id]["uid"] = room.users[i].id;
			data["userList"][room.users[i].id]["nick"] = room.users[i].nick;
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
		room.game = new Game();
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
		try{
			cb(socket, data);
		}
		catch(e){
			console.log(data);
			socket.emit('message', respond(returnCode.error.code, returnCode.error.msg, data.type, null));
		}
    }else{
      socket.emit('message', data);
    }
  });

  socket.on('disconnect', function (data) {
      console.log(data);
	  for(var i in users){
		var user = users[i];
		if(user.login && user.socket == socket){
			var room = Room.selectRoom(user.roomId);
            console.log(user);
			//房主掉线了
			if(room.rUid == user.id){
				for(var j in room.users){
					users[room.users[j].id].logout();
					room.users[j] = null;
				}
			}
			//其它玩家掉线
			else{
				for(var j in room.users){
					if(room.users[j].id == user.id){
						users[room.users[j]].logout();
						room.users[j] = null;
					}
				}
			}
			var n = 0;
			for(var j in room.users){
				if(room.users[j]){
					n++;
				}
			}
			//剩下一名玩家，不能再继续游戏了
			if(n == 1){
				for(var j in room.users){
					if(room.users[j]){
						users[room.users[j]].logout();
						room.users[j] = null;
					}
				}
			}
			break;
		}
	  }
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
User.logout = function(){
	this.login = false;
	if(this.socket){
		this.socket.close();
	}
}

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

Game.selectQUid = function(room){
	for(var i in room.users){
		if(room.users[i].id != room.rUid){
			return room.users[i].id;
		}
	}
}