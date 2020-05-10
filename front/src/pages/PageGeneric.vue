<template>
  <div>
    <h1> Page Generic Layout 1 </h1>
    <h2> {{ $route.params }} </h2>
    <component :is="screen">
      <router-view/>
    </component>
  </div>
</template>
<script>
export default {
  computed: {
    screen() {
      console.log('screen')
      console.log(this.$route.params.screen)
      return this.$route.params.screen
    }
  }
}
</script>
