/* Shoveler View
 *
 * Handles the "shoveler" which is a right-to-left carousel view with endpoints on both sides
 *
 */

(function (exports) {
  "use strict";

  var SHOVELER_ROW_ITEM_SELECTED = "springboard-shoveler-rowitem-selected";


  function SpringboardShovelerView() {


    Events.call(this, ['loadComplete', 'giveMeData', 'exit', 'up', 'down','startScroll', 'indexChange', 'stopScroll', 'select', 'bounce', 'back']);


    this.currSelection = 0;
    this.loadingImages = 0;
    this.jjj = 4;
    this.last=0;
    this.$el = null;
    this.$rowElements = [];
    this.rowsData = null;
    this.rowIndex = 0;
    this.rowCounter = 0;
    this.lastUpperRowPos = [];
    this.lastLowerRowPos = [];
    this.currY = 0;
    this.lastView = null;
    this.MARGIN_WIDTH = 30;
    this.elementWidths = [];
    this.pos = -520;

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

       //$(this.$rowElements[this.rowCounter][this.currSelection ]).css("z-index", "100");
       //$(this.$rowElements[this.rowCounter][ this.currSelection]).children('img').addClass("focusBorder");
       $(".focusBorder").show();
       $(".focusBorder").css({
         '-webkit-transform': 'translate3d('+this.pos+'px, 195px,0px) scale(1.52,1.82)',
         'outline':'4px solid #ba3a23'
       });

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

      // $(this.$rowElements[this.rowCounter][this.currSelection]).css("z-index", "");
      // $(this.$rowElements[this.rowCounter][this.currSelection]).children().removeClass("focusBorder");
      // $(".focusBorder").css({
      //   '-webkit-transform': 'translate3d(290px, 0px,0px)'
      // });
      $(".focusBorder").hide();
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
      $(this.$rowElements[this.rowCounter][thisDownIndex]).children('.springboard-shoveler-full-img').removeClass("focusBorder");
      this.transitionDown();
      this.rowCounter+=1;
      this.selectARow(this.rowCounter);
      var mmm = this.lastLowerRowPos[this.rowCounter-1] || 0 ;
      $(this.$rowElements[this.rowCounter][mmm ]).css("z-index", "100");
      $(this.$rowElements[this.rowCounter][ mmm]).children('.springboard-shoveler-full-img').addClass("focusBorder");

    };

    this.up = function(eventKeycode){

      if(this.rowCounter  === 0){

          this.trigger('bounce',eventKeycode);
          return;
        }


    };


    //this.handleContentItemSelection = function(e) {
    //  var targetIndex = $(e.target).parent().index();
    //
    //  if(targetIndex === this.currSelection) {
    //    this.trigger('select', this.currSelection);
    //  } else {
    //    //set current selected item
    //    this.setSelectedElement(targetIndex);
    //
    //    this.transitionRow();
    //
    //    this.trigger("stopScroll", this.currSelection);
    //  }
    //}.bind(this);

    this.render = function (el, rowData) {
      var ttt;

      //this.parentContainer = el;

      this.rowData = rowData;

      var html = fireUtils.buildTemplate($("#springboard-shoveler-template"), {
        row: this.rowData
      });

      this.parentEle = el;

      el.append(html);

      this.$el = el.children().last().children('#springboard-shoveler-view');

      this.$rowElements[this.rowCounter] = this.$el.children('div');

      ttt = $(this.parentEle).children(".springboardShovelerParent")[this.rowCounter];
      $(ttt).children(".springboardRowIndex").text(this.currSelection+1);
      $(ttt).children(".springboardRowTotal").text("|  "+this.$rowElements[this.rowCounter].length);
      $("#springboard-shoveler-view").find(".springboardRowTitle").text("Episodes");

      this.initialLayout();

    };


    this.initialLayout = function () {

      this.transformLimit = this.$el.width() + 300;

      this.limitTransforms = false;

      for (var i = 0; i < this.$rowElements[this.rowCounter].length; i++) {

        var $currElt = $(this.$rowElements[this.rowCounter][i]);
        var $currImage = $currElt.children("img.springboard-shoveler-full-img");

        if ($currImage.length === 0) {
          if(this.rowData[i].image !== null){
            $currElt.prepend('<img class = "springboard-shoveler-full-img" src="'+ this.rowData[i].image.styles.medium+ '" style="opacity:0"/>');
          }
          else{
              $currElt.prepend('<img class = "springboard-shoveler-full-img" src="assets/BT_placeholder.png" style="opacity:0"/>');
          }


          if(this.rowData[i].duration !== null && this.rowData[i].duration !== undefined  && this.rowData[i].duration > 0){

             $currElt.append('<div class="springboardShovelerDuration">'+ app.data.convertSecondsToMMSS(this.rowData[i].duration)+'</div>');
             $currElt.append('<div class="springboardShovelerMovieTitle">'+this.rowData[i].label+'</div>');
             $currElt.find(".springboardShovelerDuration").css('opacity', '1');

          }

          $currImage = $currElt.children("img.springboard-shoveler-full-img");
        }


        this.createImageLoadHandlers($currElt, $currImage, i);

        this.loadingImages++;
      }
    };

    this.createImageLoadHandlers = function($elt, $currImage, index) {
      $currImage.on("load", this.imageLoadHandler($elt, this.rowData[index]));

      $currImage.on("error", this.imageLoadErrorHandler(this.rowData[index]));
    }.bind(this);

    this.imageLoadHandler = function($elt, itemType) {
      return function () {
        // if (itemType === "subcategory") {

        //   $elt.append('<div class = "springboard-shoveler-subcat-bg"></div>');
        // }
        $elt.children("img.springboard-shoveler-full-img")[0].style.opacity = "";
        this.relayoutOnLoadedImages();
      }.bind(this);
    };

    this.imageLoadErrorHandler = function(itemType) {
      return function (event) {
        var $elt = $(event.currentTarget).parent();
        $elt.children("img.springboard-shoveler-full-img").remove();
        $elt.prepend('<img class = "springboard-shoveler-full-img" src="'+ this.DEFAULT_IMAGE + '" style="opacity:0"/>');
        var $currImage = $elt.children("img.springboard-shoveler-full-img");
        $currImage.on("load", this.imageLoadHandler($elt, itemType));
        errorHandler.writeToConsole(ErrorTypes.IMAGE_LOAD_ERROR, ErrorTypes.IMAGE_LOAD_ERROR.errorToDev,  errorHandler.genStack());
      }.bind(this);
    }.bind(this);


    this.layoutElements = function () {

      for (var i = 0; i < this.$rowElements[this.rowCounter].length; i++) {
        var $currElt = $(this.$rowElements[this.rowCounter][i]);
        this.elementWidths[i] = $currElt.width();

        if ($currElt.children("img.springboard-shoveler-full-img").length > 0) {
          $currElt.children("img.springboard-shoveler-full-img")[0].style.opacity = "";

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

            this.trigger('select', this.rowData[this.currSelection]);

            $(".focusBorder").css({

              '-webkit-transform': 'translate3d(0px, 0px,0px)',
               'outline':'8px solid #ba3a23'
            });
            $(".focusBorder").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {



            });

            break;

          case buttons.BACK:
          $('.springboardBackground').hide();
          $('.springboardBackground img').hide();
          $(".springboardBackground img").attr('src', '');

            this.trigger("back");
            break;

          case buttons.UP:

            //this.trigger("up", e.keyCode);

            this.up();

            break;

          case buttons.DOWN:

            //this.trigger("down");

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

            if(this.currSelection < this.rowData.length) {

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

       this.$el =  this.parentEle.children('.springboardShovelerParent') ;
       this.$rowElements[index] = $(this.$el[index]).children().children('div');

    }.bind(this);


    this.finalizeSelection = function(currSelection) {

      $(this.$rowElements[this.rowCounter][currSelection]).css("z-index", "100");

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

        this.currSelection += direction;

        ttt = $(this.parentEle).children(".springboardShovelerParent")[this.rowCounter];
        $(ttt).children(".springboardRowIndex").text(this.currSelection+1);

        if (this.currSelection < this.$rowElements[this.rowCounter].length - 3) {

          this.transitionRow();
          this.pos = -520;
          $(".focusBorder").css({

            '-webkit-transform': 'translate3d('+this.pos+'px, 195px, 0px) scale(1.52, 1.82)',
             'outline':'4px solid #ba3a23'

          });
          ttt = $(this.parentEle).children(".springboardShovelerParent")[this.rowCounter];
          $(ttt).children(".springboardShovelerRight").css('opacity', '0.3');
        } else {

          if(direction > 0){

            this.pos+=428;
            $(".focusBorder").css({

              '-webkit-transform': 'translate3d('+this.pos+'px, 195px, 0px) scale(1.52, 1.82)',
               'outline':'4px solid #ba3a23'

            });

          }
          else if (direction < 0){

            this.pos-=428;
            $(".focusBorder").css({

              '-webkit-transform': 'translate3d('+this.pos+'px, 195px, 0px) scale(1.52, 1.82)',
               'outline':'4px solid #ba3a23'

            });

          }

          ttt = $(this.parentEle).children(".springboardShovelerParent")[this.rowCounter];
          $(ttt).children(".springboardShovelerRight").css('opacity', '0');
        }

        if (this.currSelection > 0) {
          ttt = $(this.parentEle).children(".springboardShovelerParent")[this.rowCounter];
          $(ttt).children(".springboardShovelerLeft").css('opacity', '0.3');
        } else {
          ttt = $(this.parentEle).children(".springboardShovelerParent")[this.rowCounter];
          $(ttt).children(".springboardShovelerLeft").css('opacity', '0');
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
        currX = Math.round(this.elementWidths[selected] );
        this.setRightItemPositions(selected+ 1 , currX);

    }.bind(this);

    this.manageSelectedElement = function (selectedEle) {

      selectedEle.style[this.transformStyle] = "translate3d(0, 0, 0)";
      selectedEle.style.opacity = "0.99";

    };

    this.setLeftItemPositions = function (start, currX) {
      var i;

      for (i = start; i >= 0; i--) {
        var currPosition = (currX - this.elementWidths[i] -this.MARGIN_WIDTH);

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
          currX -= Math.round(this.elementWidths[i] + this.MARGIN_WIDTH);

      }
    }
    };

    this.setRightItemPositions = function (start, currX) {
      var i;

      for (i = start; i < this.$rowElements[this.rowCounter].length; i++) {
        if (this.elementWidths[i] > 0) {
          this.$rowElements[this.rowCounter][i].style[this.transformStyle] = "translate3d(" + (currX+ this.MARGIN_WIDTH) + "px,0,0px) ";
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
          currX += Math.round(this.elementWidths[i] + this.MARGIN_WIDTH);

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

  exports.SpringboardShovelerView = SpringboardShovelerView;
}(window));
