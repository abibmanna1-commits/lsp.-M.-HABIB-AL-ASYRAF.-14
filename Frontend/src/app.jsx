import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const formAwal = {
  kode_siswa: '',
  nama_siswa: '',
  alamat_siswa: '',
  tgl_siswa: '',
  jurusan_siswa: ''
};

function App() {
  const [siswa, setSiswa] = useState([]);
  const [form, setForm] = useState(formAwal);
  const [modeEdit, setModeEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState('');

  // GET: Mengambil data siswa dari backend
  const ambilData = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Gagal mengambil data siswa');
      }

      const data = await response.json();
      setSiswa(data);
    } catch (error) {
      setPesan(error.message);
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  // Mengatur perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  // POST dan PUT: Menambah atau mengedit siswa
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kode_siswa || !form.nama_siswa) {
      setPesan('Kode dan nama siswa wajib diisi!');
      return;
    }

    setLoading(true);
    setPesan('');

    try {
      const url = modeEdit
        ? `${API_URL}/${encodeURIComponent(form.kode_siswa)}`
        : API_URL;

      const method = modeEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Operasi gagal');
      }

      setPesan(result.message);
      setForm(formAwal);
      setModeEdit(false);

      await ambilData();

    } catch (error) {
      setPesan(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mengisi form untuk diedit
  const handleEdit = (data) => {
    setForm({
      kode_siswa: data.kode_siswa,
      nama_siswa: data.nama_siswa,
      alamat_siswa: data.alamat_siswa || '',
      tgl_siswa: data.tgl_siswa
        ? String(data.tgl_siswa).slice(0, 10)
        : '',
      jurusan_siswa: data.jurusan_siswa || ''
    });

    setModeEdit(true);
    setPesan('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // DELETE: Menghapus data siswa
  const handleDelete = async (kode) => {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus siswa ${kode}?`
    );

    if (!yakin) return;

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(kode)}`,
        {
          method: 'DELETE'
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus data');
      }

      setPesan(result.message);
      await ambilData();

    } catch (error) {
      setPesan(error.message);
    }
  };

  // Membatalkan edit
  const batalEdit = () => {
    setForm(formAwal);
    setModeEdit(false);
    setPesan('');
  };

  return (
    <div className="app-container">

      <header className="header">
        <div className="logo">🎓</div>
        <div>
          <h1>Data Siswa</h1>
          <p>Aplikasi Manajemen Data Siswa</p>
        </div>
      </header>

      <main className="main-content">

        <section className="stats">
          <div className="stat-card">
            <span>Total Siswa</span>
            <h2>{siswa.length}</h2>
          </div>

          <div className="stat-card">
            <span>Status Backend</span>
            <h2 className="status-online">Terhubung</h2>
          </div>
        </section>

        <section className="form-card">
          <h2>
            {modeEdit ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Kode Siswa</label>
                <input
                  type="text"
                  name="kode_siswa"
                  placeholder="Contoh: #S005"
                  value={form.kode_siswa}
                  onChange={handleChange}
                  disabled={modeEdit}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nama Siswa</label>
                <input
                  type="text"
                  name="nama_siswa"
                  placeholder="Masukkan nama siswa"
                  value={form.nama_siswa}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Alamat Siswa</label>
                <input
                  type="text"
                  name="alamat_siswa"
                  placeholder="Masukkan alamat"
                  value={form.alamat_siswa}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tanggal Lahir</label>
                <input
                  type="date"
                  name="tgl_siswa"
                  value={form.tgl_siswa}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Jurusan Siswa</label>
                <input
                  type="text"
                  name="jurusan_siswa"
                  placeholder="Contoh: Teknik Informatika"
                  value={form.jurusan_siswa}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? 'Memproses...'
                  : modeEdit
                    ? 'Simpan Perubahan'
                    : 'Tambah Siswa'}
              </button>

              {modeEdit && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={batalEdit}
                >
                  Batal
                </button>
              )}
            </div>

          </form>

          {pesan && (
            <p className="message">{pesan}</p>
          )}
        </section>

        <section className="table-card">
          <div className="table-header">
            <div>
              <h2>Daftar Siswa</h2>
              <p>Data siswa yang tersimpan di database MySQL</p>
            </div>

            <button
              className="btn-refresh"
              onClick={ambilData}
            >
              ↻ Refresh
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Siswa</th>
                  <th>Nama Siswa</th>
                  <th>Alamat</th>
                  <th>Tanggal Lahir</th>
                  <th>Jurusan</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {siswa.length > 0 ? (
                  siswa.map((data, index) => (
                    <tr key={data.kode_siswa}>
                      <td>{index + 1}</td>
                      <td>{data.kode_siswa}</td>
                      <td>{data.nama_siswa}</td>
                      <td>{data.alamat_siswa}</td>
                      <td>
                        {data.tgl_siswa
                          ? String(data.tgl_siswa).slice(0, 10)
                          : '-'}
                      </td>
                      <td>{data.jurusan_siswa}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(data)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() =>
                              handleDelete(data.kode_siswa)
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-data">
                      Belum ada data siswa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <footer>
        <p>© 2026 Aplikasi Data Siswa | React.js + Express.js + MySQL</p>
      </footer>

    </div>
  );
}

export default App;