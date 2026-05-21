const productRepository = require('../repositories/ProductRepository');

class ProductService {
  async getProducts({ page, limit, search, category }) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (category && category !== 'All') where.category = category;

    const [products, totalCount] = await Promise.all([
      productRepository.findAll({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      productRepository.count(where)
    ]);

    return {
      products,
      totalCount,
      hasMore: skip + take < totalCount
    };
  }

  async getProductById(id) {
    return productRepository.findById(id);
  }
}

module.exports = new ProductService();
