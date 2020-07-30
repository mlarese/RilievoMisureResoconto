<template>
  <v-container class="mainContainer">
    <!-- FILTRO -->
    <v-row dense>
      <v-col xs="12" md="6" lg="4">
        <v-card class="elevation-0" height="50px">
          <div class="d-flex">
            <v-text-field
              outlined
              dense
              clearable
              label="Cerca contatto..."
              append-icon="search"
              background-color="white"
              v-model="ui.filter.text"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- LISTA CONTATTI -->
    <v-row dense>
      <v-col v-for="(item, i) in getfilteredList" :key="i" xs="12" md="6" lg="4">
        <v-card color="white" @click="openEditForm(item._id)" min-width="300" min-height="130" max-height="200">
          <div class="d-flex flex-no-wrap">
            <v-avatar class="mt-6 ml-3" size="60">
              <v-img :src="item.imgURL || require('../../assets/images/contact.jpg')" />
            </v-avatar>
            <div class="flex-grow-1 flex-shrink-1">
              <v-card-title
                v-text="item.data.CONDescrizione"
                class="headline"
                style="word-break: normal;"
              />
              <v-card-subtitle v-text="item.data.CONTelefono" />
              <v-card-text v-text="item.data.CONIndirizzo" />
            </div>
          </div>
<!--           <v-card-actions class="py-0">
            <v-spacer></v-spacer>
            <v-icon
              v-if="item.data.isPreferito"
              color="primary"
              class="align-self-end pa-1"
            >favorite</v-icon>
          </v-card-actions> -->
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
    ...mapState('gestione_contatti', { ui: 'ui', listLavori: 'list' }),
    ...mapGetters('gestione_contatti', { getfilteredList: 'filteredList' })
  },
  methods: {
    ...mapActions('gestione_contatti', { caricaLavoro: 'getById' }),
    ...mapActions('dm_resources', { getRisorsa: 'getById' }),
    onAdd() {
      this.$router.push(`/gestione_contatti/add`)
    },
    openEditForm(id) {
      this.$router.push(`/gestione_contatti/${id}`)
    }
  }
}
</script>
