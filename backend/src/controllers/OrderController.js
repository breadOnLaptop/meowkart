const orderService = require('../services/OrderService');
const authService = require('../services/AuthService');

class OrderController {
  async placeOrder(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const order = await orderService.placeOrder(userId, req.body.shippingAddress);
      res.json(order);
    } catch (error) {
      const status = error.message === 'Cart empty' ? 400 : 500;
      res.status(status).json({ error: error.message });
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
