(function (exports) {
    "use strict";

   
    function AutoplayView() {

    	 Events.call(this, ['select', 'back', 'transitionDown', 'Ypos']);

    	this.currSelection = 1;
      this.currY = 0;

    	this.render = function($container, data){

    		var html = fireUtils.buildTemplate($("#autoplay-template"), data);           

        $container.append(html);
        $(".autoplayRow span:nth-child("+this.currSelection+")").addClass("orangeBorder");       
        
    	};

    	this.expandVideo = function(){
			 $(".FRAMER_EXAMPLE").css({ 
            '-webkit-transform': 'scale(1.0)',
            '-webkit-transform-origin': '50% 50%'
          	});
    	};

    	this.move = function(dir){

    		if((dir > 0 && this.currSelection === 3) || (dir < 0 && this.currSelection === 1) ){
    			return;
    		}
    		$(".autoplayRow span:nth-child("+this.currSelection+")").removeClass("orangeBorder");

    		this.currSelection += dir;

    		$(".autoplayRow span:nth-child("+this.currSelection+")").addClass("orangeBorder");

    	};

      this.transitionDown = function(){
           
          this.currY -=575; 
             
          $(".innerAutoplayContainer").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)');
          $(".nextVideoText").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)');
          $(".currentVideoText").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)');
          $(".framerMovieTitle").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)');
          $("#framerParent").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)'); 
          this.trigger("Ypos", this.currY);
        };

        this.transitionUp = function(){
           
          this.currY +=575; 
             
          $(".innerAutoplayContainer").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)');
          $(".nextVideoText").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)');
          $(".currentVideoText").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)');
           $(".framerMovieTitle").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)'); 
          $("#framerParent").css('transform', 'translate3d( 0px,'+this.currY+'px,0px)'); 
          //this.trigger("Ypos", this.currY);
        };

    	this.handleControls = function (e) {
          
          if (e.type === 'buttonpress') {
            switch (e.keyCode) {
            case buttons.CLICK:
            case buttons.SELECT:         
            case buttons.PLAY_PAUSE:

                this.trigger('select', this.currSelection); 
                         
              break;

            case buttons.BACK:
             this.trigger('back');
              
              break;

            

            case buttons.UP:

              break;         
            case buttons.DOWN:
           
             this.transitionDown();
             this.trigger('transitionDown');
              break;

            case buttons.LEFT:

                this.move(-1);             

              break;

            case buttons.RIGHT:            

            	this.move(1);
                
             
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

    exports.AutoplayView = AutoplayView;
}(window));