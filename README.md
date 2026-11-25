
<<<<<<< Updated upstream
=======
Aplikasi web sederhana **Student Directory** (Direktori Mahasiswa) yang dibangun untuk memenuhi tugas mata kuliah **Perancangan dan Pemrograman Web (S1 Rekayasa Perangkat Lunak)** sesuai dengan capaian materi praktikum **Modul 1 sampai Modul 10**.

Aplikasi ini mendemonstrasikan integrasi *full-stack* modern:
- **Frontend**: Antarmuka pengguna responsif berbasis React.js dan Vite yang mengonsumsi data via Fetch API.
- **Backend**: Layanan REST API berbasis NestJS dengan arsitektur modular (*Module, Controller, Service*) dan *Dependency Injection*.
- **Database**: PostgreSQL yang diakses menggunakan Prisma ORM (*Prisma Client, Migration, dan Seed*).

---

## 1. Teknologi yang Digunakan

### Frontend
- **React.js** (dengan bundler **Vite**)
- **JavaScript (JSX)** (tanpa TypeScript untuk kemudahan pemahaman mahasiswa)
- **CSS Murni (Native CSS)** dengan tema *Clean Academic Dashboard* (tanpa framework Tailwind / Bootstrap)
- **Fetch API** (`async/await`) untuk komunikasi data dengan backend API
- React Hooks: `useState` (manajemen state data, loading, dan error) serta `useEffect` (siklus hidup pengambilan data awal)

### Backend
- **Node.js** & **NestJS** (TypeScript)
- Arsitektur standar NestJS: **Module**, **Controller**, dan **Service**
- **Dependency Injection** menggunakan dekorator `@Injectable()` dan constructor injection
- **Prisma ORM** (Prisma Schema, Prisma Migrate, Prisma Client)
- **CORS** diaktifkan untuk mengizinkan permintaan dari origin frontend (`http://localhost:5173`)

### Database
- **PostgreSQL** (Basis Data Relasional)
- Nama Basis Data: `student_directory`
- Tabel Utama: `students` (dengan atribut `id` [UUID], `nim` [Unique], `name`, `studyProgram`, `entryYear`, `email`)

### Pengujian API
- **Postman** / cURL / REST Client

---

## 2. Struktur Folder Proyek

```text
Tugas_HarianE-Manage/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   └── 20261118172438_init/
│   │   │       └── migration.sql       # Berkas migrasi DDL SQL tabel students
│   │   ├── schema.prisma               # Definisi datasource, generator, & model Student
│   │   └── seed.js                     # Skrip pengisian 12 data awal mahasiswa
│   ├── src/
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts        # Module penyedia PrismaService secara global
│   │   │   └── prisma.service.ts       # Service pembungkus PrismaClient (OnModuleInit & OnModuleDestroy)
│   │   ├── students/
│   │   │   ├── entities/
│   │   │   │   └── student.entity.ts   # Definisi representasi data Student
│   │   │   ├── students.controller.ts  # Controller HTTP handler GET /students & GET /students/:id
│   │   │   ├── students.module.ts      # Pengelompok fitur resource Students
│   │   │   └── students.service.ts     # Service logika bisnis & pemanggilan PrismaService
│   │   ├── app.module.ts               # Module akar aplikasi
│   │   └── main.ts                     # Titik masuk aplikasi (Port 3001 & Konfigurasi CORS)
│   ├── .env                            # Konfigurasi environment lokal (DATABASE_URL & PORT)
│   ├── .env.example                    # Template environment untuk publik/tim
│   ├── package.json                    # Konfigurasi dependency & skrip backend
│   └── tsconfig.json                   # Konfigurasi TypeScript
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── StudentTable.jsx        # Komponen tabel untuk merender baris mahasiswa
│   │   ├── App.css                     # Gaya CSS tema Clean Academic Dashboard
│   │   ├── App.jsx                     # Komponen utama (State, Effect, Fetch API, Kondisi UI)
│   │   ├── index.css                   # CSS reset & tipografi dasar
│   │   └── main.jsx                    # Titik masuk rendering React DOM
│   ├── index.html                      # Berkas HTML utama
│   ├── package.json                    # Konfigurasi dependency frontend
│   └── vite.config.js                  # Konfigurasi Vite
└── README.md                           # Dokumentasi lengkap proyek
```

---

