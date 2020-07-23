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
  async fetch({ store, params }) {
    await store.dispatch('articoli/getById', params.id, { root: true })
  }
}
</script>
