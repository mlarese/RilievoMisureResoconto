<template>
    <GridContainer :title="ui.title">
        <div slot="header-right">
            <DxButton class="mr-2" hint="Aggiungi Lavoro" icon="add" _text="buttonAddTitle" @click="onAdd" />
            <DxButton :style="{background: showFilter?'#e2e2e2':'white'}" class="mr-2" hint="Aggiungi Lavoro" icon="search" _text="buttonAddTitle" @click="showFilter=!showFilter" />
        </div>
        <Grid slot="body-center" :show-filter="showFilter" />
    </GridContainer>
</template>

<script>
  import GridContainer from '../../components/Containers/GridContainer'
  import Grid from '../../components/GestioneLavori/Grid'
  import {mapState, mapGetters} from 'vuex'
  export default {
    components: {GridContainer, Grid},
    data () {
      return {
        showFilter: false
      }
    },
    computed: {
      ...mapState('gestione_lavori', ['ui']),
      ...mapGetters('gestione_lavori', ['buttonAddTitle'])
    },
    methods: {
      onAdd () {
        this.$router.push(`/gestione_lavori/add`)
      }
    }
  }
</script>
