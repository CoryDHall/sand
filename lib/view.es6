(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils;

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

      this._bgColorPicker.el().addEventListener('colorchange', e => {
        this._clearColor = new su.Color(0, 100, 0, 0.8);
        this.clear();
        this._clearColor = this._bgColorPicker.getColor();
        this._clearColor.alpha(0.05);
      });
      this._fgColorPicker.el().addEventListener('colorchange', e => {
        this.grain.color = this._grainColor = this._fgColorPicker.getColor();
      });
    }

    start() {
      let mouseDown = false, trueCenter = this._center.dup(), trueWidth = this._width, widthState = {}, posState = {}, counterAdvance = 0.01;
      let downEvent = (e => {
        e.preventDefault();
        mouseDown = true;
        widthState['end'] = true;
        posState['end'] = true;
        this._clearColor.alpha(0.01);
        this._clearColor = this._clearColor.invert();
        this.grain.color = this._grainColor = this._grainColor.invert();
        widthState = su.doUntil(50, _ => {
          this._width = Math.floor((this._width + 50) / 2);
          return this._width;
        });
        posState = su.doUntil(e.offsetX, _ => {
          return this._center.x(Math.floor((this._center.x() * 10 + e.offsetX) / 11)).x();
        });
      });
      this.cvs.addEventListener('mousedown', downEvent);
      this.cvs.addEventListener('touchstart', downEvent);
      let upEvent = (e => {
        e.preventDefault();
        mouseDown = false;
        widthState['end'] = true;
        posState['end'] = true;
        this._clearColor.alpha(0.05);
        this._clearColor = this._clearColor.invert();
        this.grain.color = this._grainColor = this._grainColor.invert();
        widthState = su.doUntil(Math.round(trueWidth), _ => {
          this._width = Math.ceil((this._width * 20 + trueWidth) / 21);
          return this._width;
        });
        posState = su.doUntil(trueCenter.x(), _ => {
          return this._center.x(Math.floor((this._center.x() * 20 + trueCenter.x()) / 21)).x();
        });
      });
      this.cvs.addEventListener('mouseup', upEvent);
      this.cvs.addEventListener('touchend', upEvent);

      let moveEvent = (e => {
        e.preventDefault();
        if (!mouseDown) return;
        this._positiondelta = trueCenter.distanceTo([trueCenter.x(), e.offsetY]) / 1;
      });
      this.cvs.addEventListener('mousemove', moveEvent);
      this.cvs.addEventListener('touchmove', moveEvent);
      requestAnimationFrame(this.draw.bind(this));
      var counter = 0;
      setInterval(_ => {
        let gp = this._positiondelta, time = new Date(Date.now());
        let num = time.getSeconds(), x = this._center.x(), y = this._center.y();
        // this._positiondelta += (gp < this._height / 5);
        // this._positiondelta -= (gp > this._height / 4);
        counter += counterAdvance;
        counter *= (counter < 10000 * Math.PI);
        for(var i = -30; i <= -29 + num; i+= 0.5) {
          this.grain.position.y(y + gp * Math.sin(i / 60 * counter));
          for (var j = -2; j <= 2; j++) {
            this.grain.size = i / 10 + 6 + j;
            this.grain.position.x(x + (this._width / 2.05) * Math.cos(this._height - gp * i * j / 600 + counter + i));
            this.ctx.translate(10 * j, 10 * j);
            this.grain.color.rotate(j * (i + 30) / 2);
            this.grain.render(this.ctx);
            this.ctx.translate(10 * -j, 10 * -j);
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
      setTimeout(_ => {
        ctx.drawImage(cvs, -1, -1, cvs.width + 2, cvs.height + 2);
        ctx.fillStyle = `${this._clearColor}`;
        ctx.fillRect(0,0,cvs.width, cvs.height);
      }, 0);
    }
  }
})();
