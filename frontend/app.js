// Configuración de la API
const API_URL = 'http://localhost:3000';

// Elemento para mostrar respuestas de la API
const apiResponseEl = document.getElementById('api-response');
const productsGridEl = document.getElementById('products-grid');
const statusEl = document.getElementById('status');

// Función para mostrar respuesta JSON formateada
function showApiResponse(data) {
    apiResponseEl.textContent = JSON.stringify(data, null, 2);
}

// Función para actualizar el estado de conexión
function updateStatus(connected, message) {
    statusEl.className = 'status ' + (connected ? 'connected' : 'error');
    statusEl.querySelector('.status-text').textContent = message;
}

// Verificar la salud de la API
async function checkHealth() {
    try {
        productsGridEl.innerHTML = '<div class="loading-message">⏳ Verificando conexión con la API...</div>';
        
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        
        showApiResponse(data);
        
        if (data.status === 'OK') {
            updateStatus(true, '✅ API conectada');
            productsGridEl.innerHTML = '<div class="loading-message">✅ Conexión exitosa. Pulsa "Cargar Productos" para ver el catálogo.</div>';
        } else {
            updateStatus(false, '❌ Error de conexión');
        }
    } catch (error) {
        console.error('Error:', error);
        updateStatus(false, '❌ API no disponible');
        showApiResponse({ 
            error: 'No se pudo conectar con la API',
            message: error.message,
            tip: 'Asegúrate de que los contenedores están corriendo con: docker-compose up'
        });
        productsGridEl.innerHTML = `
            <div class="loading-message">
                ❌ Error de conexión<br>
                <small>Verifica que el backend está corriendo</small>
            </div>
        `;
    }
}

// Cargar productos
async function loadProducts() {
    try {
        productsGridEl.innerHTML = '<div class="loading-message">⏳ Cargando productos...</div>';
        
        const response = await fetch(`${API_URL}/api/productos`);
        const data = await response.json();
        
        showApiResponse(data);
        
        if (data.success && data.data.length > 0) {
            updateStatus(true, `✅ ${data.count} productos cargados`);
            renderProducts(data.data);
        } else {
            productsGridEl.innerHTML = '<div class="loading-message">No hay productos disponibles</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        updateStatus(false, '❌ Error al cargar');
        showApiResponse({ error: error.message });
        productsGridEl.innerHTML = `
            <div class="loading-message">
                ❌ Error al cargar productos<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Renderizar productos en la grilla
function renderProducts(products) {
    productsGridEl.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${escapeHtml(product.nombre)}</h3>
            <p>${escapeHtml(product.descripcion || 'Sin descripción')}</p>
            <div class="product-info">
                <span class="price">${formatPrice(product.precio)} €</span>
                <span class="stock ${getStockClass(product.stock)}">
                    ${product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                </span>
            </div>
            <div class="product-actions">
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Funciones auxiliares
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

function getStockClass(stock) {
    if (stock === 0) return 'out';
    if (stock <= 10) return 'low';
    return '';
}

// Abrir modal para añadir producto
function openAddModal() {
    document.getElementById('addModal').style.display = 'block';
}

// Cerrar modal
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addProductForm').reset();
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Manejar envío del formulario
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value) || 0
    };
    
    try {
        const response = await fetch(`${API_URL}/api/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        showApiResponse(data);
        
        if (data.success) {
            closeModal();
            loadProducts();
            updateStatus(true, '✅ Producto añadido');
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showApiResponse({ error: error.message });
        alert('Error al crear el producto');
    }
});

// Eliminar producto
async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/productos/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        showApiResponse(data);
        
        if (data.success) {
            loadProducts();
            updateStatus(true, '✅ Producto eliminado');
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        showApiResponse({ error: error.message });
        alert('Error al eliminar el producto');
    }
}

// Verificar conexión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño retraso para dar tiempo a que los contenedores estén listos
    setTimeout(checkHealth, 1000);
});
