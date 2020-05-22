<template lang="pug">
  .column.content
    h1 📈 Overview
    .row.block
      PlotLine(:data="aum")
</template>
<script type="module">
module.exports = {
  props: ['title', 'data'],
  mounted() {
    console.log('Screen mounted...')
  },
  computed: {
    aum(){
      return vm.db.inventaire.group(d => d.date).map(d => d.map(d => +d.valeur_boursiere).sum()).map((d,k) => ({date_str: k, value: format('.2')(d)})).values()
    },
  }
}
</script>
<style>
  h1 { font-size: 2em;}
  .block { min-width: 100%;min-height: 300px; }
</style>
