# MLBB Flex Profile Studio

MLBB Flex Profile Studio sekarang memakai arsitektur `local-first`.

Artinya:
- metadata utama dibaca dari folder `data/`
- editor tetap jalan walau semua API eksternal mati
- remote API hanya dipakai sebagai optional diagnostics/update source
- artwork resmi MLBB tidak dibundel otomatis

## Menjalankan Lokal

Prasyarat:
- Node.js 18+ sudah terpasang

Langkah:
1. Buka folder project ini.
2. Jalankan `npm run dev`.
3. Buka `http://localhost:4173`.

Catatan:
- JSON lokal seperti `/data/heroes.json` dan `/data/skins.json` dibaca lewat static server lokal.
- Jika langsung membuka `index.html` dari `file://`, beberapa browser bisa memblokir `fetch()` ke file JSON lokal. Jalur yang direkomendasikan tetap `npm run dev`.

## Deploy GitHub ke Vercel

1. Push project ke repository GitHub.
2. Import repository tersebut di Vercel.
3. Gunakan preset `Other`.
4. Build command: kosongkan.
5. Output directory: kosongkan.
6. Deploy.

Karena project ini murni static frontend:
- `index.html` menjadi entry utama
- file di folder `data/` tetap bisa diakses langsung
- `vercel.json` hanya menambahkan header cache ringan untuk JSON lokal

## Struktur Folder

```text
Profile-Generator-MLBB/
├── api.js
├── index.html
├── manifest.json
├── package.json
├── README.md
├── script.js
├── server.mjs
├── style.css
├── vercel.json
└── data/
    ├── heroes.json
    ├── skins.json
    ├── emblems.json
    ├── roles.json
    ├── badges.json
    ├── frames.json
    └── backgrounds.json
```

## Arsitektur Data

Alur baru:

```text
LOCAL JSON
   ↓
MLBB FLEX APP
   ↑
OPTIONAL REMOTE UPDATE / DIAGNOSTICS
```

Bukan:

```text
REMOTE API
   ↓
MLBB FLEX APP
```

Source of truth:
- `data/heroes.json`
- `data/skins.json`
- `data/roles.json`
- `data/emblems.json`
- `data/badges.json`
- `data/frames.json`
- `data/backgrounds.json`

Remote provider config:
- `manifest.json`

## Menambah Hero

Edit `data/heroes.json`.

Contoh:

```json
{
  "id": "gusion",
  "name": "Gusion",
  "roles": ["Assassin"],
  "specialty": ["Burst", "Magic Damage"],
  "portrait": "assets/heroes/gusion/portrait.webp",
  "artwork": "assets/heroes/gusion/artwork.webp",
  "addedAt": "2026-08-17"
}
```

Aturan:
- `id` harus unik
- `roles` harus memakai nama role MLBB asli
- `portrait` dan `artwork` menunjuk ke asset lokal milikmu sendiri atau placeholder yang kamu punya izin pakai

## Menambah Skin

Edit `data/skins.json`.

Contoh:

```json
{
  "id": "gusion-cosmic-gleam",
  "heroId": "gusion",
  "name": "Cosmic Gleam",
  "rarity": "Collector",
  "artwork": "assets/skins/gusion/cosmic-gleam.webp",
  "icon": "assets/skins/gusion/cosmic-gleam-icon.webp"
}
```

Aturan:
- `heroId` harus cocok dengan `id` hero di `heroes.json`
- dropdown skin otomatis memfilter berdasarkan `heroId`

## Menambah Frame

Edit `data/frames.json`.

Contoh:

```json
{
  "id": "royal",
  "name": "Royal Gold",
  "rarity": "Legendary",
  "asset": "assets/frames/royal-gold.webp",
  "styleType": "solid",
  "primary": "#f3c969",
  "secondary": "#f3c969"
}
```

## Menambah Badge

Edit `data/badges.json`.

Contoh:

```json
{
  "id": "mvp",
  "name": "MVP",
  "accent": "#f3c969"
}
```

## Menambah Emblem

Edit `data/emblems.json`.

Contoh:

```json
{
  "id": "best-carry",
  "name": "Best Carry",
  "token": "Best Carry",
  "asset": "assets/emblems/best-carry.webp"
}
```

## Menambah Background

Edit `data/backgrounds.json`.

Contoh:

```json
{
  "id": "abyss",
  "name": "Abyss",
  "asset": "assets/backgrounds/abyss.webp",
  "accent": "#8fb6ff",
  "colors": ["#10192d", "#050a14", "#26426c"],
  "style": "radial-gradient(circle at 70% 14%,rgba(255,255,255,.18),transparent 20%),linear-gradient(145deg,#10192d 0%,#050a14 55%,#26426c 100%)"
}
```

## Update Metadata

Jika ingin update metadata hero/emblem secara manual:
1. edit file JSON di folder `data/`
2. refresh browser
3. jika perlu, gunakan `Reset Profile` untuk memuat ulang pilihan default

Project ini sengaja tidak mengharuskan remote sync agar editor tetap stabil.

## Mengganti API Provider

Remote provider diatur di `manifest.json`.

Bagian yang bisa diubah:
- `baseUrl`
- `heroesEndpoint`
- `emblemsEndpoint`
- `timeoutMs`
- `size`
- `index`
- `order`
- `lang`

Contoh:

```json
{
  "api": {
    "enabled": true,
    "timeoutMs": 8000,
    "providers": [
      {
        "id": "primary",
        "name": "MLBB Rone API",
        "baseUrl": "https://mlbb.rone.dev/api",
        "heroesEndpoint": "/heroes",
        "emblemsEndpoint": "/academy/emblems"
      }
    ]
  }
}
```

Jika remote gagal:
- app tetap memakai local database
- hero dan skin tidak kosong
- badge, emblem, frame, background tetap tersedia
- status UI akan menjadi `LOCAL DATABASE` atau `REMOTE OFFLINE`

## Local Storage

Editor menyimpan data berikut ke `localStorage`:
- selected hero
- selected skin
- selected frame
- selected background
- selected emblem
- selected badge
- profile text dan stats
- layout drag / scale / rotate
- custom colors

Gunakan tombol `Reset Profile` untuk menghapus state tersimpan dan kembali ke default.

## Asset dan Hak Cipta

Penting:
- project ini memisahkan metadata dari artwork
- metadata boleh disusun lokal dalam JSON
- artwork resmi MLBB tidak boleh diasumsikan bebas pakai
- jangan bundle, download, atau redistribusikan artwork resmi tanpa izin yang tepat

Jika asset lokal belum ada:
- aplikasi akan memakai placeholder lokal
- UI tetap jalan
- export PNG tetap bisa dilakukan

## Ringkasan Fitur Saat Ini

- local-first data architecture
- hero dropdown dari `data/heroes.json`
- skin dropdown terhubung ke `data/skins.json`
- role mengikuti hero
- search hero berdasarkan nama, role, dan specialty
- sort hero `A-Z`, `Z-A`, `Role`, `Recently Added`
- badge/emblem/frame/background dari JSON lokal
- remote API diagnostics opsional
- localStorage restore
- reset profile
- randomize dari database lokal
- preset tetap tersedia
- PNG export tetap tersedia
