const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  name: String,
  password: String,
  phoneNumber: String,
  restaurantId: String,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});


const partnerModel = mongoose.model("Partner", partnerSchema);

module.exports = partnerModel;