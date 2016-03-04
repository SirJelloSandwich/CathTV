/* One D View
 *
 * Handles 1D view containing one sub-category of elements
 *
 */

(function(exports) {
  "use strict";

  var SHOVELER_ROW_ITEM_SELECTED = "featured-3D-shoveler-rowitem-selected";

  function FeaturedRowView() {
    // mixin inheritance, initialize this as an event handler for these events:
    Events.call(this, ['noContent', 'exit', 'startScroll', 'back', 'Ypos', 'indexChange', 'transitionDown', 'stopScroll', 'select', 'bounce', 'loadComplete']);

    //global variables
    this.currSelection = 1;
    this.currentView = null;
    this.elementWidths = [];
    this.titleText = null;
    this.$shovelerContainer = null;
    this.noItems = false;
    this.transformStyle = fireUtils.vendorPrefix('Transform');
    this.currY = 0;
    this.loadingImages = 0;
    this.MARGIN_WIDTH = 30;
    this.DEFAULT_IMAGE = "assets/default-image.png";


    //jquery global variables
    this.$el = null;
    this.el = null;

    this.fadeOut = function() {
      this.$el.css("opacity", "0");
      this.shovelerView.fadeOut();
    };

    this.transitionDown = function() {

      //$(".fixedFocusBorder").hide();

      this.currY -= 505;

      this.scroll[0].style[this.transformStyle] = "translate3d( 0px," + this.currY + "px,0px)";
      this.trigger("Ypos", this.currY);

    };

    this.transitionUp = function() {

      this.currY += 505;
      this.scroll[0].style[this.transformStyle] = "translate3d( 0px," + this.currY + "px,0px)";

    };

    this.highLight = function() {
      $(".fixedFocusBorder").show();
      $(".fixedFocusBorder").css({

        '-webkit-transform': 'translate3d(0px, 0px, 0px)',
        'width': '825px',
        'height': '464px',
        'top':'205px',
        'outline': '8px solid #ba3a23'

      });
    };

    this.unhighLight = function() {
      $(".fixedFocusBorder").hide();
    };

    this.fadeIn = function() {
      this.$el[0].style.opacity = "";
      this.shovelerView.fadeIn();
    };

    this.hide = function() {
      this.$el[0].style.opacity = "0";
      this.shovelerView.hide();
    };


    this.show = function() {
      this.$el.css("opacity", "");
      this.shovelerView.show();
    };


    this.remove = function() {
      if (this.el) {
        $(this.el).remove();
      }
    };


    this.setCurrentView = function(view) {
      this.currentView = view;
    };


    this.render = function($el, rowData) {
      //Make sure we don't already have a full container

      this.remove();
      this.rowData = rowData;
      //console.log(this.rowData);

      // Build the main content template and add it

      var html = fireUtils.buildTemplate($("#newRow"), {
        items: this.rowData
      });

      $el.append(html);

      console.log(this.rowData.length);

      $("#app-overlay").hide();
      $("#splashscreenSpinner").hide();
      //$('#featured-container').css('width', (this.rowData.length*$('#featured-container div img').eq(4).width())+"px");
        //$('#featured-container').css('width', (this.rowData.length*1280)+"px");
        // var ttt =setTimeout(function(){
        //   //console.log($('#featured-container img').eq(4).width());
        //   $('#featured-container').css('width', ((this.rowData.length+1)*$('#featured-container img').eq(4).width())+"px");
        //   clearTimeout(ttt);
        // }.bind(this), 1000);

    };

    this.shovelMove = function(dir) {
      this.trigger("startScroll", dir);
      this.selectRowElement(dir);
    }.bind(this);


    this.handleControls = function(e) {

      if (e.type === 'buttonpress') {

        switch (e.keyCode) {
          case buttons.SELECT:
          case buttons.PLAY_PAUSE:
            this.trigger('select', this.currSelection);
            break;

          case buttons.BACK:
            this.trigger("exit");
            break;

          case buttons.UP:
            this.trigger('bounce', e.keyCode);
            break;
          case buttons.DOWN:

            this.trigger("transitionDown");
            break;

          case buttons.LEFT:
            if (this.currSelection !== 0) {
              this.shovelMove(-1);
            } else {
              //this.trigger('bounce', e.keyCode);
            }

            break;

          case buttons.RIGHT:
            if (this.currSelection < this.rowData.length) {
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




    this.selectRowElement = function(direction) {

      if ((direction > 0 && (this.$rowElements.length - 1) === this.currSelection) ||
        (direction < 0 && this.currSelection === 0)) {
        return false;
      }
      //  $(this.$rowElements[this.currSelection]).find('img.featured-full-img').nextAll().hide();
      this.currSelection += direction;
      //$(this.$rowElements[this.currSelection]).find('img.featured-full-img').nextAll().show();
      this.transitionRow();

      return true;
    }.bind(this);




  }
  exports.FeaturedRowView = FeaturedRowView;
}(window));
