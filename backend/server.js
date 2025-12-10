const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'tienda',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

// Función para conectar con reintentos
async function connectWithRetry(maxRetries = 10, delay = 5000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            pool = mysql.createPool(dbConfig);
            // Probar la conexión
            const connection = await pool.getConnection();
            console.log('✅ Conectado a MySQL correctamente');
            connection.release();
            return true;
        } catch (error) {
            console.log(`⏳ Intento ${i + 1}/${maxRetries} - Esperando a MySQL...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('No se pudo conectar a MySQL después de varios intentos');
}

// ============== RUTAS API ==============

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        mensaje: '🚀 API Backend Docker - Práctica DAM',
        version: '1.0.0',
        endpoints: {
            productos: '/api/productos',
            producto: '/api/productos/:id',
            usuarios: '/api/usuarios',
            health: '/api/health'
        }
    });
});

// Health check - para verificar que el servicio está activo
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1');
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'Disconnected',
            error: error.message
        });
    }
});

// GET - Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos ORDER BY id');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener productos'
        });
    }
});

// GET - Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM productos WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener producto'
        });
    }
});

// POST - Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;
        
        if (!nombre || !precio) {
            return res.status(400).json({
                success: false,
                error: 'Nombre y precio son obligatorios'
            });
        }
        
        const [result] = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
            [nombre, descripcion || '', precio, stock || 0]
        );
        
        res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            data: {
                id: result.insertId,
                nombre,
                descripcion,
                precio,
                stock
            }
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear producto'
        });
    }
});

// PUT - Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock } = req.body;
        
        const [result] = await pool.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
            [nombre, descripcion, precio, stock, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Producto actualizado correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar producto'
        });
    }
});

// DELETE - Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM productos WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar producto'
        });
    }
});

// GET - Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener usuarios'
        });
    }
});

// ============== INICIAR SERVIDOR ==============

async function startServer() {
    try {
        await connectWithRetry();
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`
╔════════════════════════════════════════════╗
║   🐳 Backend Docker - Práctica DAM         ║
╠════════════════════════════════════════════╣
║   Servidor corriendo en puerto: ${PORT}        ║
║   Base de datos: MySQL                     ║
║   Estado: ✅ Operativo                      ║
╚════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('❌ Error fatal al iniciar:', error);
        process.exit(1);
    }
}

startServer();
