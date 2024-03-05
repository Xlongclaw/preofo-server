const mongoose  = require('mongoose')

const partnerOrderSchema =new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  orderPrice:Number,
  orderStatusCode:Number,
  // 100 -completed 101-accepted 103-pending 102-rejected 
  orderItems:[
    {
      itemId:String,
      itemQty:Number,
      itemPrice:Number
    },
  ],
  partners:[{type: mongoose.Schema.Types.ObjectId, ref: 'Partner'}]
});

const partnerOrderModel = mongoose.model("PartnerOrder", partnerOrderSchema);
module.exports = partnerOrderModel;