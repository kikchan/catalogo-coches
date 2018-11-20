import { Service_API } from './services/Service_API.js'
import { compile } from 'handlebars';

var APIservice = new Service_API('http://localhost:3000')

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

var templateDetalles = `
  <span id="details_{{id}}">
    {{details}}
  </span>
`

//Compilamos las plantillas handlebars. Esto genera funciones a las que llamaremos luego
var tmpl_carList_compiled = compile(templateList)
var tmpl_item_compilada = compile(templateItem)
var tmpl_detalles_compilada = compile(templateDetalles)

document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded @ " + new Date().toLocaleString())

    APIservice.listCars().then(function(data) {
        var carListHTML = tmpl_carList_compiled(data)
        document.getElementById("availableCarsList").innerHTML = carListHTML
    })
})

document.getElementById('button_login').addEventListener('click', function() {
  var user = {
    "username": document.getElementById('username').value,
    "password": document.getElementById('password').value
  }

  var token = APIservice.login(user).then(function() {
    console.log("Logged")
  })
})