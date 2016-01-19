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
      this._positiondelta = 5;
    }

    setUp() {
      this.cvs = document.createElement('canvas');
      this.cvs.setAttribute('width', this._width);
      this.cvs.setAttribute('height', 3 * this._height / 4);
      this._container.appendChild(this.cvs);
      this.ctx = this.cvs.getContext('2d');

      this._colorPicker = new Sand.ColorPicker(this._width, this._height / 4);
      this._container.appendChild(this._colorPicker.render().el());

      this._container.addEventListener('colorchange', e => {
        this._clearColor = new su.Color(0, 100, 0, 0.8);
        this.clear();
        this._clearColor = this._colorPicker.getColor();
        this._clearColor.alpha(0.01);
      });
    }

    start() {
      this.cvs.addEventListener('click', e => {
        this._positiondelta = this._center.distanceTo([e.offsetX, e.offsetY]) / 1;
        requestAnimationFrame(_ => {
        });
      });
      requestAnimationFrame(this.draw.bind(this));
      var counter = 0;
      setInterval(_ => {
        let gp = this._positiondelta;
        this._positiondelta += (gp < this._height / 5) * (counter / 20000);
        this._positiondelta -= (gp > this._height / 4) * (counter / 20000);
        counter += 2;
        counter *= (counter < 10000);
        for(var i = -30; i < 30; i++) {
          this.grain.position.y(this._center.y() + i * 5 + gp * Math.sin(i / 30 * counter / (gp)));
          for (var j = -2; j < 3; j++) {
            this.grain.size = (10 + 5 * Math.sin(i + counter / 25) - 2 * j * j);
            this.grain.position.x(this._center.x() - i * 2 + j * this._width / 10 + gp * Math.cos(i + j * counter / (gp)));
            this.grain.render(this.ctx);
          }
        }
      }, 2);
    }

    draw() {
      let ctx = this.ctx, cvs = ctx.canvas, gp = this._positiondelta;
      this.clear();

      requestAnimationFrame(this.draw.bind(this));
    }

    clear(opacity=0.01) {
      let ctx = this.ctx, cvs = ctx.canvas;
      ctx.fillStyle = `${this._clearColor}`;
      ctx.fillRect(0,0,cvs.width, cvs.height);
    }
  }
})();
