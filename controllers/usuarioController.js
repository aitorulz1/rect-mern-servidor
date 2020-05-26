const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario =  async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req); // req -> request para retornar si hay algún error y lo genera como un array
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    // Extraer email y password
    const { email, password } = req.body; 

    try{
        // Revisar q el usuario registrado sea único 
        let usuario = await Usuario.findOne({email});

        if(usuario) {
           return res.status(400).json({msg: 'El usuario ya existe'})
        }

        // crea el usuario
        usuario = new Usuario(req.body) ;

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar Usuario
        await usuario.save();

        // Crea y firmar el Json Web Token
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn:3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

             // Mensaje de confirmación
             res.json({ token });
        });

      
    }catch(error){
        console.log(error);
        res.status(400).send('Hubo un error');

    }
} 