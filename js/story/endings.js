/* js/story/endings.js — oyunun sonu: 3 sonluq (uduzma, yaxşı son, ən yaxşı son) və statistika.
   Burada həmişə "Yenidən başla" düyməsi var (köhnə versiyada yox idi).
   Kat-səhnələr, "Nə öyrəndin?" ekranı, liderlər cədvəli və uğurlar Mərhələ 6–7-də əlavə olunur. */
(function (Game) {
  'use strict';

  // kind: 'lose-time' | 'lose-trace' | 'good' | 'best'
  Game.over = function (kind) {
    var s = Game.state;
    if (!s || s.over) return;
    s.over = true;
    s.ending = kind;
    Game.timer.stop();
    Game.timer.resumeAll();
    Game.save.clear();
    Game.popup.closeAll();
    Game.events.emit('over', kind);
    Game.endings.show(kind);
  };

  Game.endings = {
    show: function (kind) {
      var el = Game.el, T = Game.T.end, s = Game.state, e = T[kind] || T['lose-time'];
      var d = Game.DIFF[s.diff], ph = Game.suspects.phantom();
      var rows = [
        [T.score, String(s.score)],
        [T.time, Game.timer.fmt(d.time - s.timeLeft)],
        [T.diff, Game.T.menu.diffs[s.diff].name],
        [T.hints, String(s.stats.hints)],
        [T.wrong, String(s.stats.wrong)]
      ];
      if (kind !== 'best' && ph) rows.push([T.phantom, ph.name]);

      var scr = document.getElementById('screen-end');
      scr.textContent = '';
      scr.className = 'screen on end-' + (kind.indexOf('lose') === 0 ? 'lose' : kind);
      scr.appendChild(el('div', { class: 'end-card' }, [
        el('h1', { text: e.title }),
        el('p', { class: 'pre', text: e.text }),
        el('h2', { text: T.stats }),
        el('dl', { class: 'stats' }, rows.reduce(function (acc, r) {
          return acc.concat([el('dt', { text: r[0] }), el('dd', { text: r[1] })]);
        }, [])),
        el('div', { class: 'actions' }, [
          el('button', { type: 'button', text: T.again, onclick: function () { Game.start(s.diff); } }),
          el('button', { type: 'button', class: 'secondary', text: T.toMenu, onclick: function () { Game.menu.show(); } })
        ])
      ]));
      Game.showScreen('end');
      var b = scr.querySelector('button');
      if (b) b.focus();
    }
  };
})(window.Game = window.Game || {});
