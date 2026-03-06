const userModel = require("../models/user.model");

const systemUserCheck = async (req, res, next) => {
  //bring and checj jwt token for auth 
  try {
    const isSystemUser = await userModel.findById(req.user._id);
    if (!isSystemUser) {
      return res.status(404).json({
        message: "No system user found...",
      });
    }
    if (isSystemUser.systemUser === false) {
      return res.status(403).json({
        message: "Unauthorised user, only system user allowed...",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: " server error... ",
    });
  }
};

module.exports = systemUserCheck
