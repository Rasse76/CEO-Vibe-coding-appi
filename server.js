const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create table and seed data
function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL,
    category TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      // Check if database is empty
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) {
          console.error('Error checking products:', err);
        } else if (row.count === 0) {
          seedDatabase();
        }
      });
    }
  });
}

// Seed database with 20 products
function seedDatabase() {
  const products = [
    { name: 'Laptop Pro', description: 'High-performance laptop for professionals', quantity: 15, price: 1299.99, category: 'Electronics' },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', quantity: 45, price: 29.99, category: 'Electronics' },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical gaming keyboard', quantity: 30, price: 89.99, category: 'Electronics' },
    { name: 'USB-C Hub', description: '7-in-1 USB-C docking station', quantity: 25, price: 49.99, category: 'Electronics' },
    { name: 'Monitor 27"', description: '4K Ultra HD monitor', quantity: 12, price: 399.99, category: 'Electronics' },
    { name: 'Webcam HD', description: '1080p HD webcam with microphone', quantity: 20, price: 79.99, category: 'Electronics' },
    { name: 'Office Chair', description: 'Ergonomic office chair with lumbar support', quantity: 8, price: 299.99, category: 'Furniture' },
    { name: 'Standing Desk', description: 'Adjustable height standing desk', quantity: 5, price: 499.99, category: 'Furniture' },
    { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', quantity: 35, price: 39.99, category: 'Furniture' },
    { name: 'Notebook A4', description: 'Premium hardcover notebook', quantity: 100, price: 12.99, category: 'Stationery' },
    { name: 'Pen Set', description: 'Set of 10 premium ballpoint pens', quantity: 75, price: 19.99, category: 'Stationery' },
    { name: 'Whiteboard', description: 'Magnetic dry-erase whiteboard', quantity: 10, price: 59.99, category: 'Office Supplies' },
    { name: 'Paper Ream', description: 'A4 copy paper, 500 sheets', quantity: 50, price: 8.99, category: 'Office Supplies' },
    { name: 'Headphones', description: 'Noise-cancelling wireless headphones', quantity: 18, price: 199.99, category: 'Electronics' },
    { name: 'Phone Stand', description: 'Adjustable smartphone stand', quantity: 40, price: 15.99, category: 'Accessories' },
    { name: 'Cable Organizer', description: 'Desktop cable management system', quantity: 60, price: 9.99, category: 'Accessories' },
    { name: 'External SSD 1TB', description: 'Portable solid state drive', quantity: 22, price: 129.99, category: 'Electronics' },
    { name: 'Printer Ink', description: 'Compatible ink cartridge set', quantity: 35, price: 44.99, category: 'Office Supplies' },
    { name: 'Monitor Stand', description: 'Wooden monitor riser with storage', quantity: 15, price: 34.99, category: 'Furniture' },
    { name: 'Tablet 10"', description: 'Android tablet with stylus', quantity: 10, price: 349.99, category: 'Electronics' }
  ];

  const stmt = db.prepare('INSERT INTO products (name, description, quantity, price, category) VALUES (?, ?, ?, ?, ?)');
  
  products.forEach(product => {
    stmt.run(product.name, product.description, product.quantity, product.price, product.category);
  });
  
  stmt.finalize(() => {
    console.log('Database seeded with 20 products');
  });
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(row);
    }
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, description, quantity, price, category } = req.body;
  
  if (!name || quantity === undefined || !price) {
    return res.status(400).json({ error: 'Name, quantity, and price are required' });
  }
  
  db.run(
    'INSERT INTO products (name, description, quantity, price, category) VALUES (?, ?, ?, ?, ?)',
    [name, description || '', quantity, price, category || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, description, quantity, price, category });
      }
    }
  );
});

// Update product quantity
app.put('/api/products/:id', (req, res) => {
  const { quantity } = req.body;
  
  if (quantity === undefined) {
    return res.status(400).json({ error: 'Quantity is required' });
  }
  
  db.run(
    'UPDATE products SET quantity = ? WHERE id = ?',
    [quantity, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  );
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted successfully' });
    }
  });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
