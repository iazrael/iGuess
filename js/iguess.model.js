Z.$package('iGuess.model', function(z){

    var uid, rid, utype, status;
    
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

});