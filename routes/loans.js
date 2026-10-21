
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
        if (results.length === 0) {
            return res.status(404).json({
                error: 'Loan not found'
            });
        }

        return res.status(200).json(results);
    });
});
// uj kolcsonzes hozzaadasa
router.post('/', (req,res)=>{
    const {reader_id, book_id, book_available, loan_date, due_date} = req.body;
    if (!reader_id || !book_id ||!loan_date || !due_date || book_available===undefined){
        return res.status(400).json("Missing required fields!")
    }
    if (book_available != 1){
        return res.status(400).json("Book is not available for loan!")
    }
    db.query('INSERT INTO loans (reader_id, book_id, book_available, loan_date, due_date) VALUES (?, ?, ?, ?, ?)', [reader_id, book_id, book_available, loan_date, due_date], (err, results)=>{
        if (err){
            console.error(err);
            return res.status(500).json({error: 'Database query error'});
        }
        return res.status(201).json({message: 'Loan added successfully'});
    })
})
// kolcsonzes modositasa id alapjan
router.put('/:id', (req,res)=>{
    const {reader_id, book_id, book_available, loan_date, due_date} = req.body;
    if (!reader_id || !book_id ||!loan_date || !due_date || book_available===undefined){
        return res.status(400).json("Missing required fields!")
    }
    db.query('UPDATE loans SET reader_id = ?, book_id = ?, book_available = ?, loan_date = ?, due_date = ? WHERE id = ?', [reader_id, book_id, book_available, loan_date, due_date, req.params.id], (err, results)=>{
        if (err){
            console.error(err);
            return res.status(500).json({error: 'Database query error'});
        }
    if (results.affectedRows === 0) {
        return res.status(404).json({error: 'Loan not found'});
    }
        return res.status(200).json({message: 'Loan updated successfully'});
    })
})

//kolcsonzes torlese id alapjan
router.delete('/:id', (req,res)=>{
    db.query('DELETE FROM loans WHERE id = ?', [req.params.id], (err, results)=>{
        if (err){
            return res.status(500).json({error: ' Database query error'})
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({error: 'Loan not found'})
        }

        return res.status(200).json({message: 'Loan deleted succesfully!'})
    })
})

//visszahozas datumanak rogzitese

router.patch('/:id/return', (req, res)=>{
    const {return_date} = req.body;
    if (!return_date){
        return res.status(400).json({error: 'Missing required field!'})
    }

    db.query('UPDATE loans SET return_date = ? WHERE id = ?', [return_date, req.params.id], (err, results)=>{
        if (err){
            return res.status(500).json({error: 'database query error!'})
        }
        if(results.affectedRows === 0){
            return res.status (404).json({error: 'Loan not found!'})
        }

        return res.status(200).json({message: 'Return date updated succesfully!'})
    })
})
module.exports = router;
