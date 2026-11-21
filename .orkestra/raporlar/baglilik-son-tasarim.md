# Puhu Koç: son bağlılık şartnamesi (davranış bilimci, 3. tur)

## 0. İki eleştiriye yanıt

Satır numaralarını bu turda yeniden kontrol ettim (f:/lichess/index.html). İki eleştirmen de haklı: `RANKS` 606, `GOALS` 607, `addStar` 612, `streak()` 617, "Bugünlük bitti! Serbest bulmaca çöz" düğmesi 638. TTS puanlaması 571. satırda (`/natural/i` → 3, `/google/i` → 2); çocuk refahı eleştirisi 570 demişti, bir satır kaymış. Önceki önerimdeki numaralar bayattı.

### Çocuk refahı eleştirisi

**Haklı olduğu yerler (kabul ediyorum):**
1. **Ardışık gün sayacı kendi hedefimle çelişiyordu.** Hedefi "haftada 4-5 gün" koyup 7 günü ödüllendiren bir sayaç önermiştim. Ardışık gün sayacını kaldırıp yerine **haftalık hedef** koyuyorum: "bu hafta 3/4 gün". Duolingo'nun kendi blogu kayıp kaçınmasını seriyi besleyen güdü olarak anıyor. 10 yaşında bir çocukta bunu bilerek kullanmak, ICO'nun "bilinçdışı süreçleri istismar etme" cümlesine ters düşer.
2. **Kazanılan, biriken dondurma sanal bir varlık oluyordu.** Bunu kaldırıyorum. Haftalık hedefle birlikte dinlenme günleri kendiliğinden tanımlanmış oluyor (haftada 4 gün hedefi = 3 dinlenme günü). Sayılmaz, kazanılmaz, kaybedilmez.
3. **Kilometre taşları gün sayısına bağlıydı.** Ustalık eşiklerine taşıyorum.
4. **Puhu'yla kurulan duygusal bağ, dönüş tetiği olarak kullanılmamalı.** "Seni bekliyor" ve "özledi" yasak. Puhu'nun hafızası yalnız içeriği hatırlatır.
5. **Sürpriz soru ve "değişken ödül".** Hook modelini çocuğa uygularken fazla rahat davrandım. Bu bölüm her zaman açık bir "ünlü motif köşesi" oluyor; rastgele belirme yok.
6. **Hatırlatma varsayılan olarak kapalı olmalı ve veli açmalı.** Kabul.
7. **Takım ve kulüp şimdilik çıkıyor.** Kabul.
8. **Bulut TTS'i hiç görmemiştim.** Yerinde bir tespit. Yalnız cihazda çalışan ses (`localService`) varsayılan oluyor.
9. **CURR ve D1/D7 hedef değil, yan gösterge.** Kabul. Her deney bir refah karşı-metriğine ve bir durdurma kuralına bağlanıyor.
10. **ICO 13'ü yanlış aktardım.** Standardın başlığı veri ve gizlilikle ilgili. Puhu için geçerli olan dayanak, aynı sayfadaki "exploit unconscious psychological processes / human affirmation needs" ifadesi ve 0-12 yaş için "taking breaks" önerisi.

**Kısmen katılmadığım yer:** Haftalık hedef de bir hedeftir. Kaçırılınca baskı yaratabilir. Bu yüzden kaçırılan hafta hiç işaretlenmiyor, yeni hafta temiz başlıyor ve geçmiş haftalar "kırık" gösterilmiyor.

### Ürün stratejisti eleştirisi

**Haklı olduğu yerler (kabul ediyorum):**
1. **Parayı ödeyen kişi (veli, koç) merkezde değildi.** Veli kartı, ürün sürümünde ilk sıraya çıkıyor.
2. **15 mekanik fazla.** Çekirdeği 4 mekaniğe indiriyorum: kolay haftalık hedef, sağlıklı durak, kendi oyunundan yeni ders, veli raporu.
3. **Kuzey yıldızı yavaş sinyal veriyor.** Öncü gösterge haftalık aktif gün olacak. Bunu yalnız izleyeceğiz, optimize etmeyeceğiz.
4. **Tehdit dedektörü pahalı.** Asm.js Stockfish ile hamle başına iki değerlendirme telefonda yavaş çalışır. MVP'de ucuz sezgiyi kullanıyoruz: Lichess'in kendi analizinde işaretlenen blunder'lar ile "bir sonraki rakip hamlesi taş kazandırıyor mu" kontrolü. Bunun için `evals` ve `judgment` alanlarını spec'te bu turda ben doğrulamadım.
5. **GPL ve Lichess koşulları ürünleşmeyi bloke ediyor.** Bu bağlılık meselesi değil, ama karar listesine girdi.

