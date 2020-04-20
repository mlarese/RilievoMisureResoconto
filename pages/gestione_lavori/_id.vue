<template>

  <Form/>

</template>

<script>
import Form from '../../components/GestioneLavori/Form'
import {getFs} from '../../assets/filesystem'
export default {
  layout: 'fullPage',
  components: {
    Form
  },
  async fetch ({store, params}) {

    store.commit('gestione_lavori/setModalita', 'EDIT',  {root: true})
    store.dispatch('gestione_lavori/getById', params.id,  {root: true})
  }
}
</script>
