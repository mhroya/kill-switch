/* js/core/puzzles.js — tapmacaların ümumi reyestri.
   Hər tapmaca belə qeydiyyatdan keçir:
     Game.puzzles.register({
       id: 'office-caesar', room: 'office', title: '...',
       gen: function (rand) { return {...} },          // hər oyunda təsadüfi kod (istəyə bağlı)
       answer: function (code) { return 'CAVAB' },     // və ya sabit sətir / sətirlər massivi
       prompt: function (code) { return 'sual' },      // ask() pəncərəsindəki mətn və ya Node
       hints: [function (code) {...}, function (code) {...}], // 2 pilləli hint
       onSolve: function () {...}
     });
   Xal, iz sayğacı və hint qiyməti burada bir yerdə hesablanır. */
(function (Game) {
  'use strict';

  var reg = {};

  function st() { return Game.state; }

  // Cavabları müqayisə üçün sadələşdirir: böyük/kiçik hərf, artıq boşluq, ı/i fərqi nəzərə alınmır.
  function norm(v) {
    return String(v === null || v === undefined ? '' : v)
      .toLocaleLowerCase('az')
      .replace(/ı/g, 'i')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function value(fnOrVal, code) {
    return typeof fnOrVal === 'function' ? fnOrVal(code) : fnOrVal;
  }

  Game.puzzles = {
    norm: norm,

    register: function (p) { reg[p.id] = p; },
    get: function (id) { return reg[id]; },
    inRoom: function (roomId) {
      return Object.keys(reg).map(function (k) { return reg[k]; })
        .filter(function (p) { return p.room === roomId; });
    },

    // Yeni oyunda bütün təsadüfi kodları yaradır.
    generateAll: function (s) {
      Object.keys(reg).forEach(function (k) {
        if (reg[k].gen) s.codes[k] = reg[k].gen(Game.rand);
      });
    },

    code: function (id) {
      var s = st();
      if (s && !(id in s.codes) && reg[id] && reg[id].gen) s.codes[id] = reg[id].gen(Game.rand);
      return s ? s.codes[id] : undefined;
    },

    answers: function (id) {
      var p = reg[id];
      return p ? [].concat(value(p.answer, Game.puzzles.code(id))) : [];
    },

    isSolved: function (id) { return !!(st() && st().solved[id]); },

    // Oyunçunun cavabını yoxlayır, xal/iz sayğacını tətbiq edir. true/false qaytarır.
    check: function (id, input) {
      var p = reg[id], s = st();
      if (!p || !s || s.over || s.solved[id]) return false;
      var n = norm(input);
      if (!n) return false;
      var ok = p.validate
        ? !!p.validate(input, Game.puzzles.code(id))
        : Game.puzzles.answers(id).some(function (a) { return norm(a) === n; });
      if (ok) Game.puzzles.solve(id); else Game.puzzles.wrong(id);
      return ok;
    },

    solve: function (id) {
      var p = reg[id], s = st();
      if (!p || !s || s.over || s.solved[id]) return;
      s.solved[id] = true;
      Game.addScore(Game.SCORE.correct);
      Game.events.emit('solved', id);
      Game.changed();
      if (p.onSolve) p.onSolve(Game.puzzles.code(id));
    },

    // Yanlış cavab və ya səhv seçim: −20 xal və iz sayğacı artır.
    wrong: function (id, traceMul) {
      var s = st();
      if (!s || s.over) return;
      Game.addScore(-Game.SCORE.wrong);
      s.stats.wrong++;
      Game.events.emit('wrong', id);
      Game.trace.add(Math.round(Game.diff().traceWrong * (traceMul || 1)));
    },

    // Alınmış hint-lərin mətnləri.
    boughtHints: function (id) {
      var p = reg[id], s = st();
      if (!p || !p.hints || !s) return [];
      var lvl = s.hints[id] || 0, code = Game.puzzles.code(id);
      return p.hints.slice(0, lvl).map(function (h) { return value(h, code); });
    },

    // Növbəti hint-i alır (ən çox 2). Hər hint çətinliyə görə xal aparır.
    buyHint: function (id) {
      var p = reg[id], s = st();
      if (!p || !p.hints || !s || s.over) return null;
      var lvl = s.hints[id] || 0;
      if (lvl >= p.hints.length) return null;
      s.hints[id] = lvl + 1;
      s.stats.hints++;
      Game.addScore(-Game.diff().hint);
      Game.events.emit('hint', id);
      Game.changed();
      return value(p.hints[lvl], Game.puzzles.code(id));
    },

    // Mətn cavablı tapmaca üçün standart pəncərə: sual, cavab sahəsi, hint düymələri.
    ask: function (id, opts) {
      var p = reg[id], T = Game.T, el = Game.el;
      if (!p) return null;
      opts = opts || {};
      if (Game.puzzles.isSolved(id)) {
        return Game.popup.info(p.title, p.solvedText ? value(p.solvedText, Game.puzzles.code(id)) : T.puzzle.alreadySolved);
      }

      var input = el('input', {
        class: 'answer', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
        'aria-label': T.puzzle.answerLabel, placeholder: T.puzzle.answerPlaceholder
      });
      var msg = el('p', { class: 'msg', 'aria-live': 'polite' });
      var hintList = el('ol', { class: 'hints' });
      var hintBtn = el('button', { type: 'button', class: 'secondary' });
      var h;

      function renderHints() {
        hintList.textContent = '';
        Game.puzzles.boughtHints(id).forEach(function (t) { hintList.appendChild(el('li', { text: t })); });
        var lvl = (st().hints[id] || 0), total = (p.hints || []).length;
        if (lvl >= total) { hintBtn.hidden = true; return; }
        hintBtn.textContent = T.puzzle.hintBtn(lvl + 1, Game.diff().hint);
      }

      function submit() {
        if (!input.value.trim()) { input.focus(); return; }
        if (Game.puzzles.check(id, input.value)) {
          h.close();
        } else if (!st().over) {
          msg.className = 'msg bad';
          msg.textContent = T.puzzle.wrong(Game.SCORE.wrong);
          input.select();
        }
      }

      // preventDefault: yoxsa eyni Enter yeni açılan pəncərənin düyməsini də basır.
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      hintBtn.addEventListener('click', function () { Game.puzzles.buyHint(id); renderHints(); input.focus(); });

      var body = el('div', { class: 'puzzle' }, [
        el('div', { class: 'prompt' }, [value(p.prompt, Game.puzzles.code(id))]),
        el('div', { class: 'answer-row' }, [
          input,
          el('button', { type: 'button', text: T.puzzle.check, onclick: submit })
        ]),
        msg,
        p.hints && p.hints.length ? el('div', { class: 'hint-box' }, [hintList, hintBtn]) : null
      ]);
      renderHints();
      h = Game.popup.open({ title: p.title, body: body, kind: opts.kind || 'puzzle', focus: input });
      return h;
    }
  };
})(window.Game = window.Game || {});
