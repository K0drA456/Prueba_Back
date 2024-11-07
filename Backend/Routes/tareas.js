const express = require('express');
const Tarea = require('../Models/Tarea');
const verificarToken = require('../middleware/verificarToken');

const router = express.Router();

// Creamos una nueva tarea mediante el endpoint POST
router.post('/', verificarToken, async (req, res) => {
    const { proyecto, titulo, descripcion, prioridad } = req.body;

    try {
        const nuevaTarea = new Tarea({
            proyecto, // ID del proyecto al que esta asociado la tarea
            usuario: req.usuarioId, // ID del usuario autentificado
            titulo,
            descripcion,
            prioridad
        });

        await nuevaTarea.save();
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});






// Listamo todas las tareas segun su proyecto
router.get('/:proyectoId', verificarToken, async (req, res) => {
    try {
        const tareas = await Tarea.find({ proyecto: req.params.proyectoId });
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});








// Actualizar una tarea
router.put('/:id', verificarToken, async (req, res) => {
    const { titulo, descripcion, estado, prioridad } = req.body;

    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate( //encuentra mediante el Id y actualiza
            req.params.id,
            { titulo, descripcion, estado, prioridad },
            { new: true }
        );

        if (!tareaActualizada) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }

        res.json(tareaActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});







// Eliminamos una tarea medinte su Id
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);

        if (!tareaEliminada) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }

        res.json({ mensaje: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

module.exports = router;
