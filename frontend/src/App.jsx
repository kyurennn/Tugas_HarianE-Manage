import { useState, useEffect } from 'react';
import StudentTable from './components/StudentTable';
import './App.css';

const API_URL = 'http://localhost:3001/students';

const EMPTY_FORM = {
  nim: '',
  name: '',
  studyProgram: 'S1 Rekayasa Perangkat Lunak',
  entryYear: '2024',
  email: '',
};

function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const [entryYearFilter, setEntryYearFilter] = useState('');

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch {
      // Abaikan error statistik jika backend sedang offline
    }
  };

  const fetchStudents = async (activeSearch = search, activeYear = entryYearFilter) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (activeSearch.trim()) params.append('search', activeSearch.trim());
      if (activeYear) params.append('entryYear', activeYear);

      const query = params.toString();
      const response = await fetch(query ? `${API_URL}?${query}` : API_URL);

      if (!response.ok) {
        throw new Error(`Gagal mengambil data (HTTP ${response.status})`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        'Tidak dapat terhubung ke server backend atau database. Pastikan backend aktif di port 3001 dan PostgreSQL berjalan.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents('', '');
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        entryYear: Number(formData.entryYear),
      };

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan data mahasiswa');
      }

      setFormData(EMPTY_FORM);
      setEditingId(null);
      await fetchStudents();
      await fetchStats();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormError('');
    setFormData({
      nim: student.nim,
      name: student.name,
      studyProgram: student.studyProgram,
      entryYear: String(student.entryYear),
      email: student.email,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Hapus mahasiswa ${student.name} (${student.nim})?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${student.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal menghapus data');
      }

      if (editingId === student.id) {
        handleCancelEdit();
      }
      await fetchStudents();
      await fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStudents(search, entryYearFilter);
  };

  const handleResetFilter = () => {
    setSearch('');
    setEntryYearFilter('');
    fetchStudents('', '');
  };

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-title">Student Directory</span>
          </div>
          <span className="brand-tag">S1 Rekayasa Perangkat Lunak</span>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          <div className="page-header">
            <div className="page-header-text">
              <h1 className="page-title">Daftar Mahasiswa</h1>
              <p className="page-description">
                Aplikasi manajemen direktori mahasiswa berbasis React, NestJS, Prisma ORM, dan PostgreSQL.
              </p>
            </div>

            {!loading && !error && (
              <div className="stats-box">
                <span className="stats-label">Total Database</span>
                <span className="stats-value">
                  {stats ? stats.totalStudents : students.length} Mahasiswa
                </span>
                <button
                  type="button"
                  className="btn-refresh"
                  onClick={() => {
                    fetchStudents();
                    fetchStats();
                  }}
                >
                  Refresh
                </button>
              </div>
            )}
          </div>

          {/* Form Tambah / Edit Mahasiswa */}
          <section className="card-container form-card">
            <h2 className="section-title">
              {editingId ? 'Edit Data Mahasiswa' : 'Tambah Mahasiswa Baru'}
            </h2>
            <form className="student-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="nim"
                placeholder="NIM (misal: 103022400099)"
                value={formData.nim}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="studyProgram"
                placeholder="Program Studi"
                value={formData.studyProgram}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="entryYear"
                placeholder="Angkatan (misal: 2024)"
                value={formData.entryYear}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Mahasiswa"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting
                    ? 'Menyimpan...'
                    : editingId
                    ? 'Simpan Perubahan'
                    : 'Tambah Mahasiswa'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
            {formError && <p className="form-error">{formError}</p>}
          </section>

          {/* Filter & Statistik Singkat */}
          <section className="card-container filter-card">
            <form className="filter-bar" onSubmit={handleFilterSubmit}>
              <input
                type="text"
                placeholder="Cari nama, NIM, atau prodi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={entryYearFilter}
                onChange={(e) => {
                  setEntryYearFilter(e.target.value);
                  fetchStudents(search, e.target.value);
                }}
              >
                <option value="">Semua Angkatan</option>
                {stats?.byEntryYear?.map((item) => (
                  <option key={item.entryYear} value={item.entryYear}>
                    Angkatan {item.entryYear} ({item.count})
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary">
                Cari
              </button>
              {(search || entryYearFilter) && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetFilter}
                >
                  Reset
                </button>
              )}
            </form>
          </section>

          {/* Tabel Data */}
          <section className="card-container">
            {loading && (
              <div className="status-box loading-box">
                <div className="spinner"></div>
                <p className="status-title">Memuat Data...</p>
                <p className="status-desc">Mengambil data mahasiswa dari backend API.</p>
              </div>
            )}

            {!loading && error && (
              <div className="status-box error-box">
                <p className="status-title error-text">Gagal Memuat Data</p>
                <p className="status-desc">{error}</p>
                <button className="btn-retry" onClick={() => fetchStudents()}>
                  Coba Lagi
                </button>
              </div>
            )}

            {!loading && !error && students.length === 0 && (
              <div className="status-box empty-box">
                <p className="status-title">Belum Ada Data Mahasiswa</p>
                <p className="status-desc">
                  Data tidak ditemukan atau tabel belum memiliki isi.
                </p>
              </div>
            )}

            {!loading && !error && students.length > 0 && (
              <div className="table-wrapper">
                <div className="table-header-info">
                  <span className="table-info-text">
                    Menampilkan <strong>{students.length}</strong> data mahasiswa
                  </span>
                </div>
                <StudentTable
                  students={students}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Student Directory</p>
      </footer>
    </div>
  );
}

export default App;
