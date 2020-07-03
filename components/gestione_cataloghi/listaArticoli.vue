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
              label="Cerca articolo..."
              append-icon="search"
              background-color="white"
              v-model="ui.filter.text"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- LISTA LAVORI -->
    <v-row dense>
      <v-col v-for="(item, i) in listaArticoli" :key="i" xs="12" md="6" lg="4">
        <v-card color="white" @click="openEditForm(item._id)" min-width="300" max-height="200">
          <div class="d-flex flex-no-wrap">
            <v-avatar class="ma-3" size="60" tile>
              <v-img :src="item.imgURL || require('../../assets/images/lavoro.png')"></v-img>
            </v-avatar>
            <div class="flex-grow-1 flex-shrink-1">
              <v-card-title
                v-text="item.JSDescrizione"
                class="headline"
                style="word-break: normal;"
              />
              <!-- <v-card-subtitle v-text="item.data.GL_Oggetto" />
              <v-card-text v-text="item.data.GL_Indirizzo" /> -->
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-btn fab color="primary" class="mx-2 mb-12" dark fixed absolute bottom right @click="onAdd">
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
    ...mapState('articoli', { ui: 'ui', listaArticoli: 'list' })
  },
  methods: {
    ...mapActions('articoli', { caricaLavoro: 'getById' }),
    onAdd() {
      this.$router.push(`/articoli/add`)
    },
    openEditForm(id) {
      this.$router.push(`/cataloghi/${id}`)
    }
  }
}
</script>
