const cartRepository = require('../repositories/CartRepository');

class CartService {
  async getCart(userId) {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }
    return cart;
  }

  async addToCart(userId, productId, quantity) {
    let cart = await cartRepository.findCartOnly(userId);
    if (!cart) cart = await cartRepository.createCart(userId);

    const existingItem = await cartRepository.findItem(cart.id, parseInt(productId));

    if (existingItem) {
      return cartRepository.updateItem(existingItem.id, {
        quantity: existingItem.quantity + (quantity || 1),
      });
    } else {
      return cartRepository.createItem({
        cartId: cart.id,
        productId: parseInt(productId),
        quantity: quantity || 1,
      });
    }
  }

  async updateItemQuantity(itemId, quantity) {
    return cartRepository.updateItem(parseInt(itemId), { quantity: parseInt(quantity) });
  }

  async removeItem(itemId) {
    return cartRepository.deleteItem(parseInt(itemId));
  }
}

module.exports = new CartService();
