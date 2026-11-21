# Puhu Koç için bağlılık tasarımı (davranış bilimci görüşü)

## 0. Kısa hüküm
Duolingo'nun işe yarayan çekirdeği karmaşık değil. Günde tek ve küçük bir eylem var, kaybedilmek istenmeyen bir seri var, seriyi koruyan bir "esneklik" var ve iyi ayarlanmış tek bir hatırlatma geliyor. 10 yaşındaki bir çocuğa bunun yarısı uyar. Lig, kayıp korkusu ve sınırsız XP kovalamacası ise satranç öğrenmesini bozar. Puhu'nun ayırt edici gücü, Duolingo'da olmayan bir şey: çocuğun **kendi oyunları**. Bağlılık "uygulamaya dön" diye değil, "Lichess'te oyna, Puhu'ya getir" diye kurulmalı. Ölçülecek asıl şey ekranda geçen süre değil, **oyun başına hata eğiliminin düşmesi**.

## 1. Kodda gördüğüm üç somut sorun (f:/lichess/index.html)
1. **Seri yalnız doğru cevapla sayılıyor.** `streak()` (satır 556-561) yalnız `stars[gün]>0` olan günleri sayıyor. Yıldız ise yalnız doğru cevapta veriliyor (`addStar`, satır 551). Zor bir günde çabalayıp hep yanlış yapan çocuğun serisi bozuluyor. Bu, performansa bağlı ödül oluyor ve tam da yetkinlik duygusunu kıran tasarım. Duolingo aynı hatayı düzeltti: seriyi günlük hedeften ayırdılar ve tek ders seriyi uzatır hale getirdiler. Sonuç D14 tutmada +%3,3, seri tutan yeni öğrencilerde +%19 oldu (https://blog.duolingo.com/improving-the-streak/). **Düzeltme:** seri "bugün en az 1 pozisyon denendi" ile uzasın, yıldız ayrı kalsın.
2. **Plan bitince daha fazlasına itiyor.** "Bugünlük bitti! Serbest bulmaca çöz" düğmesi (satır 577) sağlıklı bir durak yerine sonsuz döngü kuruyor. Aşağıdaki 15. mekaniğe bakın.
3. **Rütbe merdiveninin tavanı var.** Şah 320 yıldızda. Planın tamamı günde yaklaşık 13 yıldız eder, yani üç-dört haftada merdiven bitiyor ve uzun vadeli hedef kalmıyor. Merdiveni yıldızla değil **ustalıkla** uzatmak gerekiyor (8. mekanik).

## 2. Duolingo'nun gerçek mekanikleri (açtığım kaynaklarla)
- **Seri:** 7 günlük seriye ulaşan öğrencinin kursu bitirme olasılığı 3,6 kat. Seri uzatma animasyonu yeni öğrencilerde 7. gün aktifliğini +%1,7 artırmış. Kayıp kaçınması uzun serileri koruma güdüsü olarak açıkça anılıyor. 2→3 gün %50 artış, 200→201 ise %0,5 (https://blog.duolingo.com/how-duolingo-streak-builds-habit/).
- **Seri dondurma:** Aynı anda iki dondurma taşıma izni günlük aktif öğrenciyi +%0,38 artırmış. Gerekçe UPenn/UCLA araştırmasına dayanıyor: biraz "gevşeklik" katı kuraldan daha motive edici (aynı kaynak).
- **Seri ile hedefin ayrılması:** Yukarıda anlatıldı. Bir yıl sonra günlük öğrencilerin yarısından fazlası 7+ günlük seride; önceki yıl bu oran üçte birdi (https://blog.duolingo.com/improving-the-streak/).
- **Ligler:** Lansmandan sonra öğrenme süresi %17 arttı, yüksek bağlılıklı kullanıcı sayısı üçe katlandı, D1/D7 anlamlı biçimde iyileşti. Asıl kuzey yıldızı metrik CURR (mevcut kullanıcının ertesi gün dönme oranı) oldu ve DAU'ya etkisi ikinci en iyi kaldıracın yaklaşık 5 katıydı. İlk denenen gamification (hamle sayacı) tutmada **hiçbir etki** yaratmadı (https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth).
- **Bildirim:** Kural "kanalı koru". Bildirim sayısını artırmak CEO onayı istiyordu. İlk büyük seri kazancı gece gelen "serin bitmek üzere" kurtarıcısı oldu (aynı kaynak). Şablonlar bandit algoritmasıyla seçiliyor. Yeni şablonun etkisi zamanla sönüyor (yenilik etkisi), bu yüzden yakın zamanda gösterilen şablon geri plana atılıyor (https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/). Akademik makale: Yancey & Settles, KDD 2020 (https://research.duolingo.com/papers/yancey.kdd20.pdf). Bu makalenin yalnız künyesini gördüm, içeriğini okumadım.
- **Maskot:** Aynı blog, Duo'nun ısrarının bir meme'e dönüştüğünü ve kullanıcıların bildirimi kaydırıp suçluluk duyduğunu kabul ediyor. **Suçluluk, çocuk için aktarılmayacak kısım.**
- **Karanlık yüz:** Duolingo üzerine nitel bir çalışma, gamification'ın kötüye kullanımının öğrenmeye ve iyi oluşa zarar verdiğini ve başlıca nedenin rekabet olduğunu bildiriyor (https://arxiv.org/abs/2203.16175; yalnız arama özetini gördüm). Bu çalışmanın örneklemi yetişkin; çocuk verisi yok.

## 3. Modeller ve Puhu'ya çevirisi
- **Fogg B=MAP:** Davranış, motivasyon, yetenek ve tetik aynı anda buluştuğunda olur. Biri eksikse davranış olmaz (https://www.behaviormodel.org/). Puhu'da motivasyon hazır (çocuk satranç seviyor), tetik ise yok (sunucu yok, bildirim yok). Yetenek tarafı açık: OAuth girişi ve 13 adımlık plan bir çocuk için uzun. **En ucuz kaldıraç, tetik ve "1 dakikalık" minimum gün.**
- **Hook (tetik, eylem, değişken ödül, yatırım):** (https://www.nirandfar.com/how-to-manufacture-desire/) Ödül türleri Kabile, Av ve Benlik olarak üçe ayrılıyor (https://www.nirandfar.com/want-to-hook-your-users-drive-them-crazy/). Çocuk için yalnız **Benlik** (ustalık, tamamlama) ve kontrollü **Kabile** (aile, kulüp) kullanılmalı. Av türündeki sonsuz kaydırma ve ganimet kutusu çıkarılmalı. "Yatırım" Puhu'da doğal olarak var: her yeni Lichess oyunu, kişisel hata destesini zenginleştiriyor.
- **Öz-belirleme kuramı (SDT):** Özerklik, yetkinlik ve ilişkililik desteklenirse katılım daha gönüllü ve nitelikli olur (https://selfdeterminationtheory.org/theory/). Deci, Koestner ve Ryan'ın 1999 meta-analizi (128 çalışma), katılıma, tamamlamaya ve performansa bağlı somut ödüllerin serbest seçim içsel motivasyonunu düşürdüğünü buldu (d = −0,40 / −0,36 / −0,28) (https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf; özet arama sonucundan). **Sonuç:** Yıldız satın alınabilir bir şeye dönüşmemeli. Yıldız "bilgi veren geri bildirim" olarak kalmalı. Ödülün en güçlü biçimi, Puhu'nun neyin **daha iyi** olduğunu söylemesi olmalı.
- **Öğrenme bilimi:** Dunlosky ve arkadaşlarının değerlendirmesi, en yüksek yarara sahip iki teknik olarak deneme testini ve aralıklı tekrarı gösteriyor (https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html). Puhu'daki Leitner zaten bu iki tekniği birlikte uyguluyor. Bağlılık mekaniği Leitner kutusunu beslemeli, onunla yarışmamalı.
- **Çocuk düzenlemesi:** İngiltere ICO Çocuk Kodu'nun 13. standardı "nudge" tekniklerini konu alıyor. Taslak metin "kullanımı uzatma" ifadesini içeriyordu ve ICO basın açıklamalarında seri ve beğeni gibi ödül döngüleri örnek gösterildi. Nihai rehber ise ara vermek gibi **iyi oluşu destekleyen** nudge'ları öneriyor (https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/; sayfa 403 verdi, yalnız arama özetini gördüm). Türkiye için KVKK'da çocuk verisi ve veli onayı ayrıca hukukçuya sorulmalı.

## 4. Aktarılacaklar ve aktarılmayacaklar
| Aktar | Aktarma |
|---|---|
| Küçük minimum gün (1 pozisyon) | Suçluluk ve tehdit dilindeki bildirimler ("Puhu ağlıyor") |
| Seri ile esneklik (dondurma) | Yabancılarla haftalık lig, küme düşme |
| Seri uzayınca kutlama animasyonu | Parayla seri kurtarma, mücevher ekonomisi |
| Tek ve iyi zamanlanmış hatırlatma | Gece geç saatte "serin bitiyor" |
| Maskotla duygusal bağ (sıcak, cesaretlendiren) | Rastgele ganimet kutusu, sonsuz XP |
| Uzun vadeli ustalık merdiveni | Süreye ve hıza dayalı yarış (çocuğun sorunu acele değil, tehdidi görmemek) |

## 5. Önerilen mekanikler (15 madde)
Her maddede sırasıyla şunlar var: çocuğun gördüğü, tetik, ödül, öğrenmeye katkısı ve ölçüm.

1. **"Bir lokma" günü**
   - Görülen: Ana ekranda "Bugün 1 pozisyon yeter" kartı.
   - Tetik: Uygulama açılışı.
   - Ödül: Seri +1 ve Puhu'nun kanat çırpması.
   - Öğrenme: Leitner kartlarının vadesi kaçmıyor.
   - Ölçüm: Haftalık aktif gün sayısı; "1 pozisyonda kalan gün / tüm günler" oranı.
   - Kod: `streak()` yıldız yerine `gun[tarih]` kaydında herhangi bir deneme olup olmadığına baksın.
2. **Puhu'nun yuvası (seri dondurma)**
   - Görülen: Haftada 1 dal, en çok 2 birikebilir. Kaçırılan gün "Puhu yuvada dinlendi" diye işaretlenir.
   - Tetik: Kaçırılan gün kendiliğinden.
   - Ödül: Seri korunur.
   - Öğrenme: Kayıp korkusu yerine gevşeklik (Duolingo'da +%0,38 DAU).
   - Ölçüm: Dondurmadan sonraki gün geri dönüş oranı.
   - Satın alma yok; dal 7 aktif günde bir kazanılır.
3. **Kendi maçın, Puhu'nun dersi (asıl döngü)**
   - Görülen: "Dün 3 maç oynadın, Puhu 2 yeni ders buldu".
   - Tetik: Lichess'te yeni oyun (OAuth API ile açılışta kontrol).
   - Ödül: Yeni kart ve "senin hatan, senin kartın" etiketi.
   - Öğrenme: Transfer, çünkü çocuk kendi hatasını çalışıyor.
   - Ölçüm: Oyun başına blunder sayısı (7 ve 28 günlük kayan ortalama).
4. **Tehdit dedektörü rozeti** (çocuğun asıl zaafına özel)
   - Görülen: Her gerçek oyunda rakibin tehdidini kaçırmadan geçen 10 hamle, dedektör rozetine bir "büyüteç" ekler.
   - Tetik: Oyun analizi.
   - Ödül: Gerçek oyundan gelen kanıt.
   - Öğrenme: Pratik doğrudan oyun davranışına bağlanıyor.
   - Ölçüm: Oyun başına "rakip tehdidini kaçırma" sayısı.
5. **"Önce rakibe bak" ritüeli**
   - Görülen: Her pozisyonda önce "Rakip ne istiyor?" düğmesi, sonra hamle.
   - Tetik: Pozisyon açılışı.
   - Ödül: Puhu'nun "gözlerin açık!" demesi ve küçük bir göz animasyonu.
   - Öğrenme: Alışkanlığın kendisi satranç düşünme rutini oluyor (bağlam ve tekrar). Çocuk zaten uzun düşünüyor, eksik olan nereye baktığı.
   - Ölçüm: Ritüeli kullanma oranı ve aynı pozisyon türünde doğruluk.
6. **Puhu'nun ruh hali ve günlüğü**
   - Görülen: Puhu bir gün önce olanları hatırlar ("Dünkü fil açmazını bugün de görecek misin?").
   - Tetik: Açılış.
   - Ödül: İlişkililik.
   - Öğrenme: Aralıklı tekrar maskotun ağzından söyleniyor.
   - Ölçüm: D1 ve D7 tutma.
   - Kural: Puhu asla üzgün ya da kırgın olmaz, yalnız meraklı ve heyecanlı olur.
7. **Kutlama, ama bilgiyle**
   - Görülen: 3, 7, 14, 30 ve 50. günde özel animasyon ve "7 günde blunder'ın 2,1'den 1,6'ya indi" cümlesi.
   - Tetik: Seri kilometre taşı.
   - Ödül: Benlik (ustalık).
   - Öğrenme: Bilgi veren geri bildirim, içsel motivasyonu desteklemenin yolu (SDT).
   - Ölçüm: Kilometre taşından sonraki 7 günlük tutma.
8. **Ustalık haritası (rütbenin devamı)**
   - Görülen: Şah'tan sonra konu adaları: Çatal Adası, Açmaz Ormanı, Pat Tuzağı Mağarası. Her ada Leitner'in 5. kutusundaki kartlarla açılır.
   - Tetik: Rütbe tavanı.
   - Ödül: Yeni bölge.
   - Öğrenme: Ödül yıldız sayısına değil kalıcı öğrenmeye bağlı.
   - Ölçüm: 5. kutudaki kart sayısı ve 30 gün sonra hatırlama oranı.
9. **Sürpriz soru (sınırlı değişkenlik)**
   - Görülen: Günde en çok 1 kez "Puhu'nun gizli bulmacası", çocuğun kendi oyunundan seçilen ünlü bir motif.
   - Tetik: Plan sırasında rastgele.
   - Ödül: Merak.
   - Öğrenme: Değişkenlik ödülde değil içerikte.
   - Ölçüm: Açılma oranı.
   - Kural: Kumar benzeri kutu yok, sonuç her zaman bir ders.
10. **Kendi planını seç (özerklik)**
    - Görülen: Bugünün 3 adımından ikisini çocuk seçer; Puhu "tehdit avı"nı her zaman önerir ama zorlamaz.
    - Tetik: Ana ekran.
    - Ödül: Özerklik.
    - Öğrenme: Seçilen işe daha nitelikli katılım.
    - Ölçüm: Plan tamamlama oranı (seçimli ve seçimsiz A/B).
11. **Tek hatırlatma, çocuğun saatinde**
    - Görülen: Çocuğun seçtiği saatte (ör. 17:30) tek bir sıcak mesaj: "Puhu dünkü maçından bir bulmaca hazırladı."
    - Tetik: Web Push ya da PWA. Sunucusuz olduğu için ilk aşamada veli WhatsApp'ı veya ekran kartı da olur.
    - Ödül: Yok; tetik yeterli.
    - Ölçüm: Bildirimden 2 saat içinde açılma ve kapatma (opt-out) oranı.
    - Kural: Günde en fazla 1, saat 20:00'den sonra asla, 3 gün yanıtsız kalırsa haftada 1'e düşer ("kanalı koru").
12. **Aile köşesi (ilişkililik, rekabetsiz)**
    - Görülen: Haftalık karne ekranı veliye paylaşılabilir. "Bu hafta beraber 1 Puhu bulmacası çözün" görevi.
    - Tetik: Pazar.
    - Ödül: Kabile, ama tanıdık kişiler.
    - Öğrenme: Çocuk açıklayarak öğreniyor (çözümü veliye anlatıyor).
    - Ölçüm: Paylaşım oranı ve takip eden haftanın oturum sayısı.
13. **Arkadaş ya da kulüp takımı (lig yerine)**
    - Görülen: 3-5 kişilik, davetle kurulan takım; hedef ortak ("bu hafta takım 100 tehdit buldu").
    - Tetik: Haftalık.
    - Ödül: Ortak bayrak.
    - Öğrenme: İşbirliği; küme düşme yok.
    - Ölçüm: Takımdaki çocukların CURR değeri, solo kullanıcılarla karşılaştırmalı.
    - Ürünleşme sırasına göre: önce satranç kulübü ve öğretmen paneli.
14. **Hatadan sonra "yeniden dene" kalkanı**
    - Görülen: Yanlış cevap yıldız götürmez, Puhu bir ipucu verir. İkinci denemede doğru yaparsa yarım yıldız ve kart 1. kutuya döner.
    - Tetik: Yanlış cevap.
    - Ödül: Yetkinlik korunur.
    - Öğrenme: Yanlışın ardından düzeltici geri bildirim, deneme testinin en etkili hali.
    - Ölçüm: Yanlıştan sonra oturumu bırakma oranı.
15. **Sağlıklı durak** (ayrıntısı 6. bölümde)

## 6. Sağlıklı durak tasarımı
- **Doğal bitiş:** Plan bitince "Serbest bulmaca çöz" yerine Puhu esner: "Bugünlük beynin doydu. En iyi çalışma şimdi: **git Lichess'te 1 maç oyna**, ben yarın o maça bakarım." Düğme Lichess'e gider. Böylece döngü uygulama dışındaki gerçek pratiğe bağlanıyor.
- **Üst sınır:** Günlük yıldız ve kart sayısı 25-30 ile sınırlı. Sonrasında yalnız bilgi veren mod çalışır (yıldız yok). Ödül kovalayarak uzun oturum yapma teşvik edilmez.
- **Yorgunluk algılama:** Art arda 3 yanlış ya da hamle başına sürenin keskin düşmesi (yorgunluk ya da tahmin) görülürse Puhu "Kısa mola: 5 dakika sonra gel" der ve bir zamanlayıcı gösterir.
- **Saat bekçisi:** 21:00'den sonra Puhu uyur; uygulama yalnız "yarın görüşürüz" ekranı gösterir. Veli bu saati ayarlayabilir.
- **Seri bir rozet, yük değil:** Seri bozulursa "Yeni serine başla, en uzun serin 12 gün, rekor yerinde duruyor" yazar. Kırmızı ateş sönme animasyonu yok.
- **Ölçüm:** Ortalama oturum süresi bir **tavan** metriği olarak izlenir (hedef 10-20 dk). 30 dakikayı aşan oturumların oranı artarsa bu bir alarm sayılır.

## 7. Ölçüm planı
- **Kuzey yıldızı:** Oyun başına blunder (ve rakip tehdidini kaçırma) eğilimi, 28 günlük kayan ortalama. Lichess oyunlarından zaten hesaplanabiliyor.
- **Bağlılık:** D1, D7, D30 tutma; haftalık aktif gün (hedef 4-5, 7 değil); CURR (bugün aktif ve son 6 günde de aktif olanın ertesi gün dönmesi).
- **Sağlık:** Oturum süresi dağılımı, 21:00 sonrası açılma girişimleri, bildirimi kapatma oranı.
- **Altyapı:** Sunucu olmadığı için tek kullanıcıda her şey localStorage olay günlüğünde tutulabilir (`events:[{t,tip}]`) ve karne ekranından hesaplanabilir. Ürün aşamasında anonim, toplu telemetri gerekir; çocuk verisi olduğu için KVKK kapsamında açık veli onayı şart (hukuk denetimi gerekli). Kişisel veri, Lichess kullanıcı adı ya da oyun içeriği gönderilmemeli.
- **Deney:** N=1 ile A/B yapılmaz. Ilk ay ABAB tek-denek düzeni uygulanabilir (1 hafta yeni seri kuralı, 1 hafta eski). Ürün aşamasında ilk A/B adayları seri tanımı (1. mekanik), dondurma (2. mekanik) ve hatırlatma (11. mekanik); Duolingo'da en büyük kazançlar bu üç kaldıraçtan geldi.

## 8. Önceliklendirme (en ucuzdan en etkiliye)
1. Seri tanımını düzelt ve dondurmayı ekle (1-2): kodda birkaç satır.
2. Sağlıklı durakla birlikte "Lichess'te oyna" kapanışı (15).
3. Kilometre taşı kutlaması ve blunder eğilimi cümlesi (7).
4. "Önce rakibe bak" ritüeli ile tehdit dedektörü (4-5): çocuğun asıl zaafına doğrudan gidiyor.
5. Ustalık haritası (8); hatırlatma ve PWA (11); aile ve kulüp (12-13) ürünleşme aşamasında.

## Kaynaklar
**Açılıp okunanlar:**
- https://blog.duolingo.com/how-duolingo-streak-builds-habit/
- https://blog.duolingo.com/improving-the-streak/
- https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/
- https://www.behaviormodel.org/
- https://selfdeterminationtheory.org/theory/
- https://www.nirandfar.com/how-to-manufacture-desire/
- https://www.nirandfar.com/want-to-hook-your-users-drive-them-crazy/
- https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html

**Yalnız arama özetiyle görülenler (tam metin okunmadı):**
- Deci, Koestner ve Ryan 1999: https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf
- ICO 13. standart (sayfa 403 verdi): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/
- https://arxiv.org/abs/2203.16175
- Yancey & Settles, KDD 2020: https://research.duolingo.com/papers/yancey.kdd20.pdf

**İncelenen kod:** f:/lichess/index.html, satır 544-582 (yıldız, rütbe, seri ve plan bölümü).