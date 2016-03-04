/* Shoveler View
 *
 * Handles the "shoveler" which is a right-to-left carousel view with endpoints on both sides
 *
 */

(function (exports) {
  "use strict";

  var SHOVELER_ROW_ITEM_SELECTED = "shoveler-rowitem-selected";

 
  function ShovelerView() {
   

    Events.call(this, ['loadComplete', 'giveMeData', 'exit', 'up', 'down','startScroll', 'indexChange', 'stopScroll', 'select', 'bounce', 'back']);

    
    this.currSelection = 0;
    this.elementWidths = [];
    this.isScrolling = false;
    this.currScrollDirection = null;
    this.loadingImages = 0;
    this.jjj = 4;
    this.globalRows=null;
    this.last=0;   
    this.$el = null;
    this.$rowElements = [];
    this.rowsData = null;
    this.rowIndex = 0;
    this.rowCounter = 0;
    this.firstPass = 0;
    this.lastUpperRowPos = [];
    this.lastLowerRowPos = [];
    this.currY = 0;
    this.lastView = null;
    this.MARGIN_WIDTH = 100;

    this.DEFAULT_IMAGE = "assets/l1.jpg";

    this.transformStyle = fireUtils.vendorPrefix('Transform');

    this.fadeOut = function() {
      this.$el.css("opacity", "0");
    };

    this.Ypos = function(ypos){
      this.currY = ypos;
    };

    this.fadeIn = function() {
      this.$el.css("opacity", "");
    };

    this.highLight =function(index){ 
    //this.rowCounter = index;
    //this.currSelection = index;         
         
       $(this.$rowElements[this.rowCounter][this.currSelection ]).css("z-index", "100");
       $(this.$rowElements[this.rowCounter][ this.currSelection]).children('img').addClass("orangeBorder"); 
      
     };

     this.transitionDown = function(){      
      this.currY -=695;    
      this.parentEle[0].style[this.transformStyle] = "translate3d( 0px,"+this.currY+"px,0px)"; 
     
     };

     this.transitionUp = function(){
      this.currY += 695;    
      this.parentEle[0].style[this.transformStyle] = "translate3d( 0px,"+this.currY+"px,0px)"; 
     
     };

     this.decrementRow = function(){
       this.rowCounter-=1;

     };

     this.incrementRow = function(){
        this.rowCounter+=1;
     };

    this.unHighLight =function(){
     
       $(this.$rowElements[this.rowCounter][this.currSelection]).css("z-index", "");  
       $(this.$rowElements[this.rowCounter][this.currSelection]).children().removeClass("orangeBorder");
           
    };

    this.showExtraData = function (index) {
      
  };

  
    this.hideExtraData = function () {
       
    };

    
    this.remove = function () {
      
      this.$el.remove();
    };

    
    this.hide = function () {
      this.$el.css("opacity", "0");
    };

   
    this.show = function () {
      this.$el.css("opacity", "");
    };

    this.down = function(){

      if(this.rowCounter >= this.finalNumOfRows-2 ){              
              return;
        }          

      var thisDownIndex = this.lastUpperRowPos[this.rowCounter+1] = this.currSelection;          
      this.currSelection = this.lastLowerRowPos[this.rowCounter] || 0;          
      $(this.$rowElements[this.rowCounter][thisDownIndex]).css("z-index", "");  
      $(this.$rowElements[this.rowCounter][thisDownIndex]).children('.shoveler-full-img').removeClass("orangeBorder");      
      this.transitionDown();
      this.rowCounter+=1;
      this.selectARow(this.rowCounter);
      var mmm = this.lastLowerRowPos[this.rowCounter-1] || 0 ;           
      $(this.$rowElements[this.rowCounter][mmm ]).css("z-index", "100");
      $(this.$rowElements[this.rowCounter][ mmm]).children('.shoveler-full-img').addClass("orangeBorder");   

    };

    this.up = function(eventKeycode){

      if(this.rowCounter  === 0){
          this.trigger('bounce',eventKeycode);
          return;
        }
        
      var thisUpIndex = this.lastLowerRowPos[this.rowCounter-1] = this.currSelection;         
      this.currSelection = this.lastUpperRowPos[this.rowCounter] || 0;
      $(this.$rowElements[this.rowCounter][thisUpIndex]).css("z-index", "");  
      $(this.$rowElements[this.rowCounter][thisUpIndex]).children('.shoveler-full-img').removeClass("orangeBorder");
      this.transitionUp();
      this.rowCounter-=1;
      this.selectARow(this.rowCounter);
      var mmm = this.lastUpperRowPos[this.rowCounter+1] || 0;            
      $(this.$rowElements[this.rowCounter][mmm ]).css("z-index", "100");
      $(this.$rowElements[this.rowCounter][ mmm]).children('.shoveler-full-img').addClass("orangeBorder"); 

    };

    
    this.handleContentItemSelection = function(e) {
      var targetIndex = $(e.target).parent().index();

      if(targetIndex === this.currSelection) {
        this.trigger('select', this.currSelection);
      } else {
        //set current selected item
        this.setSelectedElement(targetIndex);

        this.transitionRow();

        this.trigger("stopScroll", this.currSelection);
      }
    }.bind(this);
    
    this.render = function (el, row) {
      var ttt;
     
      this.parentContainer = el; 

      if(app.springboard || app.autoplay){
        this.myrow=row;
        if(this.myrow.number ==="four"){
           this.myrow.rowtitle = "YOU MIGHT ALSO LIKE";
        }
       
      } 
      else{
         this.myrow =row;
        if(this.myrow.number ==="four"){
           this.myrow.rowtitle = "Continue Watching";
         }
       
      }    
      
      var html = fireUtils.buildTemplate($("#shoveler-template"), {
        row: this.myrow
      });  
       
      this.parentEle = el;           
       
      el.append(html);     

      this.rowsData = row.items;      

      this.$el = el.children().last().children('#shoveler-view');

      this.$rowElements[this.rowCounter] = this.$el.children('div');

      ttt = $(this.parentEle).children(".shovelerParent")[this.rowCounter];
      $(ttt).children(".rowIndex").text(this.currSelection+1);
      $(ttt).children(".rowTotal").text("|  "+this.$rowElements[this.rowCounter].length);

      this.initialLayout();
      
    };

   
    this.initialLayout = function () {
     
      this.transformLimit = this.$el.width() + 300;
            
      this.limitTransforms = false;

      for (var i = 0; i < this.$rowElements[this.rowCounter].length; i++) {
        var $currElt = $(this.$rowElements[this.rowCounter][i]);

        var $currImage = $currElt.children("img.shoveler-full-img");
        if ($currImage.length === 0) {
          $currElt.prepend('<img class = "shoveler-full-img" src="'+ this.rowsData[i].hdbackgroundimageurl + '" style="opacity:0"/>');
          $currElt.append('<div class="shovelerMovieTitle">'+this.rowsData[i].movieTitle+'</div>');
          $currElt.append('<div class="shovelerMovieStars"></div>');
          $currImage = $currElt.children("img.shoveler-full-img");
        }

        //set a callback to make sure all images are loaded
        this.createImageLoadHandlers($currElt, $currImage, i);

        this.loadingImages++;
      }
    };

    this.createImageLoadHandlers = function($elt, $currImage, index) {
      $currImage.on("load", this.imageLoadHandler($elt, this.rowsData[index].type));
      
      $currImage.on("error", this.imageLoadErrorHandler(this.rowsData[index].type));
    }.bind(this);

    this.imageLoadHandler = function($elt, itemType) {
      return function () {
        if (itemType === "subcategory") {
         
          $elt.append('<div class = "shoveler-subcat-bg"></div>');
        }
        $elt.children("img.shoveler-full-img")[0].style.opacity = "";
        this.relayoutOnLoadedImages();
      }.bind(this);
    };

    this.imageLoadErrorHandler = function(itemType) {
      return function (event) {
        var $elt = $(event.currentTarget).parent();
        $elt.children("img.shoveler-full-img").remove();
        $elt.prepend('<img class = "shoveler-full-img" src="'+ this.DEFAULT_IMAGE + '" style="opacity:0"/>');
        var $currImage = $elt.children("img.shoveler-full-img");
        $currImage.on("load", this.imageLoadHandler($elt, itemType));
        errorHandler.writeToConsole(ErrorTypes.IMAGE_LOAD_ERROR, ErrorTypes.IMAGE_LOAD_ERROR.errorToDev,  errorHandler.genStack());
      }.bind(this);
    }.bind(this);

    
    this.layoutElements = function () {

      for (var i = 0; i < this.$rowElements[this.rowCounter].length; i++) {
        var $currElt = $(this.$rowElements[this.rowCounter][i]);
        this.elementWidths[i] = $currElt.width();

        if ($currElt.children("img.shoveler-full-img").length > 0) {
          $currElt.children("img.shoveler-full-img")[0].style.opacity = "";

        }
      }

      this.setTransforms(0);

      window.setTimeout(function() {
        this.$rowElements[this.rowCounter].css("transition", "");
        this.limitTransforms = true;
        this.finalizeRender();
      }.bind(this), 500);
    };

    
    this.finalizeRender = function () {
      this.$el.css('opacity', '');
      this.trigger('loadComplete');

    };

    
    this.relayoutOnLoadedImages = function () {
      if (--this.loadingImages === 0) {
        this.layoutElements();
        
        this.finalizeSelection(0);
      }
    };

    
    this.shovelMove = function (dir) {
      this.trigger("startScroll", dir);
      this.selectRowElement(dir);
    }.bind(this);

    
    this.handleControls = function (e) {

      if (e.type === 'buttonpress') {
        switch (e.keyCode) {
          case buttons.SELECT:
          case buttons.PLAY_PAUSE:
           
            this.trigger('select', this.rowCounter, this.currSelection);
            break;

          case buttons.BACK:
            this.trigger("back");
            break;

          case buttons.UP:

            this.trigger("up", e.keyCode);        

            break;

          case buttons.DOWN: 

            this.trigger("down");                 

            break;

          case buttons.LEFT:
            if(this.currSelection !== 0) {
              this.shovelMove(-1);
            } else {

              if(this.rowCounter === 0){
            
          }
            }

            break;       

          case buttons.RIGHT:
         
            if(this.currSelection < this.rowsData.length) {

              this.shovelMove(1);
            } else {
              this.trigger('bounce', e.keyCode);
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
          case buttons.UP:
              this.up();
            break;
          case buttons.DOWN:
              this.down();
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

    
    this.prepareSelectionForAnimation = function() {
      
      $(this.$rowElements[this.currSelection]).removeClass(SHOVELER_ROW_ITEM_SELECTED);
      $(this.$rowElements[this.currSelection]).css("z-index", "");
    }.bind(this);

    this.selectARow = function(index){
      
       this.$el =  this.parentEle.children('.shovelerParent') ;       
       this.$rowElements[index] = $(this.$el[index]).children().children('div');      
         
    }.bind(this);

    
    this.finalizeSelection = function(currSelection) {     
      
      $(this.$rowElements[this.rowCounter][currSelection]).addClass(SHOVELER_ROW_ITEM_SELECTED);
     
      $(this.$rowElements[this.rowCounter][currSelection]).css("z-index", "100"); 


          if(!app.springboard || !app.autoplay){
            if (this.jjj < 7){
              this.jjj+=1;        
              this.rowCounter+=1;

              this.trigger('giveMeData', this.jjj);            
                       
              return;
            }
           }
      app.springboard = 0;
      app.autoplay = 0;
      this.rowCounter = 0;
      this.finalNumOfRows = this.parentEle.children().length;      
      this.selectARow(0);     
      this.trigger('loadComplete');
      
    }.bind(this);

    
    this.selectRowElement = function (direction) {       
      var ttt;
      if ((direction > 0 && (this.$rowElements[this.rowCounter].length -1 ) === this.currSelection) ||
          (direction < 0 && this.currSelection === 0 )) {

            return false;
          
          }
         
        $(this.$rowElements[this.rowCounter][this.currSelection]).css("z-index", "");  
        $(this.$rowElements[this.rowCounter][this.currSelection]).children('.shoveler-full-img').removeClass("orangeBorder");    
        this.currSelection += direction;
        $(this.$rowElements[this.rowCounter][this.currSelection]).css("z-index", "100");
        $(this.$rowElements[this.rowCounter][this.currSelection]).children('.shoveler-full-img').addClass("orangeBorder");
        ttt = $(this.parentEle).children(".shovelerParent")[this.rowCounter];
        $(ttt).children(".rowIndex").text(this.currSelection+1);
     
        if (this.currSelection < this.$rowElements[this.rowCounter].length -4){
          this.transitionRow();
          ttt = $(this.parentEle).children(".shovelerParent")[this.rowCounter];
          $(ttt).children(".shovelerRight").css('opacity','1' );
        }
        else{
          ttt = $(this.parentEle).children(".shovelerParent")[this.rowCounter];
          $(ttt).children(".shovelerRight").css('opacity','0' );
        }
        
        if(this.currSelection > 0){
          ttt = $(this.parentEle).children(".shovelerParent")[this.rowCounter];
          $(ttt).children(".shovelerLeft").css('opacity','1' );
        }
        else{
          ttt = $(this.parentEle).children(".shovelerParent")[this.rowCounter];
          $(ttt).children(".shovelerLeft").css('opacity','0' );
        }
        
       

    }.bind(this);

    this.transitionRow = function(theEnd) {
      window.requestAnimationFrame(function(){
        this.setTransforms(this.currSelection);
      }.bind(this));

        this.trigger('indexChange', this.currSelection);
      }.bind(this);

     this.setTransforms = function (selected) {
        
        var currX = 0;
        this.manageSelectedElement(this.$rowElements[this.rowCounter][selected]);     
        selected = selected || this.currSelection; 
        this.setLeftItemPositions(selected - 1, currX);
        currX = Math.round(this.elementWidths[selected] + 20);       
        this.setRightItemPositions(selected+ 1 , currX);
 
    }.bind(this); 

    this.manageSelectedElement = function (selectedEle) {
      
      selectedEle.style[this.transformStyle] = "translate3d(0, 0, 0)";      
      selectedEle.style.opacity = "0.99";

    }; 

    this.setLeftItemPositions = function (start, currX) {
      var i;
       
      for (i = start; i >= 0; i--) {
        var currPosition = (currX - this.elementWidths[i]-20);
       
        var itemTrans = "translate3d(" + currPosition + "px,0, 0px) ";

        if (this.elementWidths[i] > 0) {
          this.$rowElements[this.rowCounter][i].style[this.transformStyle] = itemTrans;
          this.$rowElements[this.rowCounter][i].style.opacity = "";

        } else {
          //keep element offscreen if we have no width yet
          this.$rowElements[this.rowCounter][i].style[this.transformStyle] = "translate3d("+ (-this.transformLimit) + "px,0,0px)";
          this.$rowElements[this.rowCounter][i].style.display = "none";

        }

        if (currX < -this.transformLimit + 1000) {
          if (this.limitTransforms) {
            break;
          }
        } else {
          currX -= Math.round(this.elementWidths[i] * 0.75 + this.MARGIN_WIDTH);
          
      }
    }
    };

    this.setRightItemPositions = function (start, currX) {
      var i;
      
      for (i = start; i < this.$rowElements[this.rowCounter].length; i++) {
        if (this.elementWidths[i] > 0) {
          this.$rowElements[this.rowCounter][i].style[this.transformStyle] = "translate3d(" + (currX+10) + "px,0,0px) ";
          this.$rowElements[this.rowCounter][i].style.opacity = "";
        } else {
          //keep element offscreen if we have no width yet
          this.$rowElements[this.rowCounter][i].style[this.transformStyle] = "translate3d("+ this.transformLimit +" +px,0,0px)";
        }

        if (currX > this.transformLimit) {
          if (this.limitTransforms) {
            break;
          }
        } else {
          currX += Math.round(this.elementWidths[i] * 0.75 + this.MARGIN_WIDTH);
          
        }
      }
    }; 
  
    this.setSelectedElement = function (index) {
      this.currSelection = index;
    }.bind(this);   

    
    this.fadeSelected = function () {
      this.$rowElements[this.currSelection].style.opacity = "0.5";

    };
    
    this.unfadeSelected = function () {
      this.$rowElements[this.currSelection].style.opacity = "0.99";

    };
    
    this.shrinkSelected = function () {
      this.setRightItemPositions(this.currSelection, 0);
      this.setLeftItemPositions(this.currSelection - 1, 0 - this.MARGIN_WIDTH);
    };   
   

  }

  exports.ShovelerView = ShovelerView;
}(window));
