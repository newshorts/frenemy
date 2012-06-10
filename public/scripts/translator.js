/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

(function(window) {
    var Translator = function() {
        
        var mag,
            zoomer,
            porthole,
            secondImage;
        
        this.init = function() {
            console.debug('sanity - translator init')
            mag = $("#translator-window").contents().find("#mag");
            zoomer = $("#translator-window").contents().find("#zoomer");
            porthole = $("#translator-window").contents().find(".big-window");
            secondImage = $("#translator-window").contents().find(".big-image");
            
            mag.on('transitionend webkitTransitionEnd oTransitionEnd msTransitionEnd', function(evt) {
                console.debug('sanity - transition ended');
                
                var target = $(evt.currentTarget);
                
                if(target.hasClass('fade-in')) {
                    
                    porthole.css({
                        top: 100,
                        left: 115,
                        opacity: 1
                    });

                    secondImage.css({
                        top: -100,
                        left: -115
                    });
                    
                    target.removeClass();
                    zoomer.removeClass().addClass('on');
                    
//                    setTimeout(function() {
//                        target.removeClass();
//                        zoomer.removeClass().addClass('on');
//                    }, 200);
                }
                
            });
            
            mag.on('animationend webkitAnimationEnd MSAnimationEnd', function(evt) {
                
                var target = $(evt.currentTarget);
                console.debug('sanity - animation end')
                
            });
        };

        this.playOpeningSequence = function() {
            console.debug('sanity - play sequence');
            zoomer.removeClass().addClass('off');
            mag.removeClass();
            mag.addClass('fade-in play-fuzz');
            mag.css({
                top: 100 -17,
                left: 115 - 17,
                opacity: 0,
                display: 'block'
            });
            
            setTimeout(function() {
                mag.css({
                    opacity: 1
                });    
            }, 50);
                
            
//            setTimeout(function() {
//                mag.removeClass('play-fuzz');
//            }, 1200);
            
//            mag.css({
//                left: 200
//            });
                
            
        };
    };

    window.Translator = Translator;
}(window));