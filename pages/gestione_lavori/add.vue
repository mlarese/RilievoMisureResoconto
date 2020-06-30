<template>
  <Form />
</template>

<script>
import Form from '../../components/gestione_lavori/Form'

export default {
  layout: 'fullPage',
  components: {
    Form
  },
  fetch({ store, params }) {
    store.commit('gestione_lavori/setEditMode', { root: true })
    store.commit('gestione_lavori/resetRecord', null, { root: true })
  }
}
</script>
