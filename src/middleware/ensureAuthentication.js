const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthentication(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    req.user = {
      id: Number(user_id),
    };

    return next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
}

module.exports = ensureAuthentication;
