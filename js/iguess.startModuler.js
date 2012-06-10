;jQuery(function($){

     iGuess.stargModuler={
     		tmplLiItem:[' <li class="liItem">',
				'          <a href="javascript:void(0);" class="thumbnail">',
				'            <img src="#joinImg#" alt="">',
				'          </a>',
				'        </li>',
				].join(''),
	    	init:function(){
	    		//console.log('init stargModuler');

	    		var t=iGuess.stargModuler;
	    		 iGuess.socket.on('getUid',t.initUid);
	    		 // iGuess.socket.on('getRid',t.initUrl);
	    		 iGuess.socket.on('join',t.updateJoinList);

	    		 iGuess.socket.send({type:'getUid'});
	    		
	    		 iGuess.socket.on('start',t.getResFromStart);

	    		 $('.carousel').carousel({	//初始化 动画切换动画
  					interval: 2000
				});

	    		$('#btn_start').bind('click',t.fnStart);

	    		$('#urlInput').bind('click',function(){
	    			$('#urlInput').select();
	    		})
	    	},
	    	getResFromStart:function(res){
	    		//console.log('get res');
	    		//console.log(res);
	    		if(!res||!res.returnData||!res.returnData.userList){
	    			//console.log('res data error');
	    			return;
	    		}
	    		iGuess.model.setUserList(res.returnData.userList);
	    		for(var i in res.returnData.userList){
	    			var user=res.returnData.userList[i];
	    			if(user.uid!=res.returnData.qUid){
	    				//不是楼主
	    				//console.log('normal user=');
	    				//console.log(user);
	    				iGuess.model.setGameUser(user);
	    			}else{
	    				//是楼主
	    				//console.log('admin user=');
	    				//console.log(user);
	    				iGuess.model.setGameAdmin(user);
	    			}
	    		}
    			iGuess.wait.hide();
    			iGuess.main.hide();
    			iGuess.main.reset();
	    		if(res.returnData.qUid === iGuess.model.getUid()){
	    			iGuess.stargModuler.hide();
	    			// iGuess.ask.reset();
	    			iGuess.ask.show();
	    			iGuess.model.setUType(1);
	    		}else{
	    			iGuess.wait.show(iGuess.model.getGameAdmin());
	    		}

	    		
	    	},
	    	fnStart:function(e){

	    		if($('#btn_start').hasClass('disabled')){
	    			//console.log('no join user');
	    			return ;
	    		}

	    		//console.log('star game');
	    		var uid=iGuess.model.getUid();
	    		iGuess.socket.send({type:'start',param:{uid:uid, rid: iGuess.model.getRoomId()}});

	    	},
	    	getHttpParams:function(name){
			var r = new RegExp("(\\?|#|&)"+name+"=([^&#]*)(&|#|$)");
			var m = location.href.match(r);
			return decodeURIComponent(!m?"":m[2]).replace(/\+/g," ");
			},
	    	initUid: function(data){
	    		//console.log('initUid');
	    		//console.log(data);
	    		var t=iGuess.stargModuler;
	    		var uid=data.returnData.userInfo.uid;
	    		iGuess.model.setUid(uid);
	    		if(location.href.indexOf('?rid')>0){
	    			
	    			//iGuess.wait.show();
	    			var rid=t.getHttpParams('rid');
	    			iGuess.model.setRoomId(rid);
	    			iGuess.socket.send({type:'join',param:{rid:rid,uid:uid}});

	    		}else{
	    			iGuess.stargModuler.show();
	    			iGuess.socket.on('getRid',t.initUrl);
	    			iGuess.socket.send({type:'getRid',param:{uid:uid}});
	    		}
	    		

	    	},
	    	initUrl:function(data){

	    		var item=data.returnData;
	    		iGuess.model.setRoomId(item.rid);
	    		$('#urlInput')[0].value='http://10.66.45.34/~azrael/iGuess/index.html?rid='+item.rid;

	    	},
	    	updateJoinList:function(data){
	    		//console.log('updateJoinList');
	    		
	    		var ulList=$('#joinList');
	    		var t=iGuess.stargModuler;
	    		var tmpl=t.tmplLiItem;
	    		if(!data){
	    			//console.log('updateJoinList error');
	    			return ;
	    		}
	    		/*
	    		//console.log('updateJoinList data=');
	    		//console.log(data);
	    		
	    		var data={};
				data.returnData={};
				data.returnData.userList=[{uid:1,nick:'jim'},{uid:2,nick:'jack'}];
				*/

	    		var dataList=data.returnData.userList;
	    		var html='', ruser;
	    		for(var i in dataList){
	    			var user=dataList[i];
	    			if(iGuess.model.getUid()!=user.uid){
	    				html+=tmpl.replace('#joinImg#',t.getUserImgUrl(user.uid));
	    			}
	    			
	    		}

	    		ulList.append(html);

	    		//有好友参与后的逻辑
	    		$('#btn_start').removeClass('disabled');
	    		$('#btn_start').addClass('btn-primary');
	    		$('#lb_tip').hide();

	    		if(iGuess.model.getUid()!=data.returnData.rUid){
	    			iGuess.stargModuler.hide();
	    			iGuess.wait.show(dataList[data.returnData.rUid]);
	    		}

	    	},
	    	getUserImgUrl:function(uid){
	    		var img = uid % 5 + 1;
	    		return 'img/' + img + '.jpg';
	    	},
	    	hide:function(callBack){
	    		$('#startModuler').hide(0,function(){
	    			if(callBack&&typeof(callBack)=='function'){
	    				callBack();
	    			}
	    		});
	    	},
	    	show:function(callBack){
	    		var $el = $('#startModuler');
	    		$el.removeClass('hidden');
	    		$el.show(0,function(){
	    			if(callBack&&typeof(callBack)=='function'){
	    				callBack();
	    			}
	    		});
	    	}

	    };

});