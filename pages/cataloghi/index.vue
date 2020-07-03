<template>
  <div>
    <listaArticoli />
  </div>
</template>

<script>
import listaArticoli from '../../components/gestione_cataloghi/listaArticoli'
export default {
  components: {
    listaArticoli
  },
  async fetch({ store }) {
    await store.dispatch('articoli/load', {}, { root: true })
  }
}
</script>
