(function () {
  let Sand = window.Sand = window.Sand || {};
  let u = Sand.Utils = {};

  u.Vector = class {
    constructor(x=0,y=0) {
      this.pos = new Float64Array([x, y]);
    }

    x(val=null) {
      if (val) {
        this.pos[0] = val;
      }

      return this.pos[0];
    }

    y(val=null) {
      if (val) {
        this.pos[1] = val;
      }

      return this.pos[1];
    }

    set(newPos) {
      this.pos.set(newPos);
      return this;
    }

    get() {
      return this.pos;
    }
  }

  u.Color = class {
    constructor(h, s, l, a=1) {
      if(s < 0 || s > 100) throw new RangeError('saturation must be between 0 and 100');
      if(l < 0 || l > 100) throw new RangeError('lightness must be between 0 and 100');
      if(a < 0 || a > 1) throw new RangeError('alpha must be between 0 and 1');

      this.h = h % 360;
      this.s = s;
      this.l = l;
      this.a = a;
    }
  }
})();
