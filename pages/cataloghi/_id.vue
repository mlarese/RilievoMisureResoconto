<template>
  <Form />
</template>

<script>
import Form from '../../components/gestione_cataloghi/dettaglioArticolo'
export default {
  layout: 'fullPage',
  components: {
    Form
  },
  fetch({ store, params }) {
    // Soluzione temporanea per assicurarsi che la gallery non rimanga aperta da altre gestioni
    store.commit('appuntimm/hideGallery', null, { root: true })
    store.dispatch('articoli/getById', params.id, { root: true })
  }
}
</script>
