/* js/main.js — başlanğıc nöqtəsi: əsas menyu, çətinlik seçimi, oyunu başlatmaq / davam etdirmək, fasilə menyusu.
   Bütün digər fayllar bundan əvvəl yüklənir. */
(function (Game) {
  'use strict';

  Game.settings = Game.save.settings();

  Game.showScreen = function (name) {
    ['menu', 'game', 'end'].forEach(function (n) {
      document.getElementById('screen-' + n).classList.toggle('on', n === name);
    });
  };

  // Oyunu vəziyyətdən qurur (yeni və ya saxlanmış).
  function enter(s) {
    Game.popup.closeAll();
    Game.timer.stop();
    Game.timer.resumeAll();
    Game.inventory.hold(null);
    Game.state = s;
    Game.showScreen('game');
    Game.hud.build();
    Game.inventory.renderBar();
    Game.room.render(true);
    Game.events.emit('room', s.room);
    Game.save.write();
    Game.timer.start();
  }

  Game.start = function (diffId) {
    enter(Game.newState(diffId));
    var T = Game.T.intro;
    Game.popup.open({
      title: T.title, body: T.text, kind: 'cutscene',
      buttons: [{ label: T.start }]
    });
  };

  Game.resume = function () {
    var s = Game.save.read();
    if (!s) { Game.menu.show(); return; }
    enter(s);
  };

  Game.menu = {
    show: function () {
      var el = Game.el, T = Game.T.menu, saved = Game.save.read();
      Game.timer.stop();
      Game.popup.closeAll();
      if (Game.state && !Game.state.over) Game.save.write();
      Game.state = null;

      var scr = document.getElementById('screen-menu');
      scr.textContent = '';
      var diffBox = el('div', { class: 'diffs', hidden: true }, [
        el('h2', { text: T.chooseDiff }),
        el('div', { class: 'diff-list' }, ['e', 'm', 'h'].map(function (d) {
          return el('button', { type: 'button', class: 'diff', 'data-diff': d, onclick: function () { Game.start(d); } }, [
            el('b', { text: T.diffs[d].name }), el('span', { text: T.diffs[d].info })
          ]);
        })),
        el('button', { type: 'button', class: 'secondary', text: T.back, onclick: function () { diffBox.hidden = true; main.hidden = false; main.querySelector('button').focus(); } })
      ]);
      var main = el('div', { class: 'menu-main' }, [
        saved ? el('button', { type: 'button', id: 'btn-continue', text: T.cont, onclick: Game.resume }) : null,
        saved ? el('p', { class: 'muted small', text: T.contInfo(Game.T.rooms[saved.room] || saved.room, Game.timer.fmt(saved.timeLeft)) }) : null,
        el('button', {
          type: 'button', id: 'btn-new', class: saved ? 'secondary' : '', text: T.newGame,
          onclick: function () { main.hidden = true; diffBox.hidden = false; diffBox.querySelector('button').focus(); }
        }),
        el('button', { type: 'button', class: 'secondary', text: T.rules, onclick: function () { Game.popup.info(T.rules, T.rulesText); } })
      ]);
      scr.appendChild(el('div', { class: 'menu-card' }, [
        el('h1', { class: 'logo', text: Game.T.title }),
        el('p', { class: 'tagline', text: Game.T.tagline }),
        main, diffBox,
        el('p', { class: 'muted small', text: T.saveNote }),
        Game.debug.on ? el('p', { class: 'debug-note', text: T.debugOn }) : null
      ]));
      Game.showScreen('menu');
      var first = scr.querySelector('button');
      if (first) first.focus();
    },

    // Oyun içində "Menyu" düyməsi.
    pause: function () {
      var T = Game.T.pause, H = Game.T.hud, el = Game.el;
      // Səs ayarları burada da var (telefonda üst paneldə gizlədilir).
      function soundBtn(name) {
        var b = el('button', { type: 'button', class: 'secondary', 'aria-pressed': String(Game.settings[name] !== false) });
        function label() { b.textContent = (name === 'music' ? H.music : H.sfx) + ': ' + (Game.settings[name] !== false ? H.on : H.off); }
        b.onclick = function () {
          Game.settings[name] = Game.settings[name] === false;
          Game.save.setSettings(Game.settings);
          b.setAttribute('aria-pressed', String(Game.settings[name] !== false));
          label();
          Game.hud.build();
          Game.events.emit('settings', Game.settings);
        };
        label();
        return b;
      }
      Game.popup.open({
        title: T.title,
        body: el('div', {}, [el('p', { text: T.text }), el('div', { class: 'actions' }, [soundBtn('sfx'), soundBtn('music')])]),
        buttons: [
          { label: T.resume },
          { label: T.rules, primary: false, onClick: function () { Game.popup.info(Game.T.menu.rules, Game.T.menu.rulesText); } },
          { label: T.toMenu, primary: false, onClick: function () { Game.menu.show(); } },
          {
            label: T.restart, primary: false, onClick: function () {
              Game.popup.open({
                title: T.restart, body: T.restartConfirm,
                buttons: [
                  { label: T.yes, onClick: function () { Game.save.clear(); var d = Game.state.diff; Game.state.over = true; Game.start(d); } },
                  { label: T.no, primary: false }
                ]
              });
            }
          }
        ]
      });
    }
  };

  window.addEventListener('beforeunload', function () { Game.save.write(); });

  function boot() {
    document.title = Game.T.title;
    Game.debug.build();
    Game.menu.show();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.Game = window.Game || {});
