(function(exports) {
  "use strict";

  function SpringboardPageView() {


    Events.call(this, ['loadComplete', 'startScroll', 'select', 'UP', 'back', 'transitionDown', 'stars', 'Ypos', 'delete']);
    this.currSelection = 0;
    this.elementsLength = null;
    var incrementer = 2;
    this.currY = 0;
    this.transformStyle = fireUtils.vendorPrefix('Transform');
    this.lastView = null;
    this.noItems = false;
    $(".focusBorder").css({
      '-webkit-transform': 'translate3d(0px, 0px,0px)',
      'outline': '8px solid #ba3a23'
    });

    this.render = function($el, data, springboardButtons) {

      this.data = data;

      this.data.springboardButtons = springboardButtons.buttons;

      var html = fireUtils.buildTemplate($("#springboard-template"), this.data);

      $el.append(html);

      this.elementsLength = $(".springboardRow").children().length;

      if (data.fliTime !== null && data.fliTime !== undefined) {
        if (data.authors !== undefined) {
          $(".director").text(data.authors[0].label + " " + "|");
        }

      } else {
        if (data.authors !== undefined) {
          $(".director").text(data.authors[0].label);
        }
      }

      if(data.description.length > 350){
        var newString = data.description.substring(0, 350);
        $(".ratingEtc").after("<div class='newDesc'>"+newString+ "..."+"</div>");
      }
      else{
        $(".ratingEtc").after("<div class='newDesc'>"+data.description+"</div>");
      }

      var image = new Image();

      image.onload = function() {

         $('.springboardBackground img').attr('src',  image.src );
         $('.springboardBackground img').fadeIn(5000, 'swing', function(){

         });

      };

      if (data.springboard_image !== null && data.springboard_image !== undefined) {
        image.src = this.data.springboard_image.self;
      }
       else {
       image.src = "assets/BT-default-springboard-image.jpg";
      }

      $('.springboardBackground').show();
      $(".focusBorder").show();
      this.trigger('loadComplete');

      this.$children = $('.springboardContainer').children();

    };

    this.highLight = function() {

      $(".focusBorder").show();
    };

    this.unHighLight = function() {

      $(".focusBorder").hide();
    };

    this.move = function(dir) {

      this.trigger("startScroll", dir);
      this.selectRowElement(dir);
    }.bind(this);

    this.selectRowElement = function(direction) {

      if ((direction > 0 && (this.elementsLength - 1) === this.currSelection) ||
        (direction < 0 && this.currSelection === 0)) {
          //console.log("in false");
        return false;
      }

      if (direction > 0) {

        $(".focusBorder").css({
          '-webkit-transform': 'translate3d(290px, 0px,0px)'
        });
      } else {

        $(".focusBorder").css({
          '-webkit-transform': 'translate3d(0px, 0px,0px)'
        });
      }

      this.currSelection += direction;

    }.bind(this);

    this.transitionDown = function() {

      this.currY -= 545;
      this.$children[0].style[this.transformStyle] = "translate3d( 0px," + this.currY + "px,0px)";
      this.trigger("Ypos", this.currY);
    };
    this.transitionUp = function() {

      this.currY += 545;
      this.$children[0].style[this.transformStyle] = "translate3d( 0px," + this.currY + "px,0px)";

    };


    this.handleControls = function(e) {

      if (e.type === 'buttonpress') {
        switch (e.keyCode) {
          case buttons.CLICK:
          case buttons.SELECT:
          case buttons.PLAY_PAUSE:

            $(".focusBorder").hide();
            this.trigger('select', this.currSelection, this.data);

            break;

          case buttons.BACK:

            $(".focusBorder").hide();

            $('.springboardBackground').css({

              'background': '#000000 url("") left top/1920px 1080px no-repeat '

            });

            $('.springboardBackground').hide();
            $('.springboardBackground img').hide();
            $(".springboardBackground img").attr('src', '');

            this.trigger("back");
            break;


          case buttons.UP:

            this.trigger("UP");

            break;
          case buttons.DOWN:

            this.trigger('transitionDown');
            break;

          case buttons.LEFT:

            if (this.currSelection !== 0) {
              this.move(-1);
            } else {

            }

            break;

          case buttons.RIGHT:

            if (this.currSelection <= 3) {
              this.move(1);
            }

            break;
        }
      } else if (e.type === 'buttonrepeat') {
        switch (e.keyCode) {
          case buttons.LEFT:

            break;

          case buttons.RIGHT:

            break;
        }
      } else if (e.type === 'buttonrelease') {
        switch (e.keyCode) {
          case buttons.LEFT:
          case buttons.RIGHT:

            break;
        }
      }
    }.bind(this);

  }

  exports.SpringboardPageView = SpringboardPageView;
}(window));
