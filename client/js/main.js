import { Service_API } from './services/Service_API.js'
import { compile } from 'handlebars';

var APIservice = new Service_API('http://localhost:3000')
//var APIservice = new Service_API('http://185.207.145.237:3000')

var myStorage = window.localStorage
myStorage.carIDtoEdit = -1

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

var welcomeUser = `
  <label style="text-align: left">Hello <strong>{{this}}&nbsp;</strong><label>
`

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


//Compilamos las plantillas handlebars. Esto genera funciones a las que llamaremos luego
var tmpl_carList_compiled = compile(templateList)
var tmpl_item_compiled = compile(templateItem)
var tmpl_carDetails_compiled = compile(carDetails)
var tmpl_welcome_username_compiled = compile(welcomeUser)

console.log("Page loaded @ " + new Date().toLocaleString())

if(myStorage.loginStatus != "OK") {
  document.getElementById('button_login').addEventListener('click', function () {
    var user = {
      "username": document.getElementById('username').value,
      "password": document.getElementById('password').value
    }

    APIservice.login(user).then(function (result) {
      if (result == "Wrong username or password") {    
        window.alert(result)
      } else {
        myStorage.loginStatus = "OK"
        myStorage.username = user.username
        myStorage.token = result
        location.reload()
      }
    })
  })
} else {  
  var divContainer = document.getElementById('container')
  divContainer.style.background = "black"
  divContainer.style.opacity = 0.8

  var divLoginBox = document.getElementById("loginBox")
  divLoginBox.style.display = "none"

  var logoutButton = document.getElementById('button_logout')
  logoutButton.style.display = "inline"

  var welcomeUser = document.getElementById('welcomeUser')
  welcomeUser.innerHTML = tmpl_welcome_username_compiled(myStorage.username)
  welcomeUser.style.display = "inline"

  APIservice.listCars().then(function (data) {
    if(!isEmpty(data)) {
      var divAvailableCars = document.getElementById("availableCarsList")
      divAvailableCars.innerHTML = tmpl_carList_compiled(data)
      divAvailableCars.style.textAlign = "left"
      divAvailableCars.style.display = "inline"
    } else window.alert("There are no cars in the catalogue :(")
  })

  var divAddCar = document.getElementById('addModCar')
  divAddCar.style.textAlign = "left"
  divAddCar.style.display = "inline"
}

document.getElementById('button_logout').addEventListener('click', function () {
  myStorage.clear()
  location.reload()
})

function details(id) {
  APIservice.getCar(id).then(function (data) {
    var divCarDetails = document.getElementById("carDetails")
    divCarDetails.innerHTML = tmpl_carDetails_compiled(data)
    divCarDetails.style.textAlign = "left"
    divCarDetails.style.display = "inline"
  })
}

//Its quite important to store the function into the actual window so the page can load it
window.details = details

function deleteCar(id) {
  APIservice.deleteCar(id, myStorage.token).then(function () {
    location.reload()
  })
}

//Same story on this one
window.deleteCar = deleteCar

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

function editCar(id) {
  APIservice.getCar(id).then(function (car) {
    document.getElementById('maker').value = car.maker
    document.getElementById('model').value = car.model
    document.getElementById('year').value = car.year
    document.getElementById('country').value = car.country
    document.getElementById('mileage').value = car.mileage
    document.getElementById('available').value = car.available
    document.getElementById('price').value = car.price
  })

  myStorage.carIDtoEdit = id
}

//Same story on this one
window.editCar = editCar

document.getElementById('button_ok').addEventListener('click', function () {
  console.log(myStorage.carIDtoEdit)

  var car = {
    maker: document.getElementById('maker').value,
    model: document.getElementById('model').value,
    year: document.getElementById('year').value,
    country: document.getElementById('country').value,
    mileage: document.getElementById('mileage').value,
    available: document.getElementById('available').value,
    price: document.getElementById('price').value
  }

  if(myStorage.carIDtoEdit >= 0) {
    car.id = myStorage.carIDtoEdit

    APIservice.editCar(car, myStorage.token).then(function () {
      console.log("edit")
      myStorage.carIDtoEdit = -1
    })
  } else APIservice.addCar(car, myStorage.token).then(function () {
    console.log("add")
    myStorage.carIDtoEdit = -1
  })

  document.getElementById('maker').value = ""
  document.getElementById('model').value = ""
  document.getElementById('year').value = ""
  document.getElementById('country').value = ""
  document.getElementById('mileage').value = ""
  document.getElementById('available').value = ""
  document.getElementById('price').value = ""
  
  location.reload()
})