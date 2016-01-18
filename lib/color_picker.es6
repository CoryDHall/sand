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
      this._height = height;
      this._container = document.createElement('div');
      this.currHue = 0;
      this.currSat = 100;
      this.currLit = 50;
      this._updateColor();
      this.createHueSlider();
      this.createValueField();
    }

    _updateColor() {
      this._color = new su.Color(this.currHue, this.currSat, this.currLit);
      this._container.dispatchEvent(colorChangeEvt);
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
      this._hs.setAttribute('height', 50);
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

    pickHue(e) {
      this.currHue = e.offsetX / this._width * 360;
      this._updateColor();
      this.updateValueField();
    }

    createValueField() {
      this._vf = document.createElement('canvas');
      this._vf.setAttribute('width', this._width);
      this._vf.setAttribute('height', this._width);
      this._container.appendChild(this._vf);
      this._vfctx = this._vf.getContext('2d');
      this.updateValueField();
      this._vf.addEventListener('click', this.pickValue.bind(this));
    }

    updateValueField() {
      var currColor;
      let unit = this._width / 100;
      for (var s = 0; s < 100; s++) {
        for (var l = 0; l < 100; l++) {
          currColor = new su.Color(this.currHue, s, l);
          this._vfctx.fillStyle = currColor.toString();
          this._vfctx.fillRect(unit * s, unit * l, unit, unit);
        }
      }
    }

    pickValue(e) {
      this.currSat = e.offsetX / this._width * 100;
      this.currLit = e.offsetY / this._width * 100;
      this._updateColor();
      this.updateHueField();
    }

    getColor() {
      return this._color;
    }
  }

})();