**Katılmadığım yer:** Koçun sınıfında haftalık "en çok tehdit bulan" sıralaması. Rekabet tanıdık kişilerle sınırlı kalsa bile sıralamanın alt yarısında hep aynı çocuklar olur. Duolingo üzerine yapılan nitel çalışma da zararın başlıca nedeni olarak rekabeti gösteriyor (yetişkin örneklem; yalnız özetini gördüm). B2B tarafında aynı satış kozunu rekabetsiz bir **ortak sınıf hedefi** verir: "Sınıf bu hafta 200 tehdit yakaladı." Koç, kendi panelinde bireysel ilerlemeyi zaten görüyor. Sıralama gerçekten istenirse yalnız **kişisel en iyiye göre gelişim** ile yapılsın.

**Bildirim çatışması (ürün "en büyük kaldıraç" diyor, refah "varsayılan kapalı" diyor):** İkisini şöyle birleştiriyorum. Tetik veliden geçsin. Veli açarsa veliye haftalık rapor ve günlük tek bir hatırlatma gider. Çocuğun cihazına push gönderimi yalnız veli ayrıca açarsa yapılır, günde en fazla 1 kez, yatma saatinden en az 1 saat önce. Sunucusuz aşamada bunun yerine **veli takvimine .ics tekrarlı etkinlik** konur: sıfır altyapı, sıfır veri.

---

## 1. Çocuklar için "sağlıklı bağlılık" ilkeleri

1. **Dönüşün sebebi öğrenme olsun, kaygı değil.** Kayıp korkusu, suçluluk ve "Puhu üzülür" dili yok.
2. **Küçük ve yeterli gün.** 1 pozisyon denemek günü sayar. Doğru yapmak şart değil, çünkü çaba ödüllendirilir, performans değil.
3. **Doğal bitiş.** Uygulama "yeter" der, sonsuz döngü yok. Günlük tavan var. Mola ve uyku saati var.
4. **Bilgi veren geri bildirim, birikmeyen ödül.** Yıldız bir şey satın almaz. En güçlü ödül, "blunder'ın düştü" gibi kanıtlı ustalık cümlesidir (SDT, Deci ve ark. 1999).
5. **Özerklik.** Çocuk planın bir kısmını kendisi seçer. Ritüeller atlanabilir.
6. **İlişkililik tanıdık kişilerle kurulur.** Aile ve koç olur, yabancı olmaz. Maskot sıcak ve meraklıdır, duygusal tetik olarak kullanılmaz.
7. **Değişkenlik ödülde değil içerikte.** Ganimet kutusu ve "gizli ödül" yok. Yenilik, çocuğun kendi yeni oyunlarından gelir.
8. **Tetik veliye aittir.** Hatırlatma varsayılan olarak kapalıdır, veli açar, sessiz saatler vardır.
9. **Veri cihazda kalır.** Yorgunluk algılama, olay günlüğü ve ses varsayılan olarak cihazdadır. Ürün sürümünde toplanan veri en az düzeyde ve veli onaylıdır.
10. **Başarı ölçütü oyun başına hatanın düşmesidir.** Tutma metrikleri yan göstergedir. Oturum süresi bir tavandır, hedef değil.

---

## 2. Önceliklendirilmiş mekanikler

Efor: S = birkaç saat, M = 1-3 gün, L = backend ya da hafta düzeyi.

