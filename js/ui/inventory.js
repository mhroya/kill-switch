/* js/ui/inventory.js — inventar və "Sübutlar" paneli.
   - Əşyalar Game.defineItem ilə təsvir olunur, Game.inventory.add ilə çantaya düşür.
   - Alt paneldə əşyaya klik → "əldə" seçilir; sonra otaqdakı obyektə klik → obyektin use() funksiyası.
   - Çanta pəncərəsində iki əşyanı birləşdirmək olar (Game.inventory.combo ilə qeydiyyat). */
(function (Game) {
  'use strict';

  Game.items = {};
  Game.defineItem = function (id, o) { Game.items[id] = o; };

  var selected = null;
  var combos = {};

  function comboKey(a, b) { return [a, b].sort().join('+'); }
  function st() { return Game.state; }
  function item(id) { return Game.items[id] || { name: id, icon: '?', desc: '' }; }

  Game.inventory = {
    add: function (id, silent) {
      var s = st();
      if (!s || s.inventory.indexOf(id) >= 0) return;
      s.inventory.push(id);
      if (!silent) Game.ui.toast(Game.T.inv.got(item(id).name), 'good');
      Game.events.emit('inv');
      Game.changed();
    },
    remove: function (id) {
      var s = st(), i = s ? s.inventory.indexOf(id) : -1;
      if (i < 0) return;
      s.inventory.splice(i, 1);
      if (selected === id) selected = null;
      Game.events.emit('inv');
      Game.changed();
    },
    has: function (id) { return !!(st() && st().inventory.indexOf(id) >= 0); },
    selected: function () { return selected; },
    // Alt paneldən: eyni əşyaya ikinci klik onu əldən buraxır.
    select: function (id) {
      Game.inventory.hold(id && selected !== id ? id : null);
    },
    hold: function (id) {
      selected = id || null;
      Game.inventory.renderBar();
      document.getElementById('scene').classList.toggle('using', !!selected);
    },

    // İki əşyanın birləşməsini qeydiyyata alır: fn() nəticəni özü edir (məs. yeni əşya verir).
    combo: function (a, b, fn) { combos[comboKey(a, b)] = fn; },
    combine: function (a, b) {
      var fn = combos[comboKey(a, b)];
      if (fn) { fn(); return true; }
      Game.ui.toast(Game.T.inv.noCombo, 'bad');
      return false;
    },

    renderBar: function () {
      var bar = document.getElementById('bar'), el = Game.el, T = Game.T.inv, s = st();
      if (!bar || !s) return;
      bar.textContent = '';
      bar.appendChild(el('button', { type: 'button', class: 'mini bag', text: T.bag(s.inventory.length), onclick: Game.inventory.open }));
      var list = el('div', { class: 'chips', role: 'list', 'aria-label': T.title });
      s.inventory.forEach(function (id) {
        var it = item(id);
        list.appendChild(el('button', {
          type: 'button', role: 'listitem', class: 'chip' + (selected === id ? ' sel' : ''),
          'aria-pressed': String(selected === id), title: it.name,
          onclick: function () { Game.inventory.select(id); }
        }, [el('span', { class: 'ico', 'aria-hidden': 'true', text: it.icon }), el('span', { class: 'nm', text: it.name })]));
      });
      if (!s.inventory.length) list.appendChild(el('span', { class: 'muted', text: T.empty }));
      bar.appendChild(list);
      bar.appendChild(el('span', { class: 'holding', 'aria-live': 'polite', text: selected ? T.holding(item(selected).name) : '' }));
    },

    // Çanta pəncərəsi: əşyaya bax, əlinə götür, başqası ilə birləşdir.
    open: function () {
      var el = Game.el, T = Game.T.inv, s = st();
      var detail = el('div', { class: 'detail', 'aria-live': 'polite' });
      var grid = el('div', { class: 'grid' });
      var combineFrom = null;
      var h;

      function show(id) {
        var it = item(id);
        if (combineFrom && combineFrom !== id) {
          var a = combineFrom;
          combineFrom = null;
          if (Game.inventory.combine(a, id)) { h.close(); return; }
        }
        detail.textContent = '';
        detail.appendChild(el('h3', {}, [el('span', { 'aria-hidden': 'true', text: it.icon + ' ' }), it.name]));
        detail.appendChild(el('p', { class: 'pre', text: typeof it.desc === 'function' ? it.desc() : it.desc }));
        detail.appendChild(el('div', { class: 'actions' }, [
          el('button', { type: 'button', text: T.use, onclick: function () { Game.inventory.hold(id); h.close(); } }),
          s.inventory.length > 1 ? el('button', {
            type: 'button', class: 'secondary', text: T.combine,
            onclick: function () { combineFrom = id; detail.appendChild(el('p', { class: 'msg', text: T.pickSecond(it.name) })); }
          }) : null,
          it.onView ? el('button', { type: 'button', class: 'secondary', text: T.look, onclick: function () { it.onView(); } }) : null
        ]));
      }

      s.inventory.forEach(function (id) {
        var it = item(id);
        grid.appendChild(el('button', { type: 'button', class: 'slot', onclick: function () { show(id); } },
          [el('span', { class: 'ico', 'aria-hidden': 'true', text: it.icon }), el('span', { text: it.name })]));
      });
      var body = el('div', { class: 'inventory' }, [
        s.inventory.length ? grid : el('p', { class: 'muted', text: T.empty }),
        detail
      ]);
      h = Game.popup.open({ title: T.title, body: body, wide: true });
    }
  };

  Game.events.on('inv', function () { Game.inventory.renderBar(); });

  // Sübutlar: detektiv ipucları. Hər sübut { id, title, text }.
  Game.evidence = {
    add: function (e) {
      var s = st();
      if (!s || Game.evidence.has(e.id)) return;
      s.evidence.push({ id: e.id, title: e.title, text: e.text });
      Game.ui.toast(Game.T.ev.got(e.title), 'good');
      Game.events.emit('evidence');
      Game.changed();
    },
    has: function (id) {
      return !!(st() && st().evidence.some(function (e) { return e.id === id; }));
    },
    open: function () {
      var el = Game.el, T = Game.T.ev, s = st();
      var list = s.evidence.length
        ? el('ul', { class: 'evidence' }, s.evidence.map(function (e) {
          return el('li', {}, [el('h3', { text: e.title }), el('p', { class: 'pre', text: e.text })]);
        }))
        : el('p', { class: 'muted', text: T.empty });
      var suspects = el('div', { class: 'suspects' }, Game.suspects.list().map(function (p) {
        return el('div', { class: 'suspect' }, [el('b', { text: p.name }), el('span', { text: p.role })]);
      }));
      Game.popup.open({ title: T.title, body: el('div', {}, [el('p', { class: 'muted', text: T.intro }), suspects, list]), wide: true });
    }
  };
})(window.Game = window.Game || {});
