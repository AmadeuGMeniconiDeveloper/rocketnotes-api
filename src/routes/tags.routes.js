const { Router } = require("express");
const ensureAuthentication = require("../middleware/ensureAuthentication");
const TagsController = require("../controllers/tagsController");

const tagsRoutes = Router();
const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthentication, tagsController.index);

module.exports = tagsRoutes;
