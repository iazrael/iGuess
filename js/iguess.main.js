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
        iGuess.socket.on('confirm', onConfirmCome);
    }

    this.reset = function(){
        $top.empty();
        $list.empty();
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
                    text: '等' + iGuess.model.getGameUser().nick + '猜答案...'
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
        var el = $list.get(0);
        z.dom.render(el, 'mainListTmpl', data, -1);
        el = $list.parents('.body');
        el.scrollTop = el.scrollHeight;
    }

    var commends = {
        enterAnswer: function(param, target, event){
            var $inputContainer = $list.find('.input'),
                $input = $inputContainer.find('input'),
                $label = $inputContainer.find('.label');
            var text = $input.val();
            if(!text){
                $label.text('请输入问题');
                $label.show();
                z.util.delay(2000, function(){
                    $label.hide();
                });
                $input.focus();
                return;
            }
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
        },
        confirmAnswer: function(param, target, event){
            var $actionContainer = $list.find('.action');
            var data = {
                type: 'confirm',
                param: {
                    uid: iGuess.model.getUid(),
                    rid: iGuess.model.getRoomId(),
                    confirm: param
                }
            };
            $actionContainer.remove();
            iGuess.socket.send(data);
        },
        restart: function(param, target, event){
            var $actionContainer = $list.find('.action');
            var data = {
                type: 'start',
                param: {
                    uid: iGuess.model.getUid(),
                    rid: iGuess.model.getRoomId()
                }
            };
            $actionContainer.remove();
            iGuess.socket.send(data);
        }
    };

    var onGuessCome = function(data){
        $list.find('.tips').remove();
        packageContext.updateMessageList({
            msgType: 1,
            msg: {
                round: data.returnData.round,
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
                    text: '等' + iGuess.model.getGameAdmin().nick + '确认'
                }
            });
        }
    }

    var confirmText = {
        '1': '是的',
        '2': '不是',
        '3': '答对了哟'
    };

    var onConfirmCome = function(data){
        $list.find('.tips').remove();
        var ret = data.returnData;
        var text = confirmText[ret.confirm];

        packageContext.updateMessageList({
            msgType: 2,
            msg: {
                confirm: ret.confirm,
                text: text
            }
        });
        
        if(ret.confirm == 3){
            if(data.returnData.qUid === iGuess.model.getUid()){
                packageContext.updateMessageList({
                    msgType: 7,
                    msg: {
                        text: '看来' + iGuess.model.getGameUser().nick + '很懂你哟',
                        actionId:2
                    }
                });
                packageContext.updateMessageList({
                    msgType: 6,
                    msg: {
                    }
                });
            }else{
                packageContext.updateMessageList({
                    msgType: 7,
                    msg: {
                        text: '看来你很懂' + iGuess.model.getGameAdmin().nick + '哟',
                        actionId:0
                    }
                });
            }
        }else{
            if(ret.round > ret.totalRound){//结束了
                var isQuestioner = data.returnData.qUid === iGuess.model.getUid();
                var actionId=1;
                if(isQuestioner){
                    text = '看来' + iGuess.model.getGameUser().nick + '不够懂你啊';
                    actionId=3;
                }else{
                    text = '看来你不够懂' + iGuess.model.getGameAdmin().nick + '啊';
                    actionId=1;
                }
                packageContext.updateMessageList({
                    msgType: 7,
                    msg: {
                        actionId:actionId,
                        text: text
                    }
                });
                if(isQuestioner){
                    packageContext.updateMessageList({
                        msgType: 6,
                        msg: {
                        }
                    });
                }
                return;
            }
            if(data.returnData.qUid === iGuess.model.getUid()){
                packageContext.updateMessageList({
                    msgType: 3,
                    msg: {
                        text: '等' + iGuess.model.getGameUser().nick + '猜答案...'
                    }
                });
            }else{
                packageContext.updateMessageList({
                    msgType: 3,
                    msg: {
                        text: '请提问: '
                    }
                });
                packageContext.updateMessageList({
                    msgType: 5,
                    msg: {
                    }
                });
            }
        }
    }

});