const express = require('express');
const router  = express.Router();
const commonMiddlewares = require("../helpers/commonMiddlewares");
const passport = require("passport");
const User = require("../models/User");
const mailer = require("../helpers/mailer");
const upload = require("../helpers/multer");
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/account", commonMiddlewares.isLoggedIn, (req, res) => {
  const {user} = req;
  User.find()
  .then(()=>{
    res.render("p_account", {user});
  })
});

router.get("/account/:id/edit",commonMiddlewares.isLoggedIn, (req,res)=>{
  let {user} = req;
  User.findById(req.params._id)
  .then(()=>{
    res.render("e_account", {user});
  })
});

router.post("/account/:id/edit",commonMiddlewares.isLoggedIn, upload.single("photo"), (req,res)=>{
  if (req.file !== undefined) req.body.photo = req.file.url;
  User.findByIdAndUpdate(req.params.id, { $set: req.body}, {new: true})
  .then(()=>{
    res.redirect("/profile/account");
  })
  .catch(err=>{
    res.render("e_account", {err, msg: "Ocurrió un error al actualizar"});
  })
});

router.post("/account/:id/delete", commonMiddlewares.isLoggedIn, (req, res)=>{
  User.findOneAndDelete(req.params._id)
  .then(()=>{
    res.redirect("/")
  });
});

module.exports = router;