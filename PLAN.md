# Kill Switch: Phantom — layihə planı

> Bu fayl layihənin əsas sənədidir. Claude Code hər sessiyanın əvvəlində bu faylı oxuyur,
> mərhələ bitdikcə aşağıdakı "İş mərhələləri" bölməsində `[ ]` işarəsini `[x]` edir.

## 1. Ümumi baxış

Multimedia texnologiyaları fənni üçün brauzerdə işləyən **tapmaca / escape room oyunu**.
Köhnə versiya (5 mərhələli tək otaq) `legacy/` qovluğunda saxlanılır; yeni versiya ondan çox böyükdür.

**Hədəf oyunçu:** universitet tələbəsi, kiberdən **heç nə bilməyə bilər**.
Qızıl qayda: **kiberdən heç nə bilməyən biri də hər tapmacanı oyundakı ipucları və alətlərlə həll edə bilməlidir.**

**Tapmacaların bölgüsü (təxminən):**
- 25% — sadə, başlanğıc səviyyəli kibertəhlükəsizlik
- 30% — ümumi IT (say sistemləri, rənglər, məntiq sxemləri, kompüter tarixi)
- 45% — dünyagörüşü, elm, coğrafiya, musiqi, məntiq, həyat

**Dil:** bütün interfeys və mətnlər Azərbaycan dilində (ə, ö, ü, ğ, ş, ç, ı düzgün yazılmalıdır).

## 2. Hekayə

Oyunçu şirkətin yeni SOC analitikidir. "**Phantom**" ləqəbli hacker şirkətin sistemlərini ələ keçirib
və vaxt bitəndə bütün məlumatları siləcək. Phantom adi hacker deyil — **tapmaca ustasıdır**: hər qapını öz
zövqünə görə (tarix, elm, coğrafiya, musiqi, məntiq) kilidləyib və oyunçunu ələ salır.

Oyunçu 4 məkandan keçir, hər məkanda **kill switch açarının bir parçasını** (4 parça) tapır.
Sonda Phantom ilə canlı "döyüş" və **detektiv sualı**: Phantom şirkətin 4 əməkdaşından hansıdır?

### Şübhəlilər (uydurma şəxslər)
| Ad | Vəzifə | Qeyd |
|---|---|---|
| Leyla Həsənova | Dizayner | |
| Murad Əliyev | Sistem administratoru | |
| Nigar Quliyeva | Mühasib | |
| Tural Məmmədov | Stajor | |

- Phantom-un kim olduğunu **Claude Code seçir** və bütün ipuclarını ona uyğun qurur (alibi, loglardakı vaxt,
  OSINT profili, gündəlik, ofisdəki əşyalar). Ən aşkar şübhəli (məs. sistem admini) **Phantom olmamalıdır** — bu, yalançı izdir.
- Hər aktda ən azı 1 detektiv ipucu olmalıdır. Final sualında oyunçu cavabını yalnız toplanmış ipucları ilə məntiqi yolla çıxara bilməlidir.
- Toplanmış ipucları "**Sübutlar**" panelində görünür.

### Sonluqlar (3 ədəd)
1. **Uduzma:** vaxt bitir və ya iz sayğacı 100% olur → məlumatlar silinir.
2. **Yaxşı son:** kill switch aktivləşdi, sistem xilas oldu, amma Phantom yanlış seçildi (və ya seçilmədi) → "Phantom qaçdı".
3. **Ən yaxşı son:** kill switch + Phantom düzgün tapıldı → "Phantom tutuldu".

## 3. Oyun dünyası və tapmacalar

Hər akt bir otaqdır (SVG səhnə, kliklənən əşyalar). Otaqlar arasında **xəritə** ilə keçid olur; növbəti otaq
əvvəlki akt bitəndə (və ya lazımi əşya ilə) açılır.

Kodlar mümkün olduqca **hər oyunda təsadüfi** generasiya olunsun (köhnə versiyadakı kimi), sabit faktlara əsaslanan
tapmacalar istisnadır.

