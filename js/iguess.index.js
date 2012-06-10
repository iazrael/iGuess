Z.$package('iGuess.index', function(z){

    var $body;

	// 整个应用的入口
    this.init = function(){
    	$body = $('.body');

        iGuess.socket.connect();
 
	  	iGuess.wait.init();
        iGuess.ask.init();
        iGuess.main.init();
	  	iGuess.socket.on('connect',function(){
	  		iGuess.stargModuler.init();
	  	});
        
        $(window).resize(onResize);
        onResize();
    }

    var onResize = function(){
        var size = {
            width: window.innerWidth,
            height: window.innerHeight - 40 - 20
        };
        $body.height(size.height);
        z.message.notify('resize', size);
    };
});