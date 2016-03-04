(function(exports) {


  function PlayerView() {

    Events.call(this, ['loadComplete', 'startScroll', 'select', 'exit', 'back', 'videoStatus', 'error', 'novideo', 'gaVideoTimeUpdate']);


    this.isSkipping = false;
    this.paused = false;
    this.SKIP_LENGTH_DEFAULT = 5;
    this.BUTTON_INTERVALS = [100, 200, 300, 400, 500];
    var ccClicked = 0;
    this.ccChoice = "OFF";
    var value;
    this.canplay = false;
    var jjj;
    this.fastfor = 0;
    this.rw = 0;
    this.fakeDisplayTime = 2;
    this.slideUp = 0;
    this.upTimeout = null;
    var trickArrayQueue = 0;
    this.trickArray = [];
    this.gaUpdateFireArray = [0.25, 0.50, 0.75];
    var gaUpdateIndex = 0;

    //this.callValue = 1;
    this.callFreq = 1000;

    this.render = function($el, data) {

      this.data = data;

      var html = fireUtils.buildTemplate($("#fli-player-view"));

      $el.append(html);

      if (data.hls) {
          $("video").attr('src', data.hls.self);
      } else if (data.video720) {
        $("video").attr('src', data.video720.self);
      } else if (data.video1080) {
        $("video").attr('src', data.video1080.self);
      } else if (data.videolow) {
        $("video").attr('src', data.videolow.self);
      } else {

        this.trigger('novideo', "We’re sorry, this video is not available right now. Please check back again soon.");
        app.menuBarView.move(-1);
        return;
      }

      this.videoElement = document.getElementsByTagName("video")[0];

      this.$el = $(".player-main-container").parent();

      // add event listeners
      this.videoElement.addEventListener("canplay", this.canPlayHandler);
      this.videoElement.addEventListener("ended", this.videoEndedHandler);
      this.videoElement.addEventListener("timeupdate", this.timeUpdateHandler);
      this.videoElement.addEventListener("pause", this.pauseEventHandler);
      this.videoElement.addEventListener("error", this.errorHandler);
      this.videoElement.addEventListener("stalled", this.errorHandler);
      this.videoElement.addEventListener("abort", this.errorHandler);
      this.videoElement.addEventListener('progress', function () {
        	console.log("Buffering...");
        }, false);
        this.videoElement.addEventListener('loadedmetadata', function() {
    			console.log("Video metadata info was loaded");

    		}, false);

      this.controlsView = new ControlsView();
      this.controlsView.render($(".FRAMER_EXAMPLE"), this);

      if (data.vtt) {
        $('track').attr('src', this.data.vtt.self);
      }

      if (this.data.trickplay_directory) {

        $(".FRAMER_EXAMPLE").append('<div class="scrubberThumbnail"><img class="scrubberImg" src="' + this.data.trickplay_directory + '3.jpg" /><div class="scrubberSpeedOverlay">x2</div></div>');
      } else {
          $(".FRAMER_EXAMPLE").append('<div class="scrubberThumbnail"><img class="scrubberImg" src="assets/BT_trickplayplaceholder.png"/><div class="scrubberSpeedOverlay">x2</div></div>');
      }
      var that = this;

      this.noPlayTimeOut = setTimeout(function() {
        if (that.canplay) {
          return;
        }
        that.trigger('novideo');

        app.menuBarView.move(-1);
        that.turnOffEvents();
      }, 10000);

    };

    this.turnOnEvents = function() {

      this.videoElement = document.getElementsByClassName("player-main-container")[0];
      this.videoElement.addEventListener("canplay", this.canPlayHandler);
      this.videoElement.addEventListener("ended", this.videoEndedHandler);
      this.videoElement.addEventListener("timeupdate", this.timeUpdateHandler);
      this.videoElement.addEventListener("pause", this.pauseEventHandler);
      this.videoElement.addEventListener("error", this.errorHandler);
      this.videoElement.addEventListener("stalled", this.errorHandler);
      this.videoElement.addEventListener("abort", this.errorHandler);
      this.videoElement.addEventListener('progress', function () {
        	console.log("Buffering...");
        }, false);
        this.videoElement.addEventListener('loadedmetadata', function() {
    			console.log("Video metadata info was loaded");

    		}, false);
    };

    this.turnOffEvents = function() {
      clearTimeout(this.noPlayTimeOut);
      this.videoElement.removeEventListener("canplay", this.canPlayHandler);
      this.videoElement.removeEventListener("ended", this.videoEndedHandler);
      this.videoElement.removeEventListener("timeupdate", this.timeUpdateHandler);
      this.videoElement.removeEventListener("pause", this.pauseEventHandler);
      this.videoElement.removeEventListener("error", this.errorHandler);
      this.videoElement.removeEventListener("stalled", this.errorHandler);
      this.videoElement.removeEventListener("abort", this.errorHandler);
      this.videoElement.removeEventListener("progress");
      this.videoElement.removeEventListener("loadedmetadata");
    };

    this.errorHandler = function(e) {

    }.bind(this);

    this.pauseEventHandler = function() {

      this.clearTimeouts();
      this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'paused');
      var ddd = $(".progressDot").offset();
      this.scrubberCenter = ddd.left - 187.5;
    //   $(".scrubberThumbnail").css('-webkit-transform', "translate3d(" + this.scrubberCenter + "px, 0px, 0px)");
      $(".scrubberThumbnail").css('transform', "translate3d( "+ this.scrubberCenter + "px, 0px, 0px)");
    }.bind(this);

    this.videoEndedHandler = function() {
      this.clearTimeouts();
      this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'ended');
      this.trigger('back');
      gaUpdateIndex = 0;
    }.bind(this);

    this.timeUpdateHandler = function() {

      this.clearTimeouts();

      // Don't update when skipping
      if (!this.isSkipping) {

        this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'playing');
        this.ffTime = this.videoElement.currentTime;

        if (gaUpdateIndex > 2) {
          return;
        } else if (this.videoElement.currentTime >= this.videoElement.duration * this.gaUpdateFireArray[gaUpdateIndex]) {
          var updateTime = this.gaUpdateFireArray[gaUpdateIndex] * 100;
          this.trigger('gaVideoTimeUpdate', updateTime);
          gaUpdateIndex += 1;

        }


      }
    }.bind(this);

    this.canPlayHandler = function() {

      this.canplay = true;
      //prevent triggering 'canplay' event when skipping or when video is paused
      if (!this.paused && !this.isSkipping) {
        this.buttonDowntime = this.videoElement.currentTime;
        this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'canplay');

      }

      var numInTrickArray = this.data.duration / 5;

      for (var i = 0; i <= numInTrickArray; i++) {
        this.trickArray[i] = i;
      }
      this.videoElement.textTracks[0].mode = "hidden";
    }.bind(this);

    this.remove = function() {
      $(".fliVideo").remove();
    }.bind(this);

    this.reShow = function() {
      $(".fliVideo").show();
      $('.roundedEdgeControlContainer').show();

    }.bind(this);

    this.playVideo = function() {

      this.videoElement.play();
      this.paused = false;
      buttons.setButtonIntervals(this.BUTTON_INTERVALS);
      this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'playing');
    }.bind(this);

    this.clearTimeouts = function() {
      if (this.playerTimeout) {
        clearTimeout(this.playerTimeout);
        this.playerTimeout = 0;
      }
      if (this.playerSlowResponse) {
        clearTimeout(this.playerSlowResponse);
        this.playerSlowResponse = 0;
      }
    };

    this.pauseVideo = function() {
      // this no longer directly sends a video status event, as the pause can come from Fire OS and not just
      // user input, so this strictly calls the video element pause
      if (!this.isSkipping) {
        this.videoElement.pause();
        this.paused = true;
      }
    };

    /**
     * Resume the currently playing video
     */
    this.resumeVideo = function() {
      $(".scrubberThumbnail").css('opacity', '0');
      this.videoElement.play();
      this.paused = false;
      this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'resumed');
    };

    this.seekVideo = function(position) {
      this.controlsView.continuousSeek = false;
      this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'playing');
      this.videoElement.currentTime = position;
      this.trigger('videoStatus', this.videoElement.currentTime, this.videoElement.duration, 'seeking');
    };

    this.fliSeek = function(time) {
      clearTimeout(this.upTimeout);
      var queueTime;
      app.playerView.ffTime += time;

    if(this.data.trickplay_directory){
          this.trickArray.filter(function(value, index , array) {
             if(index > 0){
              return array[index] === (Math.floor(app.playerView.ffTime)/5)+3 ;
             }
          }).forEach(function(value, index, array) {
             $(".scrubberImg").attr("src", " ");
             $(".scrubberImg").attr("src", app.playerView.data.trickplay_directory + app.playerView.trickArray[value] + ".jpg");
          });
        }

      value = (600 / app.playerView.videoElement.duration) * app.playerView.ffTime;

      app.playerView.controlsView.seekHead.style.marginLeft = value + "px";
      app.playerView.controlsView.progressContainer.style.width = value + "px";
      app.playerView.controlsView.$currTime.text(app.playerView.controlsView.convertSecondsToHHMMSS(app.playerView.ffTime, app.playerView.videoElement.duration > 3600));

      if ((this.controlsView.currSelection === 0 && value <= 5) || (this.controlsView.currSelection === 2 && value >= 595)) {

        $(".roundedEdgeControlContainer").css('-webkit-transform', 'translate3d(0px, 200px, 0px');
        clearInterval(jjj);

        app.playerView.videoElement.currentTime = app.playerView.ffTime;
        app.playerView.resumeVideo();
        $(".controlBox").children().css('background-color', '');
        $("div.play").removeClass("play").addClass("pause");
        $('div.pause').css('background-color', '#ff6600');
        app.playerView.controlsView.currSelection = 1;
      }

      var ddd = $(".progressDot").offset();
      this.scrubberCenter = ddd.left - 187.5;
      $(".scrubberThumbnail").css('-webkit-transform', 'translate3d(' + this.scrubberCenter + 'px, 0px, 0px');
    };

    this.reWind = function() {
      $(".controlBox").children().eq(this.controlsView.currSelection).css('background-color', '');
      this.controlsView.currSelection = 0;
      $(".controlBox").children().eq(this.controlsView.currSelection).css('background-color', '#ff6600');

      clearTimeout(this.upTimeout);
      this.rw = 1;

      $(".scrubberThumbnail").css('opacity', '0.99');

      if (this.fastfor === 1) {
        //  clearTimeout(this.upTimeout);
        if (jjj !== undefined) {

          clearInterval(jjj);

          this.fakeDisplayTime = 2;
          this.videoElement.currentTime = this.ffTime;

        }

        jjj = undefined;
        $(".scrubberThumbnail").css('opacity', '0.0');
        this.fastfor = 0;
        $("div.pause").removeClass("pause").addClass("play");

        return;
      }

      if (!this.paused) {

        this.fastfor = 0;
        $("div.pause").removeClass("pause").addClass("play");

        this.pauseVideo();
        this.ffTime = this.videoElement.currentTime;
      }

      this.fakeDisplayTime *= 2;
      $(".scrubberSpeedOverlay").text('x' + this.fakeDisplayTime);

      if (jjj !== undefined) {
        clearInterval(jjj);
      }

      jjj = setInterval(function() {
        app.playerView.fliSeek(-1);
      }, (this.callFreq/this.fakeDisplayTime));

      if (this.fakeDisplayTime >= 256) {

        clearInterval(jjj);

        this.fakeDisplayTime = 4;
        jjj = setInterval(function() {
          app.playerView.fliSeek(-1);
        }, (this.callFreq/this.fakeDisplayTime));
        $(".scrubberSpeedOverlay").text('x' + this.fakeDisplayTime);

      }
    };

    this.fastForward = function() {
      $(".controlBox").children().eq(this.controlsView.currSelection).css('background-color', '');
      this.controlsView.currSelection = 2;
      $(".controlBox").children().eq(this.controlsView.currSelection).css('background-color', '#ff6600');

      clearTimeout(this.upTimeout);
      this.fastfor = 1;

      $(".scrubberThumbnail").css('opacity', '0.99');

      if (this.rw === 1) {

        if (jjj !== undefined) {

          clearInterval(jjj);

          this.fakeDisplayTime = 2;
          this.videoElement.currentTime = this.ffTime;

        }

        jjj = undefined;
        $(".scrubberThumbnail").css('opacity', '0.0');
        this.rw = 0;
        $("div.pause").removeClass("pause").addClass("play");

        return;
      }

      if (!this.paused) {

        $("div.pause").removeClass("pause").addClass("play");

        this.pauseVideo();

        this.ffTime = this.videoElement.currentTime;
      }

      this.fakeDisplayTime *= 2;

      $(".scrubberSpeedOverlay").text('x' + this.fakeDisplayTime);

      if (jjj !== undefined) {
        clearInterval(jjj);
      }

      jjj = setInterval(function() {
        app.playerView.fliSeek(1);
      }, (this.callFreq/this.fakeDisplayTime));

      if (this.fakeDisplayTime >= 256) {

        clearInterval(jjj);

        this.fakeDisplayTime = 4;
        jjj = setInterval(function() {
          app.playerView.fliSeek(1);
        }, (this.callFreq/this.fakeDisplayTime));

        $(".scrubberSpeedOverlay").text('x' + this.fakeDisplayTime);

      }
    }.bind(this);


    this.handleControls = function(e) {

      if (e.type === 'buttonpress') {

        var slideDownFunc = function() {

          $(".roundedEdgeControlContainer").css('-webkit-transform', 'translate3d(0px,200px,0px');
          if (($(".ccOptions").css('opacity')) === '1') {
            $(".closedCaption").css('background-color', '#ff6600');
            $(".ccOptions").css('opacity', '0');
            ccClicked = 0;
          }
        };

        if (this.upTimeout !== null || this.upTimeout !== undefined) {
          clearTimeout(this.upTimeout);
        }
        this.upTimeout = setTimeout(slideDownFunc, 6000);

        $(".roundedEdgeControlContainer").css('-webkit-transform', 'translate3d(0px,0px,0px');

        switch (e.keyCode) {

          case buttons.CLICK:
          case buttons.SELECT:

            switch (this.controlsView.currSelection) {

              case 0:

                this.reWind();


                break;


              case 1:

                this.fastfor = 0;
                this.rw = 0;
                if ($("div.pause").hasClass('pause')) {

                  $("div.pause").removeClass("pause").addClass("play");
                  $('div.play').css('background-color', '#ff6600');
                } else {
                  $("div.play").removeClass("play").addClass("pause");
                  $('div.pause').css('background-color', '#ff6600');
                }

                if (this.videoElement.paused) {
                  if (jjj !== undefined) {
                    clearInterval(jjj);

                    this.fakeDisplayTime = 2;
                    this.videoElement.currentTime = this.ffTime;
                  }
                  jjj = undefined;
                  this.resumeVideo();
                } else {

                  this.pauseVideo();
                  this.videoElement.currentTime = this.ffTime;
                }

                break;


              case 2:

                this.fastForward();


                break;

              case 3:

                if (!ccClicked) {
                  $(".closedCaption").css('background-color', '');
                  $(".ccOptions").css('opacity', '1');
                  ccClicked = 1;
                } else {

                  if (($(".ccTop").css('background-color')) === 'rgb(255, 102, 0)') {
                    this.ccChoice = "ON";
                    this.videoElement.textTracks[0].mode = "showing";
                  } else {
                    this.ccChoice = "OFF";
                    this.videoElement.textTracks[0].mode = "hidden";
                  }

                  $(".closedCaption").css('background-color', '#ff6600');
                  $(".ccOptions").css('opacity', '0');
                  ccClicked = 0;

                }

                break;


            }

            break;

          case buttons.REWIND:

            this.reWind();

            break;

          case buttons.PLAY_PAUSE:

            $(".controlBox").children().eq(this.controlsView.currSelection).css('background-color', '');
            this.controlsView.currSelection = 1;
            $(".controlBox").children().eq(this.controlsView.currSelection).css('background-color', '#ff6600');

            this.fastfor = 0;
            this.rw = 0;
            if ($("div.pause").hasClass('pause')) {

              $("div.pause").removeClass("pause").addClass("play");
              $('div.play').css('background-color', '#ff6600');
            } else {
              $("div.play").removeClass("play").addClass("pause");
              $('div.pause').css('background-color', '#ff6600');
            }

            if (this.videoElement.paused) {
              if (jjj !== undefined) {
                clearInterval(jjj);
                this.fakeDisplayTime = 2;
                this.videoElement.currentTime = this.ffTime;
              }
              jjj = undefined;
              this.resumeVideo();
            } else {

              this.pauseVideo();
              this.videoElement.currentTime = this.ffTime;
            }

            break;

          case buttons.FAST_FORWARD:

            this.fastForward();

            break;

          case buttons.BACK:
            gaUpdateIndex = 0;
            clearInterval(jjj);
            $("#black-app-overlay").hide();
            $(".focusBorder").show();
            this.trigger("back");
            break;

          case buttons.UP:

            if (($(".ccOptions").css('opacity')) === '1') {
              $(".ccBottom").css('background-color', '#000000');
              $(".ccDot").css('top', '-65px');
              $(".ccTop").css('background-color', '#ff6600');

            }

            break;
          case buttons.DOWN:
            if (($(".ccOptions").css('opacity')) === '1') {
              $(".ccBottom").css('background-color', '#ff6600');
              $(".ccDot").css('top', '-25px');
              $(".ccTop").css('background-color', '#000000');
            }

            break;

          case buttons.LEFT:
            $(".ccOptions").css('opacity', '0');
            ccClicked = 0;
            this.controlsView.move(-1);


            break;

          case buttons.RIGHT:

            this.controlsView.move(1);

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

  exports.PlayerView = PlayerView;
}(window));