### Akt 1 — Hacklənmiş ofis
- **[Kiber] Sezar şifrəsi — 32 hərfli Azərbaycan əlifbası** ilə (A B C Ç D E Ə F G Ğ H X I İ J K Q L M N O Ö P R S Ş T U Ü V Y Z).
  Ekranda **fırladılan şifrə diski** aləti var, oyunçu diski çevirib sözü oxuyur. Açar (sürüşmə) otaqdakı başqa əşyadadır.
- **[Kiber] Saxta e-poçt:** 3 məktubdan hansı phishing-dir? Əlamətlər: səhv ünvan (`paypa1.com` kimi), "TƏCİLİ!",
  şübhəli link, qrammatik səhvlər. Düzgün seçəndə qısa izah.
- **[Kiber] Ən güclü parol:** 4 variantdan seç (məs. `123456`, `Roya2007`, `qwerty`, `T!g3r-Bulud-92`).
- **[Dünyagörüşü] Dünya saatları:** divarda 4 saat — Bakı, London, Tokio, Nyu-York. **Qış vaxtı** sabit fərqlərlə işlə:
  Bakı UTC+4, London UTC+0, Tokio UTC+9, Nyu-York UTC−5. Məs.: "Bakıda 12:00 olanda digər şəhərlərdə saat neçədir?"
  Nəticədəki rəqəmlər PIN kodu yaradır. Oyunda "qış vaxtı" olduğunu açıq yaz.
- **[Məntiq] Kitab şifrəsi:** rəfdə "Phantom-un gündəliyi" (mətni Claude Code özü yazır — real kitabdan sitat yox).
  Kağızda `səhifə-sətir-söz` nömrələri → söz.
- **[IT] Rəng kodları:** `#FF0000` qırmızı, `#00FF00` yaşıl, `#0000FF` göy kimi HEX kodlar; rənglərin adlarından/baş hərflərindən söz və ya rəqəm çıxır.
- Tapılanlar: **açar kart** (server otağına keçid), açar parçası №1, detektiv ipucu.

### Akt 2 — Server otağı
- **[Kiber] Log tapmacası:** 10–12 sətirlik giriş jurnalı; ən çox `FAIL` yazılan IP hücumçudur. "FAIL-ləri göstər" filtr düyməsi var.
- **[IT] Morze əlifbası:** server LED-i Morze ilə yanıb-sönür (həm görüntü, həm səs). Ekranda Morze cədvəli aləti var.
- **[IT] Məntiq sxemi:** AND / OR / NOT qapılarından ibarət sxem; oyunçu girişləri (0/1) elə seçir ki, çıxış 1 olsun və qapı açılsın.
- **[Tarix] Sual-kilid:** "İlk kompüter 'bug'-u nə idi?" — 1947-ci ildə Harvard Mark II kompüterində tapılan **güvə** (Grace Hopper-in komandası).
- **Hadisə:** işıq sönür → inventardakı **fənər** ilə otağı işıqlandırmaq lazımdır (fənər Akt 1-də və ya burada tapılır).
- Tapılanlar: açar parçası №2, detektiv ipucu (məs. log vaxtları alibi ilə uyğun gəlmir).

### Akt 3 — Phantom-un maşını
- **[Kiber] Sadə terminal:** cəmi bir neçə əmr — `help`, `ls`, `ls -a` (gizli fayllar), `cat <fayl>`, `clear`, `unlock <kod>`.
  Yazmaq istəməyənlər üçün **kliklənən əmr düymələri** var. Kiçik səhvlərə dözümlü ol (böyük/kiçik hərf, artıq boşluq).
  Gizli faylda (`.qeyd.txt` kimi) ipucu var.
- **[Kiber] OSINT:** Phantom-un uydurma sosial şəbəkə profili (ev heyvanının adı, doğum ili, sevimli komanda).
  Parol bunlardan yığılıb (məs. `Pişik adı + il`). Dərs: parolda şəxsi məlumat istifadə etmə.
