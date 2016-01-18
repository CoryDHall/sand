(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils;

  let sv = Sand.View = class {
    constructor(container) {
      this._container = container;
      this._width = this._container.clientWidth;
      this._height = this._container.clientHeight;
      this.setUp();
      this._clearColor = new su.Color(0, 50, 0, 0.0);
      this._grainColor = new su.Color(0, 100, 50);
    }

    setUp() {
      this.cvs = document.createElement('canvas');
      this.cvs.setAttribute('width', this._width);
      this.cvs.setAttribute('height', this._height);
      this._container.appendChild(this.cvs);
      this.ctx = this.cvs.getContext('2d');

      this._colorPicker = new Sand.ColorPicker();
      this._container.appendChild(this._colorPicker.render().el());

      this._container.addEventListener('colorchange', e => {
        this._grainColor = this._colorPicker.getColor();
      })

      // this.form = document.createElement('')
    }

    start() {
      this.cvs.addEventListener('mousemove', e => {
        (new Sand.Grain({
          position: (new su.Vector(e.offsetX, e.offsetY)),
          size: (Math.random() * 25),
          weight: 1,
          color: this._grainColor
        })).render(this.ctx);
      });
      requestAnimationFrame(this.draw.bind(this));
    }

    draw() {
      let ctx = this.ctx, cvs = ctx.canvas;
      this.clear();
      this._clearColor.rotate(11);

      requestAnimationFrame(this.draw.bind(this));
    }

    clear(opacity=0.01) {
      let ctx = this.ctx, cvs = ctx.canvas;
      ctx.fillStyle = `${this._clearColor}`;
      ctx.fillRect(0,0,cvs.width, cvs.height);
    }
  }
})();
