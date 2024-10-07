const mysql = require('mysql2');

//.......................................................Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'eco',
  password: 'eco',
  database: 'ecommerce_db'
});

//........................................................List All Products
exports.getAllProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Error fetching products');
    }
    res.render('products', { title: 'Products', products: results });
  });
};

// Add New Product Page
exports.getAddProduct = (req, res) => {
  res.render('add_product', { title: 'Add New Product' });
};

// Add New Product Handler
exports.postAddProduct = (req, res) => {
  const { name, description, price, image_url } = req.body;
  db.query(
    'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
    [name, description, price, image_url],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.send('Error adding product');
      }
      res.redirect('/products');
    }
  );
};

//..................................................Edit Product Page
exports.getEditProduct = (req, res) => {
  const productId = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      return res.send('Product not found');
    }
    res.render('edit_product', { title: 'Edit Product', product: results[0] });
  });
};

//..................................................Update Product Handler
exports.postEditProduct = (req, res) => {
  const { id, name, description, price, image_url } = req.body;
  db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
    [name, description, price, image_url, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.send('Error updating product');
      }
      res.redirect('/products');
    }
  );
};

//..................................................Delete Product Handler
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.send('Error deleting product');
    }
    res.redirect('/products');
  });
};
