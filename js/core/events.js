/* js/core/events.js — sadə hadisə sistemi və ümumi köməkçilər.
   Modullar bir-birini birbaşa çağırmaq əvəzinə hadisə göndərə bilər: Game.events.emit('state').
   Bu fayl birinci yüklənir: digər fayllar Game.el, Game.esc və Game.rand-dan istifadə edir. */
(function (Game) {
  'use strict';

  var handlers = {};

  Game.events = {
    on: function (name, fn) {
      (handlers[name] = handlers[name] || []).push(fn);
    },
    emit: function (name, data) {
      (handlers[name] || []).slice().forEach(function (fn) {
        try { fn(data); } catch (e) { console.error(e); }
      });
    }
  };

  // DOM elementi yaradır. attrs: class, text, on<hadisə> funksiyaları və adi atributlar.
  // children: sətir (mətn kimi əlavə olunur, HTML kimi yox) və ya Node.
  Game.el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') node.textContent = v;
      else if (k === 'class') node.className = v;
      else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    [].concat(children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return node;
  };

  // SVG/HTML sətrinə dinamik mətn qoymazdan əvvəl təhlükəsiz hala salır.
  Game.esc = function (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  // Təsadüfi ədədlər (hər oyunda yeni kodlar üçün).
  Game.rand = {
    int: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
  };

  // Vəziyyət dəyişəndə çağırılır: HUD yenilənir, gedişat yadda saxlanılır.
  Game.changed = function () {
    Game.events.emit('state');
    if (Game.save) Game.save.write();
  };
})(window.Game = window.Game || {});
