require("express-async-errors");
require("dotenv").config();

const cors = require("cors");
const uploadConfig = require("./configs/upload");
const database = require("./database/sqlite");
const express = require("express");

const AppError = require("./utils/AppError");

const apiRoutes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.UPLOADS_DIR)); // serve files (?)

app.use("/", apiRoutes);

database();

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: "error", error: err.message });
  }
  return res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
