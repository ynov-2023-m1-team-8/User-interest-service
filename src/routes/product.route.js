const express = require('express');

const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);
router.post('/interested',productController.postForm);//jesuisinterressemodalform
router.get('/:id/interestedusers', productController.getInterestedUsers);
router.post('/filter',productController.postfilter);
router.get('/filter-stock',productController.getfilters);
router.get('/filter/metrics', productController.getFilterMetrics);


module.exports = router;
