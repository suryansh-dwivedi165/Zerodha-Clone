const mongoose = require("mongoose");

const { HolidingSchema } = require("../schemas/Holding_schems");

const HoldingsModel = mongoose.model("holding", HolidingSchema);

module.exports = { HoldingsModel }; 