import { useState, useEffect } from 'react';
import StudentTable from './components/StudentTable';
import './App.css';

function App() {
  // State untuk menyimpan daftar mahasiswa dari backend
  const [students, setStudents] = useState([]);
  // State untuk melacak status pemuatan data
  const [loading, setLoading] = useState(true);
  // State untuk melacak pesan kesalahan bila request gagal
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data mahasiswa dari backend REST API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Memanggil endpoint backend NestJS pada port 3001 menggunakan Fetch API
      const response = await fetch('http://localhost:3001/students');

      // Validasi status response HTTP (misal: 200 OK)
      if (!response.ok) {
        throw new Error(
          `Gagal mengambil data dari server (Status HTTP: ${response.status})`
        );
      }

      // Parsing respons JSON
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        'Tidak dapat terhubung ke server backend atau basis data. Pastikan backend NestJS aktif pada port 3001 dan database PostgreSQL telah berjalan.'
      );
    } finally {
      // Menghentikan indikator loading
      setLoading(false);
    }
  };

  // useEffect dijalankan sekali saat komponen pertama kali dimuat (mounting)
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="app-layout">
      {/* Navbar Sederhana */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-title">Student Directory</span>
          </div>
          <span className="brand-tag">S1 Rekayasa Perangkat Lunak</span>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="main-content">
        <div className="content-container">
          {/* Header Halaman & Deskripsi */}
          <div className="page-header">
            <div className="page-header-text">
              <h1 className="page-title">Daftar Mahasiswa</h1>
              <p className="page-description">
                Aplikasi web sederhana untuk menampilkan direktori data mahasiswa
                yang tersimpan di dalam basis data PostgreSQL melalui NestJS REST
                API.
              </p>
            </div>

            {/* Informasi Jumlah Mahasiswa & Tombol Refresh */}
            {!loading && !error && (
              <div className="stats-box">
                <span className="stats-label">Total Mahasiswa</span>
                <span className="stats-value">{students.length} Mahasiswa</span>
                <button
                  className="btn-refresh"
                  onClick={fetchStudents}
                  title="Muat ulang data dari database"
                >
                  🔄 Refresh
                </button>
              </div>
            )}
          </div>

          {/* Area Tampilan Berdasarkan Kondisi State (Loading / Error / Empty / Success) */}
          <section className="card-container">
            {loading && (
              <div className="status-box loading-box">
                <div className="spinner"></div>
                <p className="status-title">Memuat Data...</p>
                <p className="status-desc">
                  Mengambil data mahasiswa dari backend API (http://localhost:3001/students)
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="status-box error-box">
                <div className="error-icon">⚠️</div>
                <p className="status-title error-text">Gagal Memuat Data</p>
                <p className="status-desc">{error}</p>
                <button className="btn-retry" onClick={fetchStudents}>
                  Coba Lagi
                </button>
              </div>
            )}

            {!loading && !error && students.length === 0 && (
              <div className="status-box empty-box">
                <div className="empty-icon">📭</div>
                <p className="status-title">Belum Ada Data Mahasiswa</p>
                <p className="status-desc">
                  Database PostgreSQL belum memiliki data mahasiswa. Jalankan seed
                  untuk mengisi data awal.
                </p>
                <button className="btn-retry" onClick={fetchStudents}>
                  Periksa Kembali
                </button>
              </div>
            )}

            {!loading && !error && students.length > 0 && (
              <div className="table-wrapper">
                <div className="table-header-info">
                  <span className="table-info-text">
                    Menampilkan <strong>{students.length}</strong> data mahasiswa aktif
                  </span>
                </div>
                <StudentTable students={students} />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer Akademik */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Student Directory &bull; Tugas
          Perancangan dan Pemrograman Web (Modul 1 &ndash; 10)
        </p>
      </footer>
    </div>
  );
}

export default App;