## 3. Langkah Instalasi dan Menjalankan Aplikasi

Pastikan pada komputer Anda telah terpasang:
- **Node.js** (versi 18 LTS atau lebih baru)
- **PostgreSQL** (versi 14, 15, 16, atau 18)

---

### Langkah 1: Persiapan Database PostgreSQL

1. Buka **pgAdmin 4** atau terminal **psql**.
2. Buat database baru bernama `student_directory`:
   ```sql
   CREATE DATABASE student_directory;
   ```
3. Pastikan server PostgreSQL berjalan pada port default (`5432`).

---

### Langkah 2: Konfigurasi Environment Backend

1. Buka direktori `backend/`:
   ```bash
   cd backend
   ```
2. Salin berkas `.env.example` menjadi `.env` jika belum ada:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan `DATABASE_URL` pada berkas `backend/.env` dengan kredensial PostgreSQL Anda:
   ```env
   DATABASE_URL="postgresql://<USER>:<PASSWORD>@localhost:5432/student_directory?schema=public"
   PORT=3001
   ```
   > **Catatan:** Ganti `<USER>` dengan username PostgreSQL Anda (biasanya `postgres`) dan `<PASSWORD>` dengan kata sandi akun PostgreSQL Anda.

---

### Langkah 3: Instalasi Dependency Backend, Migrasi, dan Seed Data

1. Jalankan instalasi dependensi backend:
   ```bash
   npm install
   ```
2. Jalankan migrasi Prisma untuk membuat tabel `students` di dalam database:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Jalankan *database seed* untuk mengisi 12 data mahasiswa realistis:
   ```bash
   npm run seed
   ```
   *(Atau dapat menggunakan perintah `npx prisma db seed`)*.
4. *(Opsional)* Buka **Prisma Studio** untuk memeriksa isi tabel `students` secara visual di browser:
   ```bash
   npx prisma studio
   ```
   Prisma Studio akan terbuka pada `http://localhost:5555`.

---

### Langkah 4: Menjalankan Server Backend API

Jalankan backend NestJS dalam mode *development watch*:
```bash
npm run start:dev
```
Server backend akan aktif pada:
- **Base URL**: `http://localhost:3001`
- **Endpoint Mahasiswa**: `http://localhost:3001/students`

---

### Langkah 5: Instalasi dan Menjalankan Frontend

Buka jendela terminal baru:
1. Masuk ke direktori `frontend/`:
   ```bash
   cd frontend
   ```
2. Pasang dependensi frontend:
   ```bash
   npm install
   ```
3. Jalankan server pengembang Vite:
   ```bash
   npm run dev
   ```
4. Buka peramban (browser) Anda dan akses alamat:
   ```
   http://localhost:5173
   ```

---

## 4. Daftar Endpoint REST API

| Method | Endpoint | Keterangan | Status Sukses |
|---|---|---|---|
| `GET` | `/students` | Mengambil seluruh data mahasiswa dari PostgreSQL | `200 OK` |
| `GET` | `/students/:id` | Mengambil satu data mahasiswa berdasarkan ID (UUID) | `200 OK` (atau `404 Not Found` jika tidak ada) |

---

## 5. Pengujian API Melalui Postman

Backend dapat diuji secara mandiri tanpa harus membuka antarmuka frontend.

### Uji Coba 1: Mengambil Seluruh Mahasiswa (`GET /students`)
- **Method**: `GET`
- **URL**: `http://localhost:3001/students`
- **Headers**: *(Kosongkan / Default)*
- **Status Harapan**: `200 OK`
- **Contoh Respons JSON** (Data terurut secara ascending berdasarkan NIM - `orderBy: { nim: 'asc' }`):
```json
[
  {
    "id": "59d7d103-c95b-47f1-b351-751d09661418",
    "nim": "103022000130",
    "name": "Joko Susilo",
    "studyProgram": "S1 Rekayasa Perangkat Lunak",
    "entryYear": 2020,
    "email": "jokosusilo@student.telkomuniversity.ac.id"
  },
  {
    "id": "ef8ea895-6df0-4102-a05a-126b67ae469e",
    "nim": "103022100102",
    "name": "Hadi Prasetyo",
    "studyProgram": "S1 Rekayasa Perangkat Lunak",
    "entryYear": 2021,
    "email": "hadiprasetyo@student.telkomuniversity.ac.id"
  },
  {
    "id": "9fdcf970-aadf-4a45-aa86-72f064fb243a",
    "nim": "103022100115",
    "name": "Indah Permatasari",
    "studyProgram": "S1 Rekayasa Perangkat Lunak",
    "entryYear": 2021,
    "email": "indahpermatasari@student.telkomuniversity.ac.id"
  }
]
```

