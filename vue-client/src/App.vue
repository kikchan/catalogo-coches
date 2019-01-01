<template>
  <div id="app">
    <div class="title">Welcome to Kiril's car list!</div>
    <Login msg="Login"/>
  </div>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    Login
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
</style>