
import app from './app.js';
import { db } from './config/database.js';

const PORT = process.env.PORT || 3000;

try {
    await db.query('SELECT 1');

    console.log('Database MySQL berhasil terhubung');

    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });

} catch (error) {
    console.error('Koneksi database gagal:', error.message);
    process.exit(1);
}
