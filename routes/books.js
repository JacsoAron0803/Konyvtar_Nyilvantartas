const express = require('express');
const router = express.Router();
const db = require('../util/database');

// Összes könyv lekérése
router.get('/', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Database query error'
            });
        }

        return res.status(200).json(results);
    });
});

//egy könyv lekérdezése
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Database query error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Book not found'
            });
        }

        return res.status(200).json(results[0]);
    });
});
//új könyv hozzáadása
router.put('/:id', (req, res) => {
    db.query('INSERT INTO books (title, author, category, publish_year) VALUES (?, ?, ?, ?)', [req.body.title, req.body.author, req.body.category, req.body.published_year], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Database query error'
            });
        }

        return res.status(201).json({
            message: 'Book added successfully'
        });
    });
});
//könyv adatainak modositasa
router.patch('/:id', (req, res) => {
    db.query('UPDATE books SET title = ?, author = ?, category = ?, publish_year = ? WHERE id = ?', [req.body.title, req.body.author, req.body.category, req.body.published_year, req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Database query error'
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                error: 'Book not found'
            });
        }

        return res.status(200).json({
            message: 'Book updated successfully'
        });
    });
});
//konyv torlese ha nincs kolcsonzesi rekord
router.delete('/:id', (req, res) => {

    db.query('SELECT * FROM loans WHERE book_id = ?', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Database query error'});

        }
        if (results.length > 0) {
            return res.status(400).json({error: 'Cannot delete book with existing loans'});
        }
    
    db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Database query error'});
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({error: 'Book not found'});
        }

        return res.status(200).json({message: 'Book deleted successfully'});
    });
    })
});
router.get('/available', (req, res) => {
    db.query('SELECT * FROM books WHERE id IN (SELECT book_id FROM loans)', (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Database query error'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'No available books found'});
        }
        return res.status(200).json(results);
    });
});
module.exports = router;
