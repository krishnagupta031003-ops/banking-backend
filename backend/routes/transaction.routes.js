const router = require("express").Router()
const transactionController = require("../controllers/transaction.controller")
const authCheckRoute = require("../middlewares/auth.middleware")

router.post("/createTransaction",authCheckRoute,transactionController)

module.exports = router