const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class TagsController {
  async index(req, res) {
    const { id: user_id } = req.user;

    const tags = await knex("tags")
      .where({ user_id })
      .orderBy("name")
      .groupBy("name");

    return res.json(tags);
  }
}

module.exports = TagsController;
