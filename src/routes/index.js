const { Router } = require("express");

const userRoutes = require("./users.routes");
const notesRoutes = require("./notes.routes");
const tagsRoutes = require("./tags.routes");
const sessionsRoutes = require("./sessions.routes");

const apiRoutes = Router();

apiRoutes.use("/users", userRoutes);
apiRoutes.use("/notes", notesRoutes);
apiRoutes.use("/tags", tagsRoutes);
apiRoutes.use("/sessions", sessionsRoutes);

module.exports = apiRoutes;
