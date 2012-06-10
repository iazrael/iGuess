Z.$package('iGuess.ask', function(z){
    var packageContext = this;
    var $container;

    var commends = {
        enterQuestion: function(param, target, event){
            var $ques = $('#question'),
                $tips = $('#tips');
            var ques = $ques.val(),
                tips = $tips.val();
            var data = {
                type: 'question',
                param: {
                    uid: iGuess.model.getUid(),
                    rid: iGuess.model.getRoomId(),
                    question: {
                        answer: ques,
                        tips: tips
                    }
                }
            };
            iGuess.socket.send(data);
            iGuess.model.setQuestion({
                text: ques,
                tips: tips
            });
        }
    };

    var onQuestionCome = function(data){
        if(data.returnData.qUid === iGuess.model.getUid()){
            packageContext.hide();
            iGuess.main.show();
        }
    }


    this.init = function(){
        $container = $('#asking');

        z.dom.bindCommends($container.get(0), commends);

        iGuess.socket.on('question', onQuestionCome);
    }

    this.reset = function(){

    }

    this.show = function(item){
        z.dom.render($container.get(0), 'askingTmpl', {});
        $container.removeClass('hidden');
        $container.show();
    }

    this.hide = function(){
        $container.hide();
    }
    
});