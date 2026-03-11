const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const systemUserCheck = async (req, res, next) => {
  //bring and checj jwt token for auth
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({
        message: "token is not given",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    

    const user = await userModel.findById(decoded._id).select("+systemUser");
    if (!user) {
      return res.status(404).json({
        message: "No such user found...",
      });
    }
    if (!user.systemUser) {
      return res.status(403).json({
        message: "Unauthorised user, only system user allowed...",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: " unauthorised access... ",
    });
  }
};

module.exports = systemUserCheck;
