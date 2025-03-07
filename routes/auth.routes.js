const { sendOtp, userRegister, userLogin, userLogout } = require("../controllers/auth.controller")

const router = require("express").Router()

router
    .post("/user-register", userRegister)
    .post("/send-otp", sendOtp)
    .post("/user-login", userLogin)
    .post("/user-logout", userLogout)

module.exports = router