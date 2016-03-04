// init.js

(function(exports) {
  'use strict';

  var settings = {
    appTitle: "FLICast",
    Model: JSONMediaModel,
    dataURL: '',
    numberOfCategories: 30,
    developerToken: "sScWYPLSHmM76WQu_xBVQtvWMHXXbdEwbVcP38LBB9Q.",
    accountID: "3986618082001",
    playerID: "115d0726-53ff-4cd9-8a5d-c68ea10d3ea2",
    showSearch: false,
    displayButtons: false,
    tizen: false
  };

  exports.app = new App(settings);
}(window));
