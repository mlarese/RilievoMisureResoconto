<template>
  <Form />
</template>

<script>
import Form from '../../components/gestione_contatti/Form'
export default {
  layout: 'fullPage',
  components: {
    Form
  },
  fetch({ store, params }) {
    store.commit('gestione_contatti/setViewMode', { root: true })
    store.dispatch('gestione_contatti/getById', params.id, { root: true })
  }
}
</script>
