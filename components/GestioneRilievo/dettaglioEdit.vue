<template>
  <div>
    <Panel>
      <v-container class="grey lighten-5 pa-0" slot="mainContent" ref="mainContent">
        <ImmagineDet
          @onImageClick="selezionaElemento"
          :drawingCommands="drawingCommands"
          :imgWidth="imgWidth"
          :imgHeight="imgHeight"
          :ignoraQuote="false"
          :EsclusiEvidenziati="false"
        ></ImmagineDet>
        <v-container fluid>
          <v-tabs v-model="currentTab" grow>
            <v-tab>Dati p.</v-tab>
            <v-tab>Misure</v-tab>
            <v-tab>Grp. Ante</v-tab>
            <v-tab>Div</v-tab>
            <v-tab>Struttura</v-tab>

            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Serie</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field
                      v-model="SERIE"
                      readonly
                      append-outer-icon="mdi-magnify"
                      @click:append-outer="openTable('SERIE', 'SERIE')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Tipo serramento</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field
                      v-model="TIPO_SERRAMENTO"
                      readonly
                      append-outer-icon="mdi-magnify"
                      @click:append-outer="openTable('TIPO_SERRAMENTO', 'TIPO_SER')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Tipo telaio</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field
                      v-model="TIPO_TELAIO"
                      readonly
                      append-outer-icon="mdi-magnify"
                      @click:append-outer="openTable('TIPO_TELAIO', 'TIPO_TELAIO')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Colore</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field
                      v-model="TINTA"
                      readonly
                      append-outer-icon="mdi-magnify"
                      @click:append-outer="openTable('TINTA', 'TINTE')"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Larghezza</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field value="1000" suffix="mm" @change="applicaMC(`L=${$event}`)"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Altezza DX</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field value="1000" suffix="mm" @change="applicaMC(`H_DX=${$event}`)"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Altezza SX</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field value="1000" suffix="mm" @change="applicaMC(`H_SX=${$event}`)"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="py-0 my-0">
                    <v-subheader>Corda</v-subheader>
                  </v-col>
                  <v-col cols="7" class="py-0 my-0">
                    <v-text-field
                      disabled
                      value="1000"
                      suffix="mm"
                      @change="applicaMC(`CORDA=${$event}`)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <div v-if="elementoSelezionatoID === 'GRP_ANTE_PRINC'">
                  <v-row>
                    <v-col cols="4" class="py-0 my-0">
                      <v-subheader>Numero ante</v-subheader>
                    </v-col>
                    <v-col cols="7" class="py-0 my-0">
                      <v-text-field
                        v-model="GRP_NUMERO_ANTE"
                        readonly
                        append-outer-icon="mdi-magnify"
                        @click:append-outer="openTable('GRP_NUMERO_ANTE', 'NUMERO_ANTE')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" class="py-0 my-0">
                      <v-subheader>Sistema Ap.</v-subheader>
                    </v-col>
                    <v-col cols="7" class="py-0 my-0">
                      <v-text-field
                        v-model="GRP_SISTEMA_APERTURA"
                        readonly
                        append-outer-icon="mdi-magnify"
                        @click:append-outer="openTable('GRP_SISTEMA_APERTURA', 'SISTEMI_APERTURA')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div v-else>Selezionare un gruppo ante</div>
              </v-tab-item>
              <v-tab-item>
                <div v-if="elementoSelezionatoType === 'DIVISORE'">
                  <v-row>
                    <v-col cols="4" class="py-0 my-0">
                      <v-subheader>Distanza</v-subheader>
                    </v-col>
                    <v-col cols="7" class="py-0 my-0">
                      <v-text-field
                        @change="applicaMC(`${elementoSelezionatoID}.DISTANZA=${$event}`)"
                        suffix="mm"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div v-else>Selezionare un divisore</div>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col>
                    <v-btn @click="ImpostaLuceTelaio_ConLuceVuota">Imposta luce vuota</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn @click="ImpostaLuceTelaio_ConPannello">Inserisci un pannello</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn @click="ImpostaLuceTelaio_ConGrpAnteSTD">Inserisci Grp. Ante STD</v-btn>
                  </v-col>
                </v-row>
                <!-- <div v-if="elementoSelezionatoType === 'DIVISORE'">
                </div>
                <div v-else>Selezionare un divisore</div>-->
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
          <v-card elevation="0" flat>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="green" @click="salva">Salva</v-btn>
              <v-btn text @click="annulla">Annulla</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-container>
    </Panel>
    <v-dialog v-model="showSelectTable" max-width="400">
      <selectTable :rows="tableRows" @onRigaSelezionata="rigaSelezionata" />
    </v-dialog>
  </div>
</template>

<script>
import Panel from '../../components/Containers/Panel'
import { mapState, mapMutations, mapActions } from 'vuex'
import ImmagineDet from '~/components/GestioneRilievo/ImmagineDet'
import ucProprieta from '~/components/GestioneRilievo/ucProprieta'
import selectTable from './selectTable'

