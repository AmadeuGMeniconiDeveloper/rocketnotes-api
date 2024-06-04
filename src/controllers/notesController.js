const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const { id: user_id } = req.user;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    if (links.length !== 0) {
      const linksInsert = links.map(link => {
        return {
          note_id,
          url: link,
        };
      });

      await knex("links").insert(linksInsert);
    }

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    await knex("tags").insert(tagsInsert);

    return res.json({ message: "Note created" });
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return res.json({
      ...note,
      links,
      tags,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("notes").where({ id }).delete();

    return res.json({ message: "Note deleted" });
  }

  async index(req, res) {
    const { title, tags } = req.query;
    const { id: user_id } = req.user;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map(tag => tag.trim());

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("title", `%${title}%`)
        .whereIn("tags.name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .groupBy("notes.title")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .groupBy("notes.title")
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });

    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return res.json(notesWithTags);
  }
}

module.exports = NotesController;
