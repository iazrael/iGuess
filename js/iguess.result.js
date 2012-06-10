Z.$package('iGuess.main', function(z){
    var packageContext = this;
    var $container;

    this.init = function(){
        $container = $('#result');

        z.dom.bindCommends($container.get(0), commends);
    }

    this.show = function(success){
        
        $container.removeClass('hidden');
        $container.show();
    }

    this.hide = function(){
        $container.hide();
    }



    var commends = {
        enterAnswer: function(param, target, event){
            
        }
    };


});