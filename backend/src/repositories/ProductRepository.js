const prisma = require('../config/prisma');

class ProductRepository {
  async findAll({ where, skip, take, orderBy }) {
    return prisma.product.findMany({ where, skip, take, orderBy });
  }

  async count(where) {
    return prisma.product.count({ where });
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { seller: { select: { name: true } } }
    });
  }

  /**
   * Atomic Stock Management (Concurrency Control)
   * Decrements stock ONLY if sufficient stock exists.
   * Returns the updated product or throws error.
   */
  async decrementStock(productId, quantity, tx = prisma) {
    // In PostgreSQL, we can use a check constraint or a simple where clause for atomicity
    const product = await tx.product.update({
      where: {
        id: productId,
        stock: { gte: quantity } // Atomic Check
      },
      data: {
        stock: { decrement: quantity }
      }
    });
    return product;
  }

  async incrementStock(productId, quantity, tx = prisma) {
    return tx.product.update({
      where: { id: productId },
      data: {
        stock: { increment: quantity }
      }
    });
  }
}

module.exports = new ProductRepository();
