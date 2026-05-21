const wishlistService = require('../services/WishlistService');
const authService = require('../services/AuthService');

class WishlistController {
  async getWishlist(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const wishlist = await wishlistService.getWishlist(userId);
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addToWishlist(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      await wishlistService.addToWishlist(userId, req.body.productId);
      res.json({ message: 'Added to wishlist' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteItem(req, res) {
    try {
      await wishlistService.removeItem(req.params.id);
      res.json({ message: 'Removed from wishlist' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WishlistController();
