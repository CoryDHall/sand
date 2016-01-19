(function () {
  let Sand = window.Sand = window.Sand || {};
  let u = Sand.Utils = {};
  let _power = Math.pow;

  u.doUntil = function (expectedValue, execute, callback, _status) {
    var result = execute(), status = _status || { 'end': false };
    if (result === expectedValue) {
      status['end'] = true;
      callback && callback();
    } else if (!status['end']) {
      requestAnimationFrame(u.doUntil.bind(null, expectedValue, execute, callback, status));
    }
    return status;
  }

  u.Vector = class {
    constructor(x=0,y=0) {
      this.pos = new Float64Array([x, y]);
    }

    x(val=null) {
      if (val) {
        this.pos[0] = val;
        return this;
      }

      return this.pos[0];
    }

    y(val=null) {
      if (val) {
        this.pos[1] = val;
        return this;
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

    dup() {
      return new u.Vector(...this.pos);
    }

    distanceTo(coordArr) {
      return Math.sqrt(_power(this.pos[0] - coordArr[0], 2) + _power(this.pos[1] - coordArr[1], 2));
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
      if (val!==null) {
        this._h = val % 360;
        this._h += 360 * (this._h < 0);
        return this;
      }
      return this._h;
    }

    saturation(val=null) {
      if (val!==null) {
        if(val < 0 || val > 100) throw new RangeError('saturation must be between 0 and 100');
        this._s = val;
        return this;
      }
      return this._s;
    }

    lightness(val=null) {
      if (val!==null) {
        if(val < 0 || val > 100) throw new RangeError('lightness must be between 0 and 100');
        this._l = val;
        return this;
      }
      return this._l;
    }

    alpha(val=null) {
      if (val!==null) {
        if(val < 0 || val > 1) throw new RangeError('alpha must be between 0 and 1');
        this._a = val;
        return this;
      }
      return this._a;
    }

    rotate(amount) {
      this.hue(this.hue() + amount);
      return this;
    }

    invert() {
      let newColor = this.dup();
      newColor
        .rotate(180)
        .lightness(100 - this._l);
      return newColor;
    }

    toString() {
      return `hsla(${this._h}, ${this._s}%, ${this._l}%, ${this._a})`;
    }

    dup() {
      return new u.Color(this._h, this._s, this._l, this._a);
    }
  }
})();
