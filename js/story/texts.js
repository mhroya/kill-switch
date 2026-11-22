/* js/story/texts.js — oyundakı mətnlərin əksəriyyəti bir yerdə (redaktə asan olsun deyə).
   Dəyişən hissəsi olan mətnlər funksiya kimi yazılıb: məs. got('Fənər') → "Yeni əşya: Fənər". */
(function (Game) {
  'use strict';

  Game.T = {
    title: 'Kill Switch: Phantom',
    tagline: 'Kiber tapmaca otağı',

    menu: {
      newGame: 'Yeni oyun',
      cont: 'Davam et',
      contInfo: function (room, time) { return 'Saxlanmış oyun: ' + room + ', qalan vaxt ' + time; },
      chooseDiff: 'Çətinlik seç',
      diffs: {
        e: { name: 'Asan', info: '90 dəqiqə · hint −25 xal' },
        m: { name: 'Orta', info: '60 dəqiqə · hint −50 xal' },
        h: { name: 'Çətin', info: '40 dəqiqə · hint −75 xal' }
      },
      back: 'Geri',
      rules: 'Qaydalar',
      rulesText:
        'Otaqdakı əşyalara klik et: ipucları oradadır. Tapdığın əşyalar aşağıdakı çantaya düşür.\n' +
        'Əşyanı seçib otaqdakı obyektə klik etsən, onu orada istifadə edərsən. Çantada iki əşyanı birləşdirmək də olar.\n\n' +
        'Xal: başlanğıc 1000, düzgün cavab +100, yanlış −20, hər hint çətinliyə görə −25 / −50 / −75.\n' +
        'Hər tapmacanın 2 hint-i var: birincisi istiqamət göstərir, ikincisi cavaba çox yaxındır.\n\n' +
        'İz sayğacı: yanlış cavablar və təsadüfi təxminlər Phantom-a səni izləməyə kömək edir. 100% olsa, uduzursan.\n' +
        'Vaxt bitsə də uduzursan. İzah pəncərələri, "Bilirdinmi?" kartları və kat-səhnələr açıq olanda vaxt dayanır.\n\n' +
        'Kiberdən heç nə bilməsən də olar: lazım olan hər şey oyunun içindədir. "?" düyməsi termini sadə dillə izah edir.',
      saveNote: 'Gedişat bu brauzerdə avtomatik saxlanılır.',
      debugOn: 'Debug rejimi açıqdır'
    },

    intro: {
      title: 'Gecə növbəsi, 23:47',
      text:
        'Sən şirkətin yeni SOC analitikisən. İlk gecə növbəndə ekranlar birdən qaralır.\n\n' +
        'Bütün monitorlarda eyni mesaj: "Salam, yeni analitik. Mən Phantom. Sistemləriniz artıq mənimdir. ' +
        'Vaxt bitəndə bütün məlumatlarınız silinəcək. Amma oyunu sevirəm: hər qapını bir tapmaca ilə kilidlədim."\n\n' +
        'Phantom şirkətin içindən kimdir — 4 əməkdaşdan biri. Onu dayandırmağın yolu kill switch-dir: ' +
        '4 hissəyə bölünmüş açar. Hər otaqda bir parça var.\n\n' +
        'Sübutları topla, açarı birləşdir və Phantom-un kim olduğunu tap.',
      start: 'Başla'
    },

    hud: {
      time: 'Vaxt',
      score: 'Xal',
      trace: 'İz',
      paused: ' (dayanıb)',
      map: 'Xəritə',
      evidence: 'Sübutlar',
      menu: 'Menyu',
      sfx: 'Səs',
      music: 'Musiqi',
      on: 'açıq',
      off: 'bağlı'
    },

    pause: {
      title: 'Menyu',
      text: 'Gedişat avtomatik saxlanılır. Menyu açıq olanda vaxt getməyə davam edir.',
      resume: 'Oyuna qayıt',
      rules: 'Qaydalar',
      toMenu: 'Saxla və əsas menyuya çıx',
      restart: 'Yeni oyun başlat',
      restartConfirm: 'Cari gedişat silinəcək. Əminsən?',
      yes: 'Bəli, yeni oyun',
      no: 'Xeyr'
    },

    ui: {
      close: 'Bağla',
      ok: 'Oldu',
      didYouKnow: 'Bilirdinmi?',
      whatIs: function (t) { return t + ' nədir?'; }
    },

    puzzle: {
      check: 'Yoxla',
      answerLabel: 'Cavab',
      answerPlaceholder: 'Cavabı yaz...',
      wrong: function (n) { return 'Yanlışdır. −' + n + ' xal, iz sayğacı artdı.'; },
      hintBtn: function (lvl, cost) { return 'İpucu ' + lvl + ' (−' + cost + ' xal)'; },
      alreadySolved: 'Bu tapmaca artıq həll olunub.'
    },

    inv: {
      title: 'Çanta',
      bag: function (n) { return 'Çanta (' + n + ')'; },
      empty: 'Çanta boşdur.',
      got: function (n) { return 'Yeni əşya: ' + n; },
      holding: function (n) { return 'Əlində: ' + n + ' — obyektə klik et'; },
      use: 'Əlimə götür',
      look: 'Diqqətlə bax',
      combine: 'Birləşdir...',
      pickSecond: function (n) { return n + ' ilə birləşdirmək üçün ikinci əşyanı seç.'; },
      noCombo: 'Bu iki əşya birləşmir.',
      noUse: function (n) { return n + ' burada işə yaramır.'; }
    },

    ev: {
      title: 'Sübutlar',
      intro: 'Phantom bu 4 əməkdaşdan biridir. Topladığın ipucları aşağıdadır.',
      empty: 'Hələ sübut tapılmayıb.',
      got: function (t) { return 'Yeni sübut: ' + t; }
    },

    map: {
      title: 'Xəritə',
      act: function (n) { return 'Akt ' + n; },
      final: 'Final',
      here: 'buradasan',
      done: 'tamamlandı',
      open: 'açıq',
      locked: 'kilidli',
      unlocked: function (n) { return 'Yeni məkan açıldı: ' + n; },
      actDone: function (n) { return 'Akt ' + n + ' tamamlandı'; },
      actDoneText: function (numeral, bonus, next) {
        return 'Kill switch açarının bir parçasını tapdın: üzərində "' + numeral + '" yazılıb.\n\n' +
          'İz sayğacı ' + bonus + '% azaldı.\nYeni məkan açıldı: ' + next + '.';
      },
      openMap: 'Xəritəni aç'
    },

    rooms: {
      office: 'Hacklənmiş ofis',
      server: 'Server otağı',
      machine: 'Phantom-un maşını',
      c2: 'C2 server',
      final: 'Kill switch'
    },

    items: {
      keyName: function (n) { return 'Açar parçası ' + n; },
      keyDesc: function (n) {
        return 'Kill switch açarının bir hissəsi. Üzərində Roma rəqəmi var: ' + n + '.\n' +
          'Finalda 4 parçanı bu rəqəmlərin sırası ilə birləşdirmək lazımdır.';
      }
    },

    end: {
      'lose-time': {
        title: 'Vaxt bitdi',
        text: 'Ekranlarda geri sayım sıfıra çatdı. Phantom bütün məlumatları sildi və iz qoymadan yox oldu.'
      },
      'lose-trace': {
        title: 'Phantom səni tapdı',
        text: 'İz sayğacı 100%-ə çatdı. Phantom hər addımını izləyirdi və sistemləri sildi.'
      },
      good: {
        title: 'Sistem xilas oldu, amma Phantom qaçdı',
        text: 'Kill switch işə düşdü və məlumatlar xilas oldu. Amma Phantom-un kim olduğunu düzgün tapa bilmədin.'
      },
      best: {
        title: 'Phantom tutuldu',
        text: 'Kill switch işə düşdü, məlumatlar xilas oldu və Phantom-un kim olduğunu sübutlarla tapdın.'
      },
      stats: 'Statistika',
      score: 'Xal',
      time: 'Sərf olunan vaxt',
      diff: 'Çətinlik',
      hints: 'Alınan hint',
      wrong: 'Səhv cavab',
      phantom: 'Phantom əslində',
      again: 'Yenidən başla',
      toMenu: 'Əsas menyu'
    },

    // "?" izahları: [başlıq, 1–2 cümləlik sadə izah].
    glossary: {
      soc: ['SOC', 'Təhlükəsizlik əməliyyatları mərkəzi: şirkətin kompüter sistemlərini izləyib hücumları vaxtında görən komanda.'],
      trace: ['İz sayğacı', 'Phantom-un səni nə qədər izlədiyini göstərir. Yanlış cavablar onu artırır, 100% olsa uduzursan. Hər otağı bitirəndə bir az azalır.'],
      killswitch: ['Kill switch', 'Təcili söndürmə açarı: bir hərəkətlə zərərli sistemi tam dayandırır.'],
      phishing: ['Phishing', 'Saxta məktub və ya saytla insanı aldadıb parolunu, kart məlumatını ələ keçirmək cəhdi.'],
      ip: ['IP ünvanı', 'Şəbəkədəki hər cihazın nömrəsi, məsələn 192.168.1.10. Poçt ünvanı kimi, məlumatın hara gedəcəyini göstərir.'],
      log: ['Log (jurnal)', 'Sistemin baş verən hadisələri — giriş cəhdlərini, xətaları — vaxtı ilə yazdığı qeydlər.'],
      base64: ['Base64', 'Mətni yalnız hərf, rəqəm və + / = işarələri ilə yazmaq üsulu. Şifrələmə deyil: hər kəs onu geri çevirə bilər.'],
      osint: ['OSINT', 'Açıq mənbələrdən — sosial şəbəkələrdən, saytlardan — məlumat toplamaq.'],
      process: ['Proses', 'Kompüterdə hazırda işləyən proqram. Tapşırıq meneceri bütün prosesləri göstərir.'],
      c2: ['C2 server', 'Hackerin ələ keçirdiyi kompüterlərə əmr göndərdiyi idarəetmə serveri.'],
      password: ['Güclü parol', 'Uzun, təxmin edilməsi çətin parol: böyük və kiçik hərflər, rəqəmlər, işarələr. Ad və doğum ili kimi şəxsi məlumat olmamalıdır.']
    },

    // MÜVƏQQƏTİ: Mərhələ 1 test otaqlarının mətnləri (aktlar yazıldıqca silinəcək).
    test: {
      label: 'test otağı',
      lock: 'Test kilidi',
      clue: 'Test sübutu',
      clueShort: 'qeyd',
      clueText: 'Bu, Sübutlar panelini yoxlamaq üçün test qeydidir.',
      evTitle: function (room) { return 'Test sübutu: ' + room; },
      evText: 'Mərhələ 1 üçün nümunə sübut.',
      factObj: 'Bilirdinmi?',
      fact: 'Bakı UTC+4 saat qurşağındadır.',
      puzzleTitle: 'Test tapmacası',
      puzzlePrompt: function (a, b) { return 'Mühərriki yoxlamaq üçün sadə sual: ' + a + ' + ' + b + ' = ?'; },
      hint1: 'Bu, toplama əməlidir.',
      hint2: function (a) { return 'Birinci ədəd ' + a + '-dir. İkincini ona əlavə et.'; },
      box: 'Test qutusu',
      boxText: 'Qutuda fənər və boş kağız var.',
      dark: 'Qaranlıq künc',
      darkNeed: 'Çox qaranlıqdır, heç nə görünmür. İşıq lazımdır.',
      darkLit: 'Fənərin işığında divarda yazı görünür: "Sübut: test 2".',
      lamp: 'Fənər (test)',
      lampDesc: 'Adi fənər. Qaranlıq yerlərdə işə yarayar.',
      paper: 'Boş kağız (test)',
      paperDesc: 'Boş görünür. Bəlkə nə iləsə birləşdirmək olar?',
      lit: 'İşıqlı kağız (test)',
      litDesc: 'Fənər + kağız birləşməsi: kağızda gizli yazı göründü — "birləşdirmə işləyir".',
      killswitch: 'Kill switch',
      needKeys: function (n) { return 'Kill switch üçün 4 açar parçası lazımdır. Səndə ' + n + ' parça var.'; },
      finalTitle: 'Final (test)',
      finalText: 'Əsl final Mərhələ 6-da yazılacaq. Sonluqları yoxlamaq üçün Phantom-u seç:'
    }
  };

  // Otaq adları texts-dən gəlir: Game.T.rooms.
})(window.Game = window.Game || {});
