const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/item/:id', cartController.updateItem);
router.delete('/item/:id', cartController.deleteItem);

module.exports = router;
