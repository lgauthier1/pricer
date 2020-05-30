<template lang="pug">
  .column.content
    .title 📈 Overview
    .block.perf
      PlotLine(:data="aum")
    .row
      Kpi(title="Plus ou moins values" :data="pmv" :subtitle="'Au ' + new Date(aum.slice(-1)[0].date_str).format('DD/MM/YYYY')" fmt=".2€")
      Kpi(title="Performance globale" :data="pmv / apport" :subtitle="'Au ' + new Date(aum.slice(-1)[0].date_str).format('DD/MM/YYYY')" fmt=".2%")
    .row
      .block.activity
        .title Avis opérés
          .column
            .row.mouvement(v-for="mvt in ao")
              .tag {{ new Date(mvt.date).format('DD/MM')}}
              .label {{ [mvt.type_mvt, mvt.isin, '('+ mvt.cours +')'].join(' ')}}
              .amount {{ format('.2€')(+(mvt.montant_net.replace(',','.'))) }}
      .block.activity
        .title Apport
        .column
          .row.mouvement(v-for="mvt in apport_mvt")
            .tag {{ new Date(mvt.date).format('DD/MM')}}
            .label {{ 'Alimentation P.E.A.' }}
            .amount {{ format('.2€')(mvt.montant_net) }}

</template>
<script type="module">
module.exports = {
  props: ['title', 'data'],
  computed: {
    apport_mvt(){
      return vm.$root.db.mouvement_cash.filter(d => ['VIR', 'CREDIT CB'].includes(d.type_mvt)).sort(d => d.date).slice(-3).reverse()
    },
    ao(){
      return vm.$root.db.avis_opere.sort(d => d.date).slice(-3).reverse()
    },
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
  .perf { min-height: 270px;padding: unset;}
  .activity .row { padding: var(--padding); }
  .activity .column {min-width: 100%; }
  .mouvement > * { display: flex;align-items: center;}
  .mouvement .tag { justify-content: center;align-items: center;color: white;background: var(--blue);border-radius: 999px;width: 40px;height: 40px;box-shadow: 0 0 0 4px rgb(64, 153, 255, 0.5);font-size: 12px;text-align: center;}
  .mouvement .label { display: flex;flex: 2;margin-left: 20px;align-items: center;font-weight: normal;font-size: 12px; }
  .mouvement .amount { display: flex;flex: 1;justify-content: center;font-size: 16px;font-weight: 600;}
</style>
