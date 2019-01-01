<template>
  <div class="container" id="container">
    <div class="loginBox" id="loginBox">
      <h2>{{ msg }}</h2>
      <input type="text" id="username" placeholder="Username"/><br>
      <input type="password" id="password" placeholder="Password"/><br>
      <input type="button" value="Login" class="button_login" id="button_login"/>
    </div>
  </div>
</template>

  <script>
  export default {
    name: 'Login',
    props: {
      msg: String
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
