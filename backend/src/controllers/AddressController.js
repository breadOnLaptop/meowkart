const addressRepository = require('../repositories/AddressRepository');
const authService = require('../services/AuthService');

class AddressController {
  async getAddresses(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const addresses = await addressRepository.findAllByUserId(userId);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createAddress(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const address = await addressRepository.create({
        ...req.body,
        userId
      });
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAddress(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      const address = await addressRepository.update(parseInt(req.params.id), userId, req.body);
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAddress(req, res) {
    try {
      const userId = await authService.ensureUserAndGetId();
      await addressRepository.delete(parseInt(req.params.id), userId);
      res.json({ message: 'Address deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AddressController();
