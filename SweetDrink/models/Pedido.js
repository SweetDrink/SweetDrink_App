const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
  _user      : { type: Schema.Types.ObjectId, ref: 'User', required: true  },
  _items: [{ type: Schema.Types.ObjectId, ref: 'Producto', required: true  }],
  total: Number,
},{
  timestamps    : {createdAt: "created_at", updatedAt: "updated_at"}
});


module.exports = mongoose.model("Pedido", pedidoSchema);