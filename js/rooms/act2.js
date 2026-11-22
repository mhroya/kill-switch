/* js/rooms/act2.js — Akt 2 — Server otağı.
   MÜVƏQQƏTİ: Mərhələ 1-də mühərriki yoxlamaq üçün test otağıdır. Əsl otaq Mərhələ 3-də yazılacaq. */
(function (Game) {
  'use strict';

  Game.room.testRoom({ id: 'server', name: Game.T.rooms.server, color: '#101a2a', fact: Game.FACTS.morse });
})(window.Game = window.Game || {});
