const orderService = require('../services/OrderService');
const authService = require('../services/AuthService');

class OrderController {
  async placeOrder(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      // addressId can be null if they use shippingAddress fallback
      const order = await orderService.placeOrder(userId, {
        addressId: req.body.addressId ? parseInt(req.body.addressId) : null,
        shippingAddress: req.body.shippingAddress
      });
      res.json(order);
    } catch (error) {
      const status = (error.message === 'Cart empty' || error.message.includes('Insufficient stock')) ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const order = await orderService.cancelOrder(userId, req.params.id);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrders(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const orders = await orderService.getOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
