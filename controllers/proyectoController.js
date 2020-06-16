const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator')

exports.crearProyecto = async(req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }


    try {

        // Crear nuevo proyecto
        const proyecto =  new Proyecto(req.body); // SOlo enviamos el nombre le pasamos req.body

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // Guardar proyecto
        proyecto.save(); 
        res.json(proyecto)

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error'); 
    }
} 


// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try{ 
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.json({ proyectos })
    } catch (error) {
        console.log(error) 
        res.status(500).send('Hubo un error')
    }
}


// Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()})
    }


    // Extraer la info del proyecto    
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }


    try {
        

        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Si el proyecto existe si o no
        if(! proyecto) {
            res.status(400).json({msg: 'Proyecto no encontrado'}) 
        }

        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(403).json({msg: 'No autorizado'})
        }

        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set : nuevoProyecto}, { new: true }),
        
        res.json({ proyecto })


    } catch (error) {
        console.log(error)
        res.status(500).send({msg: 'No se ha podido actualizar'})
    }
} 




// Eliminar un proyecto
exports.eliminarProyecto = async( req, res ) => {


    try {
        

        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // Si el proyecto existe si o no
        if(! proyecto) {
            res.status(400).json({msg: 'Proyecto no encontrado'}) 
        }

        // Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id) {
            return res.status(403).json({msg: 'No autorizado'})
        }


        // ELiminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado'})


    } catch (error) {
        console.log(error)
        res.status(500).send({msg: 'Error en el servidor'})
    }


}