const { createBill, getBill } = require("../controllers/user.controller")

const router = require("express").Router()

router
    .post("/create-bill", createBill)
    .get("/bill", getBill)

module.exports = router