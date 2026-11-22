/* js/rooms/final.js — Final — tapşırıq meneceri, kill switch, detektiv sualı.
   MÜVƏQQƏTİ: Mərhələ 1-də sonluqları yoxlamaq üçün test otağıdır. Əsl final Mərhələ 6-da yazılacaq. */
(function (Game) {
  'use strict';

  var T = Game.T.test;

  function keysHeld() {
    return Game.ROMAN.filter(function (n) { return Game.inventory.has('key-' + n); }).length;
  }

  function chooseSuspect() {
    var el = Game.el, h;
    var list = el('div', { class: 'choices' }, Game.suspects.list().map(function (p) {
      return el('button', {
        type: 'button', 'data-suspect': p.id, text: p.name + ' — ' + p.role,
        onclick: function () { h.close(); Game.over(p.id === Game.state.phantom ? 'best' : 'good'); }
      });
    }));
    h = Game.popup.open({ title: T.finalTitle, body: el('div', {}, [el('p', { text: T.finalText }), list]) });
  }

  Game.room.testRoom({
    id: 'final', name: Game.T.rooms.final, color: '#1a1a1a', noPuzzle: true, fact: Game.FACTS.enigma,
    extra: {
      kill: {
        label: T.killswitch,
        click: function () {
          var n = keysHeld();
          if (n < 4) Game.popup.info(T.killswitch, T.needKeys(n));
          else chooseSuspect();
        }
      }
    },
    extraSvg: function () {
      return '<g data-obj="kill"><rect x="140" y="150" width="180" height="180" rx="12" fill="#3a0d0d" stroke="#ff5050" stroke-width="4"/>' +
        '<circle cx="230" cy="240" r="50" fill="#d22"/>' +
        '<text x="230" y="370" text-anchor="middle" class="obj-label">' + Game.esc(T.killswitch) + '</text>' +
        '<rect class="glow" x="134" y="144" width="192" height="192" rx="14"/></g>';
    }
  });
})(window.Game = window.Game || {});
