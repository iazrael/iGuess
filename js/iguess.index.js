Z.$package('iGuess.index', function(z){



	// 整个应用的入口
    this.init = function(){
    	
        iGuess.socket.connect();
 
	  	
	  	iGuess.socket.on('connect',function(){
	  		iGuess.stargModuler.init();
	  	});
     /*   iGuess.wait.init();
        iGuess.ask.init();*/
    }   
});