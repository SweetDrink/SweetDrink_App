const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: "Debes mandar tu nombre",
    },
    email: {
        type: String,
        unique: "El email debe de unico",
        required: true
    },
    phone: {
      type: Number,
      required: true,
      unique: true
    },
    date: Date,
    password: String,
    confirmationCode: {
      type:String,
      unique: true
    },
    status: {type: String, enum: ["Pending Confirmation", "Active"],
    default: "Pending Confirmation"
  },
    profile_pic: String,
  },
  {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("User", userSchema);