<template>
  <div id="app">
    <div class="title">Welcome to Kiril's car list!</div>
    <Main msg="Main"/>
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
</style>