/* One D View
 *
 * Handles 1D view containing one sub-category of elements
 *
 */

(function (exports) {
  "use strict";

  /**
   * @class OneDView
   * @description The 1D view object, this handles everything about the 1D menu.
   */
  function GridWrapView() {
    // mixin inheritance, initialize this as an event handler for these events:

    Events.call(this, ['noContent', 'exit', 'startScroll', 'indexChange', 'stopScroll', 'select', 'bounce', 'loadComplete', 'back']);

     this.$rowElements = null;
     this.currSelection = 0;
     this.rowsData = null;   
     this.noItems = false;
     this.rowOffset = 6; 
     this.imgsInRows = 5;
     this.transformStyle = fireUtils.vendorPrefix('Transform'); 
     this.currY = 0;
     this.firstPass = 1;


    this.hideaway = function(){
      $("#menu-bar").hide();
      $("#gridWrapMainWrap").hide();
      
    };

    
    this.remove = function () {
      if(this.el) {
        $(this.el).remove();
      }
     };

     this.highLight = function(){

      $(this.$rowElements[this.currSelection]).addClass("orangeBorder"); 

    };

    
    this.render = function ($el, rowData) {
       
      //console.log(rowData);
      var html = fireUtils.buildTemplate($("#grid-wrapper"), rowData);

      $el.append(html); 

      this.$el = $el.children().last();

      this.moveableWrapContainer = this.$el.children().children(".moveableGridInternalContainer");

      this.el = this.$el[0];

      this.$rowElements = this.$el.children().children().children().children(".innerThumbnailContainer");    

      this.rowsData =  this.$rowElements;     

      $(this.$rowElements[this.currSelection]).addClass("orangeBorder");

      if (this.rowsData.length <= 0) {
    
         this.noItems = true;
         return;
      }

       this.noItems = false; 

      $(".watchlistNumber1").text(this.currSelection+1);   
      $(".watchlistNumber2").text("|  "+this.$rowElements.length);
      this.trigger('loadComplete');
    };

  

    this.shovelMove = function (dir) {
      this.trigger("startScroll", dir);
      this.selectRowElement(dir);
    }.bind(this);

    this.shiftUp = function(){
         if(this.currSelection >= ( this.imgsInRows) ){

            $(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
            this.currSelection -= this.imgsInRows;
             $(".watchlistNumber1").text(this.currSelection+1); 
            $(this.$rowElements[this.currSelection]).addClass("orangeBorder");
            this.currY += 575;    
            this.moveableWrapContainer[0].style[this.transformStyle] = "translate3d( 0px,"+this.currY+"px,0px)";          

        }
        else{
            $(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
            this.trigger('bounce', null);
           return;
        }

    };

    this.shiftDown = function(){
         if(this.currSelection <= (this.rowsData.length - this.rowOffset) ){

            $(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
            this.currSelection += this.imgsInRows;
             $(".watchlistNumber1").text(this.currSelection+1); 
            $(this.$rowElements[this.currSelection]).addClass("orangeBorder");          
            this.currY -= 575;    
            this.moveableWrapContainer[0].style[this.transformStyle] = "translate3d( 0px,"+this.currY+"px,0px)";         

        }

    };

    this.scrollDown = function(){          
        this.currY -= 575;    
        this.moveableWrapContainer[0].style[this.transformStyle] = "translate3d( 0px,"+this.currY+"px,0px)";                  

    }.bind(this);

    this.scrollUp = function(){

      if (this.currSelection <= 4) 
         {
          $(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
           this.trigger('bounce', null);
           return;
         }       

        this.currY += 575;    
        this.moveableWrapContainer[0].style[this.transformStyle] = "translate3d( 0px,"+this.currY+"px,0px)";
        $(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
        this.currSelection --;
        $(this.$rowElements[this.currSelection]).addClass("orangeBorder");

    }.bind(this);
  
    this.handleControls = function (e) {
      

      if (e.type === 'buttonpress')
       {
        switch (e.keyCode) 
        {

        case buttons.SELECT:
        case buttons.PLAY_PAUSE:

          this.trigger('select', this.currSelection);
          break;
        case buttons.BACK:
            this.trigger("back");
          break;
        case buttons.UP:          
         
          this.shiftUp();
          
          break;
        case buttons.DOWN:

          this.shiftDown();  

          break;

        case buttons.LEFT:
          if(this.currSelection !== 0) 
          {
            this.shovelMove(-1);
          } 
          else 
          {
            //this.trigger('bounce', e.keyCode);
            //$(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
          }

        break;        

        case buttons.RIGHT:
          if(this.currSelection < this.rowsData.length) 
          {

            this.shovelMove(1);
          } 
          else
           {
            this.trigger('bounce', e.keyCode);
          }
          break;
        }
      }
      else if (e.type === 'buttonrepeat') {
        switch (e.keyCode) {
          case buttons.LEFT:
              if(this.currSelection !== 0) 
              {
                this.shovelMove(-1);
              } 
              else 
              {
                //this.trigger('bounce', e.keyCode);
                //$(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
              }
             
            break;

          case buttons.RIGHT:
              if(this.currSelection < this.rowsData.length) 
              {

                this.shovelMove(1);
              } 
              else
               {
                this.trigger('bounce', e.keyCode);
              }
             
            break;
          case buttons.UP:
              this.shiftUp();
            break;
          case buttons.DOWN:
             this.shiftDown();
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

      this.selectRowElement = function (direction) {

      if ((direction > 0 && (this.$rowElements.length - 1) === this.currSelection) ||
          (direction < 0 && this.currSelection === 0 )) {
            return false;
          }
     
      if(direction < 0 && (this.currSelection %5) === 0.0){
        this.scrollUp();
        return;
      }

      
      $(this.$rowElements[this.currSelection]).removeClass("orangeBorder");
      this.currSelection += direction;
      $(".watchlistNumber1").text(this.currSelection+1); 
      $(this.$rowElements[this.currSelection]).addClass("orangeBorder");
       
        if(direction > 0 && (this.currSelection %5) === 0.0){
        this.scrollDown();

      }
      
       

      return true;
    }.bind(this);

  
   }

  exports.GridWrapView = GridWrapView;
}(window));
