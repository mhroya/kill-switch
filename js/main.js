/* js/main.js — Başlanğıc nöqtəsi: bütün modullar yükləndikdən sonra oyunu işə salır.
   Skelet (Mərhələ 0). Əsas kod Mərhələ 1-də yazılacaq. ES modules yoxdur: hər fayl global Game-ə əlavə edir. */
(function (Game) {
  'use strict';
  Game.loaded.push('main');
})(window.Game = window.Game || { loaded: [] });

// Müvəqqəti: skeletin yükləndiyini göstərir (Mərhələ 1-də əvəz olunacaq).
window.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('status');
  if (el) el.textContent = 'Yüklənən modullar: ' + window.Game.loaded.length;
});
