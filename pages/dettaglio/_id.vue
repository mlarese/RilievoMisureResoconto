<template>
  <dettaglioEdit />
</template>

<script>
import dettaglioEdit from '../../components/GestioneRilievo/dettaglioEdit'
export default {
  components: {
    dettaglioEdit
  },
  async fetch({ store, params }) {
    if (params.id == 'add') {
      
    } else {
      store.dispatch('rilievoDet/getById', params.id, { root: true })
    }
  }
}
</script>
