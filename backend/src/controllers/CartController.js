const cartService = require('../services/CartService');
const authService = require('../services/AuthService');

class CartController {
  async getCart(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const cart = await cartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const { productId, quantity } = req.body;
      await cartService.addToCart(userId, productId, quantity);
      res.json({ message: 'Added to cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateItem(req, res) {
    try {
      await cartService.updateItemQuantity(req.params.id, req.body.quantity);
      res.json({ message: 'Updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteItem(req, res) {
    try {
      await cartService.removeItem(req.params.id);
      res.json({ message: 'Removed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
