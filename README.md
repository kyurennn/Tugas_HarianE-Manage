# Student Directory

Aplikasi web sederhana untuk mengelola data mahasiswa (CRUD) menggunakan React (Vite) di sisi frontend dan NestJS + Prisma ORM + PostgreSQL di sisi backend.

## Tech Stack

- **Frontend:** React, Vite, JavaScript (JSX), CSS, Fetch API
- **Backend:** Node.js, NestJS, TypeScript, Prisma ORM
- **Database:** PostgreSQL

## Prasyarat

- Node.js 18+
- PostgreSQL

## Menjalankan Secara Lokal

### 1. Siapkan Database

Buat database PostgreSQL bernama `student_directory`:

```sql
CREATE DATABASE student_directory;
```

### 2. Konfigurasi & Jalankan Backend

```bash
cd backend
cp .env.example .env
```

Sesuaikan `DATABASE_URL` di `backend/.env` dengan kredensial PostgreSQL lokal:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/student_directory?schema=public"
PORT=3001
```

Install dependency, jalankan migrasi, seed data awal, lalu jalankan server:

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run start:dev
```

Backend berjalan di `http://localhost:3001`.

Untuk melihat data lewat Prisma Studio:

```bash
npx prisma studio
```

### 3. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

## Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/students` | Mengambil semua data mahasiswa (mendukung query `?search=...` dan `?entryYear=...`) |
| `GET` | `/students/stats` | Statistik jumlah total mahasiswa dan jumlah per angkatan |
| `GET` | `/students/:id` | Mengambil detail satu mahasiswa berdasarkan ID (`404` jika tidak ditemukan) |
| `POST` | `/students` | Menambahkan data mahasiswa baru (`409` jika NIM sudah terdaftar) |
| `PATCH` | `/students/:id` | Memperbarui data mahasiswa berdasarkan ID |
| `DELETE` | `/students/:id` | Menghapus data mahasiswa berdasarkan ID |

Contoh body `POST /students`:

```json
{
  "nim": "103022400099",
  "name": "Raka Pratama",
  "studyProgram": "S1 Rekayasa Perangkat Lunak",
  "entryYear": 2024,
  "email": "rakapratama@student.telkomuniversity.ac.id"
}
```
