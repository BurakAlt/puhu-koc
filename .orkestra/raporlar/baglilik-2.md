# Puhu Koç bağlılık önerisine eleştiri: çocuk refahı, dijital haklar ve mevzuat

## 0. Kısa hüküm
Öneri, Duolingo'yu körü körüne kopyalamıyor. Suçluluk dilini, ligi, mücevher ekonomisini ve gece bildirimini çıkarması doğru. Yine de üç noktada çocuk aleyhine kayıyor:

1. **"Kayıp kaçınması" çerçevesini hâlâ taşıyor.** Seri sayacı, kazanılan dondurma ve gün sayısına bağlı kilometre taşları buna dahil.
2. **Bildirimi ve maskotla duygusal bağı tutma aracı olarak kullanıyor.** Mekanik 6 ve 11.
3. **Ürünleşmede iki şeyi yanlış ya da eksik ele alıyor.** Ürünü uygulama dışına bağlayan iki unsur var: "Lichess'te oyna" düğmesi ve WhatsApp paylaşımı. Ayrıca bulut ses verisi gözden kaçmış.

Kuzey yıldızı metriğinin "oyun başına hata" olması en güçlü yanı. CURR'u hedef metrik olarak tutmak ise bu ilkeyle çelişiyor.

**Kod notu:** Önerideki satır numaraları bayat. Güncel yerler şöyle:
- `addStar` satır 612'de, `streak()` 617-622 arasında.
- "Bugünlük bitti! Serbest bulmaca çöz" satır 638'de.
- RANKS satır 606'da, Şah 320 yıldızda. GOALS 3+5+5 = günde 13 adım ediyor; bu iddia doğru.

## 1. Hangi mevzuat gerçekten uygulanır?

### Türkiye, KVKK (birincil pazar)
- 6698 sayılı Kanun'da çocuk verisine özel bir hüküm yok. Hak kullanımında tek yaş 18. Yazarlar aydınlatmanın velayet yoluyla yapılmasını ve açık rızanın veliden alınmasını öneriyor. GDPR'daki 16 yaş eşiği Türkiye'ye taşınamıyor (https://www.hukukihaber.net/gdpr-ve-kvkk-bakimindan-cocuklarin-kisisel-verilerinin-korunmasi-ve-konuya-iliskin-kurul-kararinin-degerlendirilmesi, açıp okudum).
- Aynı makaleye göre Kurul'un 2020/622 sayılı kararı, ayırt etme gücü olan küçüğün şikâyet hakkını kendisinin de kullanabileceğini söylüyor.
- Kurul'un 2022/776 sayılı kararı, çocuk verisinin veli açık rızası alınmadan işlendiği bir olayı konu alıyor. Yalnız arama özetini gördüm; kvkk.gov.tr sertifika hatası verdi.
- **Bugünkü durum:** Uygulamanın sunucusu yok. Token (satır 1203), oyunlar (satır 769) ve ilerleme tarayıcıda localStorage'da duruyor, istekler doğrudan lichess.org'a gidiyor. Bu yüzden işletici şu an neredeyse hiç veri işlemiyor. Bunu korumak en ucuz uyum yolu.
- **Ürün aşamasında:** Telemetri, takım ya da veli paneli gelirse işletici veri sorumlusu olur. O zaman veli açık rızası, aydınlatma metni ve VERBİS kontrolü gerekir. Yurt dışındaki servisler (bulut TTS, analitik) için aktarım hükmü de var. Bu son kısım için kaynak açmadım; hukukçuya sorulmalı.

