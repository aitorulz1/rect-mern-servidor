// Primero importo express
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// Y luego utilizamos su función. Crea el servidor
const app = express();

// Conectar a las BBDD
conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar  express.json
app.use(express.json({extended: true}));

// Puerto de la app. Calquier nº que no sea 3000. Al subir a heroku se espera que la variable de entorno se llame PORT.
const port = process.env.port || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


// Definir la página principal. Es solo para comprobar que funciona. Una vez que ves Hola Mundo puedes borrarlo.
app.get('/', (req, res) => {
    res.send('Hola mundo');
})

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el ${PORT}`);
})