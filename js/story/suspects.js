/* js/story/suspects.js — şübhəlilər (uydurma şəxslər) və Phantom seçimi.
   Qayda (PLAN.md): Phantom hər oyunda Leyla, Nigar və Tural arasından təsadüfi seçilir.
   Murad (sistem administratoru) heç vaxt Phantom deyil — o, həmişə yalançı izdir.
   Phantom-a uyğun detektiv ipucularının generasiyası aktlar yazıldıqca (Mərhələ 2–5) bura əlavə olunur. */
(function (Game) {
  'use strict';

  var LIST = [
    { id: 'leyla', name: 'Leyla Həsənova', role: 'Dizayner' },
    { id: 'murad', name: 'Murad Əliyev', role: 'Sistem administratoru' },
    { id: 'nigar', name: 'Nigar Quliyeva', role: 'Mühasib' },
    { id: 'tural', name: 'Tural Məmmədov', role: 'Stajor' }
  ];
  var CANDIDATES = ['leyla', 'nigar', 'tural'];
  var DECOY = 'murad';

  Game.suspects = {
    list: function () { return LIST.slice(); },
    get: function (id) { return LIST.filter(function (p) { return p.id === id; })[0] || null; },
    candidates: function () { return CANDIDATES.slice(); },
    decoy: DECOY,
    pickPhantom: function () { return Game.rand.pick(CANDIDATES); },
    phantom: function () { return Game.suspects.get(Game.state && Game.state.phantom); }
  };
})(window.Game = window.Game || {});
