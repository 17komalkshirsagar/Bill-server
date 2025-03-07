const asynchandler = require("express-async-handler")
const Transaction = require("../models/Transaction")
exports.createBill = asynchandler(async (req, res) => {
    await Transaction.create({ ...req.body, user: req.user })
    res.json({ message: "new bill create success" })
})
exports.getBill = asynchandler(async (req, res) => {
    const result = await Transaction.find()
    res.json({ message: "new bill fetch success", result })
})