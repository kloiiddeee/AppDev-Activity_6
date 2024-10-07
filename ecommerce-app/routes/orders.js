const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/checkout', orderController.getCheckout);
router.post('/checkout', orderController.postCheckout);


router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderDetails);

module.exports = router;
