const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require("../models/User");
const mailer = require("../helpers/mailer");
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/login', (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile/account",
  failureRedirect: "/auth/login"
}));

router.get('/signup', (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const {name, email, phone, date, password} = req.body;

  if(req.body.name === ""){
    res.render("register", {msg: "Ingresa tu nombre"});
    return;
  }
  else if(req.body.email === ""){
    res.render("register", {msg: "Ingresa tu email"});
    return;
  }
  else if(req.body.phone === ""){
    res.render("register", {msg: "Ingresa tu teléfono"});
    return;
  }
  else if(req.body.date === ""){
    res.render("register", {msg: "Ingresa tu fecha de nacimiento"});
    return;
  }
  else if(req.body.password === ""){
    res.render("register", {msg: "Ingresa tu teléfono"});
    return;
  }
  else if(req.body.password !== req.body["password-confirm"]){
    res.render("register", {msg: "Las contraseñas no coinciden"});
    return;
  }
  else if(req.body.name === "" && req.body.email === "" && req.body.phone === "" && req.body.date === "" && req.body.password === "" && req.body["password-confirm"] === ""){
    res.render("register", {msg: "NO completaste ningun campo"});
    return;
  }
  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("register", { msg: "El correo ya esta registrado" });
      return;
    }
    User.findOne({ phone }, "phone", (err, user) => {
      if (user !== null) {
        res.render("register", { msg: "El telefóno ya esta registrado" });
        return;
      }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  let hashUsername = bcrypt.hashSync(name, salt);
    hashUsername = hashUsername.replace(/\//g, '');
    hashUsername = hashUsername.replace(/\//g, '');
    const confirmationCode = encodeURIComponent(hashUsername);

    User.register({name, email, phone, date, confirmationCode: confirmationCode}, password)
    .then(user => {
      mailer.sendMail(user.email, hashUsername, user.name) 
      client.messages.create({
        to: '+'+ user.phone,
        from: process.env.TWILIO_NUMBER,
        body: 'Gracias por registrarte en SweetDrinks en breve recibirás un correo para confirmar tu cuenta.'
      });
      res.redirect("/profile/account");
    })
    .catch(err => {
      console.log(err)
      res.status(500).render("register",{err, msg:"No pudimos registrarte"})
    });
  });
});
});

router.get("/confirm/:confirmCode", (req, res) => {
  const code = encodeURIComponent(req.params.confirmCode);
  User.find({confirmationCode: code})
  .then((user) =>{
    User.findByIdAndUpdate(user[0]._id, {status: "Active"})
    .then(user=>{
      res.render("confirm", {user});
    });
  })
  .catch(err=> console.log(err))
 });

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;