import { Service_API } from './services/Service_API.js'
import { compile } from 'handlebars';

var APIservice = new Service_API('http://localhost:3000')
//var APIservice = new Service_API('http://185.207.145.237:3000')

var myStorage = window.localStorage

var templateItem = `
   <tr>
      <td>{{maker}}</td>
      <td>{{model}}</td>
      <td>
      <a class="car_details" href="javascript:details({{id}})">Details</a>
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
  Hello <strong>{{this}}</strong></br>
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

//Its quite important to store the function into the actual window so the page can load it
window.deleteCar = deleteCar

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}