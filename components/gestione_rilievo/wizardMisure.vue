<template>
  <div>
    <v-stepper v-model="stepIndex" v-if="!isLoading">
      <!-- elenco properties dell'articolo selezionato -->
      <v-stepper-content :step="index" v-for="(page, index) in listaPagine" :key="index" :style="`height:${height}px`">
        <div v-for="(prop, pi) in getProprietaDellaPagina(page)" :key="pi">
          <div v-if="prop.propTableName">
            <v-list>
              <v-card-title>{{ prop.propLabel }}</v-card-title>
              <v-divider></v-divider>
              <v-list-item-group v-model="prop.propValue" color="primary">
                <template v-for="(row, i) in getTableRows(prop.propTableName)">
                  <v-list-item :key="i" :value="row.JSTabRowCodice" @click="prop.propValueDecode = row.JSTabRowDesc">
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
            <div v-if="prop.propName == '#GRP_ANTE.PR_NUMERO_ANTE'" class="mx-2">
              <v-card-title>Numero ante</v-card-title>
              <v-divider></v-divider>
              <v-btn-toggle v-model="prop.propValue" tile group color="primary">
                <v-btn value="1">1</v-btn>
                <v-btn value="2">2</v-btn>
                <v-btn value="3">3</v-btn>
                <v-btn value="4">4</v-btn>
              </v-btn-toggle>
            </div>

            <v-row class="mx-2 py-2" v-else-if="prop.propName == '#SER.PR_H_DX'">
              <v-text-field
                v-if="getDati('FORMA').propValue == 'TR'"
                v-model="prop.propValue"
                :label="prop.propLabel"
                hide-details
                append-icon="mdi-keyboard-outline"
                @click:append="openKeyboard(prop.propName)"
                @click="try_openKeyboard($event, prop.propName)"
                :readonly="$vuetify.breakpoint.smAndDown"
                type="number"
              ></v-text-field>
              <v-text-field v-else v-show="false" readonly v-model="getDati('#SER.PR_H_SX').propValue" label="h dx"></v-text-field>
            </v-row>

            <v-row v-else class="mx-2 py-2">
              <v-text-field
                v-model="prop.propValue"
                :label="prop.propLabel"
                hide-details
                append-icon="mdi-keyboard-outline"
                @click:append="openKeyboard(prop.propName)"
                @click="try_openKeyboard($event, prop.propName)"
                :readonly="$vuetify.breakpoint.smAndDown"
                type="number"
              ></v-text-field>
            </v-row>
          </div>
        </div>

        <v-footer absolute class="py-4">
          <v-btn large text color="gray" v-if="stepIndex == 0" @click="exitWizard">Annulla</v-btn>
          <v-btn large text color="gray" v-else @click="backStep"><v-icon>mdi-chevron-left</v-icon>indietro</v-btn>
          <v-spacer></v-spacer>
          <v-btn large text color="primary" @click="nextStep">Avanti</v-btn>
        </v-footer>
      </v-stepper-content>

      <v-stepper-content :step="listaPagine.length" :style="`height:${height}px`">
        <v-card-title>Quantità prodotti</v-card-title>
        <v-divider></v-divider>
        <v-text-field
          v-model="qta"
          hide-details
          append-icon="mdi-keyboard-outline"
          @click:append="openKeyboard('qta')"
          @click="try_openKeyboard($event, 'qta')"
          :readonly="$vuetify.breakpoint.smAndDown"
          type="number"
          class="mx-2"
        >
        </v-text-field>

        <v-card-title>Note</v-card-title>
        <v-divider></v-divider>
        <v-textarea v-model="note" rows="5" filled> </v-textarea>

        <v-footer absolute class="py-4">
          <v-btn large text color="gray" v-if="stepIndex == 0" @click="exitWizard">Annulla</v-btn>
          <v-btn large text color="gray" v-else @click="backStep"><v-icon>mdi-chevron-left</v-icon>indietro</v-btn>
          <v-spacer></v-spacer>
          <v-btn large text color="primary" @click="nextStep">Avanti</v-btn>
        </v-footer>
      </v-stepper-content>

      <v-stepper-content :step="listaPagine.length + 1" :style="`height:${height}px`">
        <!-- VISUALIZZA IMMAGINE -->
        <v-card-title>Riepilogo</v-card-title>
        <ImmagineDet
          v-if="articoloGenerico.artClass == '$PC_SER'"
          :drawingCommands="drawingCommands"
          :imgWidth="350"
          :imgHeight="getHeight - 400"
        ></ImmagineDet>
        <v-card-text>
          <!-- Espone l'elenco delle risposte -->
          <div v-for="(page, ilp) in listaPagine" :key="ilp">
            <div v-for="(prop, pi) in getProprietaDellaPagina(page)" :key="pi">{{ prop.propLabel }} : {{ prop.propValueDecode || prop.propValue }}</div>
          </div>
        </v-card-text>
        <v-footer absolute class="py-4">
          <v-btn large text color="gray" @click="backStep"><v-icon>mdi-chevron-left</v-icon>indietro</v-btn>
          <v-spacer></v-spacer>
          <v-btn large text outlined color="green" @click="onSalva">Salva</v-btn>
        </v-footer>
      </v-stepper-content>
    </v-stepper>
    <v-dialog persistent v-model="keyboard" max-width="300px">
      <keyPad v-if="keyboard" @onSave="keyboardSave" @onAbort="keyboardAbort" />
    </v-dialog>
  </div>
