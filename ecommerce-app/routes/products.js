const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/', productController.getAllProducts);

router.get('/admin/add', productController.getAddProduct);
router.post('/admin/add', productController.postAddProduct);

router.get('/admin/edit/:id', productController.getEditProduct);
router.post('/admin/edit', productController.postEditProduct);

router.post('/admin/delete/:id', productController.deleteProduct);

module.exports = router;
