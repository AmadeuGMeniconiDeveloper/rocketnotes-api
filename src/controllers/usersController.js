const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");
const DiskStorage = require("../providers/diskStorage");
const AppError = require("../utils/AppError");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const userExists = await knex("users").where({ email }).first();

    if (userExists) {
      throw new AppError("User already exists");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({ message: "User created" });

    return res.status(201).json({ name, email, hashedPassword });
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const { id } = req.user;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("User not found");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    const userWithUpdatedEmail = await knex("users")
      .where({ email: user.email })
      .first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("E-mail already in use");
    }

    if (password) {
      if (!old_password) {
        throw new AppError(
          "You need to inform the old password to set a new password"
        );
      }
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match");
      }

      user.password = await hash(password, 8);
    }

    await knex("users")
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
        updated_at: user.created_at,
      })
      .where({ id });

    return res.json({ message: "User updated" });
  }

  async updateAvatar(req, res) {
    const { id } = req.user;
    const { filename } = req.file;

    const diskStorage = new DiskStorage();

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("Only authenticated users can change avatar", 401);
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const updatedFilename = await diskStorage.saveFile(filename);
    user.avatar = updatedFilename;

    await knex("users").update(user).where({ id });

    return res.json(user);
  }
}

module.exports = UsersController;
