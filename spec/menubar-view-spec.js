/*
 * menu-bar-spec.js
 */

describe("menu-bar library", function() {
  var menu_bar;

  beforeEach(function() {
    menu_bar = window.MenuBarView;
  });

  it("should be a window-bound function", function() {
    expect(typeof menu_bar).toBe("function");
  });

});
