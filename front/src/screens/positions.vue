<template lang="pug">
  .column.content
    .title 🗃 {{ 'Positions ' + new Date(positions[0].date).format('DD/MM/YYYY') }}
    .block
      .title
      Table(title="Lga table" :data="positions" :cols="[{key: 'isin'},{key: 'quantite', format: '.2'}, {key: 'poids', format:'.2%'}, {key: 'clot', format: '.2€'}, {key: 'valeur_boursiere', format: '.2€'}]")
</template>
<script type="module">
module.exports = {
  computed: {
    positions(){
      date = vm.db.inventaire.map('date').slice(-1)[0]
      aum = vm.$root.db.inventaire.filter(d => d.date === date).map(d => +d.valeur_boursiere).sum()
      return vm.$root.db.inventaire.filter(d => d.date === date).filter(d => d.quantite != 0).map(d => ({...d, poids: +d.valeur_boursiere / aum}))
    },
  }
}
</script>
