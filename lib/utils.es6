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

  u.addDragEvents = function (target, handlers) {
    function touchToClick(evtHandler) {
      if (!evtHandler) return;
      return (e => {
        let eCopy = {};
        eCopy.offsetX = e.offsetX === undefined ? e.targetTouches.item(0).clientX : e.offsetX;
        eCopy.offsetY = e.offsetY === undefined ? e.targetTouches.item(0).clientY : e.offsetY;
        eCopy.preventDefault = e.preventDefault.bind(e);
        return evtHandler(eCopy);
      });
    }

    let startHandler = touchToClick(handlers['start']);
    let moveHandler = touchToClick(handlers['move']);
    let endHandler = touchToClick(handlers['end']);

    if (startHandler) {
      target.addEventListener('mousedown', startHandler);
      target.addEventListener('touchstart', startHandler);
    }
    if (moveHandler) {
      target.addEventListener('mousemove', moveHandler);
      target.addEventListener('touchmove', moveHandler);
    }
    if (endHandler) {
      target.addEventListener('mouseup', endHandler);
      target.addEventListener('touchend', endHandler);
    }
  }

  const _pos = new WeakMap();

  u.Vector = class {
    constructor(x=0,y=0) {
      _pos.set(this, new Float64Array([x, y]));
    }

    get x() {
      return _pos.get(this)[0]
    }

    set x(val) {
      _pos.get(this)[0] = val;
    }

    get y() {
      return _pos.get(this)[1]
    }

    set y(val) {
      _pos.get(this)[1] = val;
    }

    set(newPos) {
      [this.x, this.y] = Array.from(newPos);
      return this;
    }

    scale(multiplier) {
      this.set(this.toArray().map((val) => { return val * multiplier }));
      return this;
    }

    add(...vecs) {
      let [x, y] = this.toArray();
      vecs.forEach((vec) => {
        x += vec.x;
        y += vec.y;
      });
      this.set([x, y]);
      return this;
    }

    get magnitude() {
      return this.distanceTo([0, 0]);
    }

    get angle() {
      return Math.atan2(...this.toArray().reverse());
    }

    dot(vector) {
      return this.x * vector.x + this.y * vector.y;
    }

    rect(vector) {
      let [x1, y1, x2, y2] = [...this.toArray(), ...vector.toArray()];
      return [[[x1, x2], [x1, y2]],[[y1, x2], [y1, y2]]];
    }

    get() {
      return _pos.get(this);
    }

    toArray() {
      return [..._pos.get(this)];
    }

    dup() {
      return new u.Vector(..._pos.get(this));
    }

    distanceTo(coordArr) {
      let [x1, y1] = this.toArray(), [x2, y2] = Array.from(coordArr);
      return Math.sqrt(_power(x1 - x2, 2) + _power(y1 - y2, 2));
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

    complement() {
      let newColor = this.dup();
      newColor
        .rotate(150)
        .lightness(100 - this._l);
      return newColor;
    }

    mix(...colors) {
      let cRed = this._red(), cGrn = this._green(), cBlu = this._blue(), cSat = this._s, cLit = this._l, cAlph = this._a;

      colors.forEach(color => {
        cRed += color._red();
        cGrn += color._green();
        cBlu += color._blue();
      });


      [cRed, cGrn, cBlu] = [cRed, cGrn, cBlu].map(cVal => { return cVal / (colors.length + 1) });

      let [max, min] = [Math.max(...[cRed, cGrn, cBlu]), Math.min(...[cRed, cGrn, cBlu])];

      let delta = max - min;

      var cHue;
      switch (max) {
        case cRed:
          cHue = ((cGrn - cBlu) / delta) % 6
          break;
        case cGrn:
          cHue = (cBlu - cRed) / delta + 2
          break;
        case cBlu:
          cHue = (cRed - cGrn) / delta + 4
          break;
        default:
          cHue = 0;
      }

      cHue *= 60;
      if (cHue < 0) cHue += 360;


      let cValues = [cSat, cLit, cAlph];
      cValues = cValues.map(cVal => { return cVal / (colors.length + 1) });
      return new u.Color(cHue, ...cValues);
    }

    toRGBA() {
      return `rgba(${this.red()}, ${this.green()}, ${this.blue()}, ${this._a})`;
    }

    red() {
      return ~~(this._red() * this.chroma() * 255);
    }

    _red() {
      var redAmount;
      if (this._h <= 60 || this._h >= 300) {
        redAmount = 1;
      } else if (this._h < 120) {
        redAmount =  1 - (this._h - 60) / 60;
      } else if (this._h > 240) {
        redAmount =  (this._h - 240) / 60;
      } else {
        redAmount = 0;
      }
      return redAmount;
    }

    green() {
      return this.dup().rotate(-120).red();
    }

    blue() {
      return this.dup().rotate(120).red();
    }

    _green() {
      return this.dup().rotate(-120)._red();
    }

    _blue() {
      return this.dup().rotate(120)._red();
    }

    chroma() {
      return (this._l >= 50 ? 1 : this._l / 50) * (this._s / 50);
    }

    toString() {
      return `hsla(${this._h}, ${this._s}%, ${this._l}%, ${this._a})`;
    }

    dup() {
      return new u.Color(this._h, this._s, this._l, this._a);
    }
  }
})();
