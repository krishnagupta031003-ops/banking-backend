const router = require("express").Router()
const transactionController = require("../controllers/transaction.controller")
const initialTransactionController = require("../controllers/initialTransactionController")
const authCheckRoute = require("../middlewares/auth.middleware")

router.post("system/initial-transaction",systemUserCheck,initialTransactionController)
router.post("/createTransaction",authCheckRoute,transactionController)

module.exports = router