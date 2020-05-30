<template lang="pug">
  .kpi
    .column
      .title {{ title }}
      .date {{ subtitle }}
    .value(:class='[data < 0 ? "negative" : "positive"]') {{ format(fmt)(data) }}
</template>
<script>
module.exports = {
  props: ['title', 'subtitle', 'data', 'fmt'],
}
</script>
<style>
.kpi { display: flex;flex-direction: row;flex: 1;max-width: 100%;height: 100px;background-color: #fff;background-clip: border-box; box-shadow: 0 0 5px 0 rgba(43,43,43,0.1), 0 11px 6px -7px rgba(43,43,43,0.1); padding: var(--padding);margin: 8px 8px 8px 8px;}
.kpi .row { min-width: 100%; }
.kpi .title { font-size: 19px;font-weight: 700; }
.kpi .column { display: flex;flex: 2;flex-wrap: unset;}
.kpi .date { color: var(--inactive);padding-left: 1.25rem}
.kpi .value { display: flex; flex: 1;font-weight: 800;font-size: 24px;justify-content: center;align-items: center;}
</style>
