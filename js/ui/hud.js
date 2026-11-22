/* js/ui/hud.js — üst panel: otaq adı, vaxt, xal, iz sayğacı və düymələr (xəritə, sübutlar, səs, menyu).
   Qısa bildirişlər (toast) də buradadır. */
(function (Game) {
  'use strict';

  var r = {};

  function settingLabel(name) {
    var T = Game.T.hud, on = Game.settings[name] !== false;
    return (name === 'music' ? T.music : T.sfx) + ': ' + (on ? T.on : T.off);
  }

  function toggleSetting(name, btn) {
    Game.settings[name] = Game.settings[name] === false;
    Game.save.setSettings(Game.settings);
    btn.textContent = settingLabel(name);
    btn.setAttribute('aria-pressed', String(Game.settings[name] !== false));
    Game.events.emit('settings', Game.settings);
  }

  Game.hud = {
    build: function () {
      var el = Game.el, T = Game.T.hud, h = document.getElementById('hud');
      h.textContent = '';
      r.room = el('span', { class: 'hud-room' });
      r.time = el('b', { class: 'hud-time' });
      r.pause = el('span', { class: 'hud-paused', text: T.paused, hidden: true });
      r.score = el('b');
      r.traceFill = el('span', { class: 'trace-fill' });
      r.traceVal = el('b');
      r.trace = el('span', {
        class: 'hud-trace', role: 'meter', 'aria-label': T.trace, 'aria-valuemin': '0', 'aria-valuemax': '100'
      }, [el('span', { class: 'lbl' }, [Game.ui.term(T.trace, 'trace')]), el('span', { class: 'trace-bar' }, [r.traceFill]), r.traceVal]);

      var sfx = el('button', { type: 'button', class: 'mini', 'aria-pressed': String(Game.settings.sfx !== false), text: settingLabel('sfx') });
      sfx.onclick = function () { toggleSetting('sfx', sfx); };
      var music = el('button', { type: 'button', class: 'mini', 'aria-pressed': String(Game.settings.music !== false), text: settingLabel('music') });
      music.onclick = function () { toggleSetting('music', music); };

      h.appendChild(el('div', { class: 'hud-stats' }, [
        r.room,
        el('span', {}, [T.time + ' ', r.time, r.pause]),
        el('span', {}, [T.score + ' ', r.score]),
        r.trace
      ]));
      h.appendChild(el('div', { class: 'hud-buttons' }, [
        el('button', { type: 'button', class: 'mini', text: T.map, onclick: function () { Game.map.open(); } }),
        el('button', { type: 'button', class: 'mini', text: T.evidence, onclick: function () { Game.evidence.open(); } }),
        el('span', { class: 'hud-sound' }, [sfx, music]),
        el('button', { type: 'button', class: 'mini', text: T.menu, onclick: function () { Game.menu.pause(); } })
      ]));
      Game.hud.update();
    },

    update: function () {
      var s = Game.state;
      if (!s || !r.time) return;
      var room = Game.room.get(s.room);
      r.room.textContent = room ? room.name : '';
      r.time.textContent = Game.timer.fmt(s.timeLeft);
      r.time.classList.toggle('low', s.timeLeft <= 300);
      r.pause.hidden = !Game.timer.paused();
      r.score.textContent = s.score;
      r.traceFill.style.width = s.trace + '%';
      r.traceVal.textContent = s.trace + '%';
      r.trace.setAttribute('aria-valuenow', String(s.trace));
      r.trace.classList.toggle('high', s.trace >= 70);
    }
  };

  ['tick', 'state', 'trace', 'room', 'pause'].forEach(function (ev) {
    Game.events.on(ev, function () { Game.hud.update(); });
  });

  Game.ui = Game.ui || {};
  Game.ui.toast = function (text, kind) {
    var box = document.getElementById('toasts');
    if (!box || !text) return;
    var t = Game.el('div', { class: 'toast' + (kind ? ' ' + kind : ''), text: text });
    box.appendChild(t);
    // Eyni anda ən çox 3 bildiriş: köhnələr silinir ki, ekranı örtməsin.
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(function () { t.classList.add('out'); }, 2600);
    setTimeout(function () { t.remove(); }, 3100);
  };
})(window.Game = window.Game || {});
