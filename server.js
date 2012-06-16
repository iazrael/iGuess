var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80088);

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
var nickSet = [
    "johnnyguo", 
    "stonehuang", 
    "tealin", 
    "bridge", 
    "Jetyu", 
    "milochen", 
    "puterJam", 
    "twinliang", 
    "yunishi", 
    "zhichao"
];
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
		if(!user){
			throw 'new user error';
		}
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
		if(!room){
			throw 'new room error';
		}
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
		var user = User.selectUser(_uid);
		if(!user.login){
			throw 'user:' + _uid +' not login';
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
		// //console.log('json', data);
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
			throw 'user:' + _uid + ' is not room creator';
		}
		room.game = new Game();
		if(!room.game){
			throw 'new game error';
		}
		room.game.start(room);
		var data = {
			"rUid":room.rUid,
			"qUid":room.game.qUid,
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
		for(var i in room.users){
			room.users[i].socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
	},
	'question': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		var _rid = data.param.rid;
		var question = data.param.question;
		var data = {};
		var room = Room.selectRoom(_rid);
		if(!room.lock || !room.game || room.game.status != Game.sta["start"] || _uid != room.game.qUid){
			//console.log('question', room);
			throw 'game Error or user not auth';
		}
		room.game.question = question;
		room.game.selectNextGUid(room);
		var data = {
			"tips":room.game.question['tips'],
			"rUid":room.rUid,
			"qUid":room.game.qUid,
			"gUidNext":room.game.gUid
		};
		for(var i in room.users){
			room.users[i].socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
	},
	'guess': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		var _rid = data.param.rid;
		var guess = data.param.guess;
		var data = {};
		var room = Room.selectRoom(_rid);
		if(!room.lock || !room.game || room.game.status != Game.sta["start"] || _uid != room.game.gUid){
			//console.log('guess', room);
			throw 'game Error or user not auth';
		}
		var data = {
			"guess":guess,
			"rUid":room.rUid,
			"qUid":room.game.qUid,
			"gUid":room.game.gUid,
			"round":room.game.round,
			"totalRound":Game.totalRound,
		};
		for(var i in room.users){
			room.users[i].socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
	},
	'confirm': function(socket, data){
		var type = data.type;
		var _uid = data.param.uid;
		var _rid = data.param.rid;
		var confirm = data.param.confirm;
		var data = {};
		var room = Room.selectRoom(_rid);
		if(!room.lock || !room.game || room.game.status != Game.sta["start"] || _uid != room.game.qUid){
			//console.log('confirm', room);
			throw 'game Error or user not auth';
		}
		var lastGUid = room.game.gUid;
		if(confirm == Game.confirm["bingo"] || room.game.round == Game.totalRound){
			room.game.end();
		}
		room.game.selectNextGUid(room);
		var data = {
			"confirm":confirm,
			"rUid":room.rUid,
			"qUid":room.game.qUid,
			"gUid":lastGUid,
			"gUidNext":room.game.gUid,
			"round":room.game.round,
			"totalRound":Game.totalRound,
			"end":room.game.status == Game.sta["end"] ? true : false,
		};
		for(var i in room.users){
			room.users[i].socket.emit('message',  respond(returnCode.succ.code, returnCode.succ.msg, type, data));
		}
	}
};


io.sockets.on('connection', function (socket) {
	console.log('connection');
  socket.on('message', function (data) {
	var d = new Date();
	var startTime = d.getTime();
	var cb, data = JSON.parse(data);
	//console.log('input',data);
    if(cb = onMessage[data.type]){
		  try{
			cb(socket, data);
		  }
		  catch(e){
		  	//console.log({'connect':e});
		  	socket.emit('message', respond(returnCode.error.code, returnCode.error.msg, data.type, null));
		  }
    }else{
      socket.emit('message', data);
    }
    var costTime = d.getTime() - startTime;
    //console.log('costTime:' + costTime + 'ms');
  });

  socket.on('disconnect', function (data) {
	  try{
		  //console.log(data);
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
					// //console.log(room.users);
					user.logout();
					room.users[user.id] = null;
					delete room.users[user.id];
					// //console.log(room.users);
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
    	   //console.log({'disconnect':e});
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
	this.nick = nickSet[this.id % nickSet.length];
	this.roomId = 0;
	this.socket = null;
	this.login;
};
User.prototype.logout = function(){
	this.login = false;
	if(this.socket){
		try{
			this.socket.close();
		}catch(e){
			//console.log('user:' + this.id + '\' socket has close');
		}//TODO
		this.socket = null;
		this.roomId = 0;
	}
};

User.selectUser = function(uid){
	if(uid){
		if(users[uid]){
			return users[uid];
		}
		//console.log(users);
		throw 'uid:' + uid + ' not exists';
	}
	// for(var i in users){
	// 	if(!users[i].login){
	// 		return users[i];
	// 	}
	// }
	return new User();
};

function Room(user){
	this.roomId = rid++;
	this.rUid = user.id;
	this.lock = 0;
	this.game = null;
    this.users = {};
    user.roomId = this.roomId;
    this.users[user.id] = user;
};
Room.maxNum = 5;
Room.prototype.join = function(user){
	if(this.lock){
		throw 'this room:' + this.roomId + 'is lock';
	}
	if(user.login && this.users[user.id]){
		throw 'uid:' + user.id + 'is in room:' + user.roomId;
	}
	var n = 0;
	for(var i in this.users){
		n++;
	}
	if(n + 1 > Room.maxNum){
		throw 'room:' + this.roomId + 'is full';
	}
	user.roomId = this.roomId;
	this.users[user.id] = user;
};

Room.selectRoom = function(rid){
	if(rooms[rid]){
		return rooms[rid];
	}
	//console.log(rooms);
	throw 'rid:' + rid + ' not exists';
};

function Game(){
	this.round = 0;
	this.question = {};
	this.qUid = null;
	this.gUid = null;
	this.status = 0;
};
Game.totalRound = 10;
Game.sta = {"start": 1, "end": 2};
Game.confirm = {"yes": 1, "no": 2, "bingo": 3};
Game.prototype.start = function(room){
	room.lock = true;
	this.status = Game.sta["start"];
	/*var randTime = 5;
	while(randTime--){
		for(var i in room.users){
			if(Math.random() > 0.8){
				this.qUid = room.users[i].id;
				return;
			}
		}
	}*/
	this.qUid = room.rUid;
	return;
};

Game.prototype.end = function(){
	this.status = Game.sta["end"];
	return;
};

Game.prototype.selectNextGUid = function(room){
	this.round++;
	//游戏结束了
	if(this.status == Game.sta["end"]){
		this.gUid = null;
		return;
	}
	if(this.round > Game.totalRound){
		throw "game is end";
	}
	var found = false;
	for(var t = 0; t < 2; t++){
		for(var i in room.users){
			var u = room.users[i];
			if(!found && u.id == this.gUid){
				found = true;
			}
			if(found && u.id != this.qUid && u.id != this.gUid){
				this.gUid = u.id;
				return;
			}
		}
	}
	if(!this.gUid){
		for(var i in room.users){
			var u = room.users[i];
			if(u.id != this.qUid){
				this.gUid = u.id;
				return;
			}
		}
	}
};

