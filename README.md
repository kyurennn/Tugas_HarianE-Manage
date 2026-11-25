# Student Directory

Aplikasi web sederhana untuk menampilkan daftar mahasiswa dari database PostgreSQL menggunakan React (Vite) di sisi frontend dan NestJS + Prisma ORM di sisi backend.

## Tech Stack

- **Frontend:** React, Vite, JavaScript (JSX), CSS, Fetch API
- **Backend:** Node.js, NestJS, TypeScript, Prisma ORM
- **Database:** PostgreSQL

## Prasyarat

- Node.js 18+
- PostgreSQL

## Menjalankan Secara Lokal

### 1. Siapkan Database

Buat database PostgreSQL baru bernama `student_directory`:

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
| `GET` | `/students` | Mengambil semua data mahasiswa (diurutkan berdasarkan NIM) |
| `GET` | `/students/:id` | Mengambil detail satu mahasiswa berdasarkan ID (`404` jika tidak ditemukan) |

Contoh response `GET /students/:id`:

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
