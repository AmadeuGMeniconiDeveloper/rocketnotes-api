const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const ensureAuthentication = require("../middleware/ensureAuthentication");
const UsersController = require("../controllers/usersController");

const upload = multer(uploadConfig.MULTER);

const userRoutes = Router();
const usersController = new UsersController();

userRoutes.post("/", usersController.create);
userRoutes.put("/", ensureAuthentication, usersController.update);
userRoutes.patch(
  "/avatar",
  ensureAuthentication,
  upload.single("avatar"),
  usersController.updateAvatar
);

module.exports = userRoutes;
