<template>
  <div>
    <ListLavori />
  </div>
</template>

<script>
import ListLavori from '../../components/GestioneLavori/Lista'

export default {
  components: {
    ListLavori
  },
  fetch({ store }) {
    store.dispatch('gestione_lavori/load', {}, { root: true })
  }
}
</script>
