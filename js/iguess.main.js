Z.$package('iGuess.main', function(z){
    var packageContext = this;
    var $container,
        $top,
        $list;

    this.init = function(){
        $container = $('#main');
        $top = $('#mainTop');
        $list = $('#mainList');
    }

    this.show = function(item){
        var ques = iGuess.model.getQuestion();
        var utype = iGuess.model.getUType();
        z.dom.render($top.get(0), 'mainTopTmpl', {
            utype: utype,
            ques: ques
        });
        if(utype == 1){
            this.updateMessageList({
                msgType: 3,
                msg: {
                    text: '等对方猜答案'
                }
            });
        }else{
            this.updateMessageList({
                msgType: 3,
                msg: {
                    text: '请提问: '
                }
            });
            this.updateMessageList({
                msgType: 5,
                msg: {
                }
            });
        }
        $container.removeClass('hidden');
        $container.show();
    }

    this.hide = function(){
        $container.hide();
    }

    this.updateMessageList = function(data){
        z.dom.render($list.get(0), 'mainListTmpl', data, -1);
    }

});