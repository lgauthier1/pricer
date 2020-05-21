<template lang="pug">
    .screen
      component(:is="$route.params.screen")
</template>
<style>
  .screen { min-width: calc(100% - 250px);min-height: calc(100vh - 50px);padding: 50px; }
</style>
