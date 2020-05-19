// Primero importo express
const express = require('express');

// Y luego utilizamos su función. Crea el servidor
const app = express();

// Puerto de la app. Calquier nº que no sea 3000. Al subir a heroku se espera que la variable de entorno se llame PORT.
const PORT = process.env.PORT || 4000


// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'))


// Definir la página principal. Es solo para comprobar que funciona. Una vez que ves Hola Mundo puedes borrarlo.
app.get('/', (req, res) => {
    res.send('Hola mundo')
})

// Arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el ${PORT}`)
})