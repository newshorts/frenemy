/* 
 *  @author Mike Newell
 *  @company Goodby Silverstein & Partners
 *  © 2012
 */

(function(window) {
    var Translator = function() {
        
        var mag,
            zoomer,
            porthole,
            secondImage;
        
        this.init = function() {
            mag = $("#translator-window").contents().find("#mag");
            zoomer = $("#translator-window").contents().find("#zoomer");
            porthole = $("#translator-window").contents().find(".big-window");
            secondImage = $("#translator-window").contents().find(".big-image");
            
            mag.on('transitionend webkitTransitionEnd oTransitionEnd msTransitionEnd', function(evt) {
                
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
                    
                }
                
            });
            
            mag.on('animationend webkitAnimationEnd MSAnimationEnd', function(evt) {
                
                var target = $(evt.currentTarget);
                
            });
        };

        this.playOpeningSequence = function() {
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
                
                if(Modernizr.csstransitions) {
                    mag.css({
                        opacity: 1
                    });    
                    
                } else {
                    
                    setTimeout(function() {
                        
                        mag = $("#translator-window").contents().find("#mag");
                        zoomer = $("#translator-window").contents().find("#zoomer");
                        porthole = $("#translator-window").contents().find(".big-window");
                        secondImage = $("#translator-window").contents().find(".big-image");
                        
                        porthole.css({
                            top: 100,
                            left: 115,
                            opacity: 1
                        });

                        secondImage.css({
                            top: -100,
                            left: -115
                        });
                        
                        mag.css({
                            opacity: 1
                        });

                        mag.removeClass().addClass('hidden');
                        zoomer.removeClass().addClass('on');
                        
                    }, 50);
                }
                
            }, 50);
            
        };
    };

    window.Translator = Translator;
}(window));