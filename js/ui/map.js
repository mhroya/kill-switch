/* js/ui/map.js — otaq sistemi və xəritə.
   Otaq belə qeydiyyatdan keçir:
     Game.room.register({
       id: 'office', name: 'Hacklənmiş ofis',
       svg: function (s) { return '<svg viewBox="0 0 960 540"> ... <g data-obj="board">...</g> </svg>'; },
       objects: { board: { label: 'Lövhə', click: fn, use: function (itemId) {...}, hidden: function (s) {...} } },
       onEnter: function (s) {...}
     });
   svg() içində dinamik mətn Game.esc() ilə qoyulmalıdır. SVG innerHTML ilə yox, DOMParser ilə əlavə olunur.
   Obyektlər klaviatura ilə də seçilir (Tab + Enter). */
(function (Game) {
  'use strict';

  var rooms = {};
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function st() { return Game.state; }
  function scene() { return document.getElementById('scene'); }

  // SVG sətrini DOM elementinə çevirir (XML kimi, skriptlər işə düşmür).
  Game.parseSvg = function (markup) {
    if (markup.indexOf('xmlns=') < 0) markup = markup.replace('<svg', '<svg xmlns="' + SVG_NS + '"');
    var doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
    var err = doc.getElementsByTagName('parsererror')[0];
    if (err) {
      console.error('SVG xətası: ' + err.textContent);
      return document.createElementNS(SVG_NS, 'svg');
    }
    return document.importNode(doc.documentElement, true);
  };

  function bindObjects(room) {
    [].forEach.call(scene().querySelectorAll('[data-obj]'), function (g) {
      var id = g.getAttribute('data-obj'), o = room.objects && room.objects[id];
      if (!o) return;
      if (o.hidden && o.hidden(st())) { g.style.display = 'none'; return; }
      g.classList.add('obj');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', typeof o.label === 'function' ? o.label(st()) : o.label);
      g.addEventListener('click', function () { Game.room.interact(id); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Game.room.interact(id); }
      });
    });
  }

  Game.room = {
    register: function (r) { rooms[r.id] = r; },
    get: function (id) { return rooms[id]; },
    all: function () { return Game.ROOMS_ORDER.map(function (id) { return rooms[id]; }).filter(Boolean); },
    isUnlocked: function (id) { return !!(st() && st().unlocked.indexOf(id) >= 0); },

    unlock: function (id) {
      var s = st();
      if (!s || s.unlocked.indexOf(id) >= 0) return;
      s.unlocked.push(id);
      Game.ui.toast(Game.T.map.unlocked(rooms[id] ? rooms[id].name : id), 'good');
      Game.changed();
    },

    go: function (id) {
      var s = st();
      if (!s || !rooms[id] || !Game.room.isUnlocked(id)) return false;
      s.room = id;
      Game.inventory.hold(null);
      Game.room.render(true);
      Game.events.emit('room', id);
      Game.changed();
      if (rooms[id].onEnter) rooms[id].onEnter(s);
      return true;
    },

    // Cari otağı yenidən çəkir (məs. obyekt dəyişəndə). anim — keçid animasiyası.
    render: function (anim) {
      var s = st(), room = s && rooms[s.room], sc = scene();
      if (!room) return;
      var svg = Game.parseSvg(room.svg(s));
      svg.setAttribute('role', 'group');
      svg.setAttribute('aria-label', room.name);
      sc.textContent = '';
      sc.appendChild(svg);
      bindObjects(room);
      if (anim) {
        sc.classList.remove('enter');
        void sc.offsetWidth;
        sc.classList.add('enter');
      }
    },

    // Obyektə klik: əldə əşya varsa use(), yoxsa click().
    interact: function (objId) {
      var s = st(), room = s && rooms[s.room], o = room && room.objects[objId];
      if (!o || s.over) return;
      var held = Game.inventory.selected();
      if (held) {
        Game.inventory.hold(null);
        if (o.use && o.use(held) !== false) return;
        Game.ui.toast(Game.T.inv.noUse(Game.items[held] ? Game.items[held].name : held), 'bad');
        return;
      }
      if (o.click) o.click(s);
    },

    // Akt bitdi: Roma rəqəmli açar parçası, növbəti otaq açılır, iz sayğacı azalır.
    completeAct: function (id, onDone) {
      var s = st(), idx = Game.ROOMS_ORDER.indexOf(id), T = Game.T.map;
      if (!s || idx < 0 || idx > 3 || s.actsDone.indexOf(id) >= 0) return;
      s.actsDone.push(id);
      var numeral = s.keys[idx];
      Game.inventory.add('key-' + numeral, true);
      Game.trace.reduce(Game.TRACE_ACT_BONUS);
      Game.room.unlock(Game.ROOMS_ORDER[idx + 1]);
      Game.events.emit('act', id);
      Game.changed();
      Game.popup.open({
        title: T.actDone(idx + 1),
        body: T.actDoneText(numeral, Game.TRACE_ACT_BONUS, rooms[Game.ROOMS_ORDER[idx + 1]].name),
        kind: 'cutscene',
        buttons: [{ label: T.openMap, onClick: function () { Game.map.open(); if (onDone) onDone(); } }]
      });
    }
  };

  // Açar parçaları (Roma rəqəmləri ilə).
  Game.ROMAN.forEach(function (n) {
    Game.defineItem('key-' + n, {
      icon: '🔑',
      get name() { return Game.T.items.keyName(n); },
      get desc() { return Game.T.items.keyDesc(n); }
    });
  });

  // Xəritə: açılmış otaqlar arasında keçid.
  Game.map = {
    open: function () {
      var el = Game.el, T = Game.T.map, s = st(), h;
      var list = el('ol', { class: 'map' }, Game.room.all().map(function (r, i) {
        var open = Game.room.isUnlocked(r.id), here = s.room === r.id, done = s.actsDone.indexOf(r.id) >= 0;
        var status = here ? T.here : done ? T.done : open ? T.open : T.locked;
        return el('li', { class: (open ? 'open' : 'locked') + (here ? ' here' : '') }, [
          el('button', {
            type: 'button', disabled: !open || here, 'data-room': r.id,
            onclick: function () { h.close(); Game.room.go(r.id); }
          }, [
            el('span', { class: 'n', text: i < 4 ? T.act(i + 1) : T.final }),
            el('span', { class: 'nm', text: r.name }),
            el('span', { class: 'st', text: (open ? '' : '🔒 ') + status })
          ])
        ]);
      }));
      h = Game.popup.open({ title: T.title, body: list, wide: true });
    }
  };

  // MÜVƏQQƏTİ (Mərhələ 1): mühərriki yoxlamaq üçün boş test otağı.
  // Hər akt öz mərhələsində (2–6) bunu əsl otaqla əvəz edir.
  Game.room.testRoom = function (o) {
    var T = Game.T.test;
    var objects = {
      lock: { label: T.lock, click: function () { Game.puzzles.ask(o.id + '-test'); } },
      clue: {
        label: T.clue,
        click: function () {
          Game.evidence.add({ id: o.id + '-test-ev', title: T.evTitle(o.name), text: T.evText });
          Game.popup.info(T.clue, T.clueText);
        }
      },
      fact: { label: T.factObj, click: function () { Game.popup.fact(o.fact || T.fact); } }
    };
    Object.keys(o.extra || {}).forEach(function (k) { objects[k] = o.extra[k]; });

    if (!o.noPuzzle) {
      Game.puzzles.register({
        id: o.id + '-test', room: o.id, title: T.puzzleTitle,
        gen: function (rand) { return { a: rand.int(2, 9), b: rand.int(2, 9) }; },
        answer: function (c) { return String(c.a + c.b); },
        prompt: function (c) { return T.puzzlePrompt(c.a, c.b); },
        hints: [function () { return T.hint1; }, function (c) { return T.hint2(c.a); }],
        onSolve: function () { Game.room.render(); Game.room.completeAct(o.id); }
      });
    }

    Game.room.register({
      id: o.id, name: o.name, objects: objects,
      svg: function (s) {
        var solved = Game.puzzles.isSolved(o.id + '-test');
        return '<svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid meet">' +
          '<rect width="960" height="540" fill="' + o.color + '"/>' +
          '<rect y="430" width="960" height="110" fill="#000" opacity=".25"/>' +
          '<text x="480" y="60" text-anchor="middle" class="room-title">' + Game.esc(o.name) + ' — ' + Game.esc(T.label) + '</text>' +
          (o.noPuzzle ? '' :
            '<g data-obj="lock"><rect x="120" y="140" width="220" height="200" rx="10" fill="#050a08" stroke="' + (solved ? '#39ff6a' : '#ffc933') + '" stroke-width="3"/>' +
            '<text x="230" y="250" text-anchor="middle" class="obj-big">' + (solved ? '✓' : '?') + '</text>' +
            '<text x="230" y="372" text-anchor="middle" class="obj-label">' + Game.esc(T.lock) + '</text>' +
            '<rect class="glow" x="114" y="134" width="232" height="212" rx="12"/></g>') +
          '<g data-obj="clue"><rect x="400" y="180" width="160" height="120" rx="6" fill="#d6efe0"/>' +
          '<text x="480" y="250" text-anchor="middle" fill="#0a1210" font-size="22">' + Game.esc(T.clueShort) + '</text>' +
          '<text x="480" y="332" text-anchor="middle" class="obj-label">' + Game.esc(T.clue) + '</text>' +
          '<rect class="glow" x="394" y="174" width="172" height="132" rx="8"/></g>' +
          '<g data-obj="fact"><circle cx="700" cy="240" r="60" fill="#3a2d0a" stroke="#ffc933" stroke-width="3"/>' +
          '<text x="700" y="258" text-anchor="middle" class="obj-big" fill="#ffc933">!</text>' +
          '<text x="700" y="332" text-anchor="middle" class="obj-label">' + Game.esc(T.factObj) + '</text>' +
          '<rect class="glow" x="634" y="174" width="132" height="132" rx="10"/></g>' +
          (o.extraSvg ? o.extraSvg(s) : '') +
          '</svg>';
      }
    });
  };
})(window.Game = window.Game || {});
