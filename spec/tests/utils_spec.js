describe("Sand Utils", function () {
  var Utils = Sand.Utils;

  describe("Vector()", function () {
    it("accepts no arguments", function () {
      var vec = new Utils.Vector();
      expect(vec).not.toBeUndefined();
    });
    it("accepts 2 values", function () {
      var vec = new Utils.Vector(20, 20);
      expect(vec).not.toBeUndefined();
    });
    describe("exposes getters and setters for its data via", function () {
      var vec, foo, bar;
      beforeEach(function () {
        vec = new Utils.Vector(5, 4);
        foo = new Float64Array([5, 4]);
        bar = new Float64Array([8, 7]);
      })
      it("x()", function () {
        expect(vec.x()).toEqual(5);
        vec.x(8);
        expect(vec.x()).toEqual(8);
        expect(vec.y()).not.toEqual(8);
      });
      it("y()", function () {
        expect(vec.y()).toEqual(4);
        vec.y(7);
        expect(vec.y()).toEqual(7);
        expect(vec.y()).not.toEqual(5);
      });
      it("get()", function () {
        expect(vec.get()).toEqual(foo);
        expect(vec.get()).not.toEqual(bar);
      });
      it("set()", function () {
        vec.set(bar);
        expect(vec.get()).toEqual(bar);
        expect(vec.get()).not.toEqual(foo);
      });
    });
    describe("allows operations on vector values", function () {
      describe("dup()", function () {
        it("creates a copy of the instance", function () {
          var origin, originCopy;
          origin = originCopy = new Utils.Vector(0, 0);
          origin.x(10);
          expect(originCopy.x()).toEqual(origin.x());
          origin = originCopy = new Utils.Vector(0, 0);
          originCopy = origin.dup();
          origin.x(10);
          expect(originCopy.x()).toEqual(0);
          expect(originCopy.x()).not.toEqual(origin.x());

        });
      });
      describe("scale()", function () {
        it("applies scalar multiplication to the underlying value");
      });
      describe("add()", function () {
        it("adds two vectors");
      });
      describe("distanceTo(coordArr)", function () {
        it("finds the magnitude of the transformation to coordArr", function () {
          var origin = new Utils.Vector(0, 0), down = [0, 3], right = [4, 0], left = [-4, 0], triangle = [4, 3], triangleOpposite = [-3, -4];
          expect(origin.distanceTo(down)).toEqual(3);
          expect(origin.distanceTo(left)).toEqual(4);
          expect(origin.distanceTo(right)).toEqual(4);
          expect(origin.distanceTo(triangle)).toEqual(5);
          expect(origin.distanceTo(triangleOpposite)).toEqual(5);
        });
      });
    });
  });

  describe("Color()", function () {
    it("accepts hsl values", function () {
      var color = new Utils.Color(120, 100, 50);
      expect(color).not.toBeUndefined();
    });
    it("accepts hsla values", function () {
      var color = new Utils.Color(120, 100, 50, 1);
      expect(color).not.toBeUndefined();
    });
    it("enforces valid input", function () {
      function newColor(h, s, l, a) {
        return function () {
          new Utils.Color(h, s, l, a);
        }
      }
      expect(newColor(120, 100, 50, 1)).not.toThrow();
      expect(newColor(420, 100, 50, 1)).not.toThrow();
      expect(newColor(120, 120, 50, 1)).toThrow();
      expect(newColor(120, 100, 120, 1)).toThrow();
      expect(newColor(120, 100, 50, 120)).toThrow();
    });
    describe("methods:", function () {
      var red, blue, green;
      beforeEach(function () {
        red = new Utils.Color(0, 50, 50, 0.5);
        blue = new Utils.Color(240, 50, 50, 0.5);
        green = new Utils.Color(120, 50, 50);
      });
      describe("rotate()", function () {
        it("rotates hue", function () {
          red.rotate(10);
          expect(red.hue()).toEqual(10);

          blue.rotate(360);
          expect(blue.hue()).toEqual(240);

          green.rotate(-180);
          expect(green.hue()).toEqual(300);
        });
      });
      describe("saturate()", function () {
        it("increases saturation");
      });
      describe("desaturate()", function () {
        it("decreases saturation");
      });
      describe("lighten()", function () {
        it("increases lightness");
      });
      describe("darken()", function () {
        it("decreases lightness");
      });
      describe("concentrate()", function () {
        it("increases opacity");
      });
      describe("thin()", function () {
        it("decreases opacity");
      });
      describe("toString()", function () {
        it("returns a string", function () {
          expect(red.toString()).toBe("hsla(0, 50%, 50%, 0.5)");
          expect(blue.toString()).toBe("hsla(240, 50%, 50%, 0.5)");
          expect(green.toString()).toBe("hsla(120, 50%, 50%, 1)");

          expect("" + red).toBe("hsla(0, 50%, 50%, 0.5)");
          expect("" + blue).toBe("hsla(240, 50%, 50%, 0.5)");
          expect("" + green).toBe("hsla(120, 50%, 50%, 1)");
        });
      });
      describe("set()", function () {
        it("allows setting via object notation");
      });

      describe("dup()", function () {
        it("creates a copy of the instance", function () {
          var redCopy = red.dup();
          expect(red.toString()).toBe(redCopy.toString());
          redCopy.rotate(30);
          expect(red.toString()).not.toBe(redCopy.toString());
        });
      });

      describe("invert()", function () {
        it("returns the complementary color", function () {
          var black = new Utils.Color(0, 0, 0, 1);
          var white = new Utils.Color(180, 100, 100, 1);
          expect("" + red.invert()).toBe("hsla(180, 50%, 50%, 0.5)");
          expect("" + blue.invert()).toBe("hsla(60, 50%, 50%, 0.5)");
          expect("" + green.invert()).toBe("hsla(300, 50%, 50%, 1)");
          expect("" + black.invert()).toBe("hsla(180, 0%, 100%, 1)");
          expect("" + white.invert()).toBe("hsla(0, 100%, 0%, 1)");
        });
      });
      describe("mix()", function () {
        it("accepts multiple colors");
        it("returns an averaged color");
      });
    });

  })
})
