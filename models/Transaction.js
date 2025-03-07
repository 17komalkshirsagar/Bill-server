const mongoose = require("mongoose")

module.exports = mongoose.model("transaction", new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    event: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    group: [
        {
            name: { type: String, required: true },
            paid: { type: Number, required: true },
            pending: { type: Number, required: true },
        }
    ],
    isSettled: { type: Boolean, required: true, default: false }
}, {}))