- **[Kiber] Zibil qutusu:** silinmiş faylı "Bərpa et" düyməsi ilə qaytar, içində ipucu.
- **[Elm] Kimyəvi elementlər:** atom nömrələri → simvollar → söz. Nümunə (yoxlanılıb): **56-19-92 → Ba-K-U → "BAKU"**.
  Başqa söz istifadə etsən, hər nömrəni dövri cədvəllə yoxla. Ekranda sadə dövri cədvəl aləti olsun.
- **[Riyaziyyat] Seyf:** Fibonacci (`1 1 2 3 5 8 ?` → 13) və ya sadə ədədlər ardıcıllığı.
- **UV fənəri + poster** kombinasiyası: inventarda iki əşyanı birləşdir → posterdə gizli yazı görünür.
- Tapılanlar: açar parçası №3, detektiv ipucu (OSINT profili Phantom-a işarə edir).

### Akt 4 — C2 server (Phantom-un idarəetmə paneli)
- **[Kiber] Standart parol:** panel `admin` / `admin` ilə açılır. Dərs: standart parolları həmişə dəyiş.
- **[Kiber] Base64:** şifrəli mesaj; oyunda **hazır Base64 çevirici** aləti var.
- **[Coğrafiya] Koordinatlar:** məs. `40.41° N, 49.87° E` → **Bakı**. Şəhəri xəritədən seç və ya adını yaz.
  Başqa şəhərlər istifadə etsən, koordinatları yoxla.
- **[Musiqi] Notlar:** A–G not hərflərindən söz (məs. `CAFE`, `FACE`, `BADGE`, `CABBAGE`). Melodiya səslənir,
  oyunçu onu pianoda təkrarlayır (Simon oyunu kimi, Web Audio ilə).
- **[Tarix] Sual-kilid:** "İlk e-poçt hansı ildə göndərilib?" — **1971**, Ray Tomlinson (`@` simvolunu da o seçib).
- Tapılanlar: açar parçası №4, son detektiv ipucu.

### Final — Kill switch
- **Tapşırıq meneceri:** Windows-dakı kimi proseslər siyahısı; şübhəli prosesi tap (məs. `svch0st.exe` — sıfır ilə, 99% CPU)
  və "Dayandır" düyməsini bas. Yanlış (vacib sistem) prosesi dayandırmaq cərimədir.
- 4 açar parçasını düzgün ardıcıllıqla birləşdir → kill switch.
- Bu zaman Phantom "canlı" müqavimət göstərir (əks-hücumlar tezləşir, qısa geri sayım).
- **Detektiv sualı:** "Phantom kimdir?" — 4 şübhəlidən birini seç (Sübutlar panelinə baxaraq).
- Sonra müvafiq sonluq kat-səhnəsi və **"Nə öyrəndin?"** ekranı.

## 4. Mexanikalar

- **İnventar:** əşyaları topla, üzərinə klik edib bax, iki əşyanı birləşdir (məs. UV lampa + poster). Bəzi qapılar yalnız əşya ilə açılır.
- **Xəritə:** açılmış otaqlar arasında keçid.
- **Vaxt limiti** (ümumi oyun üçün): Asan 60 dəq, Orta 45 dəq, Çətin 30 dəq.
- **İz sayğacı (0–100%):** yanlış cavablar, təsadüfi təxminlər, phishing-ə klikləmək sayğacı artırır. 100% → uduzma.
  Hər akt bitəndə bir az azalır.
- **Xal sistemi:** başlanğıc 1000; düzgün tapmaca +100; yanlış −20; hint çətinliyə görə −25/−50/−75. Sonda rütbə.
- **Hint sistemi:** hər tapmaca üçün 2 pilləli hint (1-ci yumşaq istiqamət, 2-ci demək olar cavab).
- **Hacker əks-hücumları** (təsadüfi, çətinliyə görə tezlik):
  - terminal / ekran 10 saniyə kilidlənir (glitch effekti);
  - işıq sönür;
  - **saxta pəncərə** ("Sistem yeniləməsi üçün klik et!") — kliksən iz sayğacı artır; düzgün reaksiya: bağlamaq.
