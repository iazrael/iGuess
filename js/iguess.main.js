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
        z.dom.render($top.get(0), 'mainTopTmpl', {
            utype: iGuess.model.getUType(),
            ques: ques
        });
        this.updateMessageList({
            msgType: 3,
            msg: {
                text: '等对方猜答案'
            }
        });
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