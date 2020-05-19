const mongoose = require('mongoose');
const DB_MONGO = process.env.DB_MONGO || 'mongodb://localhost:27017/mernstasksserver';

require('dotenv').config({ path: 'variables.env'});

const conectarDB = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log('DB Conectada')
    } catch (error) {
        console.log(error);
        process.exit(1); // Detener la app
    }
}

module.exports = conectarDB;


