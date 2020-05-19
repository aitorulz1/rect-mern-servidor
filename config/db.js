// const mongoose = require('mongoose');
// const conectarDB = require('./../config/db')

// require('dotenv').config({ path: 'variables.env'});

// const conectarDB = async() => {
//     try {
//         await mongoose.connect(process.env.DB_MONGO, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false,
//         });
//         console.log('DB Conectada')
//     } catch (error) {
//         console.log(error);
//         process.exit(1); // Detener la app
//     }
// }

// module.exports = conectarDB;


const mongoose = require('mongoose');
const conectarDB = require('./../config/db');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstasksserver';

require('dotenv').config({ path: 'variables.env'});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.info(`Sucessfully connected to the database GROUXION`))
    .catch(error => console.error(`An error ocurred trying to connect to the database GROUXION`, error));

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose disconnected on app termination');
            process.exit(0);
        });
    });