import { Service_API } from './services/Service_API.js'
import { compile } from 'handlebars';

var APIservice = new Service_API('http://localhost:3000')

var myStorage = window.localStorage

//Plantilla handlebars para renderizar en HTML un item de la lista
//Usamos backticks (funcionalidad de ES6) para delimitar la cadena para que pueda ser multilínea
//Con el "javascript:" en el href conseguimos que un enlace pueda llamar a código JS
var templateItem = `
   <div>
      <span id="{{id}}">
         <strong>{{maker}}</strong> <em>{{model}}</em>
      </span>   
      <a id="enlace_{{id}}" href="javascript:verDetalles({{id}})">Details</a>
   </div>
`

//Plantilla Handlebars para renderizar en HTML la lista de la compra
//1. El "." significa el objeto del nivel "actual", en nuestro caso es el array
//por el que vamos a iterar con handlebars
//2. El ${} nos permite interpolar variables (funcionalidad de ES6). Es solo por no
//andar concatenando cadenas, esto queda más elegante
var templateList = `
 <h2>Car list</h2>
 {{#.}}
   ${templateItem}
 {{/.}}
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

      var divAvailableCars = document.getElementById("availableCarsList")
      divAvailableCars.style.display = "inline"

      var logoutButton = document.getElementById('button_logout')
      var username = tmpl_welcome_username_compiled(user)
      logoutButton.insertAdjacentHTML('beforebegin', username)
      logoutButton.style.display = "inline"
    }
  })
})

document.addEventListener('DOMContentLoaded', function () {
  console.log("Page loaded @ " + new Date().toLocaleString())

  APIservice.listCars().then(function (data) {
    var carListHTML = tmpl_carList_compiled(data)
    document.getElementById("availableCarsList").innerHTML = carListHTML
  })
})

document.getElementById('button_logout').addEventListener('click', function () {
  myStorage.clear
  location.reload()
})