describe("Sand Utils", function () {
  var Utils = Sand.Utils;

  describe("Vectors", function () {
    it("should accept no arguments", function () {
      var vec = new Utils.Vector();
      expect(vec).not.toBeUndefined();
    });
    it("should accept 2 values", function () {
      var vec = new Utils.Vector(20, 20);
      expect(vec).not.toBeUndefined();
    });
    describe("should expose getters and setters for its data via", function () {
      var vec, foo;
      beforeEach(function () {
        vec = new Utils.Vector(5, 4);
        foo = new Float64Array([5, 4]);
        bar = new Float64Array([8, 7]);
      })
      it("x", function () {
        expect(vec.x()).toEqual(5);
        vec.x(8);
        expect(vec.x()).toEqual(8);
        expect(vec.y()).not.toEqual(8);
      });
      it("y", function () {
        expect(vec.y()).toEqual(4);
        vec.y(7);
        expect(vec.y()).toEqual(7);
        expect(vec.y()).not.toEqual(5);
      });
      it("get", function () {
        expect(vec.get()).toEqual(foo);
        expect(vec.get()).not.toEqual(bar);
      });
      it("set", function () {
        vec.set(bar);
        expect(vec.get()).toEqual(bar);
        expect(vec.get()).not.toEqual(foo);
      });
    })
  });
})
