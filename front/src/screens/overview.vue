<template lang="pug">
  .column.content
    h1 📈 Overview
    .block.perf
      PlotLine(:data="aum")
    .row
      Kpi(title="Plus ou moins values" :data="pmv" :subtitle="'Au ' + new Date(aum.slice(-1)[0].date_str).format('DD/MM/YYYY')" fmt=".2€")
      Kpi(title="Performance globale" :data="pmv / apport" :subtitle="'Au ' + new Date(aum.slice(-1)[0].date_str).format('DD/MM/YYYY')" fmt=".2%")
    .block
      .title Activity
      .test Hello je suis un test
</template>
<script type="module">
module.exports = {
  props: ['title', 'data'],
  computed: {
    pmv(){
      return this.aum.slice(-1)[0].value - this.apport
    },
    apport(){
      return vm.db.mouvement_cash.filter(d => ['VIR', 'CREDIT CB'].includes(d.type_mvt)).map(d => +d.montant_net).sum()
    },
    aum(){
      return vm.db.inventaire.group(d => d.date).map(d => d.map(d => +d.valeur_boursiere).sum()).map((d,k) => ({date_str: k, value: format('.2')(d)})).values()
    },
  }
}
</script>
<style>
  .perf { min-height: 350px;padding: unset;}
</style>
