<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1> Generic Page </h1>
    <h2> {{ $route.params }} </h2>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from '../components/HelloWorld.vue'
export default {
  name: 'home',
  // components: {
  //   HelloWorld
  // }
}
</script>
