;jQuery(function($){

     iGuess.stargModuler={

	    	init:function(){
	    		console.log('init stargModuler');
	    		var t=iGuess.stargModuler;
	    		 iGuess.socket.on('getuid',t.initUid);
	    		 iGuess.socket.on('getrid',t.initUrl);
	    		 iGuess.socket.send({type:'getuid'});

	    	},
	    	initUid: function(data){
	    		
	    	},
	    	initUrl:function(data){
	    		var item=data;
	    	}

	    };

});