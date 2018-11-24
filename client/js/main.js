import { Service_API } from './services/Service_API.js'
import { compile } from 'handlebars';

/*
  Sirve para que apunte directamente al API a través de una IP fija.
  Lo he utilizado para conectarme remotamente. Si lo dejo como
  localhost no funciona desde otra máquina porque busca el API en
  localhost.
*/
//var APIservice = new Service_API('http://185.207.145.237:3000')
var APIservice = new Service_API('http://localhost:3000')

//Define la variable de tipo Local Storage para la sesión del usuario.
var myStorage = window.localStorage

//Inicializa el ID del coche a editar como -1. Si no se cambia, añade en vez de editar.
myStorage.carIDtoEdit = -1

//Plantilla de handlebars para insertar cada fila de coche.
var templateItem = `
   <tr>
      <td>{{maker}}</td>
      <td>{{model}}</td>
      <td>
      <a class="car_details" href="javascript:details({{id}})">Details</a>
      <a class="car_edit" href="javascript:editCar({{id}})">Edit</a>
      <a class="car_delete" href="javascript:deleteCar({{id}})">Delete</a>
      </td>
   </tr>
`
/*
  Plantilla que muestra una tabla con tres columnas para luego mostrar todos los coches
  Luego llama a la plantilla anterior que muestra cada coche y las tres acciones que
  se pueden realizar sobre cada uno de los coches.
  
  El "." significa el objeto del nivel "actual", en nuestro caso es el array por el que 
  vamos a iterar con handlebars.

  El ${} nos permite interpolar variables (funcionalidad de ES6). Es solo por no andar 
  concatenando cadenas, esto queda más elegante.
*/
var templateList = `
  <h2>Available cars in the catalogue</h2>
  <table class="carTable">
    <thead>
      <tr>
        <th scope="col">Maker</th>
        <th scope="col">Model</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {{#.}}
        ${templateItem}
      {{/.}}
    </tbody>
  </table>
`

//Plantilla de handlebars que recibe una variable y la imprime. En este caso el username.
var welcomeUser = `
  <label style="text-align: left">Hello <strong>{{this}}&nbsp;</strong><label>
`

//Plantilla que dibuja una tabla y la rellena con los datos del coche.
var carDetails = `
  <h2>Car details</h2>
  <table class="carTable">
    <thead>
      <tr>
        <th scope="col">Maker</th>
        <th scope="col">Model</th>
        <th scope="col">Year</th>
        <th scope="col">Country</th>
        <th scope="col">Mileage</th>
        <th scope="col">Available</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{maker}}</td>
        <td>{{model}}</td>
        <td>{{year}}</td>
        <td>{{country}}</td>
        <td>{{mileage}} km</td>
        <td>{{available}}</td>
        <td>{{price}} €</td>
      </tr>
    </tbody>
  </table>
`


//Compilamos las plantillas handlebars. Esto genera funciones a las que llamaremos luego.
var tmpl_carList_compiled = compile(templateList)         //Plantilla lista coches
var tmpl_item_compiled = compile(templateItem)            //Plantilla lista coches item
var tmpl_carDetails_compiled = compile(carDetails)        //Plantilla detalle coche
var tmpl_welcome_username_compiled = compile(welcomeUser) //Plantilla saludo usuario

//Muestra en la consola del navegador un mensaje de la hora de conexión.
console.log("Page loaded @ " + new Date().toLocaleString())

//Comprueba que el usuario no haya iniciado sesión para pedirle los datos.
if(myStorage.loginStatus != "OK") {
  //Lee los campos de usuario y contraseña al pulsar sobre el botón Login.
  document.getElementById('button_login').addEventListener('click', function () {
    var user = {
      //Lee el campo con el nombre del usuario.
      "username": document.getElementById('username').value,
      //Lee el campo con la contraseña del usuario.
      "password": document.getElementById('password').value
    }

    //Llama al API para hacer el Login.
    APIservice.login(user).then(function (result) {
      //Si el login es incorrecto, muestra una ventana de aviso.
      if (result == "Wrong username or password") {    
        window.alert(result)
      } else {
        //Guarda en Local Storage que el usuario ha iniciado sesión.
        myStorage.loginStatus = "OK"
        //Guarda el nombre del usuario en Local Storage.
        myStorage.username = user.username
        //Guarda el token devuelto por el API en Local Storage.
        myStorage.token = result
        //Recarga la página y con la sesión iniciada ya muestra contenido.
        location.reload()
      }
    })
  })
} else {  
  //Recupera el contenedor principal y le añade un fondo negro con 80% de transparencia.
  var divContainer = document.getElementById('container')
  divContainer.style.background = "black"
  divContainer.style.opacity = 0.8

  //Recupera el div del login y lo oculta.
  var divLoginBox = document.getElementById("loginBox")
  divLoginBox.style.display = "none"

  //Recupera el botón del logout y lo muestra.
  var logoutButton = document.getElementById('button_logout')
  logoutButton.style.display = "inline"

  //Recupera el div que muestra el nombre del usuario e inserta su nombre para saludarlo.
  var welcomeUser = document.getElementById('welcomeUser')
  welcomeUser.innerHTML = tmpl_welcome_username_compiled(myStorage.username)
  welcomeUser.style.display = "inline"

  //Llamada al API para mostrar todos los coches del catálogo.
  APIservice.listCars().then(function (data) {
    //Llama a la función auxiliar "isEmpty" para comprobar que hay coches.
    if(!isEmpty(data)) {
      //Recupera el div de la lista de coches disponibles.
      var divAvailableCars = document.getElementById("availableCarsList")
      //Inserta la plantilla de la lista de coches en el div anterior.
      divAvailableCars.innerHTML = tmpl_carList_compiled(data)
      //Alinea todos los elementos del div a la izquierda.
      divAvailableCars.style.textAlign = "left"
      //Muestra el div al final.
      divAvailableCars.style.display = "inline"
      //Si no hay coches en el catálogo, muestra un mensaje de alerta.
    } else window.alert("There are no cars in the catalogue!")
  })

  //Recupera el div que implementa los campos del formulario y lo muestra.
  //Se emplea tanto para añadir como para modificar.
  var divAddCar = document.getElementById('addModCar')
  divAddCar.style.textAlign = "left"
  divAddCar.style.display = "inline"
  
  //Inicializa los campos del formulario con valores vacios.
  document.getElementById('maker').value = ""
  document.getElementById('model').value = ""
  document.getElementById('year').value = ""
  document.getElementById('country').value = ""
  document.getElementById('mileage').value = ""
  document.getElementById('available').value = ""
  document.getElementById('price').value = ""
  //Inicializa el ID del coche a modificar con -1 para que por defecto añada.
  myStorage.carIDtoEdit = -1
}

