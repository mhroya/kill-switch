/* js/rooms/act3.js — Akt 3 — Phantom-un maşını.
   MÜVƏQQƏTİ: Mərhələ 1-də mühərriki yoxlamaq üçün test otağıdır. Əsl otaq Mərhələ 4-də yazılacaq. */
(function (Game) {
  'use strict';

  Game.room.testRoom({ id: 'machine', name: Game.T.rooms.machine, color: '#1d1226', fact: Game.FACTS.lovelace });
})(window.Game = window.Game || {});
