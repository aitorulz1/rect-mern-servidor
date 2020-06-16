const mongoose = require ('mongoose')

const TareaSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trum: true
    },
    estado: {
        tyoe: Boolean,
        defaul: false
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    }
})

module.exports = mongoose.model('Tarea', TareaSchema)