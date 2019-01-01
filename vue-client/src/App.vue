<template>
  <div id="app">
    <div class="title">Welcome to Kiril's car list!</div>
    <Main msg="Login"/>
  </div>
</template>

<script>
  import Main from './components/Main.vue'

  export default {
    name: 'app',
    components: {
      Main
    }
  }
</script>

<style>
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

  .carTable {
    width: 100%;
    color: white;
  }

  .carTable thead {
    text-decoration: underline;
    color: red;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
  }

  td {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    text-align: center;
    font-size: 15px;
  }

  .car_details {
    color: white;
    text-decoration: unset;
  }

  .car_details:hover {
    text-decoration: underline;
  }

  .car_delete {
    color: red;
    text-decoration: unset;
  }

  .car_delete:hover {
    text-decoration: underline;
  }

  .car_edit {
    color: green;
    text-decoration: unset;
  }

  .car_edit:hover {
    text-decoration: underline;
  }
</style>