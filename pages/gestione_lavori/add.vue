<template>
  <Form />
</template>

<script>
import Form from '../../components/GestioneLavori/FormLavori'

export default {
  layout: 'fullPage',
  components: {
    Form
  },
  fetch({ store, params }) {
    store.commit('gestione_lavori/setNewMode', { root: true })
    store.commit('gestione_lavori/resetRecord', null, { root: true })
  }
}
</script>
