# Product Management App 🚀

Aplikasi mobile untuk mengelola inventaris produk dan kategori menggunakan React Native CLI. Project ini dibuat sebagai bagian dari Technical Test Home Task.

---

## 📱 Demo Video & Screenshots

* **Link Video Demo:** [👉Tonton di YouTube](https://www.youtube.com/watch?v=QpiD4cQIJwU)

* **Screenshot Utama:**

    | Login | Register | Product | Category | Stock | Profile |
    |-------|----------|---------|----------|-------|---------|
    | ![Login](https://github.com/slmnfqh/eureka-product-management-app/blob/main/assetReadMe/login.png) | ![Register](https://github.com/slmnfqh/eureka-product-management-app/blob/main/assetReadMe/register.png) | ![Products](https://github.com/slmnfqh/eureka-product-management-app/blob/main/assetReadMe/product.png) | ![Category](https://github.com/slmnfqh/eureka-product-management-app/blob/main/assetReadMe/category.png) | ![Stock](https://github.com/slmnfqh/eureka-product-management-app/blob/main/assetReadMe/stock.png) | ![Profile](https://github.com/slmnfqh/eureka-product-management-app/blob/main/assetReadMe/profile.png) |

---

## 🛠 Teknologi yang Digunakan

Sesuai dengan requirements Technical Test:

### Frontend & UI
* **Framework:** React Native CLI 0.83.1 (Latest Stable)
* **Language:** TypeScript 5.8.3
* **Navigation:** React Navigation 7.x
  - Stack Navigator untuk flow screen
  - Bottom Tabs untuk main navigation
* **Styling:** StyleSheet dengan Custom Design System
* **Icons:** React Native Vector Icons (Ionicons & Material Icons)
* **Image Handling:** React Native Image Picker 8.2.1

### State Management & Data
* **State Management:** Redux Toolkit 2.11.2
* **HTTP Client:** Axios 1.13.2
* **Persistent Storage:** AsyncStorage 2.2.0
* **Safe Area:** React Native Safe Area Context 5.6.2

---

## ✅ Fitur yang Diimplementasikan

Semua fitur sesuai dengan Technical Test requirements:

### 🔐 1. Autentikasi (Auth Flow)

#### ✅ Login Page
* Form email & password dengan **validasi lengkap**:
  - Email format validation (regex)
  - Password minimum 8 karakter
  - Error handling dengan user-friendly messages
  - Loading indicator saat proses login
* **Bukan sekadar tombol klik** - full validation implemented

#### ✅ Session Management
* Status login disimpan menggunakan **AsyncStorage**
* User **tidak perlu login ulang** setelah app restart
* Token authentication tersimpan secara persistent
* Auto-redirect ke MainTab jika sudah login

#### ✅ Logout
* Tombol logout di **halaman profil**
* Konfirmasi Alert sebelum logout
* Menghapus session dan token dari AsyncStorage
* Redirect ke Login screen

### 📂 2. Kategori Produk (CRUD)

#### ✅ List Kategori
* Menampilkan daftar kategori dengan **color-coded badges**
* Empty state jika data kosong
* Loading indicator saat fetch data
* **Sorting:** Kategori terbaru (ID terbesar) tampil di atas

#### ✅ Create/Edit Kategori
* Form untuk menambah kategori baru
* Form untuk mengubah nama kategori existing
* Validasi input (tidak boleh kosong)
* Loading state saat submit
* Success/Error feedback dengan Alert

#### ✅ Delete Kategori
* **Alert konfirmasi** sebelum hapus
* **Foreign Key Protection:** Kategori yang digunakan produk tidak bisa dihapus
* Error message yang user-friendly
* Auto-refresh list setelah delete

### 📦 3. Produk (CRUD & Relasi)

#### ✅ List Produk
* Menampilkan daftar produk dengan:
  - Foto produk
  - Nama produk
  - Kode produk
  - **Kategori** (dengan color badge)
* Empty state dengan icon & message
* Loading indicator
* **Sorting:** Produk terbaru tampil di atas (by tgl_register)

#### ✅ Detail & Edit Produk
* **Klik produk** untuk melihat detail lengkap:
  - Foto produk (full size)
  - Nama produk
  - Kode produk
  - Kategori produk
  - ID produk
* **Edit produk** dengan form lengkap:
  - Nama Produk
  - Kode Produk
  - **Pilih Kategori** (dropdown dari data kategori existing)
  - Upload foto produk
* Image picker untuk ganti foto
* Validasi semua field

#### ✅ Delete Produk
* Tombol delete di list dan detail
* **Alert konfirmasi** sebelum hapus
* Auto-refresh list setelah delete
* Error handling

### 📊 4. Fitur Tambahan: Manajemen Stok

Fitur di luar requirement:

* **CRUD Complete** untuk stok barang
* **Status Indikator Otomatis:**
  - 🟢 Tersedia (≥20 unit)
  - 🟡 Minim (10-19 unit)
  - 🔴 Habis (<10 unit)
* Relasi dengan produk (dropdown selection)
* Real-time update timestamp
* Sorting by last update

### 👤 5. Profile

#### ✅ Informasi Akun
* Menampilkan **nama user** dari API
* Menampilkan **email** dari API
* User ID
* Custom avatar/icon

#### ✅ Logout Integration
* **Tombol Logout** terintegrasi di profile
* Alert konfirmasi
* Clear session & redirect

---

## 📊 Kriteria Penilaian - Implementasi

### ✅ Architecture & Pattern

**Folder Structure yang Rapi:**
```
src/
├── components/          # Reusable components
│   ├── Button.tsx
│   ├── FloatingButton.tsx
│   ├── Input.tsx
├── constants/          # constants
│   ├── colors.tsx
├── navigation/         # Navigation setup
│   ├── Auth.tsx
│   ├── Category.tsx
│   ├── MainTab.tsx
│   ├── Product.tsx
│   ├── Root.tsx
│   ├── Stock.tsx
├── screens/           # Feature-based screens
│   ├── auth/         # Login & Register
│   ├── category/     # Category CRUD
│   ├── product/      # Product CRUD
│   ├── stock/        # Stock management
│   └── profile/      # Profile & logout
├── services/         # API services
│   ├── api.ts
│   ├── authService.ts
│   ├── categoryService.ts
│   ├── productService.ts
│   └── stockService.ts
├── store/            # Redux slices
│   ├── index.ts
│   ├── authSlice.ts
│   ├── categorySlice.ts
│   ├── productSlice.ts
│   └── stockSlice.ts
├── types/            # TypeScript interfaces
└── utils/            # Helper functions
```

### ✅ State Management

**Redux Toolkit Implementation:**
* **Centralized State:** Semua data dikelola di Redux store
* **Auto-Update:** Saat produk/kategori dihapus, list otomatis terupdate tanpa refresh manual
* **Persistent Auth:** Token tersimpan dan ter-restore otomatis
* **Clean Flow:** dispatch → service → API → update state → UI re-render

**Contoh Flow:**
```typescript
// Delete Product → Auto-refresh list
handleDelete() → deleteProduk(id) → dispatch(fetchProductSuccess) → UI Update
```

### ✅ UI/UX Quality

#### Loading Indicators
* ✅ Setiap fetch data menampilkan ActivityIndicator
* ✅ Button loading state saat submit form
* ✅ Skeleton/placeholder yang user-friendly

#### Empty State
* ✅ Icon & message jika data kosong
* ✅ Call-to-action (CTA) button untuk tambah data
* ✅ Konsisten di semua list (Product, Category, Stock)

#### Error Handling
* ✅ Alert dengan pesan error yang jelas
* ✅ Network error handling
* ✅ Validation error feedback
* ✅ Foreign key constraint handling

**Contoh Error Handling:**
```typescript
try {
  await deleteKategori(id);
  // Success flow
} catch (err) {
  if (err.message.includes('foreign key')) {
    Alert.alert('Kategori tidak bisa dihapus karena masih digunakan produk');
  } else {
    Alert.alert('Error', err.message);
  }
}
```

---

## ⚙️ Cara Instalasi & Menjalankan Aplikasi

### 1. Persyaratan Sistem

| Tool | Version | Status |
|------|---------|--------|
| Node.js | 20.19.4 | ✅ Tested |
| npm | 10.8.2 | ✅ Tested |
| JDK | 17 | ✅ Required |
| Android Studio | Latest | ✅ Required |
| React Native CLI | Latest | ✅ Required |

**Verifikasi instalasi:**
```bash
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
java --version   # Should show version 17
```

### 2. Clone Repository
```bash
git clone https://github.com/slmnfqh/eureka-product-management-app.git
cd eureka-product-management-app
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Android

#### a. Start Android Emulator
1. Buka **Android Studio**
2. Buka **AVD Manager**
3. Start emulator yang sudah ada (atau create new)


### 5. Run Application

#### Terminal 1 - Start Metro Bundler
```bash
npm start
```

#### Terminal 2 - Run Android App
```bash
npm run android
```

**Aplikasi akan otomatis install dan buka di emulator/device**

---

## 🔐 API Configuration

Base URL sudah dikonfigurasi di `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://test-kandidat.eurekagroup.id';
```

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "19.2.0",
  "react-native": "0.83.1",
  "@react-navigation/native": "^7.1.27",
  "@react-navigation/native-stack": "^7.9.1",
  "@react-navigation/bottom-tabs": "^7.9.1",
  "@reduxjs/toolkit": "^2.11.2",
  "react-redux": "^9.2.0",
  "axios": "^1.13.2",
  "react-native-image-picker": "^8.2.1",
  "react-native-vector-icons": "^10.3.0",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "react-native-safe-area-context": "^5.6.2",
  "react-native-screens": "^4.19.0"
}
```

### Dev Dependencies
```json
{
  "@types/react": "^19.2.0",
  "@types/react-native-vector-icons": "^6.4.18",
  "typescript": "^5.8.3",
  "prettier": "2.8.8",
  "eslint": "^8.19.0"
}
```

---

## 🐛 Troubleshooting

### Problem: Metro Bundler Error
```bash
# Solution: Clear cache
npm start -- --reset-cache
```

### Problem: Android Build Failed
```bash
# Solution: Clean build
cd android
./gradlew clean
cd ..
npm run android
```

### Problem: Icons Not Showing
```bash
# Solution: Re-link assets
npx react-native-asset
npm run android
```

### Problem: Font Not Applied
```bash
# Solution: Re-link font and rebuild
npx react-native-asset
npm run android
```

### Problem: Network Request Failed
* Pastikan emulator/device bisa akses internet
* Pastikan API URL benar: `https://test-kandidat.eurekagroup.id`
* Check console log untuk detail error

---

## 👨‍💻 Developer

**[Sulaiman Faqih]**  
* Email: sulaimanfaqih00@gmail.com  
* GitHub: [@slmnfqh](https://github.com/slmnfqh)  
* LinkedIn: [sulaimanfaqih](https://linkedin.com/in/sulaimanfaqih)

---

## 📄 License

This project is created for technical test purposes.

---

**⭐ Thank you for reviewing this project! ⭐**

---

## 📞 Contact

Jika ada pertanyaan terkait project ini, silakan hubungi:
* Email: sulaimanfaqih00@gmail.com

**Ready for deployment and review!** 🚀