</template>


<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
import ImmagineDet from '@/components/GestioneRilievo/ImmagineDet.vue'
import keyPad from '@/components/General/keyboard.vue'
import { v4 as uuidv4 } from 'uuid'

import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato, JSArticolo, PropertyValued, JSTableRow } from '@/store/articoloModel'
import JSArtProp from '~/models/JSArtProp'

@Component({ components: { ImmagineDet, keyPad }, name: 'Misure' })
export default class RilievoFori extends Vue {
  stepIndex = 0
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  @Prop({ type: String, default: '' }) readonly articoloDaEditareID!: string
  @Prop({ type: Number, default: 600 }) height!: Number

  articoloProperties: PropertyValued[] = new Array<PropertyValued>()
  articoloGenerico!: ArticoloGeneraleConfigurato
  articoloAnag!: JSArticolo
  dictProperty: Map<string, JSArtProp[]> = new Map()
  listaPagine: string[] = new Array<string>()
  GPROD: any = window.GPROD
  drawingCommands: string = ''
  isLoading: boolean = true

  keyboard: boolean = false
  propName_x_Keyboard: string = ''

  qta = '1'
  note = ''

  try_openKeyboard(e: any, propName: string) {
    // Se siamo in modalità touch
    if (this.$vuetify.breakpoint.smAndDown) {
      e.preventDefault()
      this.openKeyboard(propName)
    }
  }

  openKeyboard(propName: string) {
    this.propName_x_Keyboard = propName
    this.keyboard = true
  }

  keyboardSave(valore: string) {
    if (this.propName_x_Keyboard == 'qta') {
      this.qta = valore
    } else {
      let p = this.articoloProperties.find(p => p.propName == this.propName_x_Keyboard) as PropertyValued
      p.propValue = valore
    }

    this.keyboardAbort()
  }

  keyboardAbort() {
    this.propName_x_Keyboard = ''
    this.keyboard = false
  }

  nextStep() {
    if (this.stepIndex == this.listaPagine.length) {
      if (this.articoloGenerico.artClass == '$PC_SER') {
        this.getDrawingCommands()
      }
    }
    this.stepIndex++
  }

  backStep() {
    this.stepIndex--
  }

  exitWizard() {
    this.$emit('onExit')
  }

  onSalva() {
    // Crea l'articolo generale
    let articoloSpec = this.record.listaArticoliSpec.find(art => art._id == this.articoloDaEditareID) as ArticoloSpecificoConfigurato
    articoloSpec.listaPropValued = this.articoloProperties

    let q = new PropertyValued()
    ;(q.propName = '_QTA'), (q.propValue = this.qta)
    articoloSpec.listaPropValued.push(q)

    let n = new PropertyValued()
    ;(n.propName = '_NOTE'), (n.propValue = this.note)
    articoloSpec.listaPropValued.push(n)

    articoloSpec.drawingCommands = this.drawingCommands

    // Salva il rilievo con le nuove impostazioni
    this.$store.dispatch('rilievoModule/salva', undefined, { root: true })

    // Sbianca lo stato di questo componente
    // this.clearMe()

    this.exitWizard()
  }

