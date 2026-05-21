const wishlistRepository = require('../repositories/WishlistRepository');

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await wishlistRepository.findByUserId(userId);
    if (!wishlist) {
      wishlist = await wishlistRepository.createWishlist(userId);
    }
    return wishlist;
  }

  async addToWishlist(userId, productId) {
    let wishlist = await wishlistRepository.findWishlistOnly(userId);
    if (!wishlist) wishlist = await wishlistRepository.createWishlist(userId);

    const existing = await wishlistRepository.findItem(wishlist.id, parseInt(productId));

    if (!existing) {
      return wishlistRepository.createItem({
        wishlistId: wishlist.id,
        productId: parseInt(productId)
      });
    }
    return existing;
  }

  async removeItem(itemId) {
    return wishlistRepository.deleteItem(parseInt(itemId));
  }
}

module.exports = new WishlistService();
