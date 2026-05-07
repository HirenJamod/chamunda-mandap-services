const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const ADMIN_PASSWORD = "admin_chamunda"; // In production, move to .env

// Database Setup
const db = new sqlite3.Database('./chamunda.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            name TEXT,
            phone TEXT,
            date TEXT,
            style TEXT,
            message TEXT,
            status TEXT,
            timestamp TEXT
        )`);
    }
});

// API Endpoints

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
    db.all("SELECT * FROM bookings ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create new booking
app.post('/api/bookings', (req, res) => {
    const { id, name, phone, date, style, message, status, timestamp } = req.body;
    const sql = 'INSERT INTO bookings (id, name, phone, date, style, message, status, timestamp) VALUES (?,?,?,?,?,?,?,?)';
    const params = [id, name, phone, date, style, message, status, timestamp];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Booking created successfully", id: id });
    });
});

// Update booking status
app.patch('/api/bookings/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
    
    db.run(sql, [status, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: "Booking updated successfully" });
    });
});

// Static files are handled by app.use(express.static(...))

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
