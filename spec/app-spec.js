/*
 * app-spec.js
 */

describe("Main Application", function() {
  var app;

  var settings = {
    appTitle: "FLICast",
    Model: JSONMediaModel,
    dataURL: 'assets/hope-mock-data.json',
    MenuModel: MenuModel,
    menuData: 'assets/menu-data.json',
    numberOfCategories: 30,
    developerToken: "sScWYPLSHmM76WQu_xBVQtvWMHXXbdEwbVcP38LBB9Q.",
    accountID: "3986618082001",
    playerID: "115d0726-53ff-4cd9-8a5d-c68ea10d3ea2",
    showSearch: false,
    displayButtons: false,
    image : "assets/cat.jpeg"

  };

  beforeEach(function() {
    app = new App(settings);
  });

  it("should be a window-bound function", function() {
    expect(typeof window.App).toBe("function");
  });

  it("should not be able to recognize touch events", function() {
    expect(app.handleTouch).not.toBeDefined();
  });

});
