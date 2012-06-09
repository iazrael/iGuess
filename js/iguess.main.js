Z.$package('iGuess.main', function(z){
    var packageContext = this;
    var $container;

    this.init = function(){
        $container = $('#main');
    }

    this.show = function(item){
        $container.show();
    }

    this.hide = function(){
        $container.hide();
    }


});