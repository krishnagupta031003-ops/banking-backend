const router =require("express").Router()
const {createAccount , fetchAccount}=require("../controllers/account.controller")

router.post("/:accountId",createAccount)
router.get("/:accountId",fetchAccount)

module.exports = router