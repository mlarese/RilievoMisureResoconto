<template>
  <div>
    <ListaContatti />
  </div>
</template>

<script>
import ListaContatti from '../../components/gestione_contatti/Lista'

export default {
  components: {
    ListaContatti
  },
  fetch({ store }) {
    store.dispatch('gestione_contatti/load', {}, { root: true })
  }
}
</script>
