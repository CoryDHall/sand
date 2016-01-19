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
      let mDown = false, oldOffset = 0;
      this._hs.addEventListener('mousemove', e => {
        if (!mDown) return;
        let cHue = this.offset = (e.offsetX / this._width * 360);
        // let cHue = (e.offsetX / this._width * 360);
        // this.offset = oldOffset + cHue;
        this.updateHueField();
        this.updateValueField(cHue, 5);
      });
      this._hs.addEventListener('mouseup', e => {
        if (oldOffset == this.offset) {
          this.offset += (e.offsetX / this._width * 360);
        }
        this.pickHue(e);
        mDown = false;
      });
      this._hs.addEventListener('mousedown', e => {
        mDown = true;
        oldOffset = this.offset;
      });
    }

    updateHueField() {
      var currColor;
      this.offset = this.offset || 1;
      let unit = this._width / 360;
      for (var h = 0; h < 360; h++) {
        currColor = new su.Color(h + this.offset, this.currSat, this.currLit);
        this._hsctx.fillStyle = currColor.toString();
        this._hsctx.fillRect(unit * h, 0, unit + 1, 50);
      }
    }

    triggerEvent() {
      this._container.dispatchEvent(colorChangeEvt);
    }

    pickHue(e) {
      this.currHue = this.offset;
      // this.currHue = ((e.offsetX / this._width * 360) + this.offset) % 360;
      // this.offset = this.currHue;
      this._color.hue(this.currHue);
      this.triggerEvent();
      this.updateValueField(this.currHue);
      this.updateHueField();
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

    updateValueField(hue=null, res=100) {
      let unitX = this._width / res;
      let unitY = this._vfctx.canvas.height / res;
      let cHue = hue === null ? this.currHue : hue;
      var currColor = new su.Color(cHue, 0, 0);
      for (var s = 0; s <= 100; s+=100 / res) {
        for (var l = 0; l <= 100; l+=100 / res) {
          currColor.saturation(s).lightness((s + l) / 2);
          this._vfctx.fillStyle = currColor.toString();
          this._vfctx.fillRect(unitX * s / (100 / res), unitY * l / (100 / res), unitX + 1, unitY + 1);
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
