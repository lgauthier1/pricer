<template lang="pug">
  .nav
    router-link(to="/") Home |
    router-link(to="/test/screen1") Screen1
</template>
<style>
.nav {width: 100%; background: blue;}
.nav a {color: white;}
</style>
