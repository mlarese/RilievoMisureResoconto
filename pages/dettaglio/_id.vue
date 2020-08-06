<template>
  <dettaglioEdit />
</template>

<script>
import dettaglioEdit from '../../components/GestioneRilievo/dettaglioEdit'
export default {
  layout: 'fullPage',
  components: {
    dettaglioEdit
  },
  async fetch({ store, params }) {
    if (params.id == 'add') {
    } else {
      let prod = await store.dispatch('rilievoDet/getById', params.id, {
        root: true
      })

      let cat = await store.dispatch('cataloghi/getById', prod.catalogoID, {
        root: true
      })
      window.GPROD.SetTables(JSON.stringify(cat.data.JSTables))
      window.GPROD.IstanziaProdottoDaMC(prod.macroComandi)
    }
  }
}
</script>
