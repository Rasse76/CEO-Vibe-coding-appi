# CEO-Vibe-coding-appi

Modern Inventory Management Web Application

## Description

A full-featured inventory management system built with Node.js, Express, and vanilla JavaScript. The application allows users to browse products, add new products, delete products, and manage product quantities with an intuitive and modern user interface.

## Features

- 📦 **Browse Products**: View all products in a responsive card-based grid layout
- ➕ **Add Products**: Create new products with name, category, quantity, price, and description
- ✏️ **Edit Products**: Update existing product information
- 🗑️ **Delete Products**: Remove products with confirmation modal
- 🔢 **Quantity Management**: Easily increase or decrease product quantities with +/- buttons
- 🔍 **Search**: Real-time search functionality to filter products by name or description
- 🏷️ **Category Filter**: Filter products by category (Electronics, Furniture, Office Supplies)
- 📊 **Statistics Dashboard**: View total products, total items, and total inventory value
- 🎨 **Modern UI**: Clean, responsive design that works on all devices
- 💾 **Local Database**: Pre-populated with 20 sample products stored in JSON format

## Technologies Used

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: JSON file-based storage
- **UI Design**: Modern CSS with responsive grid layout

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Rasse76/CEO-Vibe-coding-appi.git
cd CEO-Vibe-coding-appi
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Browsing Products
- All products are displayed in a card-based grid layout
- Each card shows the product name, category, description, quantity, and price

### Adding a Product
1. Click the "+ Add New Product" button
2. Fill in the product details (name, category, quantity, price, description)
3. Click "Save Product"

### Editing a Product
1. Click the "Edit" button on any product card
2. Update the product information
3. Click "Save Product"

### Deleting a Product
1. Click the "Delete" button on any product card
2. Confirm the deletion in the modal dialog

### Managing Quantity
- Use the + and - buttons below each product to adjust inventory levels
- The statistics update automatically

### Searching and Filtering
- Use the search box to find products by name or description
- Use the category dropdown to filter by product category

## Project Structure

```
CEO-Vibe-coding-appi/
├── server.js           # Express server and API endpoints
├── database.json       # Local JSON database with 20 products
├── package.json        # Project dependencies
├── public/
│   ├── index.html     # Main HTML file
│   ├── style.css      # Styles and responsive design
│   └── app.js         # Frontend JavaScript logic
└── README.md          # This file
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Sample Products

The application comes pre-populated with 20 diverse products across three categories:
- **Electronics**: Laptops, mice, keyboards, monitors, webcams, headsets, etc.
- **Furniture**: Office chairs, desks, lamps, cabinets, bookshelves, etc.
- **Office Supplies**: Notebooks, paper, whiteboards, organizers, staplers, etc.

## License

MIT
