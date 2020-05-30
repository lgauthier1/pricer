<template lang="pug">
    .screen
      component(:is="$route.params.screen")
</template>
<style>
  .screen { position: relative;min-width: calc(100% - 250px);min-height: 100vh;max-height: 100vh;padding: 50px;overflow: auto;}
</style>
