
Z.$package('iGuess.socket', function(z){
    var packageContext = this;

    var socketUrl = 'ws://10.66.38.35:8989/';
    var socket;
   
    this.init = function(){
        
    }

    this.connect = function(){
        if(!socket){
            socket = new WebSocket(socketUrl);
        }
        socket.addEventListener('open', onSocketOpen);
        socket.addEventListener('message', onSocketMessage);
        socket.addEventListener('close', onSocketClose);
    }

    this.send = function(data){
        socket.send(JSON.stringify(data));
    }

    var onSocketOpen = function(data){
        alert('open');
    }

    var onSocketMessage = function(data){
        if(data.type){
            z.message.notify(packageContext, data.type, data);
        }
    }

    var onSocketClose = function(data){
        alert('close');
    }

});