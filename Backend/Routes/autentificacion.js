const express = require('express');
const Usuario = require('../Models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Endpoint para el registro de nuevos usuarios
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        // hacemos la verificacion mediante el email si el usuario ya existe en la bsae ded datos
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }
        // Creamos un nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, email, password });

        // Guardamos al nuevo usuario
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'EL usuario se creo exitosamente' });
    } catch (error) {
        console.error('Error en el registro de usuario:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});





// Endpoint para el iicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscamos el usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'No hay usuarios registrados con ese Email' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const contrasenaValida = await usuario.compararPassword(password);
        if (!contrasenaValida) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' }); //mantenemos discrecion con el comentario de Credenciales Invalidas para evitar vulnerabilidades
        }

        // Crear un token JWT
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); //agaraamos al usuario mediante su Id y le otorgamo un token de 1 hora
        res.json({ token });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

module.exports = router;
