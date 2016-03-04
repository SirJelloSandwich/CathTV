(function(exports) {
  "use strict";

  //gloabl constants
 //var CONTAINER_SCROLLING_LIST = "#menu-bar-scrolling-list",

   // CONTAINER_MAIN = "#menu-bar-list-container",

    var CLASS_MENU_ITEM_SELECTED = "menu-bar-list-item-selected",

    CLASS_MENU_ITEM_HIGHLIGHTED = "menu-bar-list-item-highlighted";

    //CLASS_MENU_ITEM_CHOSEN = "menu-bar-list-item-chosen";


  function MenuBarView() {
    // mixin inheritance, initialize this as an event handler for these events:
    Events.call(this, ['exit', 'deselect', 'indexChange', 'select', 'makeActive', 'loadComplete', 'initLiveStream']);

    this.currSelection = 0;
   // this.browseHtml = null;

    this.fadeOut = function() {
      this.$el.fadeOut();
    };

    this.fadeIn = function() {
      this.$el.fadeIn();
    };

    /**
     * Hides the menu bar view
     */
    this.hide = function() {
      this.$el.hide();
    };

    /**
     * Display the menu bar view
     */
    this.show = function() {
      this.$el.show();
    };

    /**
     * Hide the menu-bar overlay that covers the one-d-view
     */
    this.collapse = function() {

      $(".menuBottomFocus").css('background-color', 'white');

      //set the chosen item style
      this.setChosenElement();

      //set flag to false
      // this.isDisplayed = false;
      // if (typeof this.menuBarItems[this.currSelectedIndex] === "object") {
      //   this.menuBarItems[this.currSelectedIndex].deselect();
      // }
    };


    this.expand = function() {
      this.menuBarContainerEle.classList.remove('menu-bar-menulist-collapsed');
      this.menuBarContainerEle.classList.add('menu-bar-menulist-expanded');

      //set the selected item style
      this.setSelectedElement();

      //set flag to true
      this.isDisplayed = true;

      if (typeof this.menuBarItems[this.currSelectedIndex] === "object") {
        // this is a hack for dealing with selecting the input box, we need to wait for it to appear
        // TODO: Find out why this is and get a better solution.
        setTimeout(this.menuBarItems[this.currSelectedIndex].select, 200);
      }
    };


    this.setSelectedElement = function(ele) {
      ele = ele || this.currentSelectionEle;

      //remove highlighted class if it's there
      var highlightedEle = $("." + CLASS_MENU_ITEM_HIGHLIGHTED);
      if (highlightedEle) {
        highlightedEle.removeClass(CLASS_MENU_ITEM_HIGHLIGHTED);
        this.menuBarContainerEle.classList.remove('menu-bar-collapsed-highlight');
      }

      $(ele).addClass(CLASS_MENU_ITEM_SELECTED);
    };

    this.setChosenElement = function(ele) {
      // ele = ele || this.currentSelectionEle;

      // // make sure only one element can be chosen at a time
      // $(".menu-bar-list-item-static").removeClass(CLASS_MENU_ITEM_CHOSEN);

      // if($(ele).hasClass(CLASS_MENU_ITEM_SELECTED))
      // {
      //   $(ele).removeClass(CLASS_MENU_ITEM_SELECTED);
      // }
      // else if($(ele).hasClass(CLASS_MENU_ITEM_HIGHLIGHTED))
      // {
      //   $(ele).removeClass(CLASS_MENU_ITEM_HIGHLIGHTED);

      //   this.menuBarContainerEle.classList.remove('menu-bar-collapsed-highlight');

      // }
      // $(ele).addClass(CLASS_MENU_ITEM_CHOSEN);
    };


    this.setHighlightedElement = function(ele) {
      // ele = ele || this.currentSelectionEle;

      // $(ele).addClass(CLASS_MENU_ITEM_HIGHLIGHTED);
      // this.menuBarContainerEle.classList.add('menu-bar-collapsed-highlight');
      $(".menuBottomFocus").css('background-color', '#ba3a23');
    };


    this.handleListItemSelection = function(e) {
      if (!this.isDisplayed) {
        this.trigger('makeActive');
      } else {
        this.setCurrentSelectedIndex($(e.target).parent().index());
        this.confirmNavSelection();
      }
    }.bind(this);


    this.render = function($el) {

      var html = fireUtils.buildTemplate($("#menu-bar-template"), {});
      $el.append(html);

      this.trigger('loadComplete');
    };

    this.move = function(direction){

      if(direction > 0  && this.currSelection === 1 || direction < 0 && this.currSelection === 0)
      {
        return;
      }

      this.currSelection+=direction;
      if(direction > 0){
        $(".menuBottomFocus").css({
          '-webkit-transform': 'translate3d(265px,0px,0px)',
          'width': '195px'
        });
      }
      else{
        $(".menuBottomFocus").css({
          '-webkit-transform': 'translate3d(0px,0px,0px)',
          'width': '240px'
        });
      }


    };


    this.handleControls = function(e) {

      if (e.type === 'buttonpress') {
        switch (e.keyCode) {
          case buttons.UP:

            break;
          case buttons.DOWN:
          case buttons.BACK:
            this.trigger('deselect');

            break;
          case buttons.RIGHT:

              this.move(1);

            break;

          case buttons.LEFT:
              this.move(-1);
            break;

          case buttons.SELECT:

            switch(this.currSelection){

              case 0:
              //this.currSelection = 1;
              //  $("#app-container").append(this.browseHtml);
                //$("#app-container").css('opacity', '1');
              break;

              case 1:

              this.trigger('initLiveStream');


                //this.browseHtml = $("#app-container").html();
              //  $("#app-container").css('opacity', '0');

              break;

              default:

              break;
            }



            break;
        }
      } else if (e.type === 'buttonrepeat') {
        switch (e.keyCode) {
          case buttons.LEFT:
            // if(this.isDisplayed) {
            //   this.incrementCurrentSelectedIndex(-1);
            // }
            break;
          case buttons.RIGHT:
            // if(this.isDisplayed) {
            //   this.incrementCurrentSelectedIndex(1);
            // }
            break;
        }
      }

    }.bind(this);


    this.incrementCurrentSelectedIndex = function(direction) {
      if ((direction > 0 && this.currSelectedIndex !== (this.$menuItems.length - 1)) || (direction < 0 && this.currSelectedIndex !== 0)) {
        this.currSelectedIndex += direction;
        this.selectMenuBarItem();
      }
    };


    this.setCurrentSelectedIndex = function(index) {
      this.currSelectedIndex = index;
      this.selectMenuBarItem();
    };


    this.confirmNavSelection = function() {
      if (this.confirmedSelection !== this.currSelectedIndex) {

        this.confirmedSelection = this.currSelectedIndex;
        this.trigger('select', this.currSelectedIndex);

      }

    };


    this.selectMenuBarItem = function() {
      // update the menu bar to the current selection and run the selection animation
      $(this.currentSelectionEle).removeClass(CLASS_MENU_ITEM_SELECTED);

      this.currentSelectionEle = this.$menuItems.eq(this.currSelectedIndex).children()[0];
      this.setSelectedElement(this.currentSelectionEle);


      this.trigger('indexChange', this.currSelectedIndex);
    };


    this.shiftNavScrollContainer = function() {
      if (!this.translateAmount) {
        this.translateAmount = this.currentSelectionEle.getBoundingClientRect().height + 2;
      }

      //shift the nav as selection changes
      var translateHeight = 0 - (this.translateAmount * this.currSelectedIndex);
      this.scrollingContainerEle.style.webkitTransform = "translateY(" + translateHeight + "px)";
    };

  }

  exports.MenuBarView = MenuBarView;
}(window));
