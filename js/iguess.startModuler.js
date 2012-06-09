;jQuery(function($){

     iGuess.stargModuler={
     		tmplLiItem:[' <li class="liItem">',
				'          <a href="javascript:void(0);" class="thumbnail">',
				'            <img src="#joinImg#" alt="">',
				'          </a>',
				'        </li>',
				].join(''),
	    	init:function(){
	    		console.log('init stargModuler');

	    		var t=iGuess.stargModuler;
	    		 iGuess.socket.on('getRid',t.initUid);
	    		 iGuess.socket.on('getRid',t.initUrl);
	    		 iGuess.socket.on('join',t.updateJoinList);

	    		 iGuess.socket.send({type:'getUid'});
	    		 iGuess.socket.send({type:'getRid'});
	    		 iGuess.socket.on('start',t.getResFromStart);
	    		 $('.carousel').carousel({
  					interval: 2000
				})
	    		$('#btn_start').bind('click',t.fnStart);

	    	},
	    	getResFromStart:function(res){
	    		console.log('get res');
	    		console.log(res);
	    	},
	    	fnStart:function(e){
	    		console.log('star game');
	    		iGuess.socket.send({type:'start'});

	    	},
	    	initUid: function(data){
	    		console.log('initUid');
	    		console.log(data);
	    		var uid=data.returnData.userInfo.uid;
	    		iGuess.model.setUid(uid);
	    	},
	    	initUrl:function(data){
	    		var item=data;
	    		$('#urlInput')[0].value='http://iguess.com/index.html?rid='+item.rid;

	    	},
	    	updateJoinList:function(data){
	    		var ulList=$('#joinList');
	    		var t=iGuess.stargModuler;
	    		var tmpl=t.tmplLiItem;
	    		if(!data){
	    			console.log('updateJoinList error');
	    			return ;
	    		}
	    		/*
	    		console.log('updateJoinList data=');
	    		console.log(data);
	    		
	    		var data={};
				data.returnData={};
				data.returnData.userList=[{uid:1,nick:'jim'},{uid:2,nick:'jack'}];
				*/

	    		var dataList=data.returnData.userList;
	    		var html='';
	    		for(var i=0;i<dataList.length;i++){
	    			var user=dataList[i];
	    			html+=tmpl.replace('#joinImg#',t.getUserImgUrl(user.uid));
	    		}

	    		ulList.append(html);

	    	},
	    	getUserImgUrl:function(uid){
	    		return 'http://placehold.it/260x180';
	    	},
	    	hide:function(callBack){
	    		$('#startModuler').hide(0,function(){
	    			if(callBack&&typeof(callBack)=='function'){
	    				callBack();
	    			}
	    		});
	    	},
	    	show:function(callBack){
	    		$('#startModuler').show(0,function(){
	    			if(callBack&&typeof(callBack)=='function'){
	    				callBack();
	    			}
	    		});
	    	}

	    };

});