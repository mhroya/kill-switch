/* js/core/debug.js — debug rejimi: index.html?debug=1
   Test və sinifdə təqdimat üçün: istənilən otağa keçmək, aktı bitirmək, cavabları və Phantom-u görmək,
   vaxt / iz sayğacı ilə oynamaq. Adi oyunda bu panel görünmür. */
(function (Game) {
  'use strict';

  Game.debug = {
    on: /[?&]debug=1\b/.test(window.location.search),

    build: function () {
      if (!Game.debug.on || document.getElementById('debug')) return;
      var el = Game.el;
      var out = el('pre', { class: 'debug-out', 'aria-live': 'polite' });
      function say(t) { out.textContent = t; }
      function need() { if (!Game.state || Game.state.over) { say('Oyun başlamayıb.'); return false; } return true; }

      var roomBtns = Game.ROOMS_ORDER.map(function (id) {
        return el('button', {
          type: 'button', class: 'mini', text: id,
          onclick: function () { if (!need()) return; Game.room.unlock(id); Game.popup.closeAll(); Game.room.go(id); }
        });
      });

      var panel = el('details', { id: 'debug' }, [
        el('summary', { text: 'DEBUG' }),
        el('div', { class: 'debug-body' }, [
          el('div', { class: 'row' }, roomBtns),
          el('div', { class: 'row' }, [
            el('button', {
              type: 'button', class: 'mini', text: 'Cavablar',
              onclick: function () {
                if (!need()) return;
                var s = Game.state;
                var lines = Game.puzzles.inRoom(s.room).map(function (p) {
                  return (Game.puzzles.isSolved(p.id) ? '✓ ' : '· ') + p.id + ': ' + Game.puzzles.answers(p.id).join(' / ');
                });
                lines.push('Phantom: ' + Game.suspects.phantom().name);
                lines.push('Açarlar (akt 1–4): ' + s.keys.join(', '));
                say(lines.join('\n') || 'Bu otaqda tapmaca yoxdur.');
              }
            }),
            el('button', {
              type: 'button', class: 'mini', text: 'Hamısını həll et',
              onclick: function () {
                if (!need()) return;
                Game.popup.closeAll();
                Game.puzzles.inRoom(Game.state.room).forEach(function (p) { Game.puzzles.solve(p.id); });
                Game.room.render();
                say('Otağın tapmacaları həll olundu.');
              }
            }),
            el('button', {
              type: 'button', class: 'mini', text: 'Aktı bitir',
              onclick: function () { if (!need()) return; Game.popup.closeAll(); Game.room.completeAct(Game.state.room); }
            })
          ]),
          el('div', { class: 'row' }, [
            el('button', { type: 'button', class: 'mini', text: '+20% iz', onclick: function () { if (need()) Game.trace.add(20); } }),
            el('button', { type: 'button', class: 'mini', text: '−10 dəq', onclick: function () { if (need()) Game.timer.add(-600); } }),
            el('button', { type: 'button', class: 'mini', text: '+10 dəq', onclick: function () { if (need()) Game.timer.add(600); } }),
            el('button', {
              type: 'button', class: 'mini', text: 'Bütün əşyalar',
              onclick: function () { if (!need()) return; Object.keys(Game.items).forEach(function (id) { Game.inventory.add(id, true); }); say('Bütün əşyalar çantadadır.'); }
            })
          ]),
          out
        ])
      ]);
      document.body.appendChild(panel);
    }
  };
})(window.Game = window.Game || {});
