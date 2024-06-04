const { Router } = require("express");
const ensureAuthentication = require("../middleware/ensureAuthentication");
const NotesController = require("../controllers/notesController");

const notesRoutes = Router();
const notesController = new NotesController();

notesRoutes.use(ensureAuthentication);

notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.get("/", notesController.index);

module.exports = notesRoutes;
