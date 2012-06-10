Z.$package('iGuess.main', function(z){
    var packageContext = this;
    var $container,
        $top,
        $list;

    this.init = function(){
        $container = $('#main');
        $top = $('#mainTop');
        $list = $('#mainList');

        z.dom.bindCommends($container.get(0), commends);

        iGuess.socket.on('guess', onGuessCome);
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

    var commends = {
        enterAnswer: function(param, target, event){
            var $inputContainer = $list.find('.input'),
                $input = $inputContainer.find('input');
            var text = $input.val();
            $inputContainer.remove();
            var data = {
                type: 'guess',
                param: {
                    uid: iGuess.model.getUid(),
                    rid: iGuess.model.getRoomId(),
                    guess: text
                }
            };
            iGuess.socket.send(data);
        }
    };

    var onGuessCome = function(data){
        $list.find('.tips').remove();
        packageContext.updateMessageList({
            msgType: 1,
            msg: {
                text: data.returnData.guess
            }
        });
        if(data.returnData.qUid === iGuess.model.getUid()){
            packageContext.updateMessageList({
                msgType: 4,
                msg: {
                    text: '请回答'
                }
            });
        }else{
            packageContext.updateMessageList({
                msgType: 3,
                msg: {
                    text: '等对方确认'
                }
            });
        }
    }

});