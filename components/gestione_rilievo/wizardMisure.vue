<template>
  <v-card>
    <v-stepper v-model="stepIndex">
      <!-- elenco properties dell'articolo selezionato -->
      <!-- <v-stepper-content :step="index" v-for="(page, index) in listaPagine" :key="index">
        <v-card v-if="page == 'PWA.WIZSER_MISURE'">
          <p>wizard misure</p>

          <div v-for="(prp, i) in getProprietaDellaPagina(page)" :key="i">
            <div v-if="prp.propName == 'FORMA'">
              <v-row>
                <v-col cols="4">
                  {{ prp.propLabel }}
                </v-col>
                <v-col class="py-0">
                  <v-radio-group v-model="prp.propValue" class="py-0">
                    <v-radio v-for="(row, n) in getTableRows(prp.propTableName)" :key="n" :label="row.JSTabRowDesc" :value="row.JSTabRowCodice"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </div>

            <div v-if="prp.propName == '#SER.PR_L'">
              <v-row>
                <v-col cols="4">
                  {{ prp.propLabel }}
                </v-col>
                <v-col class="py-0 mr-1">
                  <v-text-field hide-details solo dense v-model="prp.propValue"></v-text-field>
                </v-col>
              </v-row>
            </div>
            <div v-if="prp.propName == '#SER.PR_H_SX'">
              <v-row>
                <v-col cols="4">
                  {{ prp.propLabel }}
                </v-col>
                <v-col class="py-0  mr-1">
                  <v-text-field hide-details solo dense v-model="prp.propValue"></v-text-field>
                </v-col>
              </v-row>
            </div>
            <div v-if="prp.propName == '#SER.PR_H_DX'">
              <v-row>
                <v-col cols="4">
                  {{ prp.propLabel }}
                </v-col>
                <v-col class="py-0 mr-1">
                  <v-text-field hide-details solo dense v-model="prp.propValue"></v-text-field>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card>

        <v-card v-if="page == 'PWA.WIZSER_GRPA'">
          <p>Wizard gruppo ante</p>

          <div v-for="(prp, i) in getProprietaDellaPagina(page)" :key="i">
            <div v-if="prp.propName == '#GRP_ANTE.PR_NUMERO_ANTE'">
              <v-row>
                <v-col cols="4">
                  {{ prp.propLabel }}
                </v-col>
                <v-col class="py-0 mr-1">
                  <v-text-field hide-details solo dense v-model="prp.propValue"></v-text-field>
                </v-col>
              </v-row>
            </div>

            <div v-if="prp.propName == '#GRP_ANTE.PR_SISTEMA_APERTURA'">
              <v-row>
                <v-col cols="4">
                  {{ prp.propLabel }}
                </v-col>
                <v-col class="py-0">
                  <v-radio-group v-model="prp.propValue" class="py-0">
                    <v-radio v-for="(row, n) in getTableRows(prp.propTableName)" :key="n" :label="row.JSTabRowDesc" :value="row.JSTabRowCodice"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card>
      </v-stepper-content> -->

      <v-stepper-content :step="index" v-for="(page, index) in listaPagine" :key="index">
        <div v-for="(prop, pi) in getProprietaDellaPagina(page)" :key="pi">
          <div v-if="prop.propTableName">
            <v-list>
              <v-list-item-subtitle v-text="prop.propLabel" />
              <v-divider></v-divider>
              <v-list-item-group v-model="prop.propValue" color="primary">
                <template v-for="(row, i) in getTableRows(prop.propTableName)">
                  <v-list-item :key="i" :value="row.JSTabRowCodice">
                    <template v-slot:default="{ active }">
                      <v-list-item-content style="width: 100%">
                        <v-list-item-title v-text="`${row.JSTabRowDesc}`"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon v-if="active">mdi-check</v-icon>
                      </v-list-item-icon>
                    </template>
                  </v-list-item>
                </template>
                <template v-if="!prop.isRequired">
                  <v-list-item value="altro">
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
                      <v-list-item-icon>
                        <v-icon v-if="active">mdi-check</v-icon>
                      </v-list-item-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
            <v-divider v-if="pi < getProprietaDellaPagina(page).length - 1"></v-divider>
          </div>

          <div v-else>
            <v-row class="mx-2 py-2" v-if="prop.propName == '#SER.PR_H_DX'">
              <v-text-field v-if="getDati('FORMA').propValue == 'TR'" dense v-model="prop.propValue" :label="prop.propLabel" hide-details></v-text-field>
              <v-text-field
                v-else
                v-show="false"
                readonly
                dense
                v-model="getDati('#SER.PR_H_SX').propValue"
                :label="prop.propLabel"
                hide-details
              ></v-text-field>
            </v-row>

            <v-row v-if="prop.propName == '#GRP_ANTE.PR_NUMERO_ANTE'" class="mx-2">
              <v-col cols="auto" class="pa-0 ma-0 pt-4">
                Ante
              </v-col>
              <v-col cols="auto" class="pa-0 ma-0">
                <v-btn-toggle v-model="prop.propValue" tile group color="primary">
                  <v-btn value="1">1</v-btn>
                  <v-btn value="2">2</v-btn>
                  <v-btn value="3">3</v-btn>
                  <v-btn value="4">4</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>

            <v-row v-else class="mx-2 py-2">
              <v-text-field dense v-model="prop.propValue" :label="prop.propLabel" hide-details></v-text-field>
            </v-row>
          </div>
        </div>
      </v-stepper-content>

      <v-stepper-content :step="listaPagine.length">
        <!-- VISUALIZZA IMMAGINE -->
        <v-btn @click="getDrawingCommands">genera img</v-btn>
        <div>
          <!-- <v-img :src="imgBase64" width="600" height="600" /> -->
          <ImmagineDet :drawingCommands="drawingCommands" :imgWidth="200" :imgHeight="200"></ImmagineDet>
        </div>
      </v-stepper-content>

      <v-btn @click="backStep">indietro</v-btn>
      <v-btn @click="nextStep">avanti</v-btn>
    </v-stepper>
  </v-card>
