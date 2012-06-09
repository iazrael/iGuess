
Z.$package('iGuess.socket', function(z){
    var packageContext = this;

    var socketUrl = 'ws://10.66.38.35:8989/';
    socketUrl = 'ws://10.66.45.39:8088/';
    // socketUrl = 'ws://10.66.38.35:8989/iguess/bin/server.php';
    var socket;
   
    this.init = function(){
        
    }

    this.connect = function(){
        if(!socket){
            // socket = new WebSocket(socketUrl);
            socket = io.connect(socketUrl);
        }
        // socket.addEventListener('open', onSocketOpen);
        // socket.addEventListener('message', onSocketMessage);
        // socket.addEventListener('close', onSocketClose);

        socket.on('connect', onSocketOpen);
        socket.on('message', onSocketMessage);
        socket.on('disconnect', onSocketClose);
    }

    this.send = function(data){
        // socket.send(JSON.stringify(data));
        socket.emit('message', JSON.stringify(data));
    }

    this.on = function(type, func){
        if(type && func){
            z.message.on(packageContext, type, func);
        }else{
            throw type + "'s function is undefined.";
        }
    }

    var onSocketOpen = function(data){
        console.log('connected');//TODO
    }

    var onSocketMessage = function(data){
        // console.log(data);
        if(data.type){
            z.message.notify(packageContext, data.type, data);
        }
    }

    var onSocketClose = function(data){
        console.log('disconnected');//TODO
    }

});