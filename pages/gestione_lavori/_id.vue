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
  async fetch({ store, params }) {
    store.commit('gestione_lavori/setViewMode', { root: true })
    store.commit('appuntimm/setFilterText', { root: true })
    store.dispatch('appuntimm/cancelPhotocamera', null, { root: true })
    await store.dispatch('gestione_lavori/getById', params.id, { root: true })
    store.dispatch('appuntimm/load', null, {root: true})
  }
}
</script>