</template>


<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
import ImmagineDet from '@/components/GestioneRilievo/ImmagineDet.vue'

import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato, JSArticolo, PropertyValued, JSTableRow } from '@/store/articoloModel'
import JSArtProp from '~/models/JSArtProp'

@Component({ components: { ImmagineDet }, name: 'Misure' })
export default class RilievoFori extends Vue {
  stepIndex = 0
  @Prop({ type: String, default: '' }) readonly articoloDaEditareID!: string
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  articoloProperties: PropertyValued[] = new Array<PropertyValued>()
  articoloGenerico!: ArticoloGeneraleConfigurato
  articoloAnag!: JSArticolo
  dictProperty: Map<string, JSArtProp[]> = new Map()
  listaPagine: string[] = new Array<string>()
  GPROD: any = window.GPROD
  drawingCommands: string = ''

  nextStep() {
    this.stepIndex++
    console.log(this.stepIndex)
  }

  backStep() {
    this.stepIndex--
    console.log(this.stepIndex)
  }

  getDrawingCommands() {
    // Il codice del modello è indicato dalla serie
    const nomeModello = this.getParametroDaScript('=getDati("SERIE").Parametro("PROTOTIPO")')
    // Preleva il modello dell'articolo
    const modello = this.articoloAnag.JSModelli.find(m => m.JSModCodice == nomeModello)
    // Istanzia il prodotto da modello
    this.GPROD.IstanziaNuovoProdottoDaJSModello(JSON.stringify(modello))
    // Imposta le property x ora fisse

    
    for (const p of this.articoloProperties) {
      if (p.propValue) {
        this.GPROD.ApplicaMC_x_Modifica(`${p.propName.replace('#SER.PR_', '')}=${p.propValue}`)
      }
    }

    let pim = this.GPROD.GetPIMSerialized()
    this.drawingCommands = JSON.parse(pim)
  }

  getProprietaDellaPagina(pagina: string): PropertyValued[] {
    // let lista = new Array<PropertyValued>()
    // let a = this.dictProperty.get(pagina) as JSArtProp[]
    // for (const propAnag of a) {
    //   for (const p of this.articoloProperties) {
    //     if (p.propName == propAnag.JSAPropName) {
    //       lista.push(p)
    //     }
    //   }
    // }
    return this.articoloProperties.filter(p => p.propPage == pagina).sort((a, b) => a.propOrder.localeCompare(b.propOrder))
  }

