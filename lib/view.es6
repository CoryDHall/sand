(function () {
  let Sand = window.Sand = window.Sand || {};

  let sv = Sand.View = class {
    constructor(ctx) {
      this.ctx = ctx;
    }

    start() {
      requestAnimationFrame(this.draw.bind(this));
    }

    draw() {
      this.clear();

      requestAnimationFrame(this.draw.bind(this));
    }

    clear(opacity=0.01) {
      let ctx = this.ctx, cvs = ctx.canvas;

      ctx.fillStyle = `hsla(0,0%,0%,${opacity})`;
      ctx.fillRect(0,0,cvs.width, cvs.height);
    }
  }

})();
