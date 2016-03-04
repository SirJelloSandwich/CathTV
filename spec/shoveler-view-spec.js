/*
 * shoveler-view-spec.js
 */

describe("shoveler-view library", function() {
  var shoveler_view;

  beforeEach(function() {
    shoveler_view = window.ShovelerView;
  });

  it("should be a window-bound function", function() {
    expect(typeof shoveler_view).toBe("function");
  });

});
