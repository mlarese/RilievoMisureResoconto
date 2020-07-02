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
    store.commit('gestione_contatti/setNewMode', { root: true })
    store.commit('gestione_contatti/resetRecord', null, { root: true })
  }
}
</script>