- **Phantom ilə dialoq:** ekranın küncündə çat; Phantom oyunçunun hərəkətlərinə reaksiya verir
  (yavaş olanda ələ salır, düz yoldasansa əsəbiləşir, yalançı ipucu atır). Mesajlar hekayəyə uyğun və təhlükəsiz olsun.
- **Yalançı ipucları:** hər otaqda 1–2 ədəd.
- **"?" izahları:** hər kiber terminin (phishing, OSINT, Base64, log, IP, proses...) yanında **?** — klikləyəndə 1–2 cümləlik sadə izah.
- **"Bilirdinmi?" kartları:** hər tapmacadan sonra qısa maraqlı fakt (bax: bölmə 6).
- **"Nə öyrəndin?" ekranı:** sonda 5–6 sadə təhlükəsizlik qaydası + statistika (vaxt, xal, hint sayı, səhv sayı, sonluq).
- **Yadda saxlama:** gedişat `localStorage`-da (try/catch ilə); "Davam et" / "Yeni oyun".
- **Uğurlar (achievements):** "İpucusuz", "Səhvsiz", "Sürətli", "Detektiv", "Phishing ovçusu" və s.
- **Yerli liderlər cədvəli** (`localStorage`).

## 5. Multimedia

- **Musiqi:** Web Audio API ilə proqram vasitəsilə yaradılan elektron fon musiqisi (fayl yox); vaxt azaldıqca tempi/gərginliyi artır.
- **Səs effektləri:** klik, uğur, xəta, alarm, yazı maşını, Morze siqnalı, piano notları — hamısı Web Audio ilə.
- **Səs düyməsi** (musiqi və effektlər ayrıca söndürülə bilsin).
- **Vizual:** CRT ekran effekti (scanline), glitch animasiyaları, Matrix yağışı (köhnə versiyadan), otaq keçidlərində animasiya.
- **Phantom "video zəngi":** canvas ilə çəkilmiş glitch-li, üzü görünməyən avatar; mətni yazı maşını effekti ilə.
- **Kat-səhnələr:** giriş (hekayə), hər akt arası qısa keçid, 3 sonluq — yazı maşını effekti + səs.
- Hamısı **orijinal** olmalıdır: real film, oyun, brend loqosu və ya personajı təqlid etmə.

## 6. "Bilirdinmi?" — yoxlanılmış faktlar

Yalnız dəqiq bildiyin faktları yaz. Əmin olmadığın faktı yazma. Yoxlanılmış nümunələr:
- Yuli Sezar məktublarında hərfləri 3 mövqe sürüşdürürdü.
- İlk kompüter "bug"-u: 1947, Harvard Mark II-də tapılan güvə; jurnala yapışdırılıb.
- İlk e-poçt: 1971, Ray Tomlinson; `@` simvolunu o seçib.
- Ada Lovelace 1843-cü ildə Analitik maşın üçün ilk alqoritmi yazıb — ilk proqramçı sayılır.
- Enigma şifrəsini polyak riyaziyyatçıların işinə əsaslanaraq Bletchley Park-da Alan Turinq və komandası qırıb.
- Morze əlifbası 1830–40-cı illərdə Samuel Morze və Alfred Veyl tərəfindən yaradılıb; SOS = `··· ––– ···`.
- `123456` illərdir dünyada ən çox istifadə olunan parollardan biridir.
- Phishing hücumlarında ən çox istifadə olunan hiylə — tələsdirmək ("TƏCİLİ!", "hesabınız bağlanacaq").
- Bakı UTC+4 saat qurşağındadır.

## 7. Texniki tələblər