### İngiltere, Yaşa Uygun Tasarım Kodu (ICO Children's Code)
- 13. standardın başlığı yalnız veri ve gizlilikle ilgili: "Do not use nudge techniques to lead or encourage children to provide unnecessary personal data or turn off privacy protections."
- Aynı sayfa 0-12 yaş için "Nudge towards wellbeing enhancing behaviours (such as taking breaks)" diyor.
- En önemlisi şu cümle: "You should not exploit unconscious psychological processes". Sayfa, buna örnek olarak "human affirmation needs" ifadesini veriyor.
- Kaynak: https://cy.ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/ (ico.org.uk 403 verdi; Galce alan adındaki aynı içeriği açıp okudum).
- **Önerideki düzeltme:** "Kullanımı uzatma" ifadesi yalnız 2019 taslağındaydı. Nihai metin bu ifadeyi taşımıyor (arama özeti). Öneri bu konuda dürüst, ama Puhu için asıl risk "affirmation" (onay ihtiyacı) maddesi.

### AB, DSA md. 28
- Komisyon kılavuzu 14 Temmuz 2025'te yayımlandı. Kapsamı: "all online platforms accessible to minors, with the exception of micro and small enterprises".
- Kılavuz şunları önerir:
  - "communication streaks", okundu bilgisi, otomatik oynatma ve push bildirimlerini varsayılan olarak kapatmak,
  - "removing persuasive design features aimed predominantly at engagement",
  - bağımlılık doğurabilecek sanal para birimlerinden ve ganimet kutularından kaçınmak.
