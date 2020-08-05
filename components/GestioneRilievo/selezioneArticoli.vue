<template>
  <div :key="mainKey">
    <v-stepper v-model="stepIndex" :vertical="isSmAndDown">
      <template v-if="isSmAndDown">
        <v-stepper-step :complete="stepIndex > 1" editable step="1">
          Selezionare il catalogo
        </v-stepper-step>
        <v-stepper-content step="1">
          <ListaArticoli
            @onSelected="articoloSelezionato"
            :modalita="'SelezioneOggetto'"
          />
        </v-stepper-content>
        <v-stepper-step :complete="stepIndex > 2" step="2">
          Selezionare il modello
        </v-stepper-step>
        <v-stepper-content step="2">
          <ListaModelli
            :lista="listaModelli"
            @onSelected="modelloSelezionato"
          />
        </v-stepper-content>
      </template>
      <template v-else>
        <v-stepper-header>
          <v-stepper-step :complete="stepIndex > 1" editable step="1">
            Selezionare il catalogo
          </v-stepper-step>
          <v-stepper-step :complete="stepIndex > 2" step="2">
            Selezionare il modello
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <ListaArticoli
              @onSelected="articoloSelezionato"
              :modalita="'SelezioneOggetto'"
            />
          </v-stepper-content>
          <v-stepper-content step="2">
            <ListaModelli
              :lista="listaModelli"
              @onSelected="modelloSelezionato"
            />
          </v-stepper-content>
        </v-stepper-items>
      </template>
    </v-stepper>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import ListaArticoli from '../gestione_cataloghi/listaArticoli'
import ListaModelli from '../gestione_cataloghi/ListaModelli'

export default {
  components: { ListaArticoli, ListaModelli },
  data() {
    return {
      stepIndex: 1,
      // listaArticoli: [],
      listaModelli: [],
      mainKeyCounter: 0
    }
  },
  computed: {
    ...mapState('rilievoDet', { rilievoDet: 'record' }),
    isSmAndDown() {
      return this.$vuetify.breakpoint.smAndDown
    },
    mainKey() {
      return 'selezione_articoli_main_' + this.mainKeyCounter
    }
  },
  watch: {
    isSmAndDown(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.mainKeyCounter++
        this.loadArticoli()
      }
    }
  },
  methods: {
    ...mapActions('cataloghi', { loadCataloghi: 'load' }),
    ...mapActions('articoli', { loadArticoli: 'load' }),
    // caricaArticoli() {
    //   this.listaArticoli = window.GPROD.GetListaArticoli_as_JSON()
    // },
   articoloSelezionato(articolo) {
      // carica i modelli per l'articolo selezionato
      this.listaModelli = articolo.JSModelli
      // va allo step successivo
      this.stepIndex = 2
    },
    modelloSelezionato(modello) {
      console.dir(modello)
      window.GPROD.IstanziaNuovoProdottoDaJSModello(JSON.stringify(modello))
      this.$router.push(`/dettaglio/add`)
    }
  },
  mounted() {
    // carica gli articoli per la visualizzazione
    this.loadArticoli()

        // // carica i cataloghi
    // this.load().then((listaCataloghi) => {
    //   listaCataloghi.forEach((cat) => {
    //     // per ogni catalogo caricato lo "invia" alla DLL
    //     let jscat = JSON.stringify(cat.data)
    //     // jscat = jscat.toString().replace('\\"', '_')
    //     console.log(jscat)
    //   })
    //   listaCataloghi[0].data.JSArticoli[0].JSModelli = [
    //     listaCataloghi[0].data.JSArticoli[0].JSModelli[0]
    //   ]

    //   let jscat = JSON.stringify(listaCataloghi[0].data)

    //   window.GPROD.AddJSCatalogo(jscat)
    //   // chiediamo alla DLL l'elenco degli articoli dei cataloghi
    //   this.caricaArticoli()
    // })
  }
}
</script>
