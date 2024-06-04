const knex = require("../database/knex");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const authConfig = require("../configs/auth");

const AppError = require("../utils/AppError");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("E-mail or password incorrect", 401);
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new AppError("E-mail or password incorrect", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return res.json({ user, token });
  }
}

module.exports = SessionsController;
