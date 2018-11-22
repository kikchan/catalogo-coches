import { Service_API } from './services/Service_API.js'
import { compile } from 'handlebars';

var APIservice = new Service_API('http://localhost:3000')
//var APIservice = new Service_API('http://185.207.145.237:3000')

var myStorage = window.localStorage

var templateItem = `
   <tr>
      <td>{{maker}}</td>
      <td>{{model}}</td>
      <td><a id="car_{{id}}" href="javascript:details({{id}})">Details</a></td>
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


//Compilamos las plantillas handlebars. Esto genera funciones a las que llamaremos luego
var tmpl_carList_compiled = compile(templateList)
var tmpl_item_compiled = compile(templateItem)
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
  var username = tmpl_welcome_username_compiled(myStorage.username)
  logoutButton.insertAdjacentHTML('beforebegin', username)
  logoutButton.style.display = "inline"

  APIservice.listCars().then(function (data) {
    var divAvailableCars = document.getElementById("availableCarsList")
    divAvailableCars.innerHTML = tmpl_carList_compiled(data)
    divAvailableCars.style.textAlign = "left"
    divAvailableCars.style.display = "inline"
  })
}

document.getElementById('button_logout').addEventListener('click', function () {
  myStorage.clear()
  location.reload()
})

function details(id) {
  APIservice.getCar(id).then(function (car) {
    var car = {
      id: car.id, 
      maker: car.maker,
      model: car.model,
      year: car.year,
      country: car.country,
      mileage: car.mileage,
      available: car.available,
      price: car.price
    }

    console.log(car)
  })
}

//Its quite important to store the function into the actual window so the page can load it
window.details = details