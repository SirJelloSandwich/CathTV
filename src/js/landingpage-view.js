(function (exports) {
  "use strict";

  
  function LandingPageView() {

    Events.call(this, ['loadComplete', 'startScroll', 'stopScroll','indexChange', 'select', 'mouseover', 'click', 'exit']);

    this.currSelection = 0;
    this.elementsLength = null;

  	this.render =  function($el, data){

      var html = fireUtils.buildTemplate($("#landingPage"), data);

      $el.append(html); 

      this.elementsLength = $(".landingPageLower").children().length;

      $(".landingPageLower div:nth-child(1)").addClass("orangeBorder");

       this.trigger('loadComplete');

  	};

    this.goToBrowse =function(){

      $("#main_landing_container").hide();
      $("#menu-bar").show();      
      $(".largeBrowseContainer").show();

    }.bind(this);

    this.hideShow = function(){

      $("#main_landing_container").hide();
      $("#signinContainer").show();      

    }.bind(this);

    this.move = function (dir) {
      
      this.trigger("startScroll", dir);
      this.selectRowElement(dir);
    }.bind(this);

    this.selectRowElement = function (direction) {
      
      if ((direction > 0 && (this.elementsLength - 1) === this.currSelection) ||
          (direction < 0 && this.currSelection === 0 )) {
            return false;
          }

      $(".landingPageLower").children().eq(this.currSelection).removeClass("orangeBorder");

      this.currSelection += direction;

     $(".landingPageLower").children().eq(this.currSelection).addClass("orangeBorder");
    
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
          this.trigger("exit");
          break;

        case buttons.UP:         
        case buttons.DOWN:
         // this.trigger("bounce");
          break;

        case buttons.LEFT:
          if(this.currSelection !== 0) {
            this.move(-1);
          } 

          break;

        case buttons.RIGHT:
          if(this.currSelection <= 2) {
            this.move(1);
          } 
          break;
        }
      } else if (e.type === 'buttonrepeat') {
        switch (e.keyCode) {
        case buttons.LEFT:
          this.selectRowElement(-1);
          break;

        case buttons.RIGHT:
          this.selectRowElement(1);
          break;
        }
      } else if (e.type === 'buttonrelease') {
        switch (e.keyCode) {
        case buttons.LEFT:
        case buttons.RIGHT:
          this.trigger("stopScroll", this.currSelection);


          break;
        }
      }
    }.bind(this);

  	 }

  exports.LandingPageView = LandingPageView;
}(window));