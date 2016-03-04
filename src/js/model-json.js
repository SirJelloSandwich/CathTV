/* Model
 *
 * Model for JSON data
 */

(function(exports) {
  "use strict";

  function JSONMediaModel() {

    Events.call(this, ['error']);

    this.beyondTodayDaily = [];
    this.beyondTodayTV = [];


    this.currData = {};
    this.currentCategory = 0;

    this.finalFeaturedData = [];
    this.featuredUrl = 'http://www.ucg.org/api/v1.0/media/';
    this.gaUrl = "http://www.google-analytics.com/collect?";

    //this.baseUrl = "https://identity.auth.theplatform.com/idm/web/Authentication/signIn?schema=1.0&form=json";
    //"https://data.media.theplatform.com/media/data/Category?schema=1.2&form=json&token=MGhTL1gK6K6cj5oWrAmAYRAAgOCocLAs"
    this.username = "mpx/tom@floatleftinteractive.com";
    this.pw = "Tomfli#1";
    // {@"schema": @"1.0", @"form": @"json"}
    // "mpx/tom@floatleftinteractive.com"
    // "Tomfli#1"
    // " "

    this.epData = [];

    this.TIMEOUT = 60000;

    this.loadData = function(url, headers,callback) {
        var requestData;
        //
        // if(type){
        //   type = true;
        // }else{
        //     type =false;
        // }
        // console.log(type);

        requestData = {
            url: url,
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            context: this,
            async:true,
            cache: true,
            timeout: this.TIMEOUT,
            // headers: {
            //   "Authorization": "Basic " + btoa(this.username + ":" + this.pw)
            // }.bind(this),
            // beforeSend : function(request) {
            //
            //   if (undefined != headers)
            //   {
            //     for ( var i in headers)
            //     {
            //       Acorn.debug.log("header:"+ "  " + i + " " + headers[i]);
            //       request.setRequestHeader(i, headers[i]);
            //     }
            //   }
            //
            // },
            beforeSend: function (xhr) {
              if(headers === 1){
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(this.username + ":" + this.pw));
              }

            },
            success: function () {

                // var name2 = name.replace(/['"]+/g, '');
                //
                // if(name2 === "featuredUrl"){
                //     var featuredItems = arguments[0];
                //
                //     for (var ttt in featuredItems.data) {
                //
                //         this.featuredUrl += featuredItems.data[ttt].id + ',';
                //     }
                //     this[name2] = this.featuredUrl.substring(0, this.featuredUrl.length - 1);
                //     dataLoadedCallback(this[name2]);
                //
                //     return;
                // }
                //
                // this[name2] = arguments[0];
                //
                // dataLoadedCallback(this[name2]);
                //console.log("success");
                //console.log();
                callback(arguments[0]);

            }.bind(this),
            error: function (jqXHR, textStatus) {
                // Data feed error is passed to model's parent (app.js) to handle
                if (jqXHR.status === 0) {
                    this.trigger("error", ErrorTypes.INITIAL_NETWORK_ERROR, errorHandler.genStack());
                    return;
                }
                switch (textStatus) {
                    case "timeout":
                        this.trigger("error", ErrorTypes.INITIAL_FEED_TIMEOUT, errorHandler.genStack());
                        break;
                    case "parsererror":
                        this.trigger("error", ErrorTypes.INITIAL_PARSING_ERROR, errorHandler.genStack());
                        break;
                    default:
                        this.trigger("error", ErrorTypes.INITIAL_FEED_ERROR, errorHandler.genStack());
                        break;
                }
            }.bind(this)
        };
      fireUtils.ajaxWithRetry(requestData);
    }.bind(this);



    this.postData = function(postUrl) {
      this.gaUrl += postUrl;

      var postData = {
        url: this.gaUrl,
        type: 'POST',
        crossDomain: true,
        context: this,
        cache: true,
        timeout: this.TIMEOUT,
        success: function() {
          //var postReturnData = arguments[0];
        }.bind(this),
        error: function(jqXHR, textStatus) {
          // Data feed error is passed to model's parent (app.js) to handle
          if (jqXHR.status === 0) {
            this.trigger("error", ErrorTypes.INITIAL_NETWORK_ERROR, errorHandler.genStack());
            return;
          }
          switch (textStatus) {
            case "timeout":
              this.trigger("error", ErrorTypes.INITIAL_FEED_TIMEOUT, errorHandler.genStack());
              break;
            case "parsererror":
              this.trigger("error", ErrorTypes.INITIAL_PARSING_ERROR, errorHandler.genStack());
              break;
            default:
              this.trigger("error", ErrorTypes.INITIAL_FEED_ERROR, errorHandler.genStack());
              break;
          }
        }.bind(this)
      };
      fireUtils.ajaxWithRetry(postData);
    }.bind(this);

    this.browseShovelerData = function(callback) {

      this.browseRows = [];

      this.browseRows.push(this.beyondTodayDaily.data);
      this.browseRows.push(this.beyondTodayTV.data);
      this.browseRows.push(this.seriesData.data);

      for (var kkk in this.browseRows) {
        for (var ppp in this.browseRows[kkk]) {
          if (this.browseRows[kkk][ppp].duration !== null && this.browseRows[kkk][ppp].duration !== undefined) {
            var newTime = this.convertSecondsToMMSS(this.browseRows[kkk][ppp].duration);

            this.browseRows[kkk][ppp].fliTime = newTime;
          }
        }
      }
      callback(this.browseRows);

    };

    this.sortAlphabetically = function(arr) {
      arr.sort();
    };

    this.getBrowseRows = function(index) {

      return this.browseRows[index];

    }.bind(this);



    this.setCurrentCategory = function(index) {

      this.currentCategory = index;

    };


    this.setCurrentSubCategory = function(data) {
      this.currSubCategory = data;
    };


    this.getCategoryItems = function() {
      return this.categoryData;
    };


    this.getCategoryData = function(container, categoryCallback) {

      this.currData = this.categories[this.currentCategory];
      categoryCallback(container, this.currData);
    };


    this.filterLiveData = function(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].type === "video-live") {
          var startTime = new Date(data[i].startTime).getTime();
          var endTime = new Date(data[i].endTime).getTime();
          var currTime = Date.now();
          var isAlwaysLive = data[i].alwaysLive;
          if (currTime < endTime && currTime >= startTime) {
            data[i].isLiveNow = true;
          } else if (isAlwaysLive) {
            data[i].isLiveNow = true;
          } else if (currTime > endTime) {
            // remove old broadcasts
            data.splice(i, 1);
            i--;
          } else {
            var upcomingTimeSeconds = Math.round((startTime - currTime) / 1000);
            var days = Math.floor(upcomingTimeSeconds / 86400);
            data[i].isLiveNow = false;
            if (days > 0) {
              data[i].upcomingTime = exports.utils.formatDate(data[i].startTime);
            } else {
              data[i].upcomingTime = "Starts in " + this.convertSecondsToHHMM(upcomingTimeSeconds);
            }
          }
        }
      }
      return data;
    };

    this.convertSecondsToMMSS = function(seconds) {
      var minutes = Math.floor(seconds / 60);
      var displaySeconds = seconds - minutes * 60;
      if (displaySeconds < 10) {
        return minutes + ":0" + displaySeconds;
      }
      return minutes + ":" + displaySeconds;
    };


    this.convertSecondsToHHMM = function(seconds, alwaysIncludeHours) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor(seconds / 60);

      var finalString = "";

      if (hours > 0 || alwaysIncludeHours) {
        finalString += hours + " hours ";
      }
      if (minutes < 10 && minutes > 0) {
        return finalString + ('00:0' + minutes);
      } else {
        return finalString + ('00:' + minutes);
      }

    };


    this.getFullContentsForFolder = function(folder) {
      var i;
      var j;
      var contents = [];
      var currContents = folder.items;

    };


    this.getSubCategoryData = function(subCategoryCallback) {

      var returnData = JSON.parse(JSON.stringify(this.currSubCategory));
      returnData.contents = this.getFullContentsForFolder(this.currSubCategory);

      subCategoryCallback(returnData);
    };


    this.getDataFromSearch = function(searchTerm, searchCallback) {
      this.currData = [];
      for (var i = 0; i < this.mediaData.length; i++) {
        if (this.mediaData[i].title.toLowerCase().indexOf(searchTerm) >= 0 || this.mediaData[i].description.toLowerCase().indexOf(searchTerm) >= 0) {
          //make sure the date is in the correct format
          if (this.mediaData[i].pubDate) {
            this.mediaData[i].pubDate = exports.utils.formatDate(this.mediaData[i].pubDate);
          }
          this.currData.push(this.mediaData[i]);
        }
      }
      searchCallback(this.currData);
    };

    this.setCurrentItem = function(index) {
      this.currentItem = index;
      this.currentItemData = this.currData[index];
    };

    this.getCurrentItemData = function() {
      return this.currentItemData;
    };





  }

  exports.JSONMediaModel = JSONMediaModel;

})(window);
