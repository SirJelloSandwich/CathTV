(function (exports) {
    "use strict";


    function ControlsView() {

        Events.call(this, ['loadingComplete']);

         this.totalDurationFound = null;
         this.currSelection = 1;
         this.elementsLength = null;
         this.continuousSeek = false;


        this.render = function ($container, playerView ) {
            // Build the  content template and add it
            var html = fireUtils.buildTemplate($("#fli-controls-view"), {});

            $container.append(html);

            this.$containerControls = $(".roundedEdgeControlContainer");

            this.pauseIcon = this.$containerControls.find(".pause")[0];
            $('div.pause').css('background-color', ' #ff6600');
            this.$currTime = this.$containerControls.find(".currentRunTimeBox");
            this.$totalTime =  this.$containerControls.find(".totalRunTimeBox");
            this.$forwardIndicator = this.$containerControls.find(".ff");
            this.$rewindIndicator = this.$containerControls.find(".rw");
            this.forwardIndicator = this.$forwardIndicator[0];
            this.rewindIndicator = this.$rewindIndicator[0];
            this.seekHead = this.$containerControls.find(".progressDot")[0];
            this.progressContainer = this.$containerControls.find(".coloredProgressContainer")[0];
            this.playerView = playerView;
            playerView.on('videoStatus', this.handleVideoStatus, this);
            this.elementsLength = $(".controlBox").children().length + 1;

        };


            this.move = function (dir) {

              //this.trigger("startScroll", dir);
              this.selectRowElement(dir);
            }.bind(this);

            this.selectRowElement = function (direction) {

                  if ((direction > 0 && (this.elementsLength -1) === this.currSelection) || (direction < 0 && this.currSelection === 0 )) {
                    return false;
                  }



                 if (direction > 0 &&  this.currSelection === 2){

                    $(".controlBox").children().eq(this.currSelection).css('background-color', '');

                    this.currSelection += direction;

                     $(".closedCaption").css('background-color', '#ff6600');

                     return;

                 }

                 if(direction < 0 && this.currSelection === 3 ){

                    $(".closedCaption").css('background-color', '');

                    this.currSelection += direction;

                    $(".controlBox").children().eq(this.currSelection).css('background-color', '#ff6600');

                    return;
                 }


                $(".controlBox").children().eq(this.currSelection).css('background-color', '');

                this.currSelection += direction;

                $(".controlBox").children().eq(this.currSelection).css('background-color', '#ff6600');




            }.bind(this);



        this.convertSecondsToHHMMSS = function(seconds, alwaysIncludeHours) {
            var hours = Math.floor( seconds / 3600 );
            var minutes = Math.floor( seconds / 60 ) % 60;
            seconds = Math.floor( seconds % 60 );

            var finalString = "";

            if (hours > 0 || alwaysIncludeHours) {
                finalString += hours + ":";
            }
            return finalString + ('00' + minutes).slice(-2) + ":" + ('00' + seconds).slice(-2)  ;
        };

        this.handleVideoStatus = function(currentTime, duration, type) {
            // video has been loaded correctly
            if (!this.totalDurationFound) {
                this.durationChangeHandler(duration);
            }

            switch (type) {
                case "paused":
                    this.pausePressed();
                    break;
                case "durationChange":
                    this.durationChangeHandler(duration);
                    break;
                case "playing":
                    this.timeUpdateHandler(duration, currentTime);
                    break;
                case "resumed":
                    this.resumePressed();
                    break;
                case "seeking":
                    this.seekPressed(currentTime);
                    break;
            }
            this.previousTime = currentTime;
        }.bind(this);

         this.seekPressed = function(currentTime) {
            var skipTime = Math.round(Math.abs(currentTime - this.previousTime));
            if (this.previousTime > currentTime) {
                // // skip backwards
                // this.clearTimeouts();
                // this.showAndHideControls();
                // this.setIndicator("rewind", skipTime);
                // this.$forwardIndicator.hide();
                // this.indicatorTimeout = setTimeout(function() {
                //     this.$rewindIndicator.hide();
                // }.bind(this), this.controlsHideTime);
            }
            else if (currentTime > this.previousTime) {
                 //playerView.videoElement.playbackRate =
                // skip forward
                // this.clearTimeouts();
                // this.showAndHideControls();
                // this.setIndicator("forward", skipTime);
                // this.$rewindIndicator.hide();
                // this.indicatorTimeout = setTimeout(function() {
                //     this.$forwardIndicator.hide();
                // }.bind(this), this.controlsHideTime);
            }
        }.bind(this);

        this.pausePressed = function () {

            //$('div.pause').css('background-color', '');
            // $("div.pause").removeClass("pause").addClass("play");
            //  $('div.play').css('background-color', '#ff6600');
            // if (this.pauseTimeout) {
            //     clearTimeout(this.pauseTimeout);
            //     this.pauseTimeout = 0;
            // }
            // this.containerControls.style.opacity = "0.99";
            // // show pause icon
            // this.playIcon.style.opacity = "0.99";
            // // hide the pause icon after designated time by ux
            // this.pauseTimeout = setTimeout(function() {
            //     this.playIcon.style.opacity = "0";
            // }.bind(this), this.PAUSE_REMOVAL_TIME);
            // // cancel any pending timeouts
            // clearTimeout(this.removalTimeout);

        };

        this.resumePressed = function() {
            // hide pause icon
            // this.playIcon.style.opacity = "0";
             //this.showAndHideControls();
            // $("div.play").removeClass("play").addClass("pause");
            // $('div.pause').css('background-color', '#ff6600');
        };

         this.showAndHideControls = function() {
            //console.log("show and Hide");

            // this.containerControls.style.opacity = "0.99";
            // clearTimeout(this.removalTimeout);
            // this.removalTimeout = setTimeout(function() {
            //      this.containerControls.style.opacity = "0";
            //      this.$rewindIndicator.hide();
            //      this.$forwardIndicator.hide();
            // }.bind(this), this.controlsHideTime);
        };

        this.durationChangeHandler = function(videoDuration) {
            // check if we have found a duration yet, and that duration is a real value
            if (videoDuration) {
                    var duration = this.convertSecondsToHHMMSS(videoDuration);

                    this.$totalTime.text(duration);
                    // this.totalDurationFound = true;

                    // // show controls after duration found
                    // this.containerControls.style.opacity = "0.99";
                    // this.playIcon.style.opacity = "0";
                    // this.showAndHideControls();
            }
        }.bind(this);

        this.timeUpdateHandler = function(videoDuration, videoCurrentTime) {
            // Calculate the slider value
            var value = (600 / videoDuration) * videoCurrentTime;
             this.seekHead.style.marginLeft = value + "px";
             this.progressContainer.style.width = value + "px";
            // this.forwardIndicator.style.left = (value - this.SKIP_INDICATOR_OFFSET) + "%";
            // this.rewindIndicator.style.left = (value - this.SKIP_INDICATOR_OFFSET) + "%";
            this.$currTime.text(this.convertSecondsToHHMMSS(videoCurrentTime, this.videoDuration > 3600 ));
        }.bind(this);

        this.clearTimeouts = function() {
            if (this.indicatorTimeout) {
                clearTimeout(this.indicatorTimeout);
                this.indicatorTimeout = 0;
            }
        };


	}

    exports.ControlsView = ControlsView;
}(window));
