const express = require('express');
const router = express.Router();
const db = require('../util/database');

// osszes olvaso lekerese
router.get('/', (req, res) => {
    db.query('SELECT * FROM readers', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Database query error'});
        }

        return res.status(200).json(results);
    });
});
// lekeres id alapjan
router.get('/:id', (req, res)=>{
    db.query('SELECT * FROM readers WHERE id=?', [req.params.id], (err,results)=>{
        if (err){
            console.log(err)
            return res.status(500).json({error: 'Database query error'})
        }

        return res.status(200).json(results)
    })
})
// olvaso hozzaadasa
router.post('/', (req, res)=>{
    const {name, email} = req.body;

    if (!name || !email){
        return res.status(400).json({error: 'Missing required fields'})
    }
    db.query('INSERT INTO readers (name, email) VALUES (?, ?)', [name, email], (err, results)=>{
        if (err){
            console.log(err)
            return res.status(500).json({error: 'Database query error'})
        }

        return res.status(201).json({message: 'Reader added successfully'})
    })
})
// olvaso adatainak modositasa
router.put('/:id', (req, res)=>{
    const {name, email} = req.body;

    if (!name || !email){
        return res.status(400).json({error: 'Missing required fields'})
    }

    db.query('UPDATE readers SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, req.body.phone, req.params.id], (err, results)=>{
        if (err){
            console.log(err)
            return res.status(500).json({error: 'Database query error'})
        }

        return res.status(200).json({message: 'Reader updated successfully'})
    })
})
//olvaso torlese
router.delete('/:id', (req, res)=>{
    db.query('DELETE FROM readers WHERE id = ?', [req.params.id], (err, results)=>{
        if (err){
            console.log(err)
            return res.status(500).json({error: 'Database query error'})
        }
        return res.status(200).json({message: 'Reader deleted successfully'})
    })
})
module.exports = router;
 