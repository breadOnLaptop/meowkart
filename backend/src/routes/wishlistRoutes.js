const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/WishlistController');

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/item/:id', wishlistController.deleteItem);

module.exports = router;
