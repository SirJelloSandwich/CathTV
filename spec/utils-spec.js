/*
 * utils-spec.js
 */

describe("Utils library", function() {
  var utils;

  beforeEach(function() {
    utils = window.Utils;
  });

  it("should be a window-bound function", function() {
    expect(typeof utils).toBe("function");
  });

  xit("should implement Handlebars", function() {

  });

});
