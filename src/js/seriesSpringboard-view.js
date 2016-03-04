(function(exports) {
  "use strict";

  function SeriesSpringboardPageView() {


    Events.call(this, ['loadComplete', 'startScroll', 'select', 'back', 'transitionDown', 'stars', 'Ypos', 'delete', 'UP']);
    this.currSelection = 0;
    this.elementsLength = null;
    var incrementer = 2;
    this.currY = 0;
    this.transformStyle = fireUtils.vendorPrefix('Transform');
    this.lastView = null;
    this.noItems = 0;

    this.highLight = function() {

      $(".focusBorder").show();
    };

    this.unHighLight = function() {

      $(".focusBorder").hide();
    };

    this.render = function($el, data) {

      this.data = data;

      var html = fireUtils.buildTemplate($("#series-springboard-template"), this.data);

      $el.append(html);

      this.elementsLength = $(".seriesSpringboardRow").children().length;



      if (data.fliTime !== null && data.fliTime !== undefined) {
        if (data.authors !== undefined) {
          $(".seriesDirector").text(data.authors[0].label + " " + "|");
        }

      } else {
        if (data.authors !== undefined) {
          $(".seriesDirector").text(data.authors[0].label);
        }
      }

      if(data.description.length > 350){
        var newString = data.description.substring(0, 350);
        $(".seriesRatingEtc").after("<div class='newDesc'>"+newString+ "..."+"</div>");
      }
      else{
        $(".seriesRatingEtc").after("<div class='newDesc'>"+data.description+"</div>");
      }

      //$(".seriesRatingEtc").after('<div class="newDesc">'+data.description+'</div>');

      var image = new Image();

      image.onload = function() {

        $('.seriesSpringboardBackground').css({

          'background': 'url("' + image.src + '") no-repeat left top'

        });

        $('.seriesSpringboardBackground').fadeIn(1000, "swing", function() {
          $(".seriesSpringboardBgOpacity").css('background', 'rgba(0,0,0,0.8)');
        });


      };
      if (data.image !== null) {
        image.src = this.data.image.self;
      } else {
        image.src = "assets/BT_placeholder.png";
      }


      $(".seriesSpringboardBgOpacity").show();
      $(".focusBorder").show();
      this.trigger('loadComplete');

      this.$children = $('.seriesSpringboardContainer').children();

    };


    this.move = function(dir) {

      this.trigger("startScroll", dir);
      this.selectRowElement(dir);
    }.bind(this);

    this.selectRowElement = function(direction) {

      if ((direction > 0 && (this.elementsLength - 1) === this.currSelection) ||
        (direction < 0 && this.currSelection === 0)) {

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

    this.changeWatchListText = function() {
      var qqq;
      var ttt;
      if ($(".springboardRow span:nth-child(2)").hasClass('orangeBorder')) {
        var kkk = $(".springboardRow span:nth-child(2)").children();
        if ($(kkk[1]).text() === "Remove From Watchlist") {
          $(kkk[1]).text("Add to Watchlist");
          if (app.gridWrapView !== undefined) {
            qqq = $(".moveableGridInternalContainer div:nth-child(" + (app.gridWrapView.currSelection + 1) + ")");
            ttt = $(".moveableGridInternalContainer").children();
            ttt = $(ttt[app.gridWrapView.currSelection]).children(".thumbnailVideoTitle").text();
            qqq.children('div').children('img').addClass("removedFromWatchlist");
            $(qqq.children(".innerThumbnailContainer")).append("<div class='inside'>Removed From Watchlist</div>");
            //console.log(app.gridWrapView.currSelection+1);
            this.trigger('delete', (app.gridWrapView.currSelection), ttt);
          }
        } else {
          $(kkk[1]).text("Remove From Watchlist");
          if (app.gridWrapView !== undefined) {
            qqq.children('div').children('img').removeClass("removedFromWatchlist");
            $(qqq.children(".innerThumbnailContainer")).remove("<div class='inside'>Removed From Watchlist</div>");
          }
        }
      }
    };

    this.incrementStars = function() {

      if ($(".springboardRow span:nth-child(3)").hasClass('orangeBorder')) {
        if (incrementer < 5) {
          incrementer++;
        } else {
          incrementer = 0;
        }
        var icon = $(".springboardRow span:nth-child(3)").children('img');
        $(icon).attr('src', 'assets/stars_' + incrementer + '_fhd.png');
      }
    };

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
            $(".seriesSpringboardContainer").remove();
            this.trigger('select', this.currSelection, this.data);

            break;

          case buttons.BACK:
            this.trigger("back");
            break;


          case buttons.UP:
            this.trigger("UP");
            break;
          case buttons.DOWN:

            //this.trigger('transitionDown');
            break;

          case buttons.LEFT:

            if (this.currSelection !== 0) {
              this.move(-1);
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
            // this.selectRowElement(-1);
            break;

          case buttons.RIGHT:
            // this.selectRowElement(1);
            break;
        }
      } else if (e.type === 'buttonrelease') {
        switch (e.keyCode) {
          case buttons.LEFT:
          case buttons.RIGHT:
            //this.trigger("stopScroll", this.currSelection);


            break;
        }
      }
    }.bind(this);

  }

  exports.SeriesSpringboardPageView = SeriesSpringboardPageView;
}(window));