export default {
  components: {
    ucProprieta,
    ImmagineDet,
    Panel,
    selectTable
  },
  computed: {
    ...mapState('rilievoDet', ['record'])
  },
  data() {
    return {
      imgWidth: 400,
      imgHeight: 800,
      drawingCommands: '',
      currentTab: 0,
      elementoSelezionatoType: '',
      elementoSelezionatoID: '',
      showSelectTable: false,
      tableRows: [],
      propertySelected: '',
      TINTA: '',
      SERIE: '',
      TIPO_SERRAMENTO: '',
      TIPO_TELAIO: '',
      GRP_NUMERO_ANTE: '',
      GRP_SISTEMA_APERTURA: ''
    }
  },
  mounted() {
    this.imgWidth = this.$refs.mainContent.clientWidth
    this.imgHeight = this.$el.clientHeight / 3
    let pim = window.GPROD.GetPIMSerialized()
    this.drawingCommands = JSON.parse(pim)
  },
  methods: {
    ...mapActions('rilievoDet', ['save']),
    ...mapMutations('rilievoDet', ['setMacroComandi', 'setDrawingCommands']),
    salva() {
      this.setDrawingCommands(this.drawingCommands)
      this.save()
      this.$router.back()
    },
    annulla() {
      this.$router.back()
    },

    ImpostaLuceTelaio_ConLuceVuota() {
      window.GPROD.ImpostaLuceTelaio_ConLuceVuota()
      let pim = window.GPROD.GetPIMSerialized()
      this.drawingCommands = JSON.parse(pim)
    },
    ImpostaLuceTelaio_ConPannello() {
      window.GPROD.ImpostaLuceTelaio_ConPannello
      let pim = window.GPROD.GetPIMSerialized()
      this.drawingCommands = JSON.parse(pim)
    },
    ImpostaLuceTelaio_ConGrpAnteSTD() {
      window.GPROD.ImpostaLuceTelaio_ConGrpAnteSTD
      let pim = window.GPROD.GetPIMSerialized()
      this.drawingCommands = JSON.parse(pim)
    },
    openTable(propName, nomeTabella) {
      this.propertySelected = propName
      let myTable = JSON.parse(window.GPROD.GetTableSerialized(nomeTabella))
      if (myTable) {
        this.tableRows = myTable.JSTableRows
        this.showSelectTable = true
      } else {
        this[this.propertySelected] = 'Nessuna tabella trovata!!'
      }
    },
    rigaSelezionata(row) {
      if (row) {
        if (this.propertySelected.startsWith('GRP_')) {
          let realPropName = this.propertySelected.replace('GRP_', '')
          let comando = `${this.elementoSelezionatoID}.${realPropName}=${row.JSTabRowCodice}`
          this.applicaMC(comando)

          let newValue = window.GPROD.GetPropertyDesc(
            realPropName,
            row.JSTabRowCodice
          )
          this[this.propertySelected] = newValue
        } else {
          this.setProperty(row.JSTabRowCodice)
        }
      }
      this.propertySelected = ''
      this.showSelectTable = false
    },

    setProperty(propValue) {
      let newValue = window.GPROD.SetProperty(this.propertySelected, propValue)
      this[this.propertySelected] = newValue
      let pim = window.GPROD.GetPIMSerialized()
      this.drawingCommands = JSON.parse(pim)
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
    selezionaElemento({ X, Y }) {
      let pimStr = window.GPROD.getPIMSerialized_con_OggettoSelezionato(X, Y)
      let pim = JSON.parse(pimStr)
      this.drawingCommands = pim

      this.elementoSelezionatoID = ''
      this.elementoSelezionatoType = ''

      if (pim.ItemSelezionato && pim.ItemSelezionato.ID) {
        this.elementoSelezionatoID = pim.ItemSelezionato.ID
        // Scorre gli elementi per prendersi il tipo
        for (const el of pim.PIMElements) {
          if (el.ObjID === pim.ItemSelezionato.ID) {
            this.elementoSelezionatoType = el.ObjType.toUpperCase()
          }
        }
      }
    }
    // applicaMod() {
    //   let mc = this.record.macroComandi.replace(/(?:\r\n|\r|\n)/g, '||')
    //   let result = JSON.parse(window.GPROD.setMacroComandi(mc))
    //   if (result.state) {
    //     let mcTotali = JSON.parse(window.GPROD.getMacroComandi()).data
    //     this.setMacroComandi(mcTotali)
    //     this.loadDrawingCommands(mcTotali)
    //   } else {
    //     console.log(result.data)
    //   }
    // },
    // loadDrawingCommands(mc) {
    //   // if (mc) {
    //   //   let mc = this.record.macroComandi.replace(/(?:\r\n|\r|\n)/g, '||')
    //   //   let result = JSON.parse(window.GPROD.setMacroComandi(mc))
    //   //   if (result.state) {
    //   //   } else {
    //   //     console.log(result.data)
    //   //   }
    //   // }

    //   try {
    //     let jsStr = window.GPROD.getDrawingCommands(
    //       this.imgWidth,
    //       this.imgHeight
    //     )

    //     let jsonDataObj = JSON.parse(jsStr)

    //     if (jsonDataObj.state) {
    //       let pmiEl = JSON.parse(jsonDataObj.data)
    //       this.setDrawingCommands(pmiEl)
    //       // let newMC = JSON.parse(window.GPROD.getMacroComandi())

    //       // this.setMacroComandi(newMC.data)
    //       // this.drawingCommands = pmiEl
    //     } else {
    //       throw jsonDataObj.data
    //     }
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  }
}
</script>
