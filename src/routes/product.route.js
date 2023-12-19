const express = require('express');

const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);
router.post('/interested',productController.postForm);//jesuisinterressemodalform
router.get('/:id/interestedusers', productController.getInterestedUsers);

module.exports = router;
