const authController = require('../../src/controllers/authController');
const User = require('../../src/models/userModel');
const AuthService = require('../../src/services/authService');
const EmailService = require('../../src/services/emailService');
const bcrypt = require('bcrypt');

// Mock des services et des modules
jest.mock('../../src/models/userModel');
jest.mock('../../src/services/authService');
jest.mock('../../src/services/emailService');
jest.mock('bcrypt');

// Utilise un utilitaire pour simuler `req` et `res`
const mockRequest = (body = {}) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Tests pour la méthode `login`
describe('authController.login', () => {
  it('devrait retourner une erreur 400 si email ou mot de passe est manquant', async () => {
    const req = mockRequest({ email: 'test@example.com' });
    const res = mockResponse();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required.' });
  });

  it('devrait retourner une erreur 401 si l\'utilisateur est introuvable', async () => {
    const req = mockRequest({ email: 'test@example.com', password: 'password' });
    const res = mockResponse();

    User.findOne.mockResolvedValue(null); // Simule un utilisateur non trouvé

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password.' });
  });

  it('devrait retourner une erreur 401 si les mots de passe ne correspondent pas', async () => {
    const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' });
    const res = mockResponse();
    const mockUser = { password: 'hashedpassword' };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); // Simule une non-correspondance des mots de passe

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password.' });
  });

  it('devrait retourner un token et les informations de l\'utilisateur si la connexion est réussie', async () => {
    const req = mockRequest({ email: 'test@example.com', password: 'correctpassword' });
    const res = mockResponse();
    const mockUser = {
      id: 'user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      role: 'User',
      companyId: 'company-id',
      projectIds: ['project1', 'project2'],
      password: 'hashedpassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true); // Simule une correspondance des mots de passe
    AuthService.generateToken.mockReturnValue('jwt-token'); // Simule la génération de token

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'jwt-token',
      user: {
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        role: mockUser.role,
        companyId: mockUser.companyId,
        projectIds: mockUser.projectIds,
      },
    });
  });
});