  getDrawingCommands() {
    if (this.articoloGenerico.artClass != '$PC_SER') {
      // Non si deve generare l'immagine del serramento
      return ''
    }
    // Il codice del modello è indicato dalla serie
    const nomeModello = this.getParametroDaScript('=getDati("SERIE").Parametro("PROTOTIPO")')
    // Preleva il modello dell'articolo
    const modello = this.articoloAnag.JSModelli.find(m => m.JSModCodice == nomeModello)
    // Istanzia il prodotto da modello
    this.GPROD.IstanziaNuovoProdottoDaJSModello(JSON.stringify(modello))
    // Imposta le property x ora fisse
    console.log(this.GPROD.getGruppoAntePrincID())
    let valore
    let exp //getParametroDaScript
    exp = this.articoloAnag.JSProperties.find(p => p.JSAPropName == '#SER.PR_TIPO')?.JSAAutoCalcExp
    valore = this.getParametroDaScript(exp as string)
    if (valore) this.GPROD.ApplicaMC_x_Modifica(`TIPO=${valore}`)

    exp = this.articoloAnag.JSProperties.find(p => p.JSAPropName == '#SER.PR_FORMA')?.JSAAutoCalcExp
    valore = this.getParametroDaScript(exp as string)
    if (valore) this.GPROD.ApplicaMC_x_Modifica(`FORMA=${valore}`)

    valore = this.articoloProperties.find(p => p.propName == '#SER.PR_L')?.propValue
    if (valore) this.GPROD.ApplicaMC_x_Modifica(`L=${valore}`)

    valore = this.articoloProperties.find(p => p.propName == '#SER.PR_H_SX')?.propValue
    if (valore) this.GPROD.ApplicaMC_x_Modifica(`H_SX=${valore}`)

    valore = this.articoloProperties.find(p => p.propName == '#SER.PR_H_DX')?.propValue
    if (valore) {
      this.GPROD.ApplicaMC_x_Modifica(`H_DX=${valore}`)
    } else {
      this.GPROD.ApplicaMC_x_Modifica(`H_DX=${this.articoloProperties.find(p => p.propName == '#SER.PR_H_SX')?.propValue}`)
    }

    valore = this.articoloProperties.find(p => p.propName == '#GRP_ANTE.PR_NUMERO_ANTE')?.propValue
    if (valore) this.GPROD.ApplicaMC_x_Modifica(`${this.GPROD.getGruppoAntePrincID()}.NUMERO_ANTE=${valore}`)

    valore = this.getParValue(this.articoloProperties.find(p => p.propName == '#GRP_ANTE.PR_SISTEMA_APERTURA') as PropertyValued, 'APERTURA_ANTE')
    if (valore) this.GPROD.ApplicaMC_x_Modifica(`${this.GPROD.getGruppoAntePrincID()}.APERTURA_ANTE=${valore}`)

    // for (const p of this.articoloProperties) {
    //   if (p.propValue) {
    //     this.GPROD.ApplicaMC_x_Modifica(`${p.propName.replace('#SER.PR_', '')}=${p.propValue}`)
    //   }
    // }

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

    let nomeTabella: string | undefined = tableName

    if (tableName.startsWith('=')) {
      // Valuta lo script
      // =getDati("SERIE").Parametro("V_TELAI")

      nomeTabella = this.getParametroDaScript(tableName)
    }

    if (nomeTabella) {
      const tab = JSON.parse(this.GPROD.GetTableSerialized(nomeTabella))

      if (tab) {
        if (nomeTabella.includes('APERTURA')) {
          // filtra le rows
          return this.filtraTableRows_x_Aperture(tab.JSTableRows)
        } else {
          return tab.JSTableRows
        }
      }
    } else {
      return []
    }
  }

  filtraTableRows_x_Aperture(rows: JSTableRow[]) {
    let ante = this.articoloProperties.find(p => p.propName == '#GRP_ANTE.PR_NUMERO_ANTE')?.propValue as string

    return rows.filter(r => r.JSTabRowCodice.startsWith(ante))
  }

  getParametroDaScript(script: string) {
    // Toglie l'uguale
    if (script.startsWith('=')) script = script.substring(1, script.length)
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
      let tName = prop.propTableName
      if (prop.propTableName.startsWith('=')) {
        tName = this.getParametroDaScript(prop.propTableName) as string
      }
      let value = this.GPROD.GetTableRow_ParValue(tName, prop.propValue, par)
      return value
    } else {
      return undefined
    }
  }

  removeEmpty(obj: any) {
    Object.entries(obj).forEach(([key, val]) => (val && typeof val === 'object' && this.removeEmpty(val)) || ((val === null || val === '') && delete obj[key]))
    return obj
  }

  async mounted() {
    this.isLoading = true
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
      if (propAnag.JSAWizard && propAnag.JSAWizard.startsWith('PWA.DG')) {
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
    this.isLoading = false
  }

  get getHeight() {
    let offset = -10
    if (this.$vuetify.breakpoint.xsOnly) {
      return this.$vuetify.breakpoint.height - 36 //+ offset
    } else {
      return 600 //+ offset
    }
  }
}
</script>