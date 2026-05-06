# 🌿 EcoTrack - Karbon Ayak İzi Takip Uygulaması

EcoTrack, React Native (Expo) ile geliştirilmiş, Firebase tarafından desteklenen, kullanıcıların günlük aktivitelerinin karbon ayak izini takip etmelerine olanak tanıyan mobil bir uygulamadır.

## 🎯 Özellikler

- **Kimlik Doğrulama**: Firebase Auth ile kayıt ve giriş işlemleri
- **Aktivite Takibi**: Ulaşım, gıda ve diğer aktivitelerin karbon ayak izini kaydetme
- **Gerçek Zamanlı Veri**: Firestore ile anlık grafik güncelleme
- **Analitik Grafikler**: Kategori bazlı karbon takibi (Pasta Grafikleri)
- **Aktivite Geçmişi**: Tüm aktiviteleri görüntüleme ve silme
- **Responsive Tasarım**: iOS, Android ve Web platformları destekleri

## 🛠️ Teknoloji Stack'i

| Teknoloji | Versyon | Kullanım |
| --- | --- | --- |
| React Native | 0.81.5 | Mobil geliştirme |
| Expo | ~54.0.33 | React Native yönetimi |
| Firebase | ^12.12.1 | Kimlik doğrulama ve veritabanı |
| Zustand | ^5.0.13 | Global state management |
| React Navigation | ^7.1.8 | Ekran navigasyonu |
| Ionicons | ^15.0.3 | İkonlar |
| Reanimated | ~4.1.1 | Animasyonlar |

## 📁 Proje Yapısı

```
EcoTrack/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js          # Ana navigasyon (Auth ve Main)
│   ├── screens/
│   │   ├── LoginScreen.js           # Giriş ekranı
│   │   ├── RegisterScreen.js        # Kayıt ekranı
│   │   ├── DashboardScreen.js       # Ana sayfa (grafik ve son aktiviteler)
│   │   ├── HistoryScreen.js         # Aktivite geçmişi
│   │   └── SplashScreen.js          # Başlangıç ekranı
│   ├── services/
│   │   ├── firebaseConfig.ts        # Firebase konfigürasyonu
│   │   ├── auth.service.js          # Kimlik doğrulama işlemleri
│   │   └── data.service.js          # Firestore CRUD işlemleri
│   └── store/
│       └── useUserStore.js          # Zustand global state
├── .env.example                     # Environment variables örneği
├── app.json                         # Expo konfigürasyonu
├── package.json                     # Bağımlılıklar
└── index.ts                         # Uygulama giriş noktası
```

## 🚀 Kurulum ve Başlatma

### 1. Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Expo CLI (`npm install -g expo-cli`)



### 2. Projeyi Klonla ve Bağımlılıkları Yükle

```shell
# Proje klasörüne git
cd EcoTrack

# Bağımlılıkları yükle
npm install
# veya
yarn install
```

### 3. Environment Variables Ayarla

`.env.example` dosyasını `.env` olarak kopyala ve Firebase bilgilerini doldur:

```shell
cp .env.example .env
```

Sonra `.env` dosyasını açıp Firebase konfigürasyonunu ekle:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxxxxxxxxx
```

### 4. Uygulamayı Başlat



```shell
# Expo cihaz seçim menüsü ile başlat
npm start
# veya
yarn start

# Doğrudan cihaza yükle
npm run ios       # iOS
npm run android   # Android
npm run web       # Web
```

## 📱 Uygulamayı Kullanma

### Giriş ve Kayıt

1. Uygulamayı açtığınızda **Splash Screen** görürsünüz
2. Kullanıcı mevcut değilse **Login** ekranına yönlendirilirsiniz
3. **Kayıt Ol** seçeneği ile yeni hesap oluşturun
4. Email ve şifre ile giriş yapın

### Ana Sayfa (Dashboard)

- Toplam karbon ayak izi gösterilir
- Kategori bazlı pasta grafik görüntülenir
- Son 5 aktivite listelenir
- **Aktivite Ekle** butonuyla yeni aktivite kaydedilir

### Aktivite Geçmişi

- Tüm aktivitelerinizi kronolojik sırayla görüntüleyin
- Aktiviteler silinebilir
- Detaylı bilgiler (tip, mesafe, karbon ayak izi)

## 🔐 Güvenlik

- `.env` dosyası `.gitignore`'a eklenmiştir
- Firebase Auth ile güvenli kimlik doğrulama
- Firestore Security Rules (backend'de uygulanmalı):

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /activities/{doc=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🌳 Karbon Hesaplaması

```javascript
// Ulaşım (km başına)
- Araba: 0.21 kg CO2
- Otobüs: 0.089 kg CO2
- Tren: 0.041 kg CO2
- Uçak: 0.255 kg CO2

// Gıda (porsyon başına)
- Beef: 27 kg CO2
- Chicken: 6.9 kg CO2
- Fish: 12.7 kg CO2
- Vegetarian: 2 kg CO2
```

## 📊 Veri Tabanı Yapısı

### Users Collection

```javascript
{
  email: "user@example.com",
  fullName: "John Doe",
  createdAt: Timestamp
}
```

### Activities Collection

```javascript
{
  userId: "uid123",
  type: "car",           // car, bus, train, flight, food
  distance: 50,          // km
  carbonFootprint: 10.5, // kg CO2
  createdAt: Timestamp,
  notes: "İş yolculuğu"
}
```

## 🐛 Hata Giderme

### "Firebase not initialized" hatası

- `.env` dosyasının tüm alanlarını doldurduğunuzdan emin olun
- Uygulamayı yeniden başlatın: `npm start`

### "Cannot find module" hatası

- `npm install` komutunu tekrar çalıştırın
- `node_modules` klasörünü silin ve yeniden yükleyin

### Aktiviteler kaydedilmiyor

- Firebase Console'da Firestore'u kontrol edin
- Security Rules'ın aktif kullanıcı için geçerli olduğundan emin olun

## 📝 Geliştirme Notları



- **State Management**: Zustand'ın simplicity'si tercih edilmiştir
- **Navigation**: React Navigation v7 ile tab ve stack navigasyon
- **Async Operations**: Firebase async/await pattern kullanır
- **Real-time**: Firestore `onSnapshot` ile gerçek zamanlı güncellemeler

## 🤝 Katkı

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -m 'Yeni özellik ekle'`)
4. Push yapın (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

## 📄 Lisans

MIT License - ayrıntılar için `LICENSE` dosyasına bakın

## 👨‍💻 Yazar

**EcoTrack Development Team**

- Email: mertaydogn0@gmail.com

## 🌐 İlgili Kaynaklar

- [Expo Belgesi](https://docs.expo.dev)
- [Firebase Belgesi](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org)
- [Zustand](https://github.com/pmndrs/zustand)