  getTableRows(tableName: string) {
    if (!tableName) {
      return []
    }

    if (tableName.startsWith('=')) {
      // Valuta lo script
      // =getDati("SERIE").Parametro("V_TELAI")

      let nomeTabellaDaParametro = this.getParametroDaScript(tableName)

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

    const tab = JSON.parse(this.GPROD.GetTableSerialized(tableName))
    if (tab) {
      return tab.JSTableRows
    }
  }

  getParametroDaScript(script: string) {
    // Toglie l'uguale
    script = script.substring(1, script.length)
    let getDati = 'this.' + script.split(').')[0] + ')'
    let Parametro = 'this.' + script.split(').')[1]

    // Cerca la proprietà configurata
    let propCercata = eval(getDati)
    // Prende il parametrro da cercare
    let parametroDaCercare = eval(Parametro)

    // Proprietà non ancora configurata
    if (!parametroDaCercare) return ''

    return this.getParValue(propCercata, parametroDaCercare)
  }

  getDati(name: string): PropertyValued {
    // Restituisce la priprietà indicata dal nome
    let prop = this.articoloProperties.find(p => p.propName == name)
    if (prop) {
      return prop as PropertyValued
    } else {
      // Cerca nell'articolo generico
      prop = this.articoloGenerico.listaPropValued.find(p => p.propName == name)
      return prop as PropertyValued
    }
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

  onSalva() {}

  removeEmpty(obj: any) {
    Object.entries(obj).forEach(([key, val]) => (val && typeof val === 'object' && this.removeEmpty(val)) || ((val === null || val === '') && delete obj[key]))
    return obj
  }

  async mounted() {
    if (!this.articoloDaEditareID) return

    // Cerca l'articolo generico
    let articoloDaEditare: any = this.record.listaArticoliSpec.find(art => art._id == this.articoloDaEditareID)
    let art = this.record.listaArticoliGen.find(art => art._id == articoloDaEditare.rifSchedaID)
    this.articoloGenerico = art as ArticoloGeneraleConfigurato

    let cat = await this.$store.dispatch('cataloghi/getById', this.articoloGenerico.catalogo, { root: true })
    if (cat) {
      this.GPROD.SetTables(JSON.stringify(cat.data.JSTables))
      //   let a = this.removeEmpty(cat.data)
      //   this.GPROD.AddJSCatalogo(JSON.stringify(a))
    }

    // Carica l'articolo per ottenere le properties e i MC
    const id = `${this.articoloGenerico.azienda}.${this.articoloGenerico.catalogo}.${this.articoloGenerico.codice}`
    this.articoloAnag = await this.$store.dispatch('articoli/getById', id)

    for (const propAnag of this.articoloAnag.JSProperties) {
      // Crea un dictionary in funzione del wizard (se specificato) altrimenti ignora
      if (propAnag.JSAWizard == 'PWA.DG') {
        continue
      }

      let prp = new PropertyValued()
      prp.propName = propAnag.JSAPropName
      prp.propLabel = propAnag.JSAPropLabel
      prp.propTableName = propAnag.JSAPropTables
      prp.isRequired = true
      prp.propValue = propAnag.JSADefault

      if (propAnag.JSAWizard) {
        let code = propAnag.JSAWizard.replace('PWA.DS.', '')
        let page = code.split('.')[0]
        let order = code.split('.')[1]

        prp.propPage = page
        prp.propOrder = order

        if (this.listaPagine.indexOf(page) === -1) this.listaPagine.push(page)
      }

      this.articoloProperties.push(prp)

      //   if (propAnag.JSAWizard) {
      //     if (this.dictProperty.has(propAnag.JSAWizard)) {
      //       this.dictProperty.get(propAnag.JSAWizard)?.push(propAnag)
      //     } else {
      //       this.listaPagine.push(propAnag.JSAWizard)
      //       this.dictProperty.set(propAnag.JSAWizard, [propAnag])
      //     }
      //   }
    }
    console.log(this.dictProperty)
  }
}
</script>