- Yalnız HTML + CSS + **sadə JavaScript**; xarici kitabxana, framework, build alət **yoxdur**.
- **ES modules (`import/export`) İŞLƏTMƏ** — oyun `index.html` faylına iki dəfə klikləyəndə (`file://`) açılmalıdır.
  Adi `<script src>` teqləri və bir global `Game` obyekti istifadə et.
- Qovluq strukturu (təxmini):
  ```
  index.html
  css/style.css
  js/core/      (state.js, save.js, timer.js, trace.js, events.js)
  js/ui/        (hud.js, inventory.js, map.js, dialog.js, popup.js, tools.js)
  js/audio/     (music.js, sfx.js)
  js/terminal/  (terminal.js)
  js/rooms/     (act1.js, act2.js, act3.js, act4.js, final.js)
  js/story/     (texts.js, suspects.js, endings.js, facts.js)
  js/main.js
  assets/       (SVG şəkillər, lazım olsa)
  legacy/       (köhnə versiya)
  ```
- Bütün mətnlər mümkün qədər `js/story/texts.js`-də toplansın (sonra redaktə asan olsun).
- **Debug rejimi:** `index.html?debug=1` — istənilən akta keçmək, cavabları göstərmək (test və sinifdə təqdimat üçün).
- Mobil və kiçik ekranda da oynana bilsin (minimum 360px en); klaviatura ilə də istifadə olunsun.
- Kod səliqəli, şərhlər Azərbaycan dilində.

## 8. İş mərhələləri

Hər mərhələdən sonra: **dayan**, nə etdiyini qısa yaz, mənə nəyi yoxlamalı olduğumu de, commit et
(Azərbaycanca mesajla) və mən "davam" yazana qədər gözlə. Bitən mərhələni burada `[x]` et.

- [ ] **0. Hazırlıq** — köhnə `index.html`-i `legacy/index.html`-ə köçür; `CLAUDE.md`-ni yeni struktura uyğun yenilə
      (tək fayl qaydasını sil, bu PLAN.md-yə istinad əlavə et); qovluq strukturunu yarat.
- [ ] **1. Mühərrik** — state, save/load, timer, iz sayğacı, xal, HUD, otaq sistemi, xəritə, inventar, popup-lar,
      çətinlik seçimi, giriş ekranı, debug rejimi. Test üçün boş otaqlarla.
- [ ] **2. Akt 1** — ofis otağı və bütün tapmacaları + şifrə diski aləti.
- [ ] **3. Akt 2** — server otağı, log filtri, Morze, məntiq sxemi, işıq sönməsi + fənər.
- [ ] **4. Akt 3** — terminal, OSINT profili, zibil qutusu, elementlər, seyf, UV kombinasiyası.
- [ ] **5. Akt 4** — C2 panel, Base64 aləti, koordinatlar, piano/notlar, tarix sualı.
- [ ] **6. Final** — tapşırıq meneceri, açar birləşdirmə, detektiv sualı, 3 sonluq, "Nə öyrəndin?", liderlər cədvəli, uğurlar.
- [ ] **7. Multimedia** — musiqi, səs effektləri, CRT/glitch, Phantom video zəngi, kat-səhnələr, əks-hücumlar, Phantom çatı.
- [ ] **8. Yoxlama və balans** — oyunu əvvəldən sona debug rejimi olmadan keç; hər tapmacanın həll oluna bildiyini,
      hint-lərin işlədiyini, Azərbaycan hərflərini, mobil görünüşü yoxla; çətinliyi balansla; README-ni yenilə.

## 9. Hazır sayılma meyarları

- Oyunu kiber bilikləri olmayan biri ipucları ilə sona qədər keçə bilir.
- Konsolda xəta yoxdur.
- `index.html` iki dəfə kliklə açılır, internet tələb etmir.
- 3 sonluğun hamısına çatmaq mümkündür.
- Bütün mətnlər Azərbaycan dilindədir və hərflər düzgündür.
