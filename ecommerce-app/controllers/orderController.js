const mysql = require('mysql2');

// Mock Cart (for simplicity)
let cart = [];

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'eco',
  password: 'eco',
  database: 'ecommerce_db'
});

// Checkout Page
exports.getCheckout = (req, res) => {
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  res.render('checkout', { title: 'Checkout' });
};

// Handle Order Placement
exports.postCheckout = (req, res) => {
  const { user_id } = req.body;
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  const ids = cart.map(item => item.productId);
  db.query('SELECT * FROM products WHERE id IN (?)', [ids], (err, products) => {
    if (err) {
      console.error(err);
      return res.send('Error processing order');
    }
    let total = 0;
    products.forEach(product => {
      const item = cart.find(i => i.productId === product.id);
      total += product.price * item.quantity;
    });
    db.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [user_id, total],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.send('Error placing order');
        }
        const orderId = result.insertId;
        const orderItems = cart.map(item => {
          const product = products.find(p => p.id === item.productId);
          return [orderId, item.productId, item.quantity, product.price];
        });
        db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
          [orderItems],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.send('Error placing order items');
            }
            cart = [];
            res.redirect('/orders');
          }
        );
      }
    );
  });
};

// View Orders
exports.getOrders = (req, res) => {
  const userId = 1; // Replace with actual logged-in user ID
  db.query(
    'SELECT * FROM orders WHERE user_id = ?',
    [userId],
    (err, orders) => {
      if (err) {
        console.error(err);
        return res.send('Error fetching orders');
      }
      res.render('orders', { title: 'Your Orders', orders });
    }
  );
};

// View Order Details
exports.getOrderDetails = (req, res) => {
  const orderId = req.params.id;
  db.query('SELECT * FROM orders WHERE id = ?', [orderId], (err, orders) => {
    if (err || orders.length === 0) {
      console.error(err);
      return res.send('Order not found');
    }
    db.query(
      `SELECT products.name, order_items.quantity, order_items.price
       FROM order_items
       JOIN products ON order_items.product_id = products.id
       WHERE order_items.order_id = ?`,
      [orderId],
      (err, items) => {
        if (err) {
          console.error(err);
          return res.send('Error fetching order items');
        }
        res.render('order_details', { title: 'Order Details', order: orders[0], items });
      }
    );
  });
}
