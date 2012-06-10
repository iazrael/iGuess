Z.$package('iGuess.wait', function(z){
    var packageContext = this;
    var $container;

    this.init = function(){
        $container = $('#waitting');
        iGuess.socket.on('question', onQuestionCome);
    }

    this.show = function(item){
        z.dom.render($container.get(0), 'waittingTmpl', {item: item});
        $container.removeClass('hidden');
        $container.show();
    }

    this.hide = function(){
        $container.hide();
    }

    var onQuestionCome = function(data){
        if(data.returnData.qUid !== iGuess.model.getUid()){
            iGuess.model.setQuestion({
                tips: data.returnData.tips
            });
            packageContext.hide();
            iGuess.main.show();
        }
    }

});