const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ESQUEMA DE LA BASE DE DATOS QUE NOS PEDIA EN EL DOCUMENTO DEL PARCIAL
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});

// meidante un middleware encriptamos la contraseña antes de guardarla
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Este metodo funciona para comparar la contraseña con la almacenada en la base de datos
usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
    const isMatch = await bcrypt.compare(passwordIngresada, this.password);
    console.log("Comparando contraseñas:", passwordIngresada, this.password, "Resultado:", isMatch); // Log para verificación
    return isMatch;
};
module.exports = mongoose.model('Usuario', usuarioSchema);
