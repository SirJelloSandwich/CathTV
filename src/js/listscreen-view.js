(function (exports) {
    "use strict";

   
    function ListscreenView() {

    	 Events.call(this, ['select', 'back', 'loadComplete']);

    

    	this.render = function($container){

    		var html = fireUtils.buildTemplate($("#listscreen-view"), {});           

        $container.append(html);
        $("#app-header-bar").hide();

        this.trigger("loadComplete");
         
        
    	};

    	

    	this.move = function(dir){

    		if((dir > 0 && this.currSelection === 3) || (dir < 0 && this.currSelection === 1) ){
    			return;
    		}
    		// $(".autoplayRow span:nth-child("+this.currSelection+")").removeClass("orangeBorder");

    		// this.currSelection += dir;

    		// $(".autoplayRow span:nth-child("+this.currSelection+")").addClass("orangeBorder");
        
    	};

    

    	this.handleControls = function (e) {
          
          if (e.type === 'buttonpress') {
            switch (e.keyCode) {
            case buttons.CLICK:
            case buttons.SELECT:         
            case buttons.PLAY_PAUSE:

              
                         
              break;

            case buttons.BACK:
             
              
              break;

            

            case buttons.UP:

              break;         
            case buttons.DOWN:
           
           
              break;

            case buttons.LEFT:

                  

              break;

            case buttons.RIGHT:            

            	
                
             
              break;
            }
          } 
          else if (e.type === 'buttonrepeat') 
          {
            switch (e.keyCode) {
            case buttons.LEFT:
             
              break;

            case buttons.RIGHT:
              
              break;
            }
          } 
          else if (e.type === 'buttonrelease') 
          {
            switch (e.keyCode) {
            case buttons.LEFT:
            case buttons.RIGHT:
              


              break;
            }
          }
        }.bind(this);

	}

    exports.ListscreenView = ListscreenView;
}(window));