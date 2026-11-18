import express from 'express';
import cors from 'cors';
import { db } from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());

// READ - Mengambil semua data siswa
app.get('/api/siswa', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM siswa'
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ - Mengambil siswa berdasarkan kode
app.get('/api/siswa/:kode', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM siswa WHERE kode_siswa = ?',
            [req.params.kode]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// CREATE - Menambahkan siswa
app.post('/api/siswa', async (req, res) => {
    try {
        const {
            kode_siswa,
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        if (!kode_siswa || !nama_siswa) {
            return res.status(400).json({
                message: 'Kode dan nama siswa wajib diisi'
            });
        }

        await db.query(
            `INSERT INTO siswa
            (kode_siswa, nama_siswa, alamat_siswa,
            tgl_siswa, jurusan_siswa)
            VALUES (?, ?, ?, ?, ?)`,
            [
                kode_siswa,
                nama_siswa,
                alamat_siswa,
                tgl_siswa || null,
                jurusan_siswa
            ]
        );

        res.status(201).json({
            message: 'Data siswa berhasil ditambahkan'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE - Mengubah data siswa
app.put('/api/siswa/:kode', async (req, res) => {
    try {
        const {
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        const [result] = await db.query(
            `UPDATE siswa SET
            nama_siswa = ?,
            alamat_siswa = ?,
            tgl_siswa = ?,
            jurusan_siswa = ?
            WHERE kode_siswa = ?`,
            [
                nama_siswa,
                alamat_siswa,
                tgl_siswa || null,
                jurusan_siswa,
                req.params.kode
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil diperbarui'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// DELETE - Menghapus siswa
app.delete('/api/siswa/:kode', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM siswa WHERE kode_siswa = ?',
            [req.params.kode]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil dihapus'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

export default app;