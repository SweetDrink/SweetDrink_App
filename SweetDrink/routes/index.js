const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  const {user} = req;
  User.find()
  .then(()=>{
    console.log(user)
    res.render('index', {user});
  })
});

module.exports = router;
