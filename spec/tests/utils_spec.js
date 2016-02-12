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
    describe("utilizes true private data", function () {
      it("does not respond to vector#pos", function () {
        var vec = new Utils.Vector(20, 20);
        expect(vec.pos).toBeUndefined();
      });
    });
    describe("exposes getters and setters for its data via", function () {
      var vec, foo, bar;
      beforeEach(function () {
        vec = new Utils.Vector(5, 4);
        foo = new Float64Array([5, 4]);
        bar = new Float64Array([8, 7]);
      });
      it("x", function () {
        expect(vec.x).toEqual(5);
        vec.x = 8;
        expect(vec.x).toEqual(8);
        expect(vec.y).not.toEqual(8);
      });
      it("y", function () {
        expect(vec.y).toEqual(4);
        vec.y = 7;
        expect(vec.y).toEqual(7);
        expect(vec.y).not.toEqual(5);
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
      var origin, down, right, left, triangle, triangleOpposite, vec1, vec2, vec3;
      beforeEach(function () {
        origin = new Utils.Vector(0, 0);
        down = [0, 3];
        right = [4, 0];
        left = [-4, 0];
        triangle = [4, 3];
        triangleOpposite = [-3, -4];
        vec1 = new Utils.Vector(1, 2);
        vec2 = new Utils.Vector(3, -4);
        vec3 = new Utils.Vector(-3, 4);
      });
      describe("dup()", function () {
        it("creates a copy of the instance", function () {
          var originCopy = origin;
          origin.x = 10;
          expect(originCopy.x).toEqual(origin.x);
          origin = originCopy = new Utils.Vector(0, 0);
          originCopy = origin.dup();
          origin.x = 10;
          expect(originCopy.x).toEqual(0);
          expect(originCopy.x).not.toEqual(origin.x);

        });
      });
      describe("scale()", function () {
        it("applies scalar multiplication to the underlying value", function () {
          origin.scale(3);
          expect(origin.toArray()).toEqual([0, 0]);
          origin.x = 1;
          origin.scale(3);
          expect(origin.toArray()).toEqual([3, 0]);
          origin.y = -1;
          origin.scale(-3);
          expect(origin.toArray()).toEqual([-9, 3]);
        });
      });
      describe("add()", function () {
        it("adds two vectors", function () {
          vec1.add(vec2);
          expect(vec1.toArray()).toEqual([4, -2]);
          vec2.add(vec3);
          expect(vec2.toArray()).toEqual([0, 0]);
        });
        it("adds multiple vectors", function () {
          vec1.add(vec2, vec2);
          expect(vec1.toArray()).toEqual([7, -6]);
        });
      });
      describe("dot()", function () {
        it("returns the dot product of two vector objects", function () {
          expect(vec1.dot(vec2)).toEqual(-5);
          expect(vec2.dot(vec3)).toEqual(-25);
        })
      });
      describe("rect()", function () {
        it("returns the cartesian product of two vector objects", function () {
          var res1 = vec1.rect(vec1), res2 = vec1.rect(vec2);
          expect(res1).toEqual([[[1, 1], [1, 2]], [[2, 1], [2, 2]]]);
          expect(res2).toEqual([[[1, 3], [1, -4]], [[2, 3], [2, -4]]]);
        })
      });
      describe("magnitude", function () {
        it("returns the vector scalar length", function () {
          expect(origin.magnitude).toEqual(0);
          expect(vec2.magnitude).toEqual(5);
          expect(vec2.add(vec2).magnitude).toEqual(10);
        });
      });
      describe("angle", function () {
        it("returns the vector angle", function () {
          expect(origin.angle).toEqual(0);
          expect(new Utils.Vector(1, 0).angle).toEqual(0);
          expect(new Utils.Vector(1, 1).angle).toEqual(Math.PI / 4);
          expect(new Utils.Vector(0, 1).angle).toEqual(Math.PI / 2);
          expect(new Utils.Vector(-1, 1).angle).toEqual(3 * Math.PI / 4);
          expect(new Utils.Vector(-1, -1).angle).toEqual(3 * Math.PI / -4);
          expect(new Utils.Vector(1, -1).angle).toEqual(Math.PI / -4);
        })
      });
      describe("rotate(rad)", function () {
        it("rotates the vector by angle *rad*", function () {
          var newVec = new Utils.Vector(1, 0);
          expect(origin.rotate(Math.PI).toArray()).toEqual([-0, 0]);
          newVec.rotate(Math.PI / 4);
          expect(newVec.magnitude).toEqual(1);
          expect(newVec.angle).toBeCloseTo(Math.PI / 4, 6);
          newVec.rotate(Math.PI / 2);
          expect(newVec.magnitude).toEqual(1);
          expect(newVec.angle).toBeCloseTo(3 * Math.PI / 4, 6);
          newVec.rotate(3 * Math.PI / 4);
          expect(newVec.angle).toBeCloseTo(-Math.PI / 2, 6);
        })
      });
      describe("distanceTo(coordArr)", function () {
        it("finds the magnitude of the transformation to coordArr", function () {
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
      var red, blue, green, yellow, cyan, magenta;
      beforeEach(function () {
        red = new Utils.Color(0, 50, 50, 0.5);
        blue = new Utils.Color(240, 50, 50, 0.5);
        green = new Utils.Color(120, 50, 50);
        yellow = new Utils.Color(60, 50, 50, 0.5);
        cyan = new Utils.Color(180, 50, 50, 0.5);
        magenta = new Utils.Color(300, 50, 50);
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
      describe("toRGBA()", function () {
        it("returns a string in rgba format", function () {
          expect(red.toRGBA()).toBe("rgba(255, 0, 0, 0.5)");
          expect(blue.toRGBA()).toBe("rgba(0, 0, 255, 0.5)");
          expect(green.toRGBA()).toBe("rgba(0, 255, 0, 1)");
          expect(yellow.toRGBA()).toBe("rgba(255, 255, 0, 0.5)");
          expect(yellow.rotate(30).toRGBA()).toBe("rgba(127, 255, 0, 0.5)");
          expect(cyan.toRGBA()).toBe("rgba(0, 255, 255, 0.5)");
          expect(cyan.rotate(-30).toRGBA()).toBe("rgba(0, 255, 127, 0.5)");
          expect(magenta.toRGBA()).toBe("rgba(255, 0, 255, 1)");
          expect(magenta.rotate(45).toRGBA()).toBe("rgba(255, 0, 63, 1)");
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
        it("returns the inverted color", function () {
          var black = new Utils.Color(0, 0, 0, 1);
          var white = new Utils.Color(180, 100, 100, 1);
          expect("" + red.invert()).toBe("hsla(180, 50%, 50%, 0.5)");
          expect("" + blue.invert()).toBe("hsla(60, 50%, 50%, 0.5)");
          expect("" + green.invert()).toBe("hsla(300, 50%, 50%, 1)");
          expect("" + red.invert()).toBe("" + cyan);
          expect("" + blue.invert()).toBe("" + yellow);
          expect("" + green.invert()).toBe("" + magenta);
          expect("" + black.invert()).toBe("hsla(180, 0%, 100%, 1)");
          expect("" + white.invert()).toBe("hsla(0, 100%, 0%, 1)");
        });
      });

      describe("complement()", function () {
        it("returns the complementary color", function () {
          var black = new Utils.Color(0, 0, 0, 1);
          var white = new Utils.Color(180, 100, 100, 1);
          expect("" + red.complement()).toBe("hsla(150, 50%, 50%, 0.5)");
          expect("" + blue.complement()).toBe("hsla(30, 50%, 50%, 0.5)");
          expect("" + green.complement()).toBe("hsla(270, 50%, 50%, 1)");
          expect("" + black.complement()).toBe("hsla(150, 0%, 100%, 1)");
          expect("" + white.complement()).toBe("hsla(330, 100%, 0%, 1)");
        });
      });

      describe("red()", function () {
        it("return the red value of the color", function () {
          expect(red.red()).toEqual(255);
          expect(yellow.red()).toEqual(255);
          expect(magenta.rotate(-30).red()).toEqual(127);
          expect(yellow.rotate(30).red()).toEqual(127);
          expect(blue.red()).toEqual(0);
          expect(green.red()).toEqual(0);
        });
      });

      describe("green()", function () {
        it("return the green value of the color", function () {
          expect(green.green()).toEqual(255);
          expect(yellow.green()).toEqual(255);
          expect(yellow.rotate(-30).green()).toEqual(127);
          expect(cyan.rotate(30).green()).toEqual(127);
          expect(blue.green()).toEqual(0);
          expect(red.green()).toEqual(0);
        });
      });

      describe("blue()", function () {
        it("return the blue value of the color", function () {
          expect(blue.blue()).toEqual(255);
          expect(yellow.blue()).toEqual(0);
          expect(magenta.rotate(30).blue()).toEqual(127);
          expect(cyan.blue()).toEqual(255);
          expect(cyan.rotate(-30).blue()).toEqual(127);
          expect(red.blue()).toEqual(0);
        });
      });
      describe("mix()", function () {
        it("accepts multiple colors");
        it("returns an averaged color", function () {
          expect(red.mix(red).hue()).toEqual(0);
          expect(blue.mix(blue).hue()).toEqual(240);
          expect(green.mix(green).hue()).toEqual(120);

          expect(red.mix(blue).hue()).toEqual(magenta.hue());
          expect(blue.mix(red).hue()).toEqual(magenta.hue());

          expect(red.mix(green).hue()).toEqual(yellow.hue());
          expect(green.mix(red).hue()).toEqual(yellow.hue());

          expect(green.mix(blue).hue()).toEqual(cyan.hue());
          expect(blue.mix(green).hue()).toEqual(cyan.hue());
        });
      });
    });

  })
})
