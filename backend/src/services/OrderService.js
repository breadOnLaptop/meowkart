const orderRepository = require('../repositories/OrderRepository');
const cartRepository = require('../repositories/CartRepository');

class OrderService {
  async placeOrder(userId, shippingAddress) {
    const cart = await cartRepository.findByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart empty');
    }

    const totalAmount = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const order = await orderRepository.createOrder({
      userId,
      totalAmount,
      shippingAddress,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    });

    await cartRepository.clearCart(cart.id);
    console.log(`Email notification sent to Default User for Order #${order.id}`);
    return order;
  }

  async getOrders(userId) {
    return orderRepository.findAllByUserId(userId);
  }

  async getOrderById(id) {
    return orderRepository.findById(parseInt(id));
  }
}

module.exports = new OrderService();