- Kaynak: https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors (açtım). Kılavuz bağlayıcı değil, ama md. 28(1) için ölçüt (https://www.hunton.com/privacy-and-cybersecurity-law-blog/european-commission-issues-guidelines-on-the-protection-of-minors, açtım).
- **Puhu'ya uygulanması:** Kullanıcı içeriğini kamuya yaymayan bir koçluk aracı "online platform" sayılmaz. Mikro işletme istisnası da var. Bugün doğrudan uygulanmaz.
- Takım ya da kulüp (mekanik 13) çocuklar arası içerik paylaşımı getirirse platforma yaklaşır. Türkiye'de olsa bile en iyi uygulama ölçütü olarak kullanılmalı.
- Kılavuzdaki "streaks" örneği iletişim serileri (Snapchat tipi). Tek kişilik çalışma serisi bu tanıma birebir girmez, ama aynı mantığa dayanıyor.

### ABD, COPPA (ABD'li kullanıcı olursa)
- Kapsam: 13 yaş altına yönelik hizmetler. Kişisel veri tanımına "persistent identifiers" ve çocuk sesi içeren ses dosyaları giriyor.
- Kural olarak doğrulanabilir veli onayı gerekir. Yalnız tanımlayıcı toplanıyorsa ve yalnız "internal operations" için kullanılıyorsa istisna var.
- Kural 22 Nisan 2025'te değiştirildi.
- Kaynak: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions (açtım; uyum tarihini bu sayfada göremedim).
- Puhu çocuğun sesini kaydetmiyor; ses kaydı hükmü tetiklenmiyor.

### Uygulama mağazaları
- **Apple 1.3:** Çocuk kategorisindeki uygulamalar "must not include links out of the app, purchasing opportunities, or other distractions to kids unless reserved for a designated area behind a parental gate". Üçüncü taraf analitik ve reklam olmamalı. "For Kids" ifadesi yalnız bu kategoriye ayrılmış (https://developer.apple.com/app-store/review/guidelines/, açtım).
- **Google Play Families:** Yalnız çocuklara yönelik uygulama AAID gönderemez ve konum izni isteyemez. "emotionally manipulative tactics" yasak (https://support.google.com/googleplay/android-developer/answer/9893335, açtım).
- **Sonuç:** Önerideki "Lichess'e git" düğmesi (15), WhatsApp paylaşımı (11, 12) ve kulüp daveti (13) Apple çocuk kategorisinde ebeveyn kapısı ister.

### Bulut ses verisi (önerinin hiç değinmediği konu)
- Kod (satır 570) en iyi sesi şöyle seçiyor: `/natural/i` → 3 puan, `/google/i` → 2 puan. Yani varsayılan tercih Edge'in "Online (Natural)" sesleri.
- Microsoft bu seslerin "Powered by Microsoft Cognitive Services" olduğunu ve SpeechSynthesis API ile web sayfalarına açıldığını yazıyor (https://blogs.windows.com/msedgedev/2019/08/14/cloud-powered-voices-microsoft-edge-chromium/, açtım). Sonuç olarak Puhu'nun her cümlesi Microsoft'a metin olarak gidiyor.
- Chrome'daki "Google" seslerinin de ağ üzerinden çalıştığını düşünüyorum, ama bunun kaynağını açmadım. `voice.localService` ile doğrulanabilir.
- Bugün giden metin satranç açıklaması; çocuğun sesi gitmiyor. Puhu ileride çocuğun adını, Lichess adını ya da günlüğünü (mekanik 6) seslendirirse kişisel veri buluta gitmiş olur.
- **Öneri:**
  - Varsayılan olarak `localService === true` olan sesi seç. Bulut sesini veli ayarında "daha doğal, metin Microsoft/Google'a gider" açıklamasıyla isteğe bağlı yap.
  - Seslendirilen metne ad ya da kullanıcı adı koyma.

### Lichess'e yönlendirme
- lichess.org kullanım şartları 403 verdi; yaş şartını doğrulayamadım.
- Lichess'te yabancılarla sohbet var. Mekanik 3 ve 15 çocuğu daha çok çevrimiçi oyuna itiyor. Kapanış ekranı veliye "Lichess'te çocuk modu (kid mode) açık mı?" diye sormalı. Bu da kaynaksız bir öneri.

## 2. Mekanik bazında karar

| # | Mekanik | Karar | Neden ve değişiklik | Kaynak |
|---|---|---|---|---|
| Seri sayacı (genel) | | **DEĞİŞTİR** | Önerinin kendi hedefi "haftada 4-5 aktif gün, 7 değil". Ama ardışık gün sayacı 7'yi ödüllendiriyor; bu bir iç çelişki. Ardışık gün sayısı yerine "bu hafta 4/4 gün" haftalık hedef kullan. Uzun gün sayısı kayıp kaçınmasını besler; Duolingo'nun kendi blogu bunu açıkça güdü olarak anıyor. | DSA kılavuzu (streak, persuasive design); ICO 13 (bilinçdışı süreçleri istismar etme) |
| 1 | Bir lokma günü | **TUT** | Seriyi yıldızdan ayırmak doğru; bugünkü `streak()` performansa bağlı. Seri ise haftalık hedefe çevrilmeli (yukarıdaki satır). | Öneriyle aynı |
| 2 | Puhu'nun yuvası (dondurma) | **DEĞİŞTİR** | "7 aktif günde 1 dal kazanılır, en çok 2 birikir" kuralı dondurmayı biriktirilen bir sanal varlığa çeviriyor; kaybetme kaygısı da birlikte geliyor. Yerine haftada 2-3 dinlenme günü kendiliğinden tanımlansın. Kazanılmasın, sayılmasın, ekranda "Puhu da dinlendi" yazsın. | DSA kılavuzu (sanal ödül ve para birimi); öneri tablosundaki "mücevher ekonomisi yok" ilkesiyle tutarlılık |
| 3 | Kendi maçın, Puhu'nun dersi | **TUT** | Asıl öğrenme döngüsü bu. "Dün 3 maç oynadın" demek sorun değil. "Daha çok maç oyna" demek ise çocuğu sohbetli bir platforma itmek olur. | Lichess şartları doğrulanamadı |
| 4 | Tehdit dedektörü rozeti | **TUT** | Ustalık kanıtı ve gerçek oyundan geliyor. Kural: rozet ya da büyüteç asla geri alınmasın. | SDT (öneri) |
| 5 | "Önce rakibe bak" ritüeli | **TUT** | Çocuğun asıl zaafına gidiyor. Atlanabilir olmalı; zorunlu düğme çocuğu sıkar. | — |
| 6 | Puhu'nun ruh hali ve günlüğü | **DEĞİŞTİR** | ICO, "human affirmation needs" sömürüsünü örnek veriyor. Maskotla duygusal bağ dönüş tetiği olarak kullanılmasın: "Puhu seni bekliyor" ya da "özledi" olmasın. Hafıza yalnız içerik hatırlatması olsun ("dünkü fil açmazı"). "Puhu asla üzgün değil" kuralı iyi; korunsun. | ICO 13 (cy.ico.org.uk) |
| 7 | Kilometre taşı kutlaması | **DEĞİŞTİR** | 3/7/14/30/50. gün eşikleri seriyi pekiştiriyor. Kutlamayı ustalık eşiklerine bağla: "10 tehdit yakaladın", "blunder oranın düştü". Gün sayısına bağlama. | SDT; DSA (engagement odaklı tasarım) |
| 8 | Ustalık haritası | **TUT** | Ödül kalıcı öğrenmeye bağlı, rütbe tavanını da çözüyor. | — |
| 9 | Sürpriz soru | **DEĞİŞTİR** | Hook modelindeki "değişken ödül" kumar makinesinin çekirdeği. "Gizli", "rastgele anda belirir" çerçevesi kaldırılsın. Bu bölüm çocuğun istediğinde açabileceği bir "ünlü motif" köşesi olsun. | Google Play (manipülatif taktik); DSA (ganimet kutusu mantığı) |
| 10 | Kendi planını seç | **TUT** | Özerklik, ICO'nun da desteklediği yön. | — |
| 11 | Tek hatırlatma | **DEĞİŞTİR (sıkı)** | Varsayılan **kapalı** olsun ve **veli açsın**, çocuk değil. Kanal veliye gitsin (WhatsApp ya da e-posta); çocuğun cihazına push gönderme. Sessiz saat 20:00 değil, yatma saatine göre ayarlansın. Hiçbir mesajda seri ya da "kaçırma" geçmesin. "3 gün yanıtsızsa haftada 1" kuralı iyi. | DSA kılavuzu (push varsayılan kapalı); Apple 1.3 (uygulama dışı bağlantı → ebeveyn kapısı) |
| 12 | Aile köşesi | **TUT, şartlı** | Paylaşım ebeveyn kapısının arkasında olsun. Karne minimum veri içersin: ad, rating ve kullanıcı adı olmasın, yalnız eğilim. Çocuk karnenin veliye gittiğini bilsin (şeffaflık). | Apple 1.3; KVKK (veri minimizasyonu, öneriye dayalı) |
| 13 | Arkadaş ya da kulüp takımı | **ŞİMDİLİK ÇIKAR** | Başka çocukların verisi demek: her biri için ayrı veli rızası gerekir. Çocuklar arası etkileşim moderasyon ister ve DSA "platform" eşiğine yaklaşır. Sunucu da gerektirir. Ürünleşmede yalnız öğretmenin kurduğu, serbest metin içermeyen, takma adlı sınıf paneli olarak dönsün. | DSA kapsamı; KVKK (hukukihaber); COPPA (veli onayı) |
| 14 | Yeniden dene kalkanı | **TUT** | Yanlışı cezalandırmıyor ve öğrenmeye en uygun mekanik. | — |
| 15 | Sağlıklı durak | **TUT, şartlı** | Doğal bitiş, günlük 25-30 sınırı, mola ve saat bekçisi ICO'nun "taking breaks" önerisine birebir uyuyor. Ancak tek çıkışın "Lichess'e git" düğmesi olması iki sorun yaratıyor: Apple'da ebeveyn kapısı gerekir ve çocuğu sohbetli bir platforma yönlendirir. Yerine önce "evde biriyle tahtada oyna" gelsin; Lichess bağlantısı ikinci seçenek olsun. Yorgunluk algılama yalnız cihazda kalsın (profil çıkarmak için gönderilmesin). | ICO 13; Apple 1.3 |

## 3. Ölçüm ve deney planına itirazlar
- **CURR ve D1/D7/D30 hedef değil, yan gösterge olmalı.** Bu metrikler optimize edilirse ekip bildirim ve seri baskısını artırmaya kayar; DSA "engagement odaklı tasarım"a karşı. Hedefler öneride zaten var: hata eğilimi ve "oturum süresi tavanı". Karar ölçütü yalnız bunlar olsun.
- **Ürün aşamasındaki A/B testi bir riskti.** "Seri tanımı, dondurma ve hatırlatma ile tutmayı artırma" deneyi, çocuk üzerinde tutma optimizasyonu demek. Önce bir etki değerlendirmesi yapılmalı (KVKK ve ICO'daki DPIA mantığı; ICO'nun DPIA standardını bu oturumda açamadım). Her deneyde bir refah karşı-metriği izlensin: 21:00 sonrası açılış ve 30 dakikayı aşan oturum oranı. Bu metrik bozulursa deney dursun.
- **Ürün telemetrisi:**
  - Üçüncü taraf analitik kullanma (Apple 1.3, Google Families).
  - Kendi toplu sayaçların olsun: kalıcı kullanıcı kimliği olmasın, Lichess adı olmasın, oyun içeriği olmasın.
  - Yalnız tanımlayıcı toplanıyorsa COPPA'nın "internal operations" istisnası bunu kapsar; Türkiye için yine veli aydınlatması gerekir.
- **ABAB tek-denek düzeni:** Kendi çocuğunda velinin bilgisiyle yapılırsa sorun yok. Çocuğa ne yapıldığı yaşına uygun dille anlatılsın.

## 4. Öncelik sırası (refah ve uyum açısından)
1. Seri tanımını "denendi" olarak düzelt ve haftalık hedefe çevir. Dondurmayı kendiliğinden dinlenme günüyle değiştir (1, 2).
2. Plan bitince sağlıklı durak ve günlük sınır; Lichess çıkışı ikinci seçenek olsun (15).
3. Kilometre taşlarını gün sayısından ustalığa taşı (7). Puhu'nun "özledi" türü cümlelerini yasakla (6).
4. TTS: varsayılan olarak yerel ses kullan, bulut sesini veli onayına bağla (satır 570).
5. Ürünleşmeden önce şunlar hazır olsun: veli aydınlatma ve rıza akışı, ebeveyn kapısı, hatırlatmanın varsayılan olarak kapalı olması, üçüncü taraf SDK kullanılmaması. Takım ya da kulüp ancak bunlardan sonra gelsin.

## Kaynaklar
**Açıp okuduklarım:**
- https://cy.ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/
- https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors
- https://www.hunton.com/privacy-and-cybersecurity-law-blog/european-commission-issues-guidelines-on-the-protection-of-minors
- https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- https://developer.apple.com/app-store/review/guidelines/
- https://support.google.com/googleplay/android-developer/answer/9893335
- https://www.hukukihaber.net/gdpr-ve-kvkk-bakimindan-cocuklarin-kisisel-verilerinin-korunmasi-ve-konuya-iliskin-kurul-kararinin-degerlendirilmesi
- https://blogs.windows.com/msedgedev/2019/08/14/cloud-powered-voices-microsoft-edge-chromium/

**Yalnız arama özetiyle görülenler:**
- KVKK Kurul kararı 2022/776: https://www.kvkk.gov.tr/Icerik/7572/2022-776 (sertifika hatası)
- Freshfields DSA özeti, push bildirimlerinin varsayılan kapalı olması: https://technologyquotient.freshfields.com/post/102kv4s/dsa-decoded-6-the-european-commission-finalises-guidelines-on-the-protection-of
- 5Rights, Disrupted Childhood 2023 (Snapchat serisi eleştirisi): https://5rightsfoundation.com/uploads/Disrupted-Childhood-2023-v2.pdf

**Açılamayanlar:**
- ico.org.uk ana sayfası ve PDF'i (403)
- lichess.org/terms-of-service (403)

**İncelenen kod:** f:/lichess/index.html, satır 564-594 (TTS), 606-643 (yıldız, seri, plan), 1183-1219 (token).