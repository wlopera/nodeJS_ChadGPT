const mockUser = require("../mocks/authMock");

class AuthService {
  constructor() {
    this.mockUser = mockUser;
  }

  // Validar login
  validateLogin({ username, password }) {
    return new Promise((resolve, reject) => {
      try {
        if (username !== this.mockUser.username) {
          return reject({ status: 401, message: "Usuario no encontrado" });
        }

        const isMatch = require("bcryptjs").compareSync(
          password,
          this.mockUser.password
        );
        if (!isMatch) {
          return reject({ status: 401, message: "Contraseña incorrecta" });
        }

        resolve({ username });
      } catch (err) {
        reject({ status: 500, message: "Error interno", error: err });
      }
    });
  }
}

module.exports = AuthService;
