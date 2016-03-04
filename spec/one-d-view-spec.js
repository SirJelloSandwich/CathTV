/*
 * one-d-view-spec.js
 */

describe("one_d_view library", function() {
  var one_d_view;

  beforeEach(function() {
    one_d_view = window.OneDView;
  });

  it("should be a window_bound function", function() {
    expect(typeof one_d_view).toBe("function");
  });

});
