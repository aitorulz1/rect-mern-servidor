const Tarea = require('../models/Tarea')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

// Crea una nueva tarea

exports.crearTarea = async ( req, res, next ) => {

    // Revisar si hay errores
    const errores = validationResult(req); // req -> request para retornar si hay algún error y lo genera como un array
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }




    try {

        // Extraer el proyecto y ver si existe
        const { proyecto } = req.body;

        // Si no existe...
        const existeProyecto = await Proyecto.findById(proyecto);
        if(! existeProyecto) {
            return res.status(404).send({msg:'Proyecto no encontrado'})
        }
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(403).json({msg: 'No autorizado'})
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        tarea.save();
        res.json(tarea)

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}


    // Obtener todas las tareas de un proyecto
    exports.obtenerTareas = async (req, res, next) => {

        try {
            
            const tareas = await tareas.find({ proyecto: req.proyecto.id });
            res.json({tareas})

        } catch (error) {
            console.log(error)
            res.status(500).send('No hay tareas')
        }
 }


    // Actualizar una tarea
    exports.actualizarTarea = async (req, res, next) => {


        // Revisar si hay errores
        const errores = validationResult(true);
        if(!errores.isEmpty() ) {
            return res.status(400).json({errores: errores.array()})
        }


        // Extraer la info de tarea
        const { nombre } = req.body;
        const nuevaTarea = {};

        if(nombre) {
            nuevaTarea.nombre = nombre;
        }

        try {
            
            // Revisar el ID
            let tarea = await Tarea.findById(req.params.id);

            // Si la tarea existe si o no
            if(! tarea) {
                return res.send(400).json({msg: 'Proyecto no encontrado'})
            }

            // Verificar que corresponde a un proyecto
            if(tarea.proyecto !== req.proyecto.id) {
                return res.status(403).send({msg: 'No autorizado'})
            }

            // Actualizar
            tarea = await Tarea.findByIdAndUpdate({_id: req.params.id}, {$set: nuevaTarea}, {new: true})

            res.json({tarea})


        } catch (error) {
            console.log(error)
            res.status(500).send({msg: 'No se ha podido actualizar'})
        }
    }


    // Eliminar Tarea
    exports.eliminarTarea = async(req, res, next) => {

        try {

            // Revisar el ID
            const tarea = await Tarea.findById(req.params.id);

            // Si la tarea existe o no
            if(! tarea){
                return res.status(400).send({msg:'No existe esa tarea'})
            }

            // Verificar el proyecto q corresponde a la tarea
            if(tarea.proyecto !== req.proyecto.id) {
                return res.status(403).send({msg: 'No autorizado'})
            }

            // Eliminar Tarea
            await Tarea.findOneAndRemove({_id: req.params.id});
            res.json({msg:'Tarea eliminada'})
            
        } catch (error) {
            console.log(error)
            res.status(500).send({msg: 'Error en el servidor'})
        }
    }