const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper function to read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

// Helper function to write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  const products = readDatabase();
  res.json(products);
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const products = readDatabase();
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  const products = readDatabase();
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    category: req.body.category,
    quantity: parseInt(req.body.quantity) || 0,
    price: parseFloat(req.body.price) || 0,
    description: req.body.description || ''
  };
  
  products.push(newProduct);
  
  if (writeDatabase(products)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const products = readDatabase();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products[index] = {
    ...products[index],
    name: req.body.name !== undefined ? req.body.name : products[index].name,
    category: req.body.category !== undefined ? req.body.category : products[index].category,
    quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity) : products[index].quantity,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : products[index].price,
    description: req.body.description !== undefined ? req.body.description : products[index].description
  };
  
  if (writeDatabase(products)) {
    res.json(products[index]);
  } else {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const products = readDatabase();
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const deletedProduct = products.splice(index, 1)[0];
  
  if (writeDatabase(products)) {
    res.json(deletedProduct);
  } else {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Inventory Management Server running on http://localhost:${PORT}`);
});
