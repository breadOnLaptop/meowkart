const prisma = require('../config/prisma');

class WishlistRepository {
  async findByUserId(userId) {
    return prisma.wishlist.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async findWishlistOnly(userId) {
    return prisma.wishlist.findUnique({ where: { userId } });
  }

  async createWishlist(userId) {
    return prisma.wishlist.create({
      data: { userId },
      include: { items: { include: { product: true } } }
    });
  }

  async findItem(wishlistId, productId) {
    return prisma.wishlistItem.findFirst({
      where: { wishlistId, productId }
    });
  }

  async createItem(data) {
    return prisma.wishlistItem.create({ data });
  }

  async deleteItem(id) {
    return prisma.wishlistItem.delete({ where: { id } });
  }
}

module.exports = new WishlistRepository();
