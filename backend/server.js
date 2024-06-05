const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1', // Replace with your database host
    user: 'root', // Replace with your database username
    password: '', // Replace with your database password
    database: 'rumahsakit' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

// User Registration
// Create Registration
app.post('/pendaftaran', (req, res) => {
    let {
        pasien_id,
        nama_pasien,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        no_ktp,
        no_telepon,
        poliklinik,
        dokter_id,
        tipe_pembayaran,
        tarif
    } = req.body;

    // Validate dokter_id
    const parsedDokterId = parseInt(dokter_id, 10);
    if (isNaN(parsedDokterId)) {
        return res.status(400).json({ message: 'Invalid dokter_id' });
    }

    const patientQuery = 'INSERT INTO pasien (nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_ktp, no_telepon) VALUES (?, ?, ?, ?, ?, ?)';
    const registrationQuery = 'INSERT INTO pendaftaran (pasien_id, poliklinik, dokter_id, tanggal_pendaftaran, tipe_pembayaran) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)';

    console.log('Executing patientQuery with values:', [nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_ktp, no_telepon]);
    if (pasien_id === undefined) {
        // First, insert patient data
        db.query(patientQuery, [nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_ktp, no_telepon], (err, patientResult) => {
            if (err) {
                console.error('Error executing patient query:', err.stack);
                res.status(500).send('Error executing patient query');
                return;
            }

            // Capture the inserted patient's ID

            pasien_id = patientResult.insertId;
        })
    }

    console.log('Patient inserted with ID:', pasien_id);
    console.log('Executing registrationQuery with values:', [pasien_id, poliklinik, parsedDokterId, tipe_pembayaran]);

    // Then, insert registration data
    db.query(registrationQuery, [pasien_id, poliklinik, parsedDokterId, tipe_pembayaran], (err, registrationResult) => {
        if (err) {
            console.error('Error executing registration query:', err.stack);
            res.status(500).send('Error executing registration query');
            return;
        }

        console.log('Registration inserted with result:', registrationResult);

        // Insert into rekam_medis table
        const rekamMedisQuery = 'INSERT INTO rekam_medis (pasien_id, poliklinik_id, dokter_id, waktu_rekam) VALUES (?, ?, ?, CURRENT_TIMESTAMP)';
        db.query(rekamMedisQuery, [pasien_id, poliklinik, parsedDokterId], (err, rekamMedisResult) => {
            if (err) {
                console.error('Error executing rekam medis query:', err.stack);
                res.status(500).send('Error executing rekam medis query');
                return;
            }

            console.log('Rekam medis inserted with result:', rekamMedisResult);

            // Insert into antrian table
            const antrianQuery = 'INSERT INTO antrian (poliklinik_id, pasien_id, tipe_pembayaran, tanggal, waktu) VALUES (?, ?, ?, CURRENT_DATE, CURRENT_TIME)';
            db.query(antrianQuery, [poliklinik, pasien_id, tipe_pembayaran], (err, antrianResult) => {
                if (err) {
                    console.error('Error executing antrian query:', err.stack);
                    res.status(500).send('Error executing antrian query');
                    return;
                }

                console.log('Antrian inserted with result:', antrianResult);

                const tarifQuery = 'INSERT INTO tarif_pasien (pasien_id,tarif_layanan_id) VALUES (?,?)'
                db.query(tarifQuery, [pasien_id, tarif], (err, antrianResult) => {
                res.json({
                    message: 'Registration, rekam medis, and antrian created successfully',
                    registration: {
                        id: registrationResult.insertId,
                        pasien_id: pasien_id,
                        poliklinik: poliklinik,
                        dokter_id: parsedDokterId,
                        tipe_pembayaran: tipe_pembayaran,
                        tanggal_pendaftaran: new Date()
                    },
                    rekamMedis: {
                        id: rekamMedisResult.insertId,
                        pasien_id: pasien_id,
                        poliklinik_id: poliklinik,
                        dokter_id: parsedDokterId,
                        waktu_rekam: new Date()
                    },
                    antrian: {
                        id: antrianResult.insertId,
                        poliklinik_id: poliklinik,
                        pasien_id: pasien_id,
                        tipe_pembayaran: tipe_pembayaran,
                        tanggal: new Date(),
                        waktu: new Date()
                    }
                    
                    })
                });
            });
        });
    });

});

app.post('/register', async (req, res) => {
    const { username, password, dokter_id, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        let nama_lengkap = req.body.nama_lengkap;

        if (dokter_id) {
            const dokterQuery = 'SELECT nama_dokter FROM dokter WHERE dokter_id = ?';
            db.query(dokterQuery, [dokter_id], async (err, results) => {
                if (err) {
                    console.error('Error executing dokter query:', err.stack);
                    return res.status(500).send('Error executing dokter query');
                }

                if (results.length > 0) {
                    nama_lengkap = results[0].nama_dokter;
                } else {
                    return res.status(400).json({ message: 'Invalid dokter_id' });
                }

                await insertUser(username, password, dokter_id, nama_lengkap, role, res);
            });
        } else {
            await insertUser(username, password, dokter_id, nama_lengkap, role, res);
        }
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Error hashing password');
    }
});

async function insertUser(username, password, dokter_id, nama_lengkap, role, res) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password, dokter_id, nama_lengkap, role) VALUES (?, ?, ?, ?, ?)';

        db.query(query, [username, hashedPassword, dokter_id, nama_lengkap, role], (err, result) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return res.status(500).send('Error executing query');
            }
            res.json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Error hashing password');
    }
}

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
                res.json({ username: user.username, role: user.role, nama_lengkap: user.nama_lengkap, token, message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Error comparing password:', error);
            res.status(500).send('Error comparing password');
        }
    });
});

// Create Registration


app.get('/rekamMedis', (req, res) => {
    const query = 'SELECT * FROM rekam_medis';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(results);
    });
})

// Read doctors
app.get('/dokter', (req, res) => {
    const query = 'SELECT * FROM dokter';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(results);
    });
});

app.get('/poliklinik', (req, res) => {
    const query = 'SELECT * FROM poliklinik';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(results);
    });
});

// Read practice schedule
app.get('/jadwalPraktek', (req, res) => {
    const query = 'SELECT * FROM jadwal_praktek';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(results);
    });
});

// Update user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    db.query(query, [name, email, role, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json({ message: 'User updated successfully' });
    });
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
});
// Get pasien
app.get('/pasien/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pasien WHERE pasien_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(result);
    });
});
// Get all pasien
app.get('/pasien', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pasien';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(result);
    });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
