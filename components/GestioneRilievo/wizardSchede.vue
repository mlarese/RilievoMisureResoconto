<template>
  <v-card flat height="100%">
    <v-stepper v-model="stepIndex" style="height: 100%">
      <!-- selezione articolo di partenza -->
      <v-stepper-content step="0" style="height: 100%">
        <v-card-title>
          Selezionare un articolo
        </v-card-title>
        <ListaArticoli
          @onSelected="onArticoloSelezionato($event)"
          :modalita="'SelezioneOggetto'"
          :marcaRiga="true"
          :style="{ height: 'calc(100vh - 150px)', 'overflow-y': 'auto' }"
        />
        <v-card-actions>
          <v-btn text color="gray" @click="exitWizard()">Annulla</v-btn>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="nextStep()">Avanti</v-btn>
        </v-card-actions>
      </v-stepper-content>

      <!-- elenco properties dell'articolo selezionato -->
      <v-stepper-content v-for="(prop, index) in articoloProperties" :key="index" :step="index + 1">
        <p>{{ prop.propLabel }}</p>

        <v-radio-group v-if="prop.propTableName" v-model="prop.propValue">
          <v-radio v-for="(row, n) in getTableRows(prop.propTableName)" :key="n" :label="row.JSTabRowDesc" :value="row.JSTabRowCodice"></v-radio>

          <!-- Opzione altro deve sempre essere visualizzata -->
          <v-row align="center" class="pa-0 ma-0" v-if="!prop.isRequired">
            <v-radio value="altro"></v-radio>
            <v-text-field v-model="prop.PropAltro" placeholder="Altro" :hide-details="true" dense></v-text-field>
          </v-row>
        </v-radio-group>

        <v-card-actions>
          <v-btn text color="gray" @click="backStep()">Indietro</v-btn>
          <v-spacer></v-spacer>

          <v-btn v-if="index + 1 < articoloProperties.length" text color="primary" @click="nextStep()"
            >Avanti {{ index + 1 }} / {{ articoloProperties.length }}</v-btn
          >

          <v-btn v-else text color="primary" @click="onSalva()">Salva</v-btn>
        </v-card-actions>
      </v-stepper-content>
    </v-stepper>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Emit } from 'nuxt-property-decorator'
import ListaArticoli from '../gestione_cataloghi/listaArticoli.vue'
import { JSArticolo, PropertyValued, JSTableRow, ArticoloGeneraleConfigurato } from '@/store/articoloModel'
import { v4 as uuidv4 } from 'uuid'

@Component({ components: { ListaArticoli }, name: 'wizardSchede' })
export default class WizardSchede extends Vue {
  stepIndex = 0
  articoloProperties: PropertyValued[] = new Array<PropertyValued>()
  catalogoSelezionato!: any
  articoloSelezionato: JSArticolo = new JSArticolo()
  GPROD: any = window.GPROD

  getTableRows(tableName: string) {
    if (!tableName) {
      return []
    }

    if (tableName.startsWith('=')) {
      // Valuta lo script
      // =getDati("SERIE").Parametro("V_TELAI")

      // Toglie l'uguale
      let script = tableName.substring(1, tableName.length)
      let getDati = 'this.' + script.split('.')[0]
      let Parametro = 'this.' + script.split('.')[1]

      // Cerca la proprietà configurata
      let propCercata = eval(getDati)
      // Prende il parametrro da cercare
      let parametroDaCercare = eval(Parametro)

      // Proprietà non ancora configurata
      if (!parametroDaCercare) return []

      let nomeTabellaDaParametro = this.getParValue(propCercata, parametroDaCercare)

      if (nomeTabellaDaParametro) {
        const tab = JSON.parse(this.GPROD.GetTableSerialized(nomeTabellaDaParametro))
        return tab.JSTableRows
      } else {
        return []
      }
    } else {
      const tab = JSON.parse(this.GPROD.GetTableSerialized(tableName))
      return tab.JSTableRows
    }
  }

  getDati(name: string): PropertyValued {
    // Restituisce la priprietà indicata dal nome
    const prop = this.articoloProperties.find(p => p.propName == name)
    return prop as PropertyValued
  }

  Parametro(parametro: string): string {
    return parametro
  }

  getParValue(prop: PropertyValued, par: string): string | undefined {
    // restituisce il valore del parametro della row della tabella indicata nella property

    // Prende la tabella
    if (prop && prop.propTableName && prop.propValue && par) {
      let value = this.GPROD.GetTableRow_ParValue(prop.propTableName, prop.propValue, par)
      return value
    } else {
      return undefined
    }
  }

