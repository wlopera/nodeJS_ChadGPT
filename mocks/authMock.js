const bcrypt = require("bcryptjs");

const mockUser = {
  username: "admin",
  password: bcrypt.hashSync("12345", 10),
};

module.exports = mockUser;
