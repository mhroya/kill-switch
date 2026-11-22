/* js/core/trace.js — İz sayğacı (0–100%).
   Skelet (Mərhələ 0). Əsas kod Mərhələ 1-də yazılacaq. ES modules yoxdur: hər fayl global Game-ə əlavə edir. */
(function (Game) {
  'use strict';
  Game.loaded.push('core/trace');
})(window.Game = window.Game || { loaded: [] });
