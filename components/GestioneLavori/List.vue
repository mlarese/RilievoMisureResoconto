<template>
    <div>
        <GridContainer :title="ui.title">
            <!-- div slot="header-right">
                <DxButton class="mr-2" hint="Aggiungi Lavoro" icon="add" _text="buttonAddTitle" @click="onAdd" />
                <DxButton :style="{background: showFilter?'#e2e2e2':'white'}" class="mr-2" hint="Aggiungi Lavoro" icon="search" _text="buttonAddTitle" @click="showFilter=!showFilter" />
            </div -->
            <Grid slot="body-center" :show-filter="showFilter" />
        </GridContainer>

        <BottomNavigation class="">
            <div slot="right">
                <v-btn @click="onAdd">
                    <span>Nuovo</span>
                    <v-icon>mdi-plus</v-icon>
                </v-btn>

                <v-btn @click="showFilter=!showFilter">
                    <span>Filtro</span>
                    <v-icon v-if="!showFilter">mdi-filter</v-icon>
                    <v-icon v-else>mdi-filter-remove</v-icon>
                </v-btn>

            </div>
        </BottomNavigation>
    </div>
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
