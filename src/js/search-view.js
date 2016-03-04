(function (exports) {
  "use strict";

 
  function SearchView() {

  	Events.call(this, ['up', 'back']);  

    this.currSelection = 0;
    this.$el = null;

     this.render = function ($el, data) {

       var html = fireUtils.buildTemplate($("#fli-search"), data);
       $el.append(html);
       this.$el = $(".keyboard");
       
    };

    this.hideaway = function(){

       $(".keyboard").hide();

    };

    this.handleControls = function (e) {
       // console.log("SI"+e.keyCode+ " "+e.type);

      if (e.type === 'buttonpress') 
      {
      	console.log(e.keyCode);
        switch (e.keyCode) {


        case buttons.SELECT:         
        case buttons.PLAY_PAUSE:
        
          break;

        case buttons.BACK:
          this.trigger("back");
          break;

        case buttons.UP: 
        	this.trigger('up');
        	break;        
        case buttons.DOWN:

          //this.trigger("switchingInput");
          
         break;
        
        case buttons.LEFT:
         
          break;

        case buttons.RIGHT:
          
          break;

        case buttons.TIZEN_KEYBOARD_DONE:
          
          //this.trigger("done");
          break;

        }
      } 
      else if (e.type === 'buttonrepeat') 
      {
        switch (e.keyCode) {
        case buttons.LEFT:
          //this.selectRowElement(-1);
          break;

        case buttons.RIGHT:
          //this.selectRowElement(1);
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

  	exports.SearchView = SearchView;
}(window));