//Al pulsar sobre el botón Logout cierra sesión.
document.getElementById('button_logout').addEventListener('click', function () {
  //Realmente borra todo el contenido de Local Storage.
  myStorage.clear()
  //Luego recarga la página.
  location.reload()
})

//Función para mostrar los detalles de un coche dado tras hacer click sobre el botón Details.
function details(id) {
  //Llama al API para buscar el coche.
  APIservice.getCar(id).then(function (data) {
    //Recupera el div que muestra los datos del vehículo.
    var divCarDetails = document.getElementById("carDetails")
    //Llama a la plantilla de handlebars con los datos del coche y lo inserta.
    divCarDetails.innerHTML = tmpl_carDetails_compiled(data)
    //Alinea todos los elementos del div a la izquierda.
    divCarDetails.style.textAlign = "left"
    //Por último, muestra el contenedor.
    divCarDetails.style.display = "inline"
  })
}

/*
  Para que desde la página se pueda llamar a la función, la guardamos en el ámbito global
  (window). Si no, no será visible, porque el código del main.js no es visible directamente 
  para el HTML, sino el bundle.js.
*/
window.details = details

//Función para borrar un coche.
function deleteCar(id) {
  /*Llama al API con el id del coche a borrar y el token de autentificación 
    que recibe desde Local Storage.
    */
  APIservice.deleteCar(id, myStorage.token).then(function () {
    location.reload()
  })
}

/*
  Para que desde la página se pueda llamar a la función, la guardamos en el ámbito global
  (window). Si no, no será visible, porque el código del main.js no es visible directamente 
  para el HTML, sino el bundle.js.
*/
window.deleteCar = deleteCar

//Función que recibe un objeto y comprueba que está vacio.
function isEmpty(obj) {
  //El for recorre todos los campos existentes en el objeto.
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

//Función para editar un coche.
function editCar(id) {
  //Primero llama al API para recuperar el coche cuyos datos queremos cambiar.
  APIservice.getCar(id).then(function (car) {
    //Luego rellena los campos del formulario con los datos recuperados por el API.
    document.getElementById('maker').value = car.maker
    document.getElementById('model').value = car.model
    document.getElementById('year').value = car.year
    document.getElementById('country').value = car.country
    document.getElementById('mileage').value = car.mileage
    document.getElementById('available').value = car.available
    document.getElementById('price').value = car.price
  })

  //Almacena en Local Storage el ID del coche que queremos editar.
  myStorage.carIDtoEdit = id
}

/*
  Para que desde la página se pueda llamar a la función, la guardamos en el ámbito global
  (window). Si no, no será visible, porque el código del main.js no es visible directamente 
  para el HTML, sino el bundle.js.
*/
window.editCar = editCar

/*
  El botón OK del formulario distingue gracias al "carIDtoEdit" del Local Storage
  si debe editar un coche o añadir uno nuevo. La función por defecto es la de añadir
  un coche nuevo a la base de datos.

  Al hacer click sobre OK se mira el valor del campo anterior y si es mayor o igual
  que 0, modifica el coche. En caso contrario añade uno nuevo.
*/
document.getElementById('button_ok').addEventListener('click', function () {
  //Lee todos los datos introducidos en los campos del formulario.
  var car = {
    maker: document.getElementById('maker').value,
    model: document.getElementById('model').value,
    year: document.getElementById('year').value,
    country: document.getElementById('country').value,
    mileage: document.getElementById('mileage').value,
    available: document.getElementById('available').value,
    price: document.getElementById('price').value
  }

  //Impide que se inserte o modifique un coche sin marca ni modelo.
  if(car.maker == "" && car.model == "")
    //Muestra una ventana de error si se dejan en blanco.
    window.alert("You must specify maker and model!")
  else {
    //Comprueba que el ID del coche a editar sea mayor o igual que 0.
    if(myStorage.carIDtoEdit >= 0) {
      //Añade el campo ID a los datos anteriores del coche.
      car.id = myStorage.carIDtoEdit
      //Llama al API para que sustituya el coche. Le pasa el token.
      APIservice.editCar(car, myStorage.token)
      //Llama al API para añadir un coche nuevo. Le pasa los datos del coche y el token.
    } else APIservice.addCar(car, myStorage.token)

    //Recarga la página tras medio segundo de espera.
    setTimeout(location.reload.bind(location), 500)
  }
})