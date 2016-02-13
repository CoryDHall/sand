(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils, twoPi = Math.PI * 2;

  Sand.Grain = class {
    constructor({
      'position': position,
      'size': size,
      'weight': weight,
      'color': color,
    }) {
      this.position = position || new su.Vector();
      this.size = size;
      this.weight = weight;
      this.color = color || new su.Color(0, 100, 50);
    }
    render(ctx) {
      let sizeHalf = this.size / 2, [x, y] = this.position.toArray();
      ctx.strokeStyle = `${this.color}`;
      ctx.arc(x, y, this.size, 0, twoPi);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = `${this.color}`;
      ctx.arc(x, y, sizeHalf, 0, twoPi);
      ctx.fill();
    }

    growBy(factor) {
      this.size *= factor;
      return this;
    }
  }
})();
