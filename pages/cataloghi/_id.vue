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
    store.dispatch('articoli/getById', params.id, { root: true })
  }
}
</script>
