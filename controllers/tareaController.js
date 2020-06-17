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
        res.json({tarea: tarea})

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}


    // Obtener todas las tareas de un proyecto
    exports.obtenerTareas = async (req, res, next) => {

        
        
        try {

            // Extraemos el proyecto para saber de qué proyecto queremos las tareas
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

            // Obtener las tareaspor proyecto
            const tareas = await Tarea.find({ proyecto })
            res.json({tareas})

        } catch (error) {
            console.log(error)
            res.status(500).send('No hay tareas')
        }
 }


    // Actualizar una tarea
    exports.actualizarTarea = async (req, res, next) => {



        try {

            // Extraemos el proyecto, nombre y estado
            const { proyecto, nombre, estado } = req.body;

            // Si no existe...
            let tarea = await Tarea.findById(req.params.id);

            if(! tarea) {
                return res.status(404).send({msg:'No hay tarea'})
            }
            
            // extraer proyecto
            const existeProyecto = await Proyecto.findById(proyecto);

            // Revisar si el proyecto actual pertenece al usuario autenticado
            if(existeProyecto.creador.toString() !== req.usuario.id) {
                return res.status(403).json({msg: 'No autorizado'})
            }


            // Crear nueva tarea
            const nuevaTarea = {};

            if (nombre) {
                nuevaTarea.nombre = nombre;
            }

            if (estado) {
                nuevaTarea.estado = estado;
            }


            // Guardar la tarea
            tarea = await Tarea.findOneAndUpdate({_id : req.params.id }, nuevaTarea, {new: true});
            res.json({tarea});



        } catch (error) {
            console.log(error)
            res.status(500).send({msg: 'No se ha podido actualizar'})
        }

    }


    // Eliminar Tarea
    exports.eliminarTarea = async(req, res, next) => {

        try {

            // Extraemos el proyecto, nombre y estado
            const { proyecto } = req.body;

            // Si no existe...
            let tarea = await Tarea.findById(req.params.id);

            if(! tarea) {
                return res.status(404).send({msg:'No hay tarea'})
            }
            
            // extraer proyecto
            const existeProyecto = await Proyecto.findById(proyecto);

            // Revisar si el proyecto actual pertenece al usuario autenticado
            if(existeProyecto.creador.toString() !== req.usuario.id) {
                return res.status(403).json({msg: 'No autorizado'})
            }


            // Eliminar la tarea
            await Tarea.findOneAndRemove({_id : req.params.id });
            res.json({mag: 'Tarea eliminada'});



        } catch (error) {
            console.log(error)
            res.status(500).send({msg: 'No se ha podido actualizar'})
        }
    }
