<template>
  <div class="container" id="container">
    <div class="loginBox" id="loginBox">
      <h2>{{ msg }}</h2>
      <input type="text" id="username" placeholder="Username"/><br>
      <input type="password" id="password" placeholder="Password"/><br>
      <input type="button" value="Login" class="button_login" @click="login"/>
    </div>
  </div>
</template>
<script>
  import { Service_API } from '../../public/js/services/Service_API.js'

  export default {
    name: 'Main',
    props: {
      msg: String
    },
    methods: {
      login: function() {
        var APIservice = new Service_API('http://localhost:3000')
        var myStorage = window.localStorage

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
            //location.reload()

            alert("Hello")
          }
        })
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
</style>
