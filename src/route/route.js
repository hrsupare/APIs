const express = require("express")
const router = express.Router()
const { registerUser, userVerification, userlogin } = require("../controller/userController")


router.post("/registration", registerUser)

router.post("/login", userlogin)


module.exports = router