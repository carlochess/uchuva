Terminal._opts = {
  "termName": "xterm-256color",
  "debug": false
};
(function applyConfig() {
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  for (var key in Terminal._opts) {
    if (!hasOwnProperty.call(Terminal._opts, key)) continue;
    if (typeof Terminal._opts[key] === 'object' && Terminal._opts[key]) {
      if (!Terminal[key]) {
        Terminal[key] = Terminal._opts[key];
        continue;
      }
      for (var k in Terminal._opts[key]) {
        if (hasOwnProperty.call(Terminal._opts[key], k)) {
          Terminal[key][k] = Terminal._opts[key][k];
        }
      }
    } else {
      Terminal[key] = Terminal._opts[key];
    }
  }

  delete Terminal._opts;
})();
