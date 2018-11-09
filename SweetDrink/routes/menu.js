const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Producto = require("../models/Producto");
const Pedido = require("../models/Pedido");
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const commonMiddlewares = require("../helpers/commonMiddlewares");

router.get("/productos", (req, res) => {
  const {user} = req;
  User.find()
  .then(()=>{
    Producto.find({ type: "Servicios" }).then(servicios => {
      Producto.find({ type: "Juegos y más" }).then(juegos => {
        Producto.find({ type: "Farmacia" }).then(farmacia => {
          Producto.find({ type: "Cigarros" }).then(cigarros => {
            Producto.find({ type: "Botana" }).then(botana => {
              Producto.find({ type: "Jugos" }).then(jugos => {
                Producto.find({ type: "Mezclador" }).then(mezclador => {
                  Producto.find({ type: "Ginebra" }).then(ginebra => {
                    Producto.find({ type: "Whiskey" }).then(whiskey => {
                      Producto.find({ type: "Vodka" }).then(vodka => {
                        Producto.find({ type: "Ron" }).then(ron => {
                          Producto.find({ type: "Brandy" }).then(brandy => {
                            Producto.find({ type: "Tequila" }).then(tequila => {
                              Producto.find({ type: "Vino" }).then(vino => {
                                Producto.find({ type: "cerveza" }).then(
                                  cerveza => {
                                    res.render("menu", {
                                      cerveza,
                                      vino,
                                      tequila,
                                      brandy,
                                      ron,
                                      vodka,
                                      whiskey,
                                      ginebra,
                                      mezclador,
                                      jugos,
                                      botana,
                                      cigarros,
                                      farmacia,
                                      juegos,
                                      servicios,
                                      user
                                    });
                                  }
                                );
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  })
});

router.get("/carrito",commonMiddlewares.isLoggedIn, (req,res)=>{
  const {user} = req;
  User.find()
  .then(()=>{
    console.log(user)
    res.render("carrito", {user})
  })
});

router.post("/carrito", commonMiddlewares.isLoggedIn,(req,res)=>{
const newPedido = new Pedido({
  _user: req.user,
  _items: req.body.items,
  total: req.body.total 
});
newPedido.save()
.then((pedido)=>{
  client.messages.create({
    to: '+525534690871',
    from: process.env.TWILIO_NUMBER,
    body: 'Gracias por confiar en SweetDrinks en breve recibirás una llamada para confirmar tu pedido.'
  });
console.log("Se ha guardado ", {pedido})
})
.catch((err)=>{
  console.log(err, "se produjo un error")
})
})

module.exports = router;
