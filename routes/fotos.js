const express = require('express');
const { pool } = require('../db');
const router = express.Router();

/* GET fotos listing. */
router.get('/', async function(req, res, next) {

  const [rows] = await pool.promise().query('SELECT * FROM fotos')
  console.log(rows)

  res.render('fotos', {rows:rows});
});

// AGREGAR foto
router.get('/add', (req, res) => {

  res.render('add')
})


router.post('/add', async (req, res) => {

  const { title, url, description } = req.body
  
  const newFoto = {
    title,
    url,
    description
  }

  const [rows] = await pool.promise().query('INSERT INTO fotos SET ?', [newFoto])

  console.log(rows)

  res.redirect('/fotos')
})


// EDITAR foto

// --- update 
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const [ foto ] = await pool.promise().query('SELECT * FROM fotos WHERE id = ?', [ id ])

    res.render('edit', {foto:foto[0]})
})

router.post('/edit/:id', async (req, res) => {

    const { id } = req.params
    const { title, url, description } = req.body
    const newEntry = {
        title,
        url, 
        description
    }

    await pool.promise().query('UPDATE fotos SET ? WHERE id = ?', [ newEntry, id ])
    console.log('foto has been saved successfully')
    res.redirect('/fotos')
})


// DELETE foto

// --- delete
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params

    await pool.promise().query('DELETE FROM fotos WHERE id = ?', [ id ])
    console.log('foto has been removed successfully')
    res.redirect('/fotos')

})


module.exports = router;






