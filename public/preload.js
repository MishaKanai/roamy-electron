const _require = require;
process.once('loaded', () => {
  window.require = _require
});