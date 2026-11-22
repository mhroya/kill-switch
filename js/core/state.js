/* js/core/state.js — oyun vəziyyəti və əsas qaydalar (çətinlik, otaq sırası, açar parçaları).
   Game.state bütün gedişatı saxlayan sadə obyektdir: JSON-a çevrilir və localStorage-a yazılır. */
(function (Game) {
  'use strict';

  // Çətinlik səviyyələri. Vaxt saniyə ilədir (PLAN.md: Asan 90, Orta 60, Çətin 40 dəqiqə).
  Game.DIFF = {
    e: { id: 'e', time: 90 * 60, hint: 25, traceWrong: 4 },
    m: { id: 'm', time: 60 * 60, hint: 50, traceWrong: 7 },
    h: { id: 'h', time: 40 * 60, hint: 75, traceWrong: 10 }
  };

  Game.SCORE = { start: 1000, correct: 100, wrong: 20 };
  Game.TRACE_ACT_BONUS = 10;          // hər akt bitəndə iz sayğacı bu qədər azalır
  Game.ROMAN = ['I', 'II', 'III', 'IV'];

  // Otaqların sırası: 4 akt + final.
  Game.ROOMS_ORDER = ['office', 'server', 'machine', 'c2', 'final'];

  Game.SAVE_VERSION = 1;
  Game.state = null;

  // Yeni oyun üçün vəziyyət yaradır.
  Game.newState = function (diffId) {
    var d = Game.DIFF[diffId] || Game.DIFF.m;
    var s = {
      v: Game.SAVE_VERSION,
      diff: d.id,
      timeLeft: d.time,
      score: Game.SCORE.start,
      trace: 0,
      room: Game.ROOMS_ORDER[0],
      unlocked: [Game.ROOMS_ORDER[0]],
      actsDone: [],
      inventory: [],
      evidence: [],
      solved: {},
      hints: {},
      flags: {},
      // keys[i] — i-ci aktda tapılan açar parçasının Roma rəqəmi (hər oyunda qarışıq).
      keys: Game.rand.shuffle(Game.ROMAN),
      phantom: Game.suspects.pickPhantom(),
      codes: {},
      stats: { wrong: 0, hints: 0, elapsed: 0 },
      over: false
    };
    Game.puzzles.generateAll(s);
    return s;
  };

  Game.diff = function () {
    return Game.DIFF[(Game.state && Game.state.diff) || 'm'];
  };

  Game.addScore = function (n) {
    var s = Game.state;
    s.score = Math.max(0, s.score + n);
  };
})(window.Game = window.Game || {});
