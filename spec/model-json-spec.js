/*
 * model-json-spec.js
 */

describe("model-json library", function() {
  var model_json;

  beforeEach(function() {
    model_json = window.JSONMediaModel;
  });

  it("should be a window-bound function", function() {
    expect(typeof model_json).toBe("function");
  });

});
