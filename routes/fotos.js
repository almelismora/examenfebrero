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

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params

    await pool.promise().query('DELETE FROM fotos WHERE id = ?', [ id ])
    console.log('foto has been removed successfully')
    res.redirect('/fotos')

})


// MAS VOTADAS

router.get('/masvotadas', async (req, res) => {

  const [rows] = await pool.promise().query('SELECT * FROM fotos ORDER BY likes DESC')
  console.log(rows)

  res.render('masvotadas', {rows:rows})
  //res.send('fotos mas votadas!!!')
})

router.get('/addvoto/:id', async (req, res) => {
  const { id } = req.params

  await pool.promise().query('UPDATE fotos SET likes = likes+1 WHERE id = ?', [id])
  console.log(' + 1 like !!! ')

  res.redirect('/fotos')
})

// MENOS VOTADAS

router.get('/menosvotadas', async (req, res) => {

  const [rows] = await pool.promise().query('SELECT * FROM fotos ORDER BY dislikes DESC')
  console.log(rows)

  res.render('menosvotadas', {rows:rows})
  //res.send('fotos menos votadas!!!')
})

router.get('/removevoto/:id', async (req, res) => {
  const { id } = req.params

  await pool.promise().query('UPDATE fotos SET dislikes=dislikes+1 WHERE id = ?', [id])
  console.log(' + 1 dislike !!! ')

  res.redirect('/fotos')
})


module.exports = router;






