(function (exports) {
  "use strict";

  function ContinueWatchingView() {

	Events.call(this, ['select', 'back']);

	this.currSelection = 0;
	this.elementsLength = null;

	this.render =  function($el, data){    

	var html = fireUtils.buildTemplate($("#continueWatchingContainer"), data);

      $el.append(html); 		  

       this.elementsLength = $("#continueWatchingButtons").children().length;
       
       $('#continue-watching-overlay').show();
     

  	};

	this.move = function (dir) {            
	    
	    this.selectRowElement(dir);
	  }.bind(this);

	this.selectRowElement = function (direction) {
	  
	  if ((direction > 0 && (this.elementsLength - 1) === this.currSelection) ||
	      (direction < 0 && this.currSelection === 0 )) {
	        return false;
	  
	      }
	     
	  $("div#continueWatchingButtons").children().eq(this.currSelection).css('background-color', '#000000');

	  this.currSelection += direction;

	  $("div#continueWatchingButtons").children().eq(this.currSelection).css('background-color', '#ff6600');

	}.bind(this); 


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
            if(this.currSelection !== 0) {
                this.move(-1);
              } 

            	break;        
            case buttons.DOWN:
            
              if(this.currSelection === 0) {
                this.move(1);
              } 

              break;

            case buttons.LEFT:
            

              break;

            case buttons.RIGHT:
             
              
            }
          } 
          else if (e.type === 'buttonrepeat') 
          {
            switch (e.keyCode) {
            case buttons.LEFT:
              // this.selectRowElement(-1);
              break;

            case buttons.RIGHT:
              // this.selectRowElement(1);
              break;
            }
          } 
          else if (e.type === 'buttonrelease') 
          {
            switch (e.keyCode) {
            case buttons.LEFT:
            case buttons.RIGHT:
              //this.trigger("stopScroll", this.currSelection);


              break;
            }
          }
        }.bind(this);

  	}

 exports.ContinueWatchingView = ContinueWatchingView;
}(window));