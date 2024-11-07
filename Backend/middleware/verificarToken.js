const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado, no hay token' });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = id; // Sacamos el Id de la base de datos y la almacenamos en el request dentro de la variable usurioId
        next();
    } catch (error) {
        console.error('Error de verificación de token:', error);
        res.status(401).json({ mensaje: 'Token inválido' }); //si expiro el token nos muestra el mensaje mediante la consola del backend
    }
};
module.exports = verificarToken; 
