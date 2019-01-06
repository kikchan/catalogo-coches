<template>
  <div class="container" id="container">
    <div class="logoutBox" id="logoutBox">
      <div class="welcomeUser" id="welcomeUser"></div>
      <input type="button" value="Logout" class="button_logout" id="button_logout" @click="logout"/>
    </div>

    <div class="loginBox" id="loginBox">
      <h2>{{ msg }}</h2>
      <input type="text" id="username" placeholder="Username"/><br>
      <input type="password" id="password" placeholder="Password"/><br>
      <input type="button" value="Login" class="button_login" @click="login"/>
    </div>

    <div class="carDetails" id="carDetails"></div>
    <div class="availableCarsList" id="availableCarsList"></div>
    <a class="car_details" @click="details(2)">Details</a>

    <div class="addModCar" id="addModCar">
      <h2>Add or modify a car</h2>

      <div class="formCar">
        <input type="text" id="maker" placeholder="Maker"><br>
        <input type="text" id="model" placeholder="Model"><br>
        <input type="text" id="year" placeholder="Year"><br>
        <input type="text" id="country" placeholder="Country"><br>
        <input type="text" id="mileage" placeholder="Mileage"><br>
        <input type="text" id="available" placeholder="Available"><br>
        <input type="text" id="price" placeholder="Price"><br>
      </div>
      
      <input type="button" value="Ok" class="button_ok" id="button_ok">
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import { Service_API } from '../../public/js/services/Service_API.js'
        
  var APIservice = new Service_API('http://localhost:3000')

  export default {
    name: 'Main',
    props: {
      msg: String
    },
    methods: {
      login: async function() {
        var user = {
          //Lee el campo con el nombre del usuario.
          "username": document.getElementById('username').value,
          //Lee el campo con la contraseña del usuario.
          "password": document.getElementById('password').value,
        }

        var token, loginStatus

        //Llama al API para hacer el Login.
        await APIservice.login(user).then(function (result) {
          //Si el login es incorrecto, muestra una ventana de aviso.
          if (result == "Wrong username or password") {    
            window.alert(result)
          } else {
            loginStatus = 'OK'
            token = result
          }
        })

        if(loginStatus == 'OK') {
          //Guarda en Local Storage que el usuario ha iniciado sesión.
          //myStorage.loginStatus = "OK"
          this.$store.set('loginStatus', loginStatus)
          //Guarda el nombre del usuario en Local Storage.
          //myStorage.username = user.username
          this.$store.set('username', user.username)
          //Guarda el token devuelto por el API en Local Storage.
          //myStorage.token = result
          this.$store.set('token', token)
          window.location.reload()
        }
      },
      logout: function() {
        this.$store.clearAll()
        location.reload()
      },
      hola: function() {
        alert("Hola k ase")
      },
      details: function(id) {
        alert("Ya furula")

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
    },
    mounted: async function() {
      if(this.$store.get('loginStatus') == 'OK') {
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
        var username = this.$store.get('username')
        welcomeUser.innerHTML = "<label style=\"text-align: left\">Hello <strong>" + username + "&nbsp;</strong><label>"
        welcomeUser.style.display = "inline"

        //Llamada al API para mostrar todos los coches del catálogo.
        await APIservice.listCars().then(function (data) {
          //Llama a la función auxiliar "isEmpty" para comprobar que hay coches.
          if(!isEmpty(data)) {
            //Recupera el div de la lista de coches disponibles.
            var divAvailableCars = document.getElementById("availableCarsList")
            //Inserta la plantilla de la lista de coches en el div anterior.
              var carsDiv = `
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
            `
            for(var index = 0; index < data.length; ++index) {
              carsDiv += `
                <tr>
                  <td>` + data[index].maker + `</td>
                  <td>` + data[index].model + `</td>
                  <td>
                    <a class='car_details' onclick='hola'>Details</a>
                    <a class="car_edit" href="javascript:editCar(` + data[index].id + `)">Edit</a>
                    <a class="car_delete" href="javascript:deleteCar(` + data[index].id + `)">Delete</a>
                  </td>
                </tr>
              `
            }

            divAvailableCars.innerHTML = carsDiv + `</tbody></table>`

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
        //myStorage.carIDtoEdit = -1
        this.$store.set('carIDtoEdit', -1)

        //Función que recibe un objeto y comprueba que está vacio.
        function isEmpty(obj) {
          //El for recorre todos los campos existentes en el objeto.
          for(var key in obj) {
              if(obj.hasOwnProperty(key))
                  return false;
          }
          return true;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    text-align: center;
    background: url('../../public/images/container-background.jpg') no-repeat;
    background-position: center 60%;
    background-size: 100%;
    border: solid black 4px;
    margin: 2em auto 0 auto;
    padding: 4em 4em 2em 4em;
    width: 50%;
    color: white;
  }
  
  div.container div.loginBox h2 {
    color: white;
    text-shadow: 2px 2px black;
    border: none;
  }

  .loginBox input[type="button"] {
      margin-top: 2em;
  }

  .loginBox {
    margin-left: -10%;
    width: 50%;
  }

  .button_login {
    background-color:#456ac7;
    -moz-border-radius: 28px;
    -webkit-border-radius: 28px;
    border-radius: 28px;
    border: 3px solid white;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 17px;
    padding: 6px 30px;
    text-decoration: none;
    font-weight: bold;
  }

  .button_login:hover {
    background-color:white;
    color: #456ac7;
    font-weight: bold;
    border: 3px solid #456ac7;
  }

  .logoutBox {
    margin: -5% auto 4% auto;
    text-align: right;
  }

  .button_logout {
      display: none;
    background-color: #ff0000;
    -moz-border-radius: 28px;
    -webkit-border-radius: 28px;
    border-radius: 28px;
    border: 3px solid white;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 17px;
    padding: 6px 30px;
    text-decoration: none;
    font-weight: bold;
  }

  .button_logout:hover {
    background-color:white;
    color: #ff0000;
    font-weight: bold;
    border: 3px solid #ff0000;
  }

  .availableCarsList {
    display: none;
  }

  .formAddCar {
      background-color: red;
  }


  h2 {
    border-bottom: solid white 1px;
  }

  .noButton {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  .carDetails {
    display: none;
  }

  .welcomeUser {
    display: none;
  }

  .addModCar {
    display: none;
  }

  div.formCar {
    text-align: center;
  }

  div.formCar input {
    text-align: left;
    margin-bottom: 0.5%;
  }

  .button_ok {
    margin-top: 1em;
    background-color: green;
    -moz-border-radius: 28px;
    -webkit-border-radius: 28px;
    border-radius: 28px;
    border: 3px solid white;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 17px;
    padding: 6px 40px;
    text-decoration: none;
    font-weight: bold;
  }

  .button_ok:hover {
    background-color:white;
    color: green;
    font-weight: bold;
    border: 3px solid green;
  }
</style>
