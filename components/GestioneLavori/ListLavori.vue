<template>
  <v-container class="mainContainer">
    <!-- FILTRO -->
    <v-row dense>
      <v-col cols="12">
        <v-card class="elevation-0" height="50px">
          <div class="d-flex">
            <v-text-field
              outlined
              dense
              label="Cerca lavoro..."
              append-icon="search"
              background-color="white"
              v-model="ui.filter.text"
            />
            <v-btn
              icon
              color="primary"
              @click="ui.filter.preferito = !ui.filter.preferito"
              class="pl-2"
            >
              <v-icon v-if="ui.filter.preferito">favorite</v-icon>
              <v-icon v-else>favorite_border</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- LISTA LAVORI -->
    <v-row dense>
      <v-col
        v-for="(item, i) in getfilteredList"
        :key="i"
        xs="12"
        md="6"
        lg="4"
      >
        <v-card
          color="white"
          @click="openEditForm(item._id)"
          min-width="300"
          max-height="200"
        >
          <div class="d-flex flex-no-wrap">
            <v-avatar class="ma-3" size="100" tile>
              <v-img :src="require('../../assets/images/casa.jpg')"></v-img>
            </v-avatar>
            <div class="flex-grow-1 flex-shrink-1">
              <v-card-title
                v-text="item.data.GL_CommittenteDesc"
                class="headline"
                style="word-break: normal;"
              />
              <v-card-subtitle v-text="item.data.GL_Descrizione" />
              <v-card-text v-text="item.luogo" />
            </div>
          </div>
          <v-card-actions class="py-0">
            <v-spacer></v-spacer>
            <v-icon
              v-if="item.data.isPreferito"
              color="primary"
              class="align-self-end pa-1"
              >favorite</v-icon
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      fab
      color="primary"
      class="mx-2 mb-12"
      dark
      fixed
      absolute
      bottom
      right
      @click="onAdd"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<style scoped>
.mainContainer {
  height: 100%;
}
</style>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('gestione_lavori', { ui: 'ui', listLavori: 'list' }),
    ...mapGetters('gestione_lavori', { getfilteredList: 'filteredList' })
  },
  methods: {    
    ...mapActions('gestione_lavori', {caricaLavoro: 'getById'} ),
    onAdd() {
      this.$router.push(`/gestione_lavori/add`)
    },
    openEditForm(id) {
      this.$router.push(`/gestione_lavori/${id}`)
      // this.caricaLavoro(id)
    }
  }
}
</script>
