var window = window || {};
(function () {
  let Sand = window.Sand = window.Sand || {};
  let u = Sand.Utils = {};

  u.Vector = class {
    constructor(x=0,y=0) {
      this.pos = new Float64Array([x, y]);
    }

    x(val=null) {
      if (val) {
        this.pos[0] = val;
      }

      return this.pos[0];
    }

    y(val=null) {
      if (val) {
        this.pos[1] = val;
      }

      return this.pos[1];
    }

    set(newPos) {
      this.pos.set(newPos);
      return this;
    }

    get() {
      return this.pos;
    }
  }


  module.exports = Sand.Utils;
})();
