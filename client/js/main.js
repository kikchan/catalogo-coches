import { Service_API } from './services/Service_API.js'
import { compile } from 'handlebars';

var APIservice = new Service_API('http://localhost:3000')
//var APIservice = new Service_API('http://185.207.145.237:3000')

var myStorage = window.localStorage

var templateItem = `
   <tr>
      <td>{{maker}}</td>
      <td>{{model}}</td>
      <td><a id="enlace_{{id}}" href="javascript:verDetalles({{id}})">Details</a></td>
   </tr>
`

/*
<span id="{{id}}">
         <strong>{{maker}}</strong> <em>{{model}}</em>
      </span>   
      <a id="enlace_{{id}}" href="javascript:verDetalles({{id}})">Details</a>
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

var templateDetails = `
  <span id="details_{{id}}">
    {{details}}
  </span>
`

var wrongUser = `
  </br></br><strong class="wrongCredentials">Wrong username or password!</strong>
`

var welcomeUser = `
  Hello <strong>{{username}}</strong></br>
`


//Compilamos las plantillas handlebars. Esto genera funciones a las que llamaremos luego
var tmpl_carList_compiled = compile(templateList)
var tmpl_item_compiled = compile(templateItem)
var tmpl_detalles_compiled = compile(templateDetails)
var tmpl_wrong_username_compiled = compile(wrongUser)
var tmpl_welcome_username_compiled = compile(welcomeUser)

console.log("Page loaded @ " + new Date().toLocaleString())

document.getElementById('button_login').addEventListener('click', function () {
  var user = {
    "username": document.getElementById('username').value,
    "password": document.getElementById('password').value
  }

  APIservice.login(user).then(function (result) {
    if (result == "Wrong username or password") {
      console.log("Wrong username or password")
      
      var loginButton = document.getElementById('button_login')
      loginButton.insertAdjacentHTML("afterend", wrongUser)
    } else {
      myStorage.username = user.username
      myStorage.token = result

      var divContainer = document.getElementById('container')
      divContainer.style.background = "black"
      divContainer.style.opacity = 0.8

      var divLoginBox = document.getElementById("loginBox")
      divLoginBox.style.display = "none"

      var logoutButton = document.getElementById('button_logout')
      var username = tmpl_welcome_username_compiled(user)
      logoutButton.insertAdjacentHTML('beforebegin', username)
      logoutButton.style.display = "inline"

      APIservice.listCars().then(function (data) {
        var divAvailableCars = document.getElementById("availableCarsList")
        divAvailableCars.innerHTML = tmpl_carList_compiled(data)
        divAvailableCars.style.textAlign = "left"
        divAvailableCars.style.display = "inline"
      })
    }
  })
})

document.getElementById('button_logout').addEventListener('click', function () {
  myStorage.clear
  location.reload()
})