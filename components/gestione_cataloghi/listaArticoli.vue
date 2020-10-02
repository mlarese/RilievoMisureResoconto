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
              clearable
              label="Cerca articolo..."
              append-icon="mdi-magnify"
              background-color="white"
              v-model="ui.filterText"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- LISTA ARTICOLI -->
    <v-row dense>
      <v-col
        v-for="(item, i) in getListaFiltrata"
        :key="i"
        class="d-flex align-content-start flex-wrap"
      >
        <v-card
          :color="(marcaRiga && articoloSelezionatoID == item._id) ? '#e4effa': 'white'"
          @click="rowClick(item)"
          width="400"
          height="130"
        >
          <div class="d-flex flex-no-wrap">
            <v-avatar class="ma-3" size="60" tile>
              <v-img
                :src="
                  item.risorsa
                    ? item.risorsa.thumbnailUrl
                    : require('../../assets/images/product.png')
                "
              ></v-img>
            </v-avatar>
            <div class="flex-grow-1 flex-shrink-1">
              <v-card-title
                v-text="item.JSDescrizione"
                class="headline"
                style="word-break: normal;"
              />
              <v-card-subtitle v-text="item.catalogoDesc" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.mainContainer {
  height: 100%;
}
</style>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import Vue from 'vue'

export default Vue.extend({
  props: {
    modalita: { type: String, default: 'GestioneAnargafica' },
    marcaRiga: { type: Boolean, default: false }
  },
  data() {
    return {
      articoloSelezionatoID: {}
    }
  },
  computed: {
    ...mapState('articoli', { ui: 'ui', listaArticoli: 'list' }),
    ...mapGetters('articoli', ['getListaFiltrata'])
  },
  methods: {
    ...mapActions('articoli', { caricaLavoro: 'getById' }),
    onAdd() {
      this.$router.push(`/articoli/add`)
    },
    rowClick(articolo) {
      this.articoloSelezionatoID = articolo._id
      if (this.modalita === 'SelezioneOggetto') {
        this.$emit('onSelected', articolo)
      } else {
        this.$router.push(`/cataloghi/${articolo._id}`)
      }
    }
  }
})
</script>
