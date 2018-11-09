const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
  _user: {type: Schema.Type.ObjectId, ref: "User". required: true},
  mail: String,
  pay: String,
  phone: Number,
  items: {type: Schema.Type.ObjectId, ref: "Producto". required: true},
  qty: Number, 
  total: Number,
},
{
  timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
  }
});

module.exports = mongoose.model("Pedido", pedidoSchema);