const asynchandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/email")
const { differenceInSeconds } = require("date-fns")
const User = require("../models/User")



exports.userRegister = asynchandler(async (req, res) => {
    const { email, mobile } = req.body
    const result = await User.findOne({
        $or: [
            { email: email },
            { mobile: mobile },
        ]
    })
    if (result) {
        return res.status(401).json({ message: "invalid email / mobile" })
    }
    await User.create(req.body)
    res.json({ message: "user register success" })
})
exports.sendOtp = asynchandler(async (req, res) => {
    const { username } = req.body
    const result = await User.findOne({
        $or: [
            { email: username },
            { mobile: username },
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    await sendEmail({
        to: result.email,
        subject: "login otp",
        message: `your login otp is ${otp}`
    })

    await User.findByIdAndUpdate(result._id, { otp, otpSendOn: new Date() })
    res.json({ message: "otp send success" })
})
exports.userLogin = asynchandler(async (req, res) => {
    const { username, otp } = req.body
    const result = await User.findOne({
        $or: [
            { email: username },
            { mobile: username },
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })
    }
    if (result.otp != otp) {
        return res.status(401).json({ message: "invalid otp" })
    }
    if (differenceInSeconds(new Date(), result.otpSendOn) > 60) {
        return res.status(401).json({ message: "otp expired" })
    }
    await User.findByIdAndUpdate(result._id, { otp: null })
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
    res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "user login success",
        result: {
            name: result.name,
            email: result.email,
            mobile: result.mobile,
        }
    })
})
exports.userLogout = asynchandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "admin logout success" })
})