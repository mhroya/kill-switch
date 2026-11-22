/* js/core/trace.js — iz sayğacı (0–100%).
   Yanlış cavab, təsadüfi təxmin və saxta pəncərəyə klik sayğacı artırır. 100% → uduzma.
   Hər akt bitəndə bir az azalır. */
(function (Game) {
  'use strict';

  Game.trace = {
    add: function (n) {
      var s = Game.state;
      if (!s || s.over) return;
      s.trace = Math.min(100, s.trace + n);
      Game.events.emit('trace', s.trace);
      Game.changed();
      if (s.trace >= 100) Game.over('lose-trace');
    },
    reduce: function (n) {
      var s = Game.state;
      if (!s || s.over) return;
      s.trace = Math.max(0, s.trace - n);
      Game.events.emit('trace', s.trace);
      Game.changed();
    }
  };
})(window.Game = window.Game || {});
