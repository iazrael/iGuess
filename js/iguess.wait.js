Z.$package('iGuess.wait', function(z){
    var packageContext = this;
    var $container;

    this.init = function(){
        $container = $('#waitting');
    }

    this.show = function(item){
        z.dom.render($container.get(0), 'waittingTmpl', item);
        $container.show();
    }

    this.hide = function(){
        $container.hide();
    }


});