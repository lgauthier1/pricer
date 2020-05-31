<template lang="pug">
  .nav.column.left
    h3 Getting Started
    .link
      router-link(to="/") 🚀 Home
    h3 Stock
    .link.column
      router-link(to="/overview") 📈 Overview
      router-link(to="/positions") 🗃 Positions
</template>
<style scoped>
  .nav { width: 250px;position: sticky;align-self: flex-start;height: calc((100vh - 50px) - 2em);top: 50px;border-right: 1px solid rgb(238, 238, 238);overflow: hidden scroll;padding: 1em; }
  .nav > * { font-family: 'Avenir Next'; }
  .nav h3 { font-weight: 600;text-transform: uppercase;font-size: 13px;opacity: 0.7;margin-top: 3em;}
  .nav .link { margin-left: 3px;margin-bottom: 3px;padding: 0.2em; }
  .nav .link > * { font-size: 16px; }
</style>
