const prisma = require('../config/prisma');

class AddressRepository {
  async findAllByUserId(userId) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });
  }

  async findById(id) {
    return prisma.address.findUnique({ where: { id } });
  }

  async create(data) {
    // If setting as default, unset others first
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: data.userId },
        data: { isDefault: false }
      });
    }
    return prisma.address.create({ data });
  }

  async update(id, userId, data) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }
    return prisma.address.update({
      where: { id, userId },
      data
    });
  }

  async delete(id, userId) {
    return prisma.address.delete({
      where: { id, userId }
    });
  }
}

module.exports = new AddressRepository();
