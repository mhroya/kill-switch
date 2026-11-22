/* js/core/save.js — gedişatı və ayarları localStorage-da saxlayır.
   Bütün əməliyyatlar try/catch içindədir: gizli rejimdə və ya bloklanmış yaddaşda oyun yenə işləyir. */
(function (Game) {
  'use strict';

  var KEY = 'killswitch-phantom-save';
  var SETTINGS_KEY = 'killswitch-phantom-settings';

  function getRaw(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function setRaw(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function delRaw(k) { try { window.localStorage.removeItem(k); } catch (e) { /* yaddaş əlçatan deyil */ } }

  Game.save = {
    write: function () {
      var s = Game.state;
      if (!s || s.over) return;
      setRaw(KEY, JSON.stringify(s));
    },
    // Uyğun versiyalı, bitməmiş oyunu qaytarır, yoxdursa null.
    read: function () {
      var raw = getRaw(KEY);
      if (!raw) return null;
      try {
        var s = JSON.parse(raw);
        return s && s.v === Game.SAVE_VERSION && !s.over ? s : null;
      } catch (e) { return null; }
    },
    clear: function () { delRaw(KEY); },
    settings: function () {
      try { return JSON.parse(getRaw(SETTINGS_KEY)) || {}; } catch (e) { return {}; }
    },
    setSettings: function (o) { setRaw(SETTINGS_KEY, JSON.stringify(o)); },
    // Liderlər cədvəli kimi əlavə məlumatlar üçün.
    getRaw: getRaw,
    setRaw: setRaw
  };
})(window.Game = window.Game || {});
