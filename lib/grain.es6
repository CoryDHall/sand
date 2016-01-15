(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils;

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
      ctx.fillStyle = `${this.color}`;
      ctx.fillRect(...this.position.toArray(), this.size, this.size);
    }
  }
})();
