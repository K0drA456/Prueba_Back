const express = require('express');
const Proyecto = require('../Models/Proyecto');
const Tarea = require('../Models/Tarea');
const verificarToken = require('../middleware/verificarToken'); 

const router = express.Router();

// Crear un nuevo proyecto mediante el endpoint POST para crear un nuevo proyecto
router.post('/', verificarToken, async (req, res) => {
    const { nombre, descripcion, fechaInicio, fechaFin } = req.body;

    // Validar que las fechas sean correctas
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (inicio > fin) {
        return res.status(400).json({ mensaje: 'La fecha de inicio no puede ser mayor que la fecha de fin' });
    }

    try {
        const nuevoProyecto = new Proyecto({
            usuario: req.usuarioId, // id del usuario ya autentificado
            nombre,
            descripcion,
            fechaInicio,
            fechaFin
        });

        await nuevoProyecto.save();
        res.status(201).json(nuevoProyecto);
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});





// Listar todos los proyectos del usuario AUTENTIFICADO
router.get('/', verificarToken, async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ usuario: req.usuarioId });
        res.json(proyectos);
    } catch (error) {
        console.error('Error al listar proyectos:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});





// Actualizar un proyecto
router.put('/:id', verificarToken, async (req, res) => {
    const { nombre, descripcion, fechaInicio, fechaFin } = req.body;

    // Validar el campo de nombre como obligatorio, y permitir campos opcionales para descripción y fechas
    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    // Validar que las fechas sean correctas solo si ambas están presentes
    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        if (inicio > fin) {
            return res.status(400).json({ mensaje: 'La fecha de inicio no puede ser mayor que la fecha de fin' });
        }
    }

    try {
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, fechaInicio, fechaFin },
            { new: true }
        );

        if (!proyectoActualizado) {
            console.log('Proyecto no encontrado');
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }

        console.log('Proyecto actualizado:', proyectoActualizado);
        res.json(proyectoActualizado);
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});





// Eliminar un proyecto y sus tareas
router.delete('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar las tareas asociadas al proyecto
        await Tarea.deleteMany({ proyecto: id });

        // Luego eliminamos el proyecto
        const proyectoEliminado = await Proyecto.findByIdAndDelete(id);
        if (!proyectoEliminado) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }

        res.json({ mensaje: 'Proyecto y tareas eliminados con éxito' });
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error); 
        res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

module.exports = router;
