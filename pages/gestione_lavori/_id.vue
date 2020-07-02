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
  fetch({ store, params }) {
    console.dir(arguments)
    store.commit('gestione_lavori/setViewMode', { root: true })
    store.dispatch('gestione_lavori/getById', params.id, { root: true })
  }
}
</script>
