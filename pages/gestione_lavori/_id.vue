<template>
  <Form />
</template>

<script>
import Form from '../../components/GestioneLavori/Form'
export default {
  layout: 'fullPage',
  components: {
    Form
  },
  async fetch({ store, params }) {
    store.commit('gestione_lavori/setViewMode', { root: true })
    await store.dispatch('gestione_lavori/getById', params.id, { root: true })
  }
}
</script>
