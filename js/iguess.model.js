Z.$package('iGuess.model', function(z){

    var uid, rid, utype, status,
        ques;
    var joinFriend;
    var userList;
    var gameAdmin;
    var gameUser;
    this.setUid = function(_uid){
        uid = _uid;
    }

    this.getUid = function(){
        return uid;
    }

    this.setRoomId = function(_rid){
        rid = _rid;
    }

    this.getRoomId = function(){
        return rid;
    }

    this.setUType = function(_utype){
        utype = _utype;
    }

    this.getUType = function(){
        return utype;
    }

    this.setStatus = function(_status){
        status = _status;
    }

    this.getStatus = function(){
        return status;
    }
    this.setJoinFriend=function(_data){
        joinFriend=_data;
    }
    this.getJoinFriend=function(){
        return joinFriend
    }
    this.setUserList=function(_list){
        userList=_list;
    }
    this.getUserList=function(){
        return userList;
    }

    this.setQuestion = function(_ques){
        ques = _ques;
    }

    this.getQuestion = function(){
        return ques;
    }

    this.setGameUser=function(_data){
        gameUser=_data;
    }
    this.getGameUser=function(_data){
        return gameUser;
    }
    this.setGameAdmin=function(_data){
        gameAdmin=_data;
    }

    this.getGameAdmin=function(_data){
        return gameAdmin;
    }



});