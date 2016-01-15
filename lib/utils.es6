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

    toArray() {
      return [this.pos[0], this.pos[1]];
    }
  }

  u.Color = class {
    constructor(h, s, l, a=1) {
      if(s < 0 || s > 100) throw new RangeError('saturation must be between 0 and 100');
      if(l < 0 || l > 100) throw new RangeError('lightness must be between 0 and 100');
      if(a < 0 || a > 1) throw new RangeError('alpha must be between 0 and 1');

      this._h = h % 360;
      this._s = s;
      this._l = l;
      this._a = a;
    }

    hue(val=null) {
      if (val) {
        this._h = val % 360;
        this._h += 360 * (this._h < 0);
        return this;
      }
      return this._h;
    }

    rotate(amount) {
      this.hue(this.hue() + amount);
      return this;
    }

    toString() {
      return `hsla(${this._h}, ${this._s}%, ${this._l}%, ${this._a})`;
    }
  }
})();
