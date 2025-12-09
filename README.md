# CEO-Vibe-coding-appi
Tehdään webbiappi kokeiluna CEO Vibe-coding sessiossa

## Inventory Management Web Application

A modern, easy-to-use inventory management system with a dark theme. Browse, add, delete, and manage product quantities with an intuitive interface.

### Features

- 📦 Browse all products in a beautiful grid layout
- ➕ Add new products with name, description, price, quantity, and category
- 🗑️ Delete products
- 🔢 Adjust product quantities (±1, ±10)
- 🌙 Modern dark theme interface
- 💾 Pre-populated with 20 sample products
- 📱 Responsive design

### Setup and Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Technology Stack

- **Backend:** Node.js with Express
- **Database:** SQLite (local database)
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Styling:** Custom CSS with dark theme

### Database

The application automatically creates a SQLite database (`inventory.db`) with 20 pre-populated products on first run. The database includes products from various categories:
- Electronics (laptops, monitors, peripherals)
- Furniture (desks, chairs, lamps)
- Office Supplies (paper, ink, whiteboards)
- Stationery (notebooks, pens)
- Accessories (stands, organizers)

### API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product quantity
- `DELETE /api/products/:id` - Delete product

### Project Structure

```
CEO-Vibe-coding-appi/
├── server.js           # Express server and API endpoints
├── package.json        # Dependencies and scripts
├── public/
│   ├── index.html      # Main HTML page
│   ├── styles.css      # Dark theme styling
│   └── app.js          # Frontend JavaScript
└── inventory.db        # SQLite database (auto-generated)
```
