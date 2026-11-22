/* js/core/events.js — Sadə hadisə sistemi (on/emit) — modullar bir-biri ilə bununla danışır.
   Skelet (Mərhələ 0). Əsas kod Mərhələ 1-də yazılacaq. ES modules yoxdur: hər fayl global Game-ə əlavə edir. */
(function (Game) {
  'use strict';
  Game.loaded.push('core/events');
})(window.Game = window.Game || { loaded: [] });
