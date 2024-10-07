const cart = [];

// Get Cart Page
exports.getCart = (req, res) => {
  res.render('cart', { title: 'Your Cart', cart });
};

//..................................................Add to Cart
exports.addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += parseInt(quantity, 10);
  } else {
    cart.push({ productId, quantity: parseInt(quantity, 10) });
  }

  res.redirect('/cart');
};

//..................................................Remove from Cart
exports.removeFromCart = (req, res) => {
  const { productId } = req.body;
  const itemIndex = cart.findIndex(item => item.productId === productId);

  if (itemIndex > -1) {
    cart.splice(itemIndex, 1);
  }

  res.redirect('/cart');
};