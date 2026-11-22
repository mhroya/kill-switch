/* js/rooms/act1.js — Akt 1 — Hacklənmiş ofis.
   MÜVƏQQƏTİ: Mərhələ 1-də mühərriki yoxlamaq üçün test otağıdır. Əsl otaq Mərhələ 2-də yazılacaq.
   Burada əlavə olaraq inventar yoxlanılır: əşya götürmək, əşyanı obyektdə istifadə etmək, iki əşyanı birləşdirmək. */
(function (Game) {
  'use strict';

  var T = Game.T.test;

  Game.defineItem('test-lamp', { icon: '🔦', name: T.lamp, desc: T.lampDesc });
  Game.defineItem('test-paper', { icon: '📄', name: T.paper, desc: T.paperDesc });
  Game.defineItem('test-lit', { icon: '📜', name: T.lit, desc: T.litDesc });

  Game.inventory.combo('test-lamp', 'test-paper', function () {
    Game.inventory.remove('test-paper');
    Game.inventory.add('test-lit');
  });

  Game.room.testRoom({
    id: 'office', name: Game.T.rooms.office, color: '#13241c', fact: Game.FACTS.caesar,
    extra: {
      box: {
        label: T.box,
        hidden: function (s) { return !!s.flags.testBoxTaken; },
        click: function (s) {
          s.flags.testBoxTaken = true;
          Game.inventory.add('test-lamp');
          Game.inventory.add('test-paper');
          Game.room.render();
          Game.popup.info(T.box, T.boxText);
        }
      },
      dark: {
        label: T.dark,
        click: function (s) { Game.popup.info(T.dark, s.flags.testDarkLit ? T.darkLit : T.darkNeed); },
        use: function (itemId) {
          if (itemId !== 'test-lamp') return false;
          Game.state.flags.testDarkLit = true;
          Game.evidence.add({ id: 'office-test-ev2', title: T.evTitle(T.dark), text: T.darkLit });
          Game.room.render();
          Game.popup.info(T.dark, T.darkLit);
        }
      }
    },
    extraSvg: function (s) {
      return (s.flags.testBoxTaken ? '' :
        '<g data-obj="box"><rect x="160" y="440" width="120" height="70" rx="4" fill="#5a3d1e" stroke="#8a6a3e"/>' +
        '<text x="220" y="482" text-anchor="middle" class="obj-label">' + Game.esc(T.box) + '</text>' +
        '<rect class="glow" x="154" y="434" width="132" height="82" rx="6"/></g>') +
        '<g data-obj="dark"><rect x="820" y="120" width="120" height="290" fill="' + (s.flags.testDarkLit ? '#2d3b20' : '#030504') + '"/>' +
        '<text x="880" y="270" text-anchor="middle" class="obj-label">' + Game.esc(T.dark) + '</text>' +
        '<rect class="glow" x="814" y="114" width="132" height="302" rx="6"/></g>';
    }
  });
})(window.Game = window.Game || {});
