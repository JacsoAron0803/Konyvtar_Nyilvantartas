
const express = require('express');
const router = express.Router();
const db = require('../util/database');

// osszes kolcsonzes lekerese
router.get('/', (req, res) => {
    db.query('SELECT * FROM loans', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Database query error'
            });
        }

        return res.status(200).json(results);
    });
});
// id alapjan kolcsonzes lekerdezes
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM loans WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: 'Database query error'
            });
        }

        return res.status(200).json(results);
    });
});
// uj kolcsonzes hozzaadasa
router.post('/:id', (req,res)=>{
    const {name, book, book_available} = req.body;
    if (!name || !book || !book_available){
        return res.status(400).json("Missing required fields!")
    }
    db.query('SELECT * FROM ')
})
module.exports = router;
