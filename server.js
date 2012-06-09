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
		var user = User.selectUser(_uid);
		var room = new Room(user);
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
		var room = Room.selectRoom(_rid);
		if(!room){
			throw('room not exsits');
		}
		var user = User.selectUser(_uid);
		if(!user.login){
			throw('user:' + _uid +' not login');
		}
		room.join(user);
		var data = {
			"rUid":room.rUid,
			"userList":{}
		};
		var u, d;
		for(var i in room.users){
			d = {};
			u = room.users[i];
			d['uid'] = u.id;
			d['nick'] = u.nick;
			data.userList[u.id] = d;
		}
		// console.log('json', data);
		for(var i in room.users){
			room.users[i].socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
	},
	'start': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		var _rid = data.param.rid;
		var data = {};
		var room = Room.selectRoom(_rid);
		if(_uid != room.rUid){
			throw('user:' + _uid + ' is not room creator');
		}
		room.game = new Game();
		room.game.start();
		var data = {
			"qUid":room.game.qUid
		};
		for(var i in room.users){
			room.users.socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
	},
	'question': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		var _rid = data.param.rid;
		var question = data.param.question;
		var data = {};
		room = Room.selectRoom(_rid);
		if(_uid != room.rUid){
			
		}
		room.game = new Game();
		room.game.start();
		var data = {
			"qUid":room.game.qUid
		};
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
		 // try{
			cb(socket, data);
		 // }
		 // catch(e){
		 // 	console.log({'connect':e});
		 // 	socket.emit('message', respond(returnCode.error.code, returnCode.error.msg, data.type, null));
		 // }
    }else{
      socket.emit('message', data);
    }
  });

  socket.on('disconnect', function (data) {
	  try{
		  console.log(data);
		  for(var i in users){
			var user = users[i];
			if(user.login && user.socket == socket){
				user.socket = null;
				var room = Room.selectRoom(user.roomId);
				//房主掉线了
				if(room.rUid == user.id){
					for(var j in room.users){
						room.users[j].logout();
						room.users[j] = null;
						delete room.users[j];
					}
					rooms[roomId] = null;
					delete rooms[roomId];
				}
				//其它玩家掉线
				else{
					// console.log(room.users);
					for(var j in room.users){
						if(room.users[j].id == user.id){
							room.users[j].logout();
							room.users[j] = null;
							delete room.users[j];
						}
					}
					// console.log(room.users);
				}
				// var n = 0;
				// for(var j in room.users){
				// 	if(room.users[j]){
				// 		n++;
				// 	}
				// }
				//剩下一名玩家，不能再继续游戏了
				// if(n == 1){
				// 	for(var j in room.users){
				// 		if(room.users[j]){
				// 			room.users[j].logout();
				// 			room.users[j] = null;
				// 			delete room.users[j];
				// 		}
				// 	}
				// 	rooms[roomId] = null;
				// 	delete rooms[roomId];
				// }
				break;
			}
		  }
	  }
      catch(e){
    	  // console.log({'disconnect':e});
      }
  });
});

/**
/*
/*
/*
/*/

function respond(code, msg, type, data){
	var pkg = {
		"returnCode":code,
		"returnMsg":msg,
		"type":type,
		"returnData":data
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
User.prototype.logout = function(){
	this.login = false;
	if(this.socket){
		try{
			this.socket.close();
		}catch(e){}//TODO
		this.socket = null;
		this.roomId = 0;
	}
};

User.selectUser = function(uid){
	if(uid){
		return users[uid];
	}
	// for(var i in users){
	// 	if(!users[i].login){
	// 		return users[i];
	// 	}
	// }
	return new User();
};

function Room(user){
	this.maxNum = 5;
	this.roomId = rid++;
	this.rUid = user.id;
	this.lock = 0;
	this.game = null;
    this.users = {};
    user.roomId = this.roomId;
    this.users[user.id] = user;
};
Room.prototype.join = function(user){
	user.roomId = this.roomId;
	this.users[user.id] = user;
};

Room.selectRoom = function(rid){
	return rooms[rid];
};

function Game(){
	this.totalRound = 10;
	this.round = 1;
	this.question = {};
	this.qUid = null;
	this.gUid = null;
};

Game.prototype.start = function(room){
	room.lock = true;
	var randTime = 5;
	while(randTime--){
		for(var i in room.users){
			if(Math.random() > 0.2){
				this.qUid = room.users[i].id;
				return;
			}
		}
	}
	this.qUid = room.rUid;
	return;
};

