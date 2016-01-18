(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils;

  let sv = Sand.View = class {
    constructor(container) {
      this._container = container;
      this._width = this._container.clientWidth;
      this._height = this._container.clientHeight;
      this.setUp();
      this._clearColor = new su.Color(0, 50, 50, 0.1);
    }

    setUp() {
      this.cvs = document.createElement('canvas');
      this.cvs.setAttribute('width', this._width);
      this.cvs.setAttribute('height', this._height);
      this._container.appendChild(this.cvs);
      this.ctx = this.cvs.getContext('2d');
    }

    start() {
      requestAnimationFrame(this.draw.bind(this));
    }

    draw() {
      let ctx = this.ctx, cvs = ctx.canvas;
      this.clear();
      this._clearColor.rotate(11);

      (new Sand.Grain({
        position: (new su.Vector(Math.random() * cvs.width, Math.random() * cvs.height)),
        size: (Math.random() * 25),
        weight: 1
      })).render(ctx);

      requestAnimationFrame(this.draw.bind(this));
    }

    clear(opacity=0.01) {
      let ctx = this.ctx, cvs = ctx.canvas;
      ctx.fillStyle = `${this._clearColor}`;
      ctx.fillRect(0,0,cvs.width, cvs.height);
    }
  }
})();
