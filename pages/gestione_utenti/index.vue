<template>
  <div>
    <ListaUtenti />
  </div>
</template>

<script>
import ListaUtenti from '../../components/gestione_utenti/Lista'

export default {
  layout: 'fullPage',
  components: {
    ListaUtenti
  }
}
</script>