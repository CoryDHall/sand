(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils;

  const bgRefresh = 0.2;

  let sv = Sand.View = class {
    constructor(container) {
      this._container = container;
      this._width = this._container.clientWidth;
      this._height = this._container.clientHeight;
      this.setUp();
      this._clearColor = new su.Color(0, 100, 50, 0.1);
      this._grainColor = new su.Color(0, 100, 100, 1);
      this._center = new su.Vector(this._width / 2, 3 * this._height / 8);
      this.grain = new Sand.Grain({
        position: (new su.Vector(...this._center.toArray())),
        size: (2),
        weight: 1,
        color: this._grainColor
      });
      this._positiondelta = 100;
    }

    setUp() {
      this.cvs = document.createElement('canvas');
      this.cvs.setAttribute('width', this._width);
      this.cvs.setAttribute('height', 3 * this._height / 4);
      this._container.appendChild(this.cvs);
      this.ctx = this.cvs.getContext('2d');

      this._bgColorPicker = new Sand.ColorPicker(this._width / 2.1, this._height / 4);
      this._container.appendChild(this._bgColorPicker.render().el());

      this._fgColorPicker = new Sand.ColorPicker(this._width / 2.1, this._height / 4);
      this._container.appendChild(this._fgColorPicker.render().el());

      let bgState = {};
      this._bgColorPicker.el().addEventListener('colorchange', e => {
        bgState['end'] = true;
        let newColor = e.color;
        this._clearColor.hue(newColor.hue());
        bgState = su.doUntil(true, _ => {
          this._clearColor.saturation((this._clearColor.saturation() + newColor.saturation() * 2) / 3);
          this._clearColor.lightness((this._clearColor.lightness() + newColor.lightness() * 2) / 3);
          this._clearColor.alpha(bgRefresh);
          return (Math.abs(this._clearColor.saturation() - newColor.saturation()) < 1) && (Math.abs(this._clearColor.lightness() - newColor.lightness()) < 1) ;
        });
      });
      let fgState = {};
      this._fgColorPicker.el().addEventListener('colorchange', e => {
        fgState['end'] = true;
        let newColor = e.color;
        let newHue = newColor.hue();
        this._grainColor.lightness(newColor.lightness());
        this._grainColor.saturation(newColor.saturation());
        this.grain.color = this._grainColor;
        fgState = su.doUntil(true, _ => {
          this._grainColor.rotate(Math.abs(this._grainColor.hue() - newHue) / 2 * ((this._grainColor.hue() - newHue < 0) - (this._grainColor.hue() - newHue > 0)));
          return Math.abs(this._grainColor.hue() - newColor.hue()) <= 1;
        });
      });
    }

    start() {
      let mouseDown = false, trueCenter = this._center.dup(), trueWidth = this._width, minWidth = 10, widthState = {}, posState = {}, counterAdvance = 0.05;
      let downEvent = (e => {
        e.preventDefault();
        mouseDown = true;
        widthState['end'] = true;
        posState['end'] = true;
        this._clearColor.alpha(bgRefresh / 5);
        this._clearColor = this._clearColor.invert();
        this.grain.color = this._grainColor = this._grainColor.invert();
        widthState = su.doUntil(minWidth, _ => {
          this._width = Math.floor((this._width * 99 + minWidth) / 100);
          return this._width;
        });
        let x = e.offsetX || e.targetTouches.item(0).clientX;
        posState = su.doUntil(x, () => {
          this._center.x = Math.floor((this._center.x * 10 + x) / 11);
          return this._center.x;
        });
      });
      this.cvs.addEventListener('mousedown', downEvent);
      this.cvs.addEventListener('touchstart', downEvent);
      let upEvent = (e => {
        e.preventDefault();
        mouseDown = false;
        widthState['end'] = true;
        posState['end'] = true;
        this._clearColor.alpha(bgRefresh);
        this._clearColor = this._clearColor.invert();
        this.grain.color = this._grainColor = this._grainColor.invert();
        widthState = su.doUntil(Math.round(trueWidth), _ => {
          this._width = Math.ceil((this._width * 20 + trueWidth) / 21);
          return this._width;
        });
        posState = su.doUntil(trueCenter.x, () => {
          this._center.x = Math.floor((this._center.x * 20 + trueCenter.x) / 21);
          return this._center.x;
        });
      });
      this.cvs.addEventListener('mouseup', upEvent);
      this.cvs.addEventListener('touchend', upEvent);

      let moveEvent = (e => {
        e.preventDefault();
        if (!mouseDown) return;
        posState['end'] = true;
        let y = e.offsetY || e.targetTouches.item(0).clientY;
        this._positiondelta = trueCenter.distanceTo([trueCenter.x, y]) / 1;
        let x = e.offsetX || e.targetTouches.item(0).clientX;
        posState = su.doUntil(x, () => {
          this._center.x = Math.floor((this._center.x * 10 + x) / 11);
          return this._center.x;
        });
      });
      this.cvs.addEventListener('mousemove', moveEvent);
      this.cvs.addEventListener('touchmove', moveEvent);
      requestAnimationFrame(this.draw.bind(this));
      var counter = 0;
      setInterval(_ => {
        let gp = this._positiondelta, time = new Date(Date.now());
        let num = time.getSeconds(), x = this._center.x, y = this._center.y;
        counter += counterAdvance;
        counter *= (counter < 10000 * Math.PI);
        this.ctx.beginPath();
        this.ctx.moveTo(...this._center.toArray());
        for(var i = -30; i <= 30; i+= 1 + 0 * 31 / (num + 1)) {
          this.grain.position.y = (y + gp * Math.sin(i / 60 * counter));
          for (var j = -2; j <= 2; j++) {
            this.grain.size = 7 + 3 * Math.cos(i / 60 * counter) + 3 * Math.sin(this._height - gp * i * j / 600 + counter + i);
            this.grain.position.x = (x + (this._width / 2.25) * Math.cos(this._height - gp * i * j / 600 + counter + i));
            this.ctx.translate((this._width / num / 30 + minWidth) * i, 10 * j);
            this.grain.color.rotate(j * (i + 30) / 10);
            this.ctx.beginPath();
            this.grain.render(this.ctx);
            this.ctx.closePath();
            this.ctx.translate((this._width / num / 30 + minWidth) * -i, 10 * -j);
          }
        }
      }, 10);
    }

    draw() {
      let ctx = this.ctx, cvs = ctx.canvas, gp = this._positiondelta;
      this.clear();

      requestAnimationFrame(this.draw.bind(this));
    }

    clear(opacity=0.01) {
      let ctx = this.ctx, cvs = ctx.canvas;
      setTimeout(() => {
        ctx.fillStyle = `${this._clearColor}`;
        ctx.fillRect(0,0,cvs.width, cvs.height);
        var xDeg = (Date.now() / 7000) % 20 - 10;
        var yDeg = (Date.now() / 11000) % 20 - 10;
        ctx.drawImage(cvs, -xDeg/2, -yDeg/2, cvs.width + xDeg, cvs.height + yDeg);
      }, 0);
    }
  }
})();
