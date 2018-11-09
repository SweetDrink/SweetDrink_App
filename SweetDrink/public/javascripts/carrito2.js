//variables
const botonCarrito = document.getElementById("agregar");

botonCarrito.onclick = function(){
  var tr = document.createElement("tr")
  var t = document.createTextNode("CLICK ME");
  document.getElementById("tablecarrito").innerHTML = tr.appendChild(t);  ;

}