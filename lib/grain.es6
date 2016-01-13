(function () {
  let Sand = window.Sand = window.Sand || {};

  let su = Sand.Utils;

  Sand.Grain = class {
    constructor({
      'position': position,
    }) {
      this.position = position || new su.Vector();
    }
  }
})();