| # | Mekanik | Çocuğun gördüğü | Öğrenme amacı | Risk ve korkuluk | Efor | Metrik |
|---|---|---|---|---|---|---|
| 1 | **Haftalık "denedim" hedefi** (ardışık serinin yerine) | Ana ekranda 7 küçük daire: "Bu hafta 3/4 gün". 1 pozisyon denemek o günü doldurur. | Leitner vadeleri kaçmaz; aralıklı tekrar sürer. | Kaçırılan hafta işaretlenmez, "kırık seri" ve kırmızı ateş yok. Hedefi veli ayarlar (3-5). | S | Haftalık aktif gün (hedef 3-5; 7 alarm değil ama hedef de değil) |
| 2 | **Sağlıklı durak** | Plan bitince Puhu esner: "Beynin doydu. Evde biriyle tahtada oyna; istersen Lichess'te 1 maç." Günde 30 deneme sonrası yıldız yok, yalnız inceleme. 3 yanlışta 5 dk mola. 21:00 sonrası "Puhu uyuyor". | Dağıtılmış pratik, yorgunken tahmin etmeyi önleme. | Lichess bağlantısı ikinci seçenek ve veli kapısının arkasında. Uyku saatini veli ayarlar. Yorgunluk verisi cihazda kalır. | S | 30 dk'yı aşan oturum oranı, 21:00 sonrası açılış denemesi |
| 3 | **Yeniden dene kalkanı** | Yanlış cevap hiçbir şey götürmez, Puhu ipucu verir. İkinci denemede doğruya yarım yıldız; kart 1. kutuya döner. | Düzeltici geri bildirimle deneme testi. | Yarım yıldız yanlışı ödüllendirmez, yalnız düzeltmeyi ödüllendirir. | S | Yanlıştan sonra oturumu bırakma oranı |
| 4 | **Kendi maçın, Puhu'nun dersi** | Açılışta: "Dünkü 3 maçından 2 yeni ders buldum: senin hatan, senin kartın." | Transfer; çocuk kendi hatasını çalışıyor. Puhu'yu Lichess'ten ayıran şey: oyunlar arası deste. | "Daha çok oyna" denmez. Yalnız gelen oyunlar işlenir. | S-M (altyapı var) | Oyun başına blunder, 28 günlük kayan ortalama (kuzey yıldızı) |
| 5 | **"Rakip ne istiyor?" ritüeli** | Pozisyon açılınca isteğe bağlı bir göz düğmesi. Basınca rakibin tehdit ettiği kare ve taş vurgulanır, Puhu "Gözlerin açık!" der. | Çocuğun asıl zaafı: tehdidi görmemek. Düşünme rutini oluşturuyor. | Atlanabilir; zorunlu tutulursa sıkar. Puhu ilk 2 hafta önerir, sonra susar. | M | Ritüeli kullanma oranı; tehdit avında doğruluk |
| 6 | **Ustalık kutlamaları** (gün sayısına bağlı kutlamaların yerine) | "10 tehdit yakaladın!", "Bu ay blunder'ın maç başına 2,1'den 1,6'ya indi." | Bilgi veren geri bildirim (SDT). | Kazanılan bir şey asla geri alınmaz. Kötüleşme kutlama ekranında gösterilmez, karnede nötr dille yer alır. | S-M | Kutlamadan sonraki 2 haftada aktif gün |
| 7 | **Ustalık haritası** (Şah'ın devamı) | Şah'tan sonra adalar: Çatal Adası, Açmaz Ormanı, Pat Mağarası. Her ada, o konudaki kartların 5. Leitner kutusuna ulaşmasıyla açılır. | Ödül yıldız sayısına değil kalıcı öğrenmeye bağlı; rütbe tavanını kaldırır. | Ada sayısı sabit ve görünür; sonsuz harita yok. | M | 5. kutudaki kart sayısı; 30 gün sonra hatırlama |
| 8 | **Kendi planını seç** | 3 adımdan 2'sini çocuk seçer; Puhu tehdit avını önerir ama zorlamaz. | Özerklik, daha nitelikli katılım. | Yok. | S | Plan tamamlama (ABAB) |
| 9 | **Puhu'nun dil kuralları** | Puhu meraklı ve heyecanlıdır; dünkü motifi hatırlar ("Dünkü fil açmazını bugün de görecek misin?"). | Aralıklı tekrar maskotun ağzından. | "Özledi", "bekliyor", "üzgün" ve ad ya da kullanıcı adı seslendirme yasak. Metin listesi kodda tek yerde tutulur. | S | (kalite kontrolü, metrik yok) |
| 10 | **Yerel ses varsayılanı** | Puhu cihazdaki sesle konuşur. Veli ayarında "daha doğal ses (metin Microsoft'a veya Google'a gider)" seçeneği. | (gizlilik) | Bulut ses yalnız veli onayıyla. | S | — |
| 11 | **Veli kartı ve hatırlatması** | Pazar günü haftalık kart: aktif gün, blunder eğilimi, bu hafta öğrenilen motif. "Beraber 1 bulmaca çözün" görevi. Veli açarsa takvim hatırlatması. | Hesap verebilirlik, açıklayarak öğrenme. | Veli kapısının arkasında. Kartta ad, rating ve kullanıcı adı yok. Çocuk kartın veliye gittiğini bilir. Hatırlatma metninde "seri" ya da "kaçırma" geçmez. | M (sunucusuz) / L (e-posta) | Kartın açılma ve paylaşılma oranı; sonraki haftanın aktif günü |
| 12 | **Ünlü motif köşesi** (sürpriz sorunun yerine) | Her zaman açık bir köşe: çocuğun kendi oyunundaki motife benzeyen ünlü bir pozisyon. | Merak; içerik değişkenliği. | Rastgele belirme, "gizli" etiketi ve süre baskısı yok. | M | Açılma oranı (düşükse çıkar) |
| 13 | **Koç paneli ve ortak sınıf hedefi** | Koçun kurduğu takma adlı sınıf: "Sınıf bu hafta 200 tehdit yakaladı." Serbest metin yok. | İşbirliği. | Sıralama yok, küme düşme yok. Her çocuk için ayrı veli rızası. | L | Koç başına aktif öğrenci; sınıftaki ve tek başına çalışan çocukların aktif günleri |
| — | **Çıkarılanlar** | Ardışık gün sayacı, kazanılan dondurma, lig ve sıralama, ganimet kutusu, rastgele sürpriz, suçluluk dili, çocuk cihazına varsayılan push, sınırsız XP | — | — | — | — |

---

## 3. Bugünkü tek dosyalı, sunucusuz uygulamada ne yapılır, ürün sürümüne ne kalır

### Şimdi (f:/lichess/index.html, localStorage), bu sırayla
1. **`streak()` (617) → `weekGoal()`.**
   - Her denemede `store.gun[today()] = {d: denemeSayısı, k: doğru}` kaydı tutulur.
   - Yıldız (`addStar`, 612) yalnız doğru cevapta artmaya devam eder, ama haftalık hedeften bağımsızdır.
   - Ardışık gün gösterimi kaldırılır.
   - Bu kayıt aynı zamanda olay günlüğünün çekirdeği olur.
   - Efor S.
2. **Satır 638'deki düğme.**
   - "Serbest bulmaca çöz" yerine sağlıklı durak ekranı gelir.
   - Günlük 30 deneme sonrasında yıldız verilmez.
   - 3 yanlışta mola sayacı çalışır.
   - Saat bekçisi devreye girer.
   - Efor S.
3. **Yeniden dene kalkanı.** Yanlıştan sonra ipucu gösterilir, ikinci denemede doğruya yarım yıldız verilir. Efor S.
4. **TTS (571).** Puanlamaya `v.localService ? +10` eklenir; bulut ses veli ayarına bağlanır. Efor S.
5. **Puhu metin listesi.** Yasak sözcükler kod yorumu olarak listelenir. Seslendirilen metinde ad yer almaz. Efor S.
6. **Ustalık kutlamaları ve eğilim cümlesi.** Mevcut oyun analizinden 28 günlük blunder ortalaması hesaplanır ve kutlama yalnız iyileşmede gösterilir. Efor S-M.
7. **"Rakip ne istiyor?" düğmesi.** Mevcut basit tehdit sezgisi kullanılır (satır 344 civarı, açmaz ve x-ray hariç). Efor M.
8. **Ustalık haritası.** `RANKS` (606) sonrasına Leitner 5. kutuya bağlı adalar eklenir. Efor M.
9. **Veli kapısı ve veli kartı.**
   - Basit bir veli kapısı: "veli sorusu" ile çarpma sorusu ve basılı tutma.
   - Karne ekranından paylaşılabilir görsel kart üretilir (`navigator.share` veya indirme).
   - Takvime eklemek için `.ics` dosyası (tekrarlı etkinlik, saati veli seçer).
   - Efor M.
10. **ABAB ölçümü.** Haftalık özet için `gun` kaydı yeterli; karne ekranında gösterilir. Veli bilgilendirilir, çocuğa yaşına uygun dille anlatılır.

### Ürün sürümünde (backend ve hukuk gerektirir)
- Cihazlar arası senkron: tek JSON ilerleme kaydı, anahtar olarak hash'lenmiş Lichess kimliği. Oyun içeriği ve kullanıcı adı loglanmaz. Oyunlar istemcide, kullanıcının kendi token'ıyla çekilir (Lichess API: aynı anda tek istek).
- Veli hesabı, aydınlatma metni, açık rıza, Lichess yaş kuralı onayı. VERBİS ve yurt dışı aktarım için hukukçu görüşü.
- E-posta ile haftalık veli raporu, Web Push (iOS'ta yalnız ana ekrana eklenmiş PWA'da çalışır), VAPID ve zamanlanmış gönderim.
- Koç paneli ve ortak sınıf hedefi (13).
- Toplu ve kimliksiz telemetri. Üçüncü taraf analitik SDK'sı kullanılmaz.
- Tehdit dedektörünün tam motoru (gerekirse WASM Stockfish, arka planda).

---

## 4. Sahibin karar noktaları (her birinde önerim)

| # | Karar | Seçenekler | Önerim |
|---|---|---|---|
| 1 | **Ardışık seri mi, haftalık hedef mi** | Duolingo tarzı seri ya da haftalık "x/4 gün" | **Haftalık hedef.** Biraz tutma kaybı olabilir (Duolingo'daki seri kazançları yetişkin verisi), ama çocuk ürünü ve Avrupa ile Apple yönergeleri bu yönde. Pazarlamada "suçluluk yok" bir ayrışma noktası olur. |
| 2 | **Bildirim kime gider** | Çocuğa push ya da veliye | **Veliye, varsayılan kapalı.** Sunucusuz aşamada .ics, üründe e-posta. Çocuğa push yalnız veli ayrıca açarsa. |
| 3 | **Kuzey yıldızı** | Tutma metrikleri (CURR, D7) ya da oyun başına hata | **Oyun başına blunder ve kaçırılan tehdit.** Aktif gün yan gösterge. Her deneyde durdurma kuralı: 30 dk'yı aşan oturum oranı ya da 21:00 sonrası açılış artarsa deney durur. |
| 4 | **Sınıfta sıralama** | Sıralama, ortak hedef ya da hiçbiri | **Ortak hedef.** Sıralama istenirse yalnız kişisel gelişime göre. |
| 5 | **Lisans** (chessground ve Stockfish GPL) | (a) Açık kaynak kalır, hizmet satılır; (b) MIT lisanslı tahta kütüphanesine geçilir | Ürün stratejistiyle aynı fikirdeyim: **(a)**, hukukçu teyidiyle. Bağlılık tasarımını etkilemez. |
| 6 | **Lichess bağımlılığı ve çocuğun Lichess'te oynaması** | "Lichess'te oyna" çağrısı ya da tahta öncelikli kapanış | **Kapanış ekranında önce "evde tahtada oyna", Lichess ikinci seçenek.** Veli onboarding'inde Lichess yaş kuralı ve kid mode sorulur. Ücretli lansmandan önce Lichess'e yazılı olarak danışılır. |
| 7 | **Ödeme duvarı nereye** | Bağlılık mekanikleri ya da veli ve koç katmanı | **Çocuk tarafındaki her şey ücretsiz.** Ücretli katman veli raporu, senkron ve koç paneli olur. Böylece bağlılık mekanikleri gelir baskısıyla bozulmaz. |
| 8 | **Uygulama mağazası** | Erken mağaza (çocuk kategorisi) ya da web ve PWA | **İlk yıl web ve PWA.** Apple 1.3 (bağlantılar ve paylaşım için ebeveyn kapısı) ve Google Families kuralları, mağazaya geçişte zaten hazır olan veli kapısıyla karşılanır. |
| 9 | **Maskot** | Mevcut Puhu ya da Duo'dan uzaklaştırılmış tasarım | **Kahve ve turuncu, belirgin kulak tüyleri.** Yeşil ve ateş simgesi yok, reklamda "satrancın Duolingo'su" ifadesi yok. Lansmandan önce TÜRKPATENT araması. |
| 10 | **Pilot başarı ölçütü** | — | 8 haftada çocukların çoğunluğu haftada 3+ gün aktif, velilerin yarısından fazlası kartı açıyor, oyun başına blunder eğilimi düşüyor (ilk ay taban alınır), refah alarmı yok. |

---

## 5. Kaynaklar

**Benim önceki turda açıp okuduklarım:**
- https://blog.duolingo.com/how-duolingo-streak-builds-habit/
- https://blog.duolingo.com/improving-the-streak/
- https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/
- https://www.behaviormodel.org/
- https://selfdeterminationtheory.org/theory/
- https://www.nirandfar.com/how-to-manufacture-desire/
- https://www.nirandfar.com/want-to-hook-your-users-drive-them-crazy/
- https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html

**Eleştirmenlerin açıp okuduğu, bu şartnamede dayandıklarım (bu turda yeniden açmadım):**
- ICO 13. standart: https://cy.ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/
- AB DSA md. 28 kılavuzu: https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors ve https://www.hunton.com/privacy-and-cybersecurity-law-blog/european-commission-issues-guidelines-on-the-protection-of-minors
- COPPA SSS: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- Apple 1.3: https://developer.apple.com/app-store/review/guidelines/
- Google Play Families: https://support.google.com/googleplay/android-developer/answer/9893335
- KVKK ve çocuk verisi: https://www.hukukihaber.net/gdpr-ve-kvkk-bakimindan-cocuklarin-kisisel-verilerinin-korunmasi-ve-konuya-iliskin-kurul-kararinin-degerlendirilmesi
- Edge bulut sesleri: https://blogs.windows.com/msedgedev/2019/08/14/cloud-powered-voices-microsoft-edge-chromium/
- Chessground GPL: https://github.com/lichess-org/chessground
- Lichess API spec: https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/lichess-api.yaml
- iOS Web Push: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/

**Yalnız arama özetiyle görülenler (tam metin okunmadı):**
- Deci, Koestner ve Ryan 1999: https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf
- Duolingo ve gamification'ın karanlık yüzü (yetişkin örneklem): https://arxiv.org/abs/2203.16175
- Yancey ve Settles, KDD 2020: https://research.duolingo.com/papers/yancey.kdd20.pdf
- Lichess yaş kuralı (forum alıntısı): https://lichess.org/forum/off-topic-discussion/what-is-the-age-limit-for-kid-mode-and-is-there-a-age-limit-for-posting-forums
- KVKK Kurul kararı 2022/776: https://www.kvkk.gov.tr/Icerik/7572/2022-776

**Bu turda incelenen kod:** f:/lichess/index.html, satır 344 ve 461 (tehdit sezgisi, sözlük), 571 (ses puanı), 606-607 (`RANKS`, `GOALS`), 612 (`addStar`), 617 (`streak`), 638 (plan sonu düğmesi).

**Doğrulanmamış iddialar:**
- Lichess oyun dışa aktarımındaki `evals` ve `judgment` alanlarının MVP'deki tehdit sezgisine yeteceği.
- `.ics` tekrarlı etkinliğin iOS ve Android takvimlerinde sorunsuz içe aktarılacağı.
- Haftalık hedefe geçişin tutmaya etkisi: çocuk verisi yok, ABAB ile ölçülecek.