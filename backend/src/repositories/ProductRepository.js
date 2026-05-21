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
}

module.exports = new ProductRepository();
