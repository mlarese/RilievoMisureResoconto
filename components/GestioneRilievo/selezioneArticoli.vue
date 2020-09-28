<template>
  <v-card :key="mainKey">
    <v-stepper v-model="stepIndex">
      <v-stepper-content step="1">
        Selezionare il catalogo
        <ListaArticoli
          style="max-height: 700px; overflow: auto"
          @onSelected="articoloSelezionato"
          :modalita="'SelezioneOggetto'"
        />
      </v-stepper-content>

      <v-stepper-content step="2">
        Selezionare il modello
        <ListaModelli
          style="max-height: 700px; overflow: auto"
          :lista="listaModelli"
          @onSelected="modelloSelezionato"
        />
      </v-stepper-content>

      <!-- Una volta selezionato il modello ci sono le proprietà da visualizzare -->

      <v-stepper-content step="3">
        Misure
        <v-row>
          <v-col cols="4" class="py-0 my-0">
            <v-subheader>Larghezza</v-subheader>
          </v-col>
          <v-col cols="7" class="py-0 my-0">
            <v-text-field suffix="mm" @change="applicaMC(`L=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="py-0 my-0">
            <v-subheader>Altezza DX</v-subheader>
          </v-col>
          <v-col cols="7" class="py-0 my-0">
            <v-text-field suffix="mm" @change="applicaMC(`H_DX=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="py-0 my-0">
            <v-subheader>Altezza SX</v-subheader>
          </v-col>
          <v-col cols="7" class="py-0 my-0">
            <v-text-field suffix="mm" @change="applicaMC(`H_SX=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="py-0 my-0">
            <v-subheader>Corda</v-subheader>
          </v-col>
          <v-col cols="7" class="py-0 my-0">
            <v-text-field disabled suffix="mm" @change="applicaMC(`CORDA=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
      </v-stepper-content>
    </v-stepper>
    <v-card-actions>
      <v-btn text color="gray" @click="backStep()">Indietro</v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="nextStep()">Avanti</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import ListaArticoli from '../gestione_cataloghi/listaArticoli'
import ListaModelli from '../gestione_cataloghi/ListaModelli'
import Vue from 'vue'

export default Vue.extend({
  components: { ListaArticoli, ListaModelli },
  data() {
    return {
      stepIndex: 1,
      // listaArticoli: [],
      listaModelli: [],
      catalogoID: '',
      mainKeyCounter: 0,
      listaProprieta: [],
      drawingCommands: ''
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
    ...mapActions('cataloghi', { loadCataloghi: 'load', getCatalogoByID: 'getById' }),
    ...mapActions('articoli', { loadArticoli: 'load' }),
    // caricaArticoli() {
    //   this.listaArticoli = window.GPROD.GetListaArticoli_as_JSON()
    // },
    articoloSelezionato(articolo) {
      // carica i modelli per l'articolo selezionato
      this.listaModelli = articolo.JSModelli
      this.catalogoID = articolo.catalogoCodice
      // va allo step successivo
      this.nextStep()
    },
    async modelloSelezionato(modello) {
      this.rilievoDet.catalogoID = this.catalogoID
      window.GPROD.SetCatalogoInUso(this.catalogoID)
      window.GPROD.IstanziaNuovoProdottoDaJSModello(JSON.stringify(modello))

      let catalogo = await this.getCatalogoByID(this.catalogoID)
      window.GPROD.SetTables(JSON.stringify(catalogo.data.JSTables))
      // this.$router.push(`/dettaglio/add`)

      this.nextStep()
    },
    applicaMC(comando) {
      try {
        console.dir(comando)
        window.GPROD.ApplicaMC_x_Modifica(comando)
        let pim = window.GPROD.GetPIMSerialized()
        this.drawingCommands = JSON.parse(pim)
      } catch (err) {
        console.log(err)
      }
    },
    ...mapActions('rilievoDet', ['save']),
    ...mapMutations('rilievoDet', ['setMacroComandi', 'setDrawingCommands']),
    salva() {
      this.setDrawingCommands(this.drawingCommands)
      this.setMacroComandi(window.GPROD.getMacrocomandi())
      this.save()
      
    },
    annulla() {
      // Deve sbiancare il record!!!!!!!!!!!!!!!!!!!!!!!!
      this.$emit('onExit')
    },

    backStep() {
      this.stepIndex -= 1
    },
    nextStep() {
      this.stepIndex += 1
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
})
</script>
