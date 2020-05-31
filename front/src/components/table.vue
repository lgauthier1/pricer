<template lang="pug">
  .table
    .row
      .cell(v-for="col in cols") {{ col.key }}
    .row(v-for="line in data")
      .cell(v-for="col in cols") {{ format(col.format)(line[col.key]) }}
</template>
<script>
module.exports = {
  props: ['title', 'data', 'cols', 'fmt']
}
</script>
<style>
  .table { padding: var(--padding); }
  .table .row { padding: var(--padding); }
  .table .row:first-child { font-weight: 600;text-transform: capitalize; }
  .table .cell { display: flex; flex: 1;}
</style>
