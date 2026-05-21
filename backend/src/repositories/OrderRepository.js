const prisma = require('../config/prisma');

class OrderRepository {
  async createOrder(data) {
    return prisma.order.create({ data });
  }

  async findAllByUserId(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
  }
}

module.exports = new OrderRepository();
