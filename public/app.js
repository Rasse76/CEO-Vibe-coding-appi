// API Base URL
const API_URL = '/api/products';

// DOM Elements
const addProductForm = document.getElementById('addProductForm');
const productsContainer = document.getElementById('productsContainer');
const totalProductsEl = document.getElementById('totalProducts');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    addProductForm.addEventListener('submit', handleAddProduct);
});

// Load all products
async function loadProducts() {
    try {
        productsContainer.innerHTML = '<div class="loading">Loading products...</div>';
        
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
        productsContainer.innerHTML = '<div class="empty-state"><h3>Error loading products</h3><p>Please refresh the page</p></div>';
    }
}

// Display products in the grid
function displayProducts(products) {
    totalProductsEl.textContent = products.length;
    
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No products yet</h3>
                <p>Add your first product using the form above</p>
            </div>
        `;
        return;
    }
    
    productsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Attach event listeners
    attachEventListeners();
}

// Create product card HTML
function createProductCard(product) {
    const quantityClass = product.quantity === 0 ? 'quantity-out' : 
                         product.quantity < 10 ? 'quantity-low' : 'quantity-good';
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-header">
                <div>
                    <div class="product-name">${escapeHtml(product.name)}</div>
                    ${product.category ? `<span class="product-category">${escapeHtml(product.category)}</span>` : ''}
                </div>
            </div>
            
            ${product.description ? `<div class="product-description">${escapeHtml(product.description)}</div>` : ''}
            
            <div class="product-info">
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-quantity">
                    <span class="quantity-label">Stock:</span>
                    <span class="quantity-value ${quantityClass}">${product.quantity}</span>
                </div>
            </div>
            
            <div class="product-actions">
                <div class="quantity-controls">
                    <button class="btn-quantity" onclick="changeQuantity(${product.id}, ${product.quantity - 1})">
                        − 1
                    </button>
                    <button class="btn-quantity" onclick="changeQuantity(${product.id}, ${product.quantity + 1})">
                        + 1
                    </button>
                    <button class="btn-quantity" onclick="changeQuantity(${product.id}, ${product.quantity + 10})">
                        + 10
                    </button>
                </div>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

// Handle add product form submission
async function handleAddProduct(e) {
    e.preventDefault();
    
    const product = {
        name: document.getElementById('productName').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        quantity: parseInt(document.getElementById('productQuantity').value),
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value.trim()
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        
        if (!response.ok) throw new Error('Failed to add product');
        
        showToast('Product added successfully!', 'success');
        addProductForm.reset();
        loadProducts();
    } catch (error) {
        console.error('Error adding product:', error);
        showToast('Failed to add product', 'error');
    }
}

// Change product quantity
async function changeQuantity(id, newQuantity) {
    if (newQuantity < 0) {
        showToast('Quantity cannot be negative', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (!response.ok) throw new Error('Failed to update quantity');
        
        showToast('Quantity updated!', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error updating quantity:', error);
        showToast('Failed to update quantity', 'error');
    }
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        
        showToast('Product deleted successfully!', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Attach event listeners (if needed for dynamically created elements)
function attachEventListeners() {
    // Event listeners are attached via onclick attributes in this implementation
    // This function is kept for potential future enhancements
}

// Utility function to escape HTML and prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
