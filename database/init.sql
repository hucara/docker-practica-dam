-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop Gaming', 'Portátil con RTX 4060, 16GB RAM, 512GB SSD', 1299.99, 15),
('Monitor 27"', 'Monitor IPS 4K 144Hz con HDR', 449.99, 25),
('Teclado Mecánico', 'Teclado mecánico RGB switches Cherry MX', 129.99, 50),
('Ratón Inalámbrico', 'Ratón gaming 25000 DPI, batería 70h', 79.99, 40),
('Auriculares Bluetooth', 'Auriculares con cancelación de ruido activa', 199.99, 30),
('Webcam 4K', 'Webcam con autoenfoque y micrófono integrado', 89.99, 20),
('Hub USB-C', 'Hub 7 en 1 con HDMI, USB 3.0 y lector SD', 49.99, 60),
('SSD NVMe 1TB', 'Disco SSD M.2 NVMe velocidad 7000MB/s', 119.99, 35);

-- Crear tabla de usuarios (para futuras ampliaciones)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (nombre, email) VALUES
('Admin', 'admin@tienda.com'),
('Usuario Demo', 'demo@tienda.com');
