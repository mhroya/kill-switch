/* js/core/timer.js — ümumi vaxt limiti.
   Kat-səhnə, "Bilirdinmi?" kartı və izah pəncərəsi açıq olanda timer dayanır (PLAN.md bölmə 4).
   Dayandırma səbəbləri ayrı-ayrı saxlanılır: hamısı götürülənə qədər vaxt getmir. */
(function (Game) {
  'use strict';

  var interval = null;
  var reasons = {};

  function tick() {
    var s = Game.state;
    if (!s || s.over || Game.timer.paused()) return;
    s.timeLeft = Math.max(0, s.timeLeft - 1);
    s.stats.elapsed++;
    Game.events.emit('tick', s.timeLeft);
    if (s.stats.elapsed % 10 === 0) Game.save.write();
    if (s.timeLeft <= 0) Game.over('lose-time');
  }

  Game.timer = {
    start: function () {
      if (!interval) interval = setInterval(tick, 1000);
    },
    stop: function () {
      clearInterval(interval);
      interval = null;
    },
    pause: function (reason) {
      reasons[reason] = true;
      Game.events.emit('pause', true);
    },
    resume: function (reason) {
      delete reasons[reason];
      Game.events.emit('pause', Game.timer.paused());
    },
    resumeAll: function () {
      reasons = {};
      Game.events.emit('pause', false);
    },
    paused: function () {
      return Object.keys(reasons).length > 0;
    },
    // 125 → "02:05"
    fmt: function (sec) {
      sec = Math.max(0, Math.floor(sec));
      var m = Math.floor(sec / 60), r = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
    },
    // Debug üçün: vaxt əlavə et və ya azalt.
    add: function (sec) {
      var s = Game.state;
      if (!s || s.over) return;
      s.timeLeft = Math.max(0, s.timeLeft + sec);
      Game.events.emit('tick', s.timeLeft);
      if (s.timeLeft <= 0) Game.over('lose-time');
    }
  };
})(window.Game = window.Game || {});
