<template>
  <v-card flat>
    <v-stepper v-model="stepIndex">
      <!-- selezione articolo di partenza -->
      <v-stepper-content step="0" class="pa-0">
        <v-card-title>
          Selezionare un articolo
        </v-card-title>
        <ListaArticoli
          @onSelected="onArticoloSelezionato($event)"
          :modalita="'SelezioneOggetto'"
          :marcaRiga="true"
          :style="{ height: height - 65 + 'px', 'overflow-y': 'auto' }"
        />
        <v-footer absolute class="pa-4">
          <v-btn large text color="gray" @click="exitWizard()">Annulla</v-btn>
          <v-spacer></v-spacer>
          <v-btn large text color="primary" @click="nextStep()" :disabled="articoloSelezionato.JSCodice == ''">Avanti</v-btn>
        </v-footer>
      </v-stepper-content>

      <v-stepper-content step="1" v-if="esisteStessoArticolo == 1" class="pa-0">
        <v-card>
          <v-card-text :style="{ height: height + 'px', 'overflow-y': 'auto' }" class="pt-6">
            <span>Attenzione: è già stato inserito una scheda dello stesso tipo </span>
            <span>E' necessario dare un nome differente </span>
            <v-text-field v-model="subDescrizione"></v-text-field>
          </v-card-text>
          <v-footer absolute class="pa-4">
            <v-btn large text color="gray" @click="backStep()">Indietro</v-btn>
            <v-spacer></v-spacer>
            <v-btn large text color="primary" @click="nextStep()" :disabled="subDescrizione == ''">Avanti</v-btn>
          </v-footer>
        </v-card>
      </v-stepper-content>

      <!-- elenco properties dell'articolo selezionato -->
      <v-stepper-content v-for="(prop, index) in articoloProperties" :key="index" :step="index + 1 + esisteStessoArticolo" class="pa-0">
        <v-card :height="height">
          <v-card>
            <v-card-title>
              {{ prop.propLabel }}
            </v-card-title>
            <v-card-subtitle>Selezionare una delle opzioni presenti</v-card-subtitle>
          </v-card>
          <v-card-text class="py-0">
            <v-list :style="{ height: height - 150 + 'px', 'overflow-y': 'scroll' }">
              <v-list-item-group v-model="prop.propValue" color="primary">
                <template v-for="(row, i) in getTableRows(prop.propTableName)">
                  <v-list-item :key="i" :value="`${row.JSTabRowCodice}#_#${row.JSTabRowDesc}`">
                    <template v-slot:default="{ active }">
                      <v-list-item-content style="width: 100%">
                        <v-list-item-title v-text="`${row.JSTabRowDesc}`"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon v-if="active">mdi-check</v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
                <template v-if="!prop.isRequired">
                  <v-list-item :value="'altro'">
                    <template v-slot:default="{ active }">
                      <v-list-item-content>
                        <v-text-field
                          v-model="prop.propValueDecode"
                          placeholder="Altro"
                          persistent-hint
                          hint="Inserire un valore manualmente"
                          dense
                        ></v-text-field>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon v-if="active">mdi-check</v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-footer absolute class="pa-4">
            <v-btn large text color="gray" @click="backStep()">Indietro</v-btn>
            <v-spacer></v-spacer>

            <v-btn
              large
              :disabled="prop.propValue === undefined"
              v-if="index + 1 + esisteStessoArticolo < articoloProperties.length + esisteStessoArticolo"
              text
              color="primary"
              @click="nextStep()"
              >Avanti {{ index + 1 + esisteStessoArticolo }} / {{ articoloProperties.length + esisteStessoArticolo }}</v-btn
            >

            <v-btn large v-else :disabled="!(prop.propValue)" text color="primary" @click="onSalva()">Salva</v-btn>
          </v-footer>
        </v-card>
      </v-stepper-content>
    </v-stepper>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Emit, Prop } from 'nuxt-property-decorator'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'

import ListaArticoli from '../gestione_cataloghi/listaArticoli.vue'
import { JSArticolo, PropertyValued, JSTableRow, ArticoloGeneraleConfigurato } from '@/store/articoloModel'
import { v4 as uuidv4 } from 'uuid'

@Component({ components: { ListaArticoli }, name: 'wizardSchede' })
export default class WizardSchede extends Vue {
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @Prop({ type: Number, default: 600 }) height!: Number

  stepIndex = 0
  articoloProperties: PropertyValued[] = new Array<PropertyValued>()
  catalogoSelezionato!: any
  articoloSelezionato: JSArticolo = new JSArticolo()
  GPROD: any = window.GPROD
  esisteStessoArticolo = 0
  subDescrizione: string = ''

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
      let value = this.GPROD.GetTableRow_ParValue(prop.propTableName, this.getPropValue(prop), par)
      return value
    } else {
      return undefined
    }
  }

  getPropValue(prop: PropertyValued): string{
    if (prop.propValue?.indexOf('#_#') > 0 ){
      return prop.propValue.split('#_#')[0]
    }else{
      return prop.propValue
    }
  }


  propertiesDatiGenerali(): PropertyValued[] {
    if (this.articoloSelezionato) {
      if (this.articoloSelezionato.JSProperties) {
        this.articoloProperties = new Array<PropertyValued>()

        for (const propDef of this.articoloSelezionato.JSProperties) {
          if (propDef.JSAWizard && propDef.JSAWizard.startsWith('PWA.DG')) {
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
    this.verificaEsistenzaStessoArticolo()
  }

  verificaEsistenzaStessoArticolo() {
    // Cerca se esiste un altro articolo generale dello stesso tipo
    if (!this.record.listaArticoliGen) return 0
    const art = this.record.listaArticoliGen.find(a => a.codice == this.articoloSelezionato.JSCodice)
    if (art) {
      this.esisteStessoArticolo = 1
    } else {
      this.esisteStessoArticolo = 0
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
    articoloDG.artClass = this.articoloSelezionato.JSArticleClass
    articoloDG.codice = this.articoloSelezionato.JSCodice
    articoloDG.descrizione = this.articoloSelezionato.JSDescrizione
    articoloDG.listaPropValued = new Array<PropertyValued>()
    for (const p of this.articoloProperties) {
      let valore = p.propValue
      if (valore) {
        if (valore.indexOf('#_#') > 0) {
          p.propValue = valore.split('#_#')[0]
          p.propValueDecode = valore.split('#_#')[1]
        }
      }
      articoloDG.listaPropValued.push(p)
    }
    articoloDG.subDescrizione = this.subDescrizione

    // Assegna l'articolo al rilievo
    this.$store.commit('rilievoModule/setArticoloDG', articoloDG)

    // Salva il rilievo con le nuove impostazioni
    this.$store.dispatch('rilievoModule/salva', undefined, { root: true })

    // Sbianca lo stato di questo componente e esce
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

  mounted() {
    this.$store.dispatch('articoli/load', null, { root: true })
  }
}
</script>