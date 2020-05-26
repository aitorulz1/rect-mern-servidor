const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req, res) => {


    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return req.status(400).json({errores: errores.array()})
    }

    // Extraer el email y password
    const { email, password } = req.body;


    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'})
        }

        // Revisar password
        const passCorrecto = await bcryptjs.compare(password, usuario.password); // El compara el req con el q esta en la BBDD
        if(!passCorrecto) {
            return res.status(400).json({msg: 'password incorrecto'})
        }

        // Si todo es correcto, JWT
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

    } catch (error) {
        console.log(error);
    }

}