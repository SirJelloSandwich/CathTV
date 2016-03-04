/*
 * buttons-spec.js
 */

describe("buttons library", function() {
  var buttons;

  beforeEach(function() {
    buttons = window.Buttons;
  });

  it("should be a window-bound function", function() {
    expect(typeof buttons).toBe("function");
  });

});
