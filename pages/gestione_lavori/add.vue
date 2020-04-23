<template>

  <Form/>

</template>

<script>
import Form from '../../components/GestioneLavori/Form'

export default {
   layout: 'fullPage',
  components: {
    Form
  },
  fetch ({store, params}) {
    store.commit('gestione_lavori/setModalita', 'ADD',  {root: true})
    store.commit('gestione_lavori/resetRecord', null,  {root: true})
  }
}
</script>
