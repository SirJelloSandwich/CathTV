(function (exports) {
  "use strict";

 
  function DeviceLinkingView() {

  	Events.call(this, ['back']); 


      this.render = function($el){

      var html = fireUtils.buildTemplate($("#deviceLinking"), {});

      $el.append(html);

      };

  	 this.handleControls = function (e) {       

            if (e.type === 'buttonpress') 
            {
              switch (e.keyCode) {

              case buttons.SELECT:         
              case buttons.PLAY_PAUSE:
             
                if( $(".lowerButton").css('background-color') === 'rgb(255, 102, 0)'){
                  $("#signinContainer").show();
                  $(".deviceLinkingView").remove();
                  this.trigger('back');
                }
                
                break;

              case buttons.BACK:
                
                $("#signinContainer").show();
        		    $(".deviceLinkingView").remove();
        		    this.trigger('back');
               
                break;

              case buttons.UP:
                    $(".upperButton").css('background-color', '#ff6600');     
                    $(".lowerButton").css('background-color', 'rgba(0,0,0,0.4');

                break;        
              case buttons.DOWN:
                    $(".upperButton").css('background-color', 'rgba(0,0,0,0.4');     
                    $(".lowerButton").css('background-color', '#ff6600');
               break;
              
              case buttons.LEFT:
             
               
                break;

              case buttons.RIGHT:
             
                
                break;

              }
            }     

  	 }.bind(this);
  	}
  exports.DeviceLinkingView = DeviceLinkingView;
}(window));