const prisma = require('../config/prisma');

class CartRepository {
  async findByUserId(userId) {
    return prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async findCartOnly(userId) {
    return prisma.cart.findUnique({ where: { userId } });
  }

  async createCart(userId) {
    return prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } }
    });
  }

  async findItem(cartId, productId) {
    return prisma.cartItem.findFirst({
      where: { cartId, productId },
    });
  }

  async createItem(data) {
    return prisma.cartItem.create({ data });
  }

  async updateItem(id, data) {
    return prisma.cartItem.update({ where: { id }, data });
  }

  async deleteItem(id) {
    return prisma.cartItem.delete({ where: { id } });
  }

  async clearCart(cartId) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
}

module.exports = new CartRepository();
