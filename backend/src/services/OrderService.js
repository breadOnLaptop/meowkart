const orderRepository = require('../repositories/OrderRepository');
const cartRepository = require('../repositories/CartRepository');
const productRepository = require('../repositories/ProductRepository');
const prisma = require('../config/prisma');

class OrderService {
  /**
   * ACID Compliant Order Placement
   * Handles Stock Concurrency and Transactional integrity
   */
  async placeOrder(userId, { addressId, shippingAddress }) {
    return prisma.$transaction(async (tx) => {
      // 1. Get Cart
      const cart = await cartRepository.findByUserId(userId);
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart empty');
      }

      // 2. Validate Stock and Calculate Total
      const itemsToCreate = [];
      let totalAmount = 0;

      for (const item of cart.items) {
        // ATOMIC DECREMENT: This will throw P2025 (Record to update not found)
        // if the where clause (stock >= quantity) is not met.
        try {
          await productRepository.decrementStock(item.productId, item.quantity, tx);
        } catch (e) {
          throw new Error(`Insufficient stock for product: ${item.product.name}`);
        }

        totalAmount += item.product.price * item.quantity;
        itemsToCreate.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        });
      }

      // 3. Prepare Address String
      let finalShippingAddress = shippingAddress;
      if (addressId) {
        const addrEntity = await tx.address.findUnique({ where: { id: addressId } });
        if (addrEntity) {
          finalShippingAddress = `${addrEntity.name}, ${addrEntity.addressLine}, ${addrEntity.locality}, ${addrEntity.city}, ${addrEntity.state} - ${addrEntity.pincode}. Phone: ${addrEntity.phone}`;
        }
      }

      // 4. Create Order
      const order = await orderRepository.createOrder({
        userId,
        addressId,
        shippingAddress: finalShippingAddress,
        totalAmount,
        status: 'PENDING',
        items: {
          create: itemsToCreate
        }
      }, tx);

      // 5. Clear Cart
      await cartRepository.clearCart(cart.id, tx);

      console.log(`Order #${order.id} placed successfully. Stock deducted and cart cleared.`);
      return order;
    });
  }

  async cancelOrder(userId, orderId) {
    return prisma.$transaction(async (tx) => {
      const order = await orderRepository.findById(parseInt(orderId));
      
      if (!order || order.userId !== userId) {
        throw new Error('Order not found');
      }

      if (['DELIVERED', 'CANCELLED', 'SHIPPED'].includes(order.status)) {
        throw new Error(`Order cannot be cancelled in ${order.status} status`);
      }

      // 1. Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' }
      });

      // 2. RESTORE STOCK (ACID consistency)
      for (const item of order.items) {
        await productRepository.incrementStock(item.productId, item.quantity, tx);
      }

      console.log(`Order #${orderId} cancelled. Stock restored for ${order.items.length} items.`);
      return updatedOrder;
    });
  }

  async getOrders(userId) {
    return orderRepository.findAllByUserId(userId);
  }

  async getOrderById(id) {
    return orderRepository.findById(parseInt(id));
  }
}

module.exports = new OrderService();
