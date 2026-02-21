const router = require("express").Router();
const authCheckRoute = require("../middlewares/auth.middleware");
const {
  createAccount,
  fetchAccount,
} = require("../controllers/account.controller");

router.post("/createAccount", authCheckRoute, createAccount);
router.get("/fetchAccount", authCheckRoute, fetchAccount);

module.exports = router;