### Uji Coba 2: Mengambil Satu Mahasiswa Berdasarkan ID (`GET /students/:id`)
- **Method**: `GET`
- **URL**: `http://localhost:3001/students/59d7d103-c95b-47f1-b351-751d09661418`
- **Status Harapan**: `200 OK`
- **Contoh Respons JSON**:
```json
{
  "id": "59d7d103-c95b-47f1-b351-751d09661418",
  "nim": "103022000130",
  "name": "Joko Susilo",
  "studyProgram": "S1 Rekayasa Perangkat Lunak",
  "entryYear": 2020,
  "email": "jokosusilo@student.telkomuniversity.ac.id"
}
```

### Uji Coba 3: Mengambil ID yang Tidak Ada
- **Method**: `GET`
- **URL**: `http://localhost:3001/students/id-tidak-ada`
- **Status Harapan**: `404 Not Found`
- **Contoh Respons JSON**:
```json
{
  "message": "Mahasiswa dengan ID 'id-tidak-ada' tidak ditemukan",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 6. Penjelasan Hubungan Antar Komponen (Alur End-to-End)

Implementasi kode pada project ini mengikuti alur komunikasi berlapis secara utuh:

1. **Pengguna Membuka Halaman**: Pengguna mengakses `http://localhost:5173` pada peramban web.
2. **React Menjalankan `useEffect`**: Saat komponen `App` pertama kali dimuat (*mounting*), `useEffect` terpicu untuk memanggil fungsi asynchronous `fetchStudents()`.
3. **Fetch API Mengirim Permintaan HTTP**: Fungsi `fetch('http://localhost:3001/students')` mengirimkan request HTTP GET ke endpoint backend NestJS.
4. **`StudentsController` Menerima Request**: Request HTTP GET diterima oleh metode handler `@Get()` pada `StudentsController`.
5. **Controller Memanggil Service via Dependency Injection**: `StudentsController` tidak melakukan pengolahan data langsung, melainkan meneruskan tugas ke `StudentsService` yang telah disuntikkan secara otomatis melalui *constructor Dependency Injection* (`constructor(private readonly studentsService: StudentsService)`).
6. **`StudentsService` Menjalankan `findAll()`**: Metode `findAll()` dipanggil untuk mengambil daftar mahasiswa.
7. **Service Menggunakan `PrismaService` via DI**: `StudentsService` mengakses basis data melalui instance `PrismaService` yang juga di-*inject* melalui *constructor* (`constructor(private readonly prisma: PrismaService)`).
8. **Prisma Client Melakukan Query ke PostgreSQL**: `PrismaService` mengeksekusi metode ORM `this.prisma.student.findMany({ orderBy: { nim: 'asc' } })` yang diterjemahkan menjadi kueri SQL relasional:
   ```sql
   SELECT "id", "nim", "name", "studyProgram", "entryYear", "email" FROM "students" ORDER BY "nim" ASC;
   ```
9. **PostgreSQL Mengembalikan Data**: Engine basis data PostgreSQL memproses kueri dan mengembalikan *row record* mahasiswa.
10. **Data Dikembalikan dalam Format JSON**: Prisma Client memetakan hasil kueri ke array objek TypeScript, kemudian dikembalikan secara bertingkat melalui `StudentsService` dan `StudentsController` ke klien dalam bentuk respon HTTP dengan payload JSON.
11. **Frontend Menerima Response JSON**: `fetchStudents` di React menerima respons HTTP, memverifikasi `response.ok === true`, lalu mengurai payload menggunakan `await response.json()`.
12. **React Memperbarui State**: State `students` diperbarui dengan `setStudents(data)`, sementara state `loading` diatur menjadi `false`.
13. **`StudentTable` Merender Tampilan Tabel**: Pembaruan state memicu *re-render* otomatis pada React. Komponen `StudentTable` menerima array `students` via *props* dan menampilkan data baris demi baris menggunakan fungsi `.map((student, index) => ...)` dengan atribut `key={student.id}`.
>>>>>>> Stashed changes
