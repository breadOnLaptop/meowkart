const userRepository = require('../repositories/UserRepository');

class AuthService {
  constructor() {
    this.MOCK_USER_EMAIL = 'customer@meowkart.com';
    this.cachedUserId = null;
  }

  async ensureUserAndGetId() {
    if (this.cachedUserId) return this.cachedUserId;
    
    try {
      let user = await userRepository.findByEmail(this.MOCK_USER_EMAIL);
      if (!user) {
        user = await userRepository.create({
          name: 'Default User',
          email: this.MOCK_USER_EMAIL,
          password: 'mock_password',
          role: 'CUSTOMER'
        });
      }
      this.cachedUserId = user.id;
      return user.id;
    } catch (e) {
      console.error('ensureUserAndGetId error:', e);
      const anyUser = await userRepository.findFirst();
      if (anyUser) {
        this.cachedUserId = anyUser.id;
        return anyUser.id;
      }
      const newUser = await userRepository.create({
        name: 'Default User',
        email: this.MOCK_USER_EMAIL,
        password: 'mock_password',
        role: 'CUSTOMER'
      });
      this.cachedUserId = newUser.id;
      return newUser.id;
    }
  }
}

module.exports = new AuthService();
