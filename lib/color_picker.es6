(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils;

  Sand.Events = Sand.Events || {};

  let colorChangeEvt = Sand.Events.ColorChange = new Event('colorchange', {
    'bubbles': true,
  });

  let scp = Sand.ColorPicker = class {
    constructor(width=500, height=500) {
      this._width = width;
      this._height = height / 6;
      this._container = document.createElement('div');
      this._container.classList.add('color-picker');
      this.currHue = 0;
      this.currSat = 100;
      this.currLit = 50;
      this._updateColor();
      this.createHueSlider();
      this.createValueField();
    }

    _updateColor() {
      this._color = new su.Color(this.currHue, this.currSat, this.currLit);
      this.triggerEvent();
    }

    render() {
      return this;
    }

    el() {
      return this._container;
    }

    createHueSlider() {
      this._hs = document.createElement('canvas');
      this._hs.setAttribute('width', this._width);
      this._hs.setAttribute('height', this._height);
      this._container.appendChild(this._hs);
      this._hsctx = this._hs.getContext('2d');
      this.updateHueField();
      this._hs.addEventListener('click', this.pickHue.bind(this));
    }

    updateHueField() {
      var currColor;
      let unit = this._width / 360;
      for (var h = 0; h < 360; h++) {
        currColor = new su.Color(h, this.currSat, this.currLit);
        this._hsctx.fillStyle = currColor.toString();
        this._hsctx.fillRect(unit * h, 0, unit + 1, 50);
      }
    }

    triggerEvent() {
      this._container.dispatchEvent(colorChangeEvt);
    }

    pickHue(e) {
      this.currHue = e.offsetX / this._width * 360;
      this._color.hue(this.currHue);
      this.triggerEvent();
      this.updateValueField();
    }

    createValueField() {
      this._vf = document.createElement('canvas');
      this._vf.setAttribute('width', this._width);
      this._vf.setAttribute('height', this._height * 5);
      this._container.appendChild(this._vf);
      this._vfctx = this._vf.getContext('2d');
      this.updateValueField();
      this._vf.addEventListener('click', this.pickValue.bind(this));
    }

    updateValueField() {
      var currColor;
      let unitX = this._width / 100;
      let unitY = this._vfctx.canvas.height / 100;
      for (var s = 0; s < 100; s++) {
        for (var l = 0; l < 100; l++) {
          currColor = new su.Color(this.currHue, s, (s + l) / 2);
          this._vfctx.fillStyle = currColor.toString();
          this._vfctx.fillRect(unitX * s, unitY * l, unitX + 1, unitY + 1);
        }
      }
    }

    pickValue(e) {
      this.currSat = e.offsetX / this._vf.clientWidth * 100;
      this.currLit = (e.offsetY / this._vf.clientHeight + e.offsetX / this._width) * 50;
      this._updateColor();
      this.updateHueField();
    }

    getColor() {
      return this._color;
    }
  }

})();
