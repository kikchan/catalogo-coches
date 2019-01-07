<template>
  <div id="app">
    <div class="title">Welcome to Kiril's car list!</div>

    <div class="container" id="container">   
      <div v-if="!this.$store.get('logged')">
        <div class="loginBox">
          <h2 style="text-align: center">Login</h2>
          <input type="text" id="username" placeholder="Username"/><br>
          <input type="password" id="password" placeholder="Password"/><br>
          <input type="button" value="Login" class="button_login" @click="login"/>
        </div>
      </div>
      <div v-else>
        <div class="logoutBox" id="logoutBox">
          <div class="welcomeUser" id="welcomeUser"></div>
          <input type="button" value="Logout" class="button_logout" id="button_logout" @click="logout"/>
        </div>

        <div class="carDetails" id="carDetails"></div>

        <CarList/>

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
          
          <input type="button" value="OK" @click="okButton" class="button_ok" id="button_ok">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CarList from './components/CarList'
  import { Service_API } from '../public/js/services/Service_API.js'
  
  var APIservice = new Service_API('http://localhost:3000')

  export default {
    name: 'App',
    components: {
      CarList
    },
    methods: {
      login: async function() {
        var user = {
          //Lee el campo con el nombre del usuario.
          "username": document.getElementById('username').value,
          //Lee el campo con la contraseña del usuario.
          "password": document.getElementById('password').value,
        }

        var token, logged

        //Llama al API para hacer el Login.
        await APIservice.login(user).then(function (result) {
          //Si el login es incorrecto, muestra una ventana de aviso.
          if (result == "Wrong username or password") {    
              window.alert(result)
          } else {
              logged = true
              token = result
          }
        })

        if(logged) {
          //Guarda en Local Storage que el usuario ha iniciado sesión.
          //myStorage.logged = "OK"
          this.$store.set('logged', logged)
          //Guarda el nombre del usuario en Local Storage.
          //myStorage.username = user.username
          this.$store.set('username', user.username)
          //Guarda el token devuelto por el API en Local Storage.
          //myStorage.token = result
          this.$store.set('token', token)
          //Llama al API para obtener el listado de todos los coches y lo guarda en la sesión
          this.$store.set('cars', await APIservice.listCars())
          window.location.reload()
        }
      },
      logout: function() {
          this.$store.clearAll()
          location.reload()
      },
      okButton: async function() {
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
          if(this.$store.get('carIDtoEdit') >= 0) {
            //Añade el campo ID a los datos anteriores del coche.
            car.id = this.$store.get('carIDtoEdit')
            //Llama al API para que sustituya el coche. Le pasa el token.
            APIservice.editCar(car, this.$store.get('token'))
            //Llama al API para añadir un coche nuevo. Le pasa los datos del coche y el token.
          } else APIservice.addCar(car, this.$store.get('token'))
          
          //Recarga la página para reflejar los cambios.
          location.reload()
        }
      }
    },
    mounted: async function() {
      if(this.$store.get('logged')) {
        //Llama al API para obtener el listado de todos los coches y lo guarda en la sesión
        this.$store.set('cars', await APIservice.listCars())
        
        //Recupera el contenedor principal y le añade un fondo negro con 80% de transparencia.
        var divContainer = document.getElementById('container')
        divContainer.style.background = "black"
        divContainer.style.opacity = 0.8

        //Recupera el div que muestra el nombre del usuario e inserta su nombre para saludarlo.
        var welcomeUser = document.getElementById('welcomeUser')
        var username = this.$store.get('username')
        welcomeUser.innerHTML = "<label style=\"text-align: left\">Hello <strong>" + username + "&nbsp;</strong><label>"
      
        //Inicializa los campos del formulario con valores vacios.
        document.getElementById('maker').value = ""
        document.getElementById('model').value = ""
        document.getElementById('year').value = ""
        document.getElementById('country').value = ""
        document.getElementById('mileage').value = ""
        document.getElementById('available').value = ""
        document.getElementById('price').value = ""
        //Inicializa el ID del coche a modificar con -1 para que por defecto añada.
        this.$store.set('carIDtoEdit',-1)

        //Llama al API para obtener el listado de todos los coches y lo guarda en la sesión
        this.$store.set('cars', await APIservice.listCars())
      }
    }
  }
</script>

<style>
  .container {
    text-align: center;
    background: url('../public/images/container-background.jpg') no-repeat;
    background-position: center 60%;
    background-size: 100%;
    border: solid black 4px;
    margin: 2em auto 0 auto;
    padding: 4em 4em 2em 4em;
    width: 50%;
    color: white;
  }

  @font-face {
    font-family: 'TheBlacklist';
    src: url('../public/fonts/TheBlacklist/TheBlacklist.eot');
    src: local('TheBlacklist'), url('../public/fonts/TheBlacklist/TheBlacklist.woff') format('woff'), url('../public/fonts/TheBlacklist/TheBlacklist.ttf') format('truetype');
  }

  .title {
    text-align: center;
    margin-top: 1em;
    font-size: 40px;
    font-weight: bold;
    font-family: 'TheBlacklist' !important;
  }

  h2 {
    border-bottom: solid white 1px;
    text-align: left;
  }

  .welcomeUser {
    display: inline;
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

  .carDetails {
    text-align: left;
  }

  .formAddCar {
    background-color: red;
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