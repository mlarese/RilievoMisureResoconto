<template>
  <v-container>
    <!-- FILTRO -->
    <v-row dense>
      <v-col xs="12" md="auto">
        <v-card flat height="50px">
          <div class="d-flex">
            <v-btn v-if="$vuetify.breakpoint.smAndUp" @click="onAdd" rounded color="primary" class="mr-2"><v-icon>mdi-plus</v-icon>Nuovo lavoro</v-btn>
            <v-text-field class="mr-2" outlined dense clearable label="Cerca..." append-icon="mdi-magnify" background-color="white" v-model="ui.filter.text" />
            <v-btn icon color="primary" @click="ui.filter.preferito = !ui.filter.preferito">
              <v-icon v-if="ui.filter.preferito">mdi-heart</v-icon>
              <v-icon v-else>mdi-heart-outline</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- LISTA LAVORI -->
    <div style="height: calc(100vh - 170px); overflow-y: auto;">
      <v-row class="ma-0">
      <v-col v-for="(item, i) in getfilteredList" :key="i" xs="12" md="6" lg="4">
        <v-card @click="openEditForm(item._id)" min-width="300" min-height="130" max-height="200">
          <div class="d-flex flex-no-wrap">
            <v-avatar class="mt-6 ml-3" size="60">
              <v-img :src="item.imgURL || require('../../assets/images/lavoro.png')"></v-img>
            </v-avatar>
            <div class="flex-grow-1 flex-shrink-1" style="margin-right: 20px">
              <v-card-title v-text="item.data.GL_CommittenteDesc" class="headline" style="word-break: normal;" />
              <v-card-subtitle v-text="item.data.GL_Oggetto" />
              <v-card-text v-text="item.data.GL_Indirizzo" />
            </div>
          </div>
          <v-card-actions style="margin-top:-30px; padding: 0px">
            <v-spacer></v-spacer>
            <v-icon v-if="item.data.isPreferito" color="primary" class="align-self-end pb-3 pr-3">mdi-heart</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
      </v-row>
    </div>

    <v-btn v-if="$vuetify.breakpoint.xsOnly" fab color="primary" class="mx-2 mb-12" dark fixed absolute bottom right @click="onAdd">
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
    ...mapState('gestione_lavori', { ui: 'ui' }),
    ...mapGetters('gestione_lavori', { getfilteredList: 'filteredList' })
  },
  methods: {
    ...mapActions('gestione_lavori', { caricaLavoro: 'getById' }),
    onAdd() {
      this.$router.push(`/gestione_lavori/add`)
    },
    openEditForm(id) {
      this.$router.push(`/gestione_lavori/${id}`)
    }
  }
}
</script>
