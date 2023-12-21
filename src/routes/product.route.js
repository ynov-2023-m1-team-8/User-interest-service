const express = require('express');

const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getProducts);
router.get('/:id/interestedusers', productController.getInterestedUsers);
router.get('/:id', productController.getProduct);
router.post('/interested', productController.postForm);

module.exports = router;
