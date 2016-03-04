/*
 * events-spec.js
 */

describe("events library", function() {
  var events;

  beforeEach(function() {
    events = window.Events;
  });

  it("should be a window-bound function", function() {
    expect(typeof events).toBe("function");
  });

});
