const mongoose = require('mongoose');

// Definimos el esquema para Tarea
const tareaSchema = new mongoose.Schema({
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto', // referencia al modelo de Proyecto
        required: true
    },
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en progreso', 'completada'],
        default: 'pendiente' // valor por defecto
    },
    prioridad: {
        type: Number,
        min: 1,
        max: 5
    }
});
module.exports = mongoose.model('Tarea', tareaSchema);
