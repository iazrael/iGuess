Z.$package('iGuess.ask', function(z){
    var packageContext = this;
    var $container;

    var commends = {
        enterQuestion: function(param, target, event){
            var $ques = $('#question'),
                $tips = $('#tips');
            var data = {
                type: 'question',
                param: {
                    uid: iGuess.model.getUid(),
                    rid: iGuess.model.getRoomId(),
                    question: {
                        answer: $ques.val(),
                        tips: $tips.val()
                    }
                }
            };
            iGuess.socket.send(data);
        }
    };




    this.init = function(){
        $container = $('#asking');

        z.dom.bindCommends($container.get(0), commends);
    }

    this.show = function(item){
        // z.dom.render($container.get(0), 'askingTmpl', item);
        $container.removeClass('hidden');
        $container.show();
    }

    this.hide = function(){
        $container.hide();
    }
    
});