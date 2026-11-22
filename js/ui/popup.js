/* js/ui/popup.js — pəncərələr: əşyaya baxış, tapmaca, izah ("?"), "Bilirdinmi?" kartı, kat-səhnə.
   Pəncərələr üst-üstə açıla bilər (stack). Esc ən üstdəkini bağlayır, Tab fokusu pəncərənin içində saxlayır.
   'explain', 'fact' və 'cutscene' növləri açıq olanda timer dayanır. */
(function (Game) {
  'use strict';

  var stack = [];
  var seq = 0;
  var PAUSE_KINDS = { explain: true, fact: true, cutscene: true };

  function root() { return document.getElementById('overlays'); }

  function focusables(node) {
    return [].slice.call(node.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'))
      .filter(function (n) { return !n.disabled && !n.hidden && n.offsetParent !== null; });
  }

  function close(h) {
    var i = stack.indexOf(h);
    if (i < 0) return;
    stack.splice(i, 1);
    h.node.remove();
    if (h.pauses) Game.timer.resume('popup-' + h.id);
    if (h.onClose) h.onClose();
    var top = stack[stack.length - 1];
    if (top) {
      var f = focusables(top.card)[0];
      if (f) f.focus();
    } else if (h.prevFocus && document.contains(h.prevFocus)) {
      h.prevFocus.focus();
    }
    Game.events.emit('popup', stack.length);
  }

  document.addEventListener('keydown', function (e) {
    var top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === 'Escape' && top.closable) {
      e.preventDefault();
      close(top);
    } else if (e.key === 'Tab') {
      var f = focusables(top.card);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!top.card.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });

  Game.popup = {
    // o: { title, body (sətir və ya Node), kind, buttons: [{label, onClick, primary, keepOpen}],
    //      closable (default true), onClose, focus (Node), wide }
    open: function (o) {
      var el = Game.el, T = Game.T;
      var h = { id: ++seq, kind: o.kind || 'info', closable: o.closable !== false, onClose: o.onClose,
        prevFocus: document.activeElement };
      h.close = function () { close(h); };

      var titleId = 'pop-title-' + h.id;
      var body = typeof o.body === 'string' || typeof o.body === 'number'
        ? el('p', { class: 'pre', text: String(o.body) })
        : o.body;
      var buttons = (o.buttons || []).map(function (b) {
        return el('button', {
          type: 'button', class: b.primary === false ? 'secondary' : '', text: b.label,
          onclick: function () { if (!b.keepOpen) close(h); if (b.onClick) b.onClick(); }
        });
      });
      if (!buttons.length && h.closable) {
        buttons.push(el('button', { type: 'button', text: T.ui.close, onclick: h.close }));
      }

      h.card = el('div', {
        class: 'card card-' + h.kind + (o.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId
      }, [
        h.closable ? el('button', { type: 'button', class: 'x', 'aria-label': T.ui.close, text: '×', onclick: h.close }) : null,
        el('h2', { id: titleId, text: o.title || '' }),
        body,
        buttons.length ? el('div', { class: 'actions' }, buttons) : null
      ]);
      h.node = el('div', { class: 'ov ov-' + h.kind }, [h.card]);
      h.node.addEventListener('mousedown', function (e) { if (e.target === h.node && h.closable) close(h); });

      root().appendChild(h.node);
      stack.push(h);
      h.pauses = !!PAUSE_KINDS[h.kind];
      if (h.pauses) Game.timer.pause('popup-' + h.id);
      Game.events.emit('popup', stack.length);

      var f = o.focus || focusables(h.card).filter(function (n) { return !n.classList.contains('x'); })[0];
      if (f) f.focus();
      return h;
    },

    info: function (title, body, buttons) {
      return Game.popup.open({ title: title, body: body, buttons: buttons });
    },

    // "?" izahı: termin açarı Game.T.glossary-dədir. Timer dayanır.
    explain: function (term) {
      var g = Game.T.glossary[term];
      if (!g) return null;
      return Game.popup.open({ title: g[0], body: g[1], kind: 'explain' });
    },

    // "Bilirdinmi?" kartı. Timer dayanır.
    fact: function (text, onClose) {
      return Game.popup.open({ title: Game.T.ui.didYouKnow, body: text, kind: 'fact', onClose: onClose });
    },

    closeAll: function () {
      stack.slice().reverse().forEach(close);
    },
    count: function () { return stack.length; },
    top: function () { return stack[stack.length - 1] || null; }
  };

  // Termin yanında kiçik "?" düyməsi.
  Game.ui = Game.ui || {};
  Game.ui.q = function (term) {
    var g = Game.T.glossary[term];
    return Game.el('button', {
      type: 'button', class: 'q', 'aria-label': Game.T.ui.whatIs(g ? g[0] : term), text: '?',
      onclick: function (e) { e.stopPropagation(); Game.popup.explain(term); }
    });
  };
  // "Termin ?" cütü.
  Game.ui.term = function (label, term) {
    return Game.el('span', { class: 'term' }, [label, Game.ui.q(term)]);
  };
})(window.Game = window.Game || {});