  propertiesDatiGenerali(): PropertyValued[] {
    if (this.articoloSelezionato) {
      if (this.articoloSelezionato.JSProperties) {
        this.articoloProperties = new Array<PropertyValued>()

        for (const propDef of this.articoloSelezionato.JSProperties) {
          if (propDef.JSAWizard === 'PWA.DG') {
            let prp = new PropertyValued()
            prp.propLabel = propDef.JSAPropLabel
            prp.propName = propDef.JSAPropName
            prp.propTableName = propDef.JSAPropTables
            prp.isRequired = propDef.JSARequired?.toUpperCase() === 'TRUE'

            this.articoloProperties.push(prp)
          }
        }
      }
    }
    console.log(this.articoloProperties)
    return this.articoloProperties
  }

  async onArticoloSelezionato(articolo: JSArticolo) {
    console.log(articolo)

    let cat = await this.$store.dispatch('cataloghi/getById', articolo.catalogoCodice, { root: true })
    if (cat) {
      this.catalogoSelezionato = cat.data

      this.GPROD.SetTables(JSON.stringify(this.catalogoSelezionato.JSTables))

      this.articoloSelezionato = articolo
      this.propertiesDatiGenerali()
    }
  }

  @Emit('onSave') onSalva() {
    // Verifica se si sta salvando un nuovo articolo
    // o modificando uno esistente

    // Crea l'articolo generale
    let articoloDG = new ArticoloGeneraleConfigurato()
    articoloDG._id = uuidv4()
    articoloDG.azienda = this.catalogoSelezionato.JSAzienda.JSUID
    articoloDG.catalogo = this.articoloSelezionato.catalogoCodice
    articoloDG.codice = this.articoloSelezionato.JSCodice
    articoloDG.descrizione = this.articoloSelezionato.JSDescrizione
    articoloDG.listaPropValued = this.articoloProperties

    // Assegna l'articolo al rilievo
    this.$store.commit('rilievoModule/setArticoloDG', articoloDG)

    // Salva il rilievo con le nuove impostazioni
    this.$store.dispatch('rilievoModule/salva', undefined, { root: true })

    // Sbianca lo stato di questo componente
    this.clearMe()
  }

  clearMe() {
    this.stepIndex = 0
    this.articoloProperties = new Array<PropertyValued>()
    this.catalogoSelezionato = {}
    this.articoloSelezionato = new JSArticolo()
  }

  nextStep() {
    this.stepIndex = this.stepIndex + 1
  }

  @Emit('onExit') exitWizard() {
    this.clearMe()
  }

  backStep() {
    this.stepIndex = this.stepIndex - 1
  }

  goToStep(n: number) {
    this.stepIndex = n
  }

  mounted() {
    this.$store.dispatch('articoli/load', null, { root: true })
  }
}
</script>
<!--
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ListaArticoli from '../gestione_cataloghi/listaArticoli'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      articoloProperties: [],
      articolo: {}
    }
  },
  components: {
    ListaArticoli
  },

  methods: {
    ...mapActions('cataloghi', { getCatalogoByID: 'getById' }),
    ...mapActions('articoli', { loadArticoli: 'load' }),
    async onArticoloSelezionato(articolo) {
      this.articolo = articolo

      // una volta selezionato l'articolo possiamo caricare le properties
      let listaVera = []
      listaVera = articolo.JSProperties

      let catalogo = await this.getCatalogoByID(articolo.catalogoCodice)
      window.GPROD.SetTables(JSON.stringify(catalogo.data.JSTables))

      this.articoloProperties = []

      for (let realProp of listaVera) {
        // JSADataType
        let tmpProp = {
          Descrizione: realProp.JSAPropLabel,
          PropValue: '',
          PropAltro: '',
          PropName: realProp.JSAPropName
        }

        if (realProp.JSAPropTables) {
          tmpProp.hasTableData = true
          let myTable = JSON.parse(window.GPROD.GetTableSerialized(realProp.JSAPropTables))
          tmpProp.Rows = myTable.JSTableRows
        } else {
          tmpProp.hasTableData = false
        }

        this.articoloProperties.push(tmpProp)
      }
    },

    salva() {
      console.dir(this.articoloProperties)

      // SOLO PER DEMO
      // Genera la lista delle proprieta
      let listaPropResult = []
      for (const prop of this.articoloProperties) {
        let tmpProp = {
          Label: prop.Descrizione,
          Code: prop.PropName
        }

        if (prop.PropValue === 'altro') {
          tmpProp.Value = prop.PropAltro
        } else {
          tmpProp.Value = this.decodeProp(prop.Rows, prop.PropValue)
        }

        listaPropResult.push(tmpProp)
      }

      let articoloResult = {
        listaProp: listaPropResult,
        codiceArticolo: this.articolo.JSCodice,
        descrizioneArticolo: this.articolo.JSDescrizione
      }

      this.$emit('onSave', articoloResult)
    },

    decodeProp(rows, codiceProp) {
      return rows.find(r => r.JSTabRowCodice).JSTabRowDesc
    }
  },
  mounted() {
    let filtro = {
      soloGenerali: false
    }
    this.loadArticoli(filtro)
  }
})
</script>
 -->