// Global state
let products = [];
let editingProductId = null;
let deleteProductId = null;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const confirmModal = document.getElementById('confirmModal');
const productForm = document.getElementById('productForm');
const addProductBtn = document.getElementById('addProductBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Stats elements
const totalProductsEl = document.getElementById('totalProducts');
const totalItemsEl = document.getElementById('totalItems');
const totalValueEl = document.getElementById('totalValue');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Add product button
    addProductBtn.addEventListener('click', () => openProductModal());

    // Close modal buttons
    document.getElementById('closeModal').addEventListener('click', closeProductModal);
    document.getElementById('cancelBtn').addEventListener('click', closeProductModal);
    document.getElementById('closeConfirm').addEventListener('click', closeConfirmModal);
    document.getElementById('cancelDelete').addEventListener('click', closeConfirmModal);

    // Form submit
    productForm.addEventListener('submit', handleFormSubmit);

    // Confirm delete
    document.getElementById('confirmDelete').addEventListener('click', handleDelete);

    // Search and filter
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);

    // Close modal on background click
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
    });
}

// API Functions
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        updateCategories();
        filterProducts();
        updateStats();
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products');
    }
}

async function createProduct(productData) {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Failed to create product');
        await loadProducts();
        return true;
    } catch (error) {
        console.error('Error creating product:', error);
        showError('Failed to create product');
        return false;
    }
}

async function updateProduct(id, productData) {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Failed to update product');
        await loadProducts();
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        showError('Failed to update product');
        return false;
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        await loadProducts();
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
        return false;
    }
}

// UI Functions
function renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">No products found</div>
                <p>Add your first product to get started</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-header">
                <div>
                    <h3 class="product-title">${escapeHtml(product.name)}</h3>
                    <span class="product-category">${escapeHtml(product.category)}</span>
                </div>
            </div>
            <p class="product-description">${escapeHtml(product.description || 'No description')}</p>
            <div class="product-info">
                <div class="info-item">
                    <div class="info-label">Quantity</div>
                    <div class="info-value">${product.quantity}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Price</div>
                    <div class="info-value">$${product.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)" ${product.quantity <= 0 ? 'disabled' : ''}>−</button>
                <span style="font-weight: 600; min-width: 3rem; text-align: center;">${product.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
            <div class="product-actions">
                <button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function updateCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    const currentValue = categoryFilter.value;
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    categoryFilter.value = currentValue;
}

function updateStats() {
    const totalProducts = products.length;
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);

    totalProductsEl.textContent = totalProducts;
    totalItemsEl.textContent = totalItems;
    totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
}

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

// Modal Functions
function openProductModal(product = null) {
    editingProductId = product ? product.id : null;
    document.getElementById('modalTitle').textContent = product ? 'Edit Product' : 'Add New Product';

    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description || '';
    } else {
        productForm.reset();
    }

    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    productForm.reset();
    editingProductId = null;
}

function closeConfirmModal() {
    confirmModal.classList.remove('active');
    deleteProductId = null;
}

// Form Handlers
async function handleFormSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value.trim(),
        quantity: parseInt(document.getElementById('productQuantity').value),
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value.trim()
    };

    let success;
    if (editingProductId) {
        success = await updateProduct(editingProductId, productData);
    } else {
        success = await createProduct(productData);
    }

    if (success) {
        closeProductModal();
    }
}

// Product Actions
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
}

function confirmDeleteProduct(id) {
    deleteProductId = id;
    confirmModal.classList.add('active');
}

async function handleDelete() {
    if (deleteProductId) {
        await deleteProduct(deleteProductId);
        closeConfirmModal();
    }
}

async function changeQuantity(id, delta) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newQuantity = product.quantity + delta;
    if (newQuantity < 0) return;

    await updateProduct(id, { quantity: newQuantity });
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    // Simple error display - could be enhanced with a toast notification
    alert(message);
}
