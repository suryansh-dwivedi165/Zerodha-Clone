const { model } = require("mongoose");

const { OrderSchema } = require("../Schemas/OrderSchema");

const { OrderSchema } = new model("order", OrderSchema);

module.exports = { OrdersModel }; 