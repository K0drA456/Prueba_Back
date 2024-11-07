const mongoose = require('mongoose');

// ESQUEMA PARA EL PROYECTO
const proyectoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // hacemos una referencia hacia el otro esquema
        required: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fechaInicio: {
        type: Date
    },
    fechaFin: {
        type: Date
    }
});
module.exports = mongoose.model('Proyecto', proyectoSchema);
