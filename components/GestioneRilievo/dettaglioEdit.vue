<template>
  <Panel>
    <v-container class="grey lighten-5" slot="mainContent" ref="mainContent">
      <ImmagineDet
        @onImageClick="selezionaElemento"
        :drawingCommands="drawingCommands"
        :imgWidth="imgWidth"
        :imgHeight="imgHeight"
        :ignoraQuote="false"
        :EsclusiEvidenziati="false"
      ></ImmagineDet>
      <v-container fluid>
        <v-row>
          <v-col cols="4" class="pa-0 ma-0">
            <v-subheader>Larghezza</v-subheader>
          </v-col>
          <v-col cols="8" class="pa-0 ma-0">
            <v-text-field value="1000" suffix="mm" @change="applicaMC(`L=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="pa-0 ma-0">
            <v-subheader>Altezza DX</v-subheader>
          </v-col>
          <v-col cols="8" class="pa-0 ma-0">
            <v-text-field value="1000" suffix="mm" @change="applicaMC(`H_DX=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="pa-0 ma-0">
            <v-subheader>Altezza SX</v-subheader>
          </v-col>
          <v-col cols="8" class="pa-0 ma-0">
            <v-text-field value="1000" suffix="mm" @change="applicaMC(`H_SX=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="pa-0 ma-0">
            <v-subheader>Corda</v-subheader>
          </v-col>
          <v-col cols="8" class="pa-0 ma-0">
            <v-text-field disabled value="1000" suffix="mm" @change="applicaMC(`CORDA=${$event}`)"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </Panel>
</template>

<script>
import Panel from '../../components/Containers/Panel'
import { mapState, mapMutations, mapActions } from 'vuex'
import ImmagineDet from '~/components/GestioneRilievo/ImmagineDet'
import ucProprieta from '~/components/GestioneRilievo/ucProprieta'

export default {
  components: {
    ucProprieta,
    ImmagineDet,
    Panel
  },
  computed: {
    ...mapState('rilievoDet', ['record'])
  },
  data() {
    return {
      imgWidth: 400,
      imgHeight: 400,
      drawingCommands: '',
      macroComandi: 'L=2000'
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
      this.save()
      this.$router.back()
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
      let pim = window.GPROD.getPIMSerialized_con_OggettoSelezionato(X, Y)
      this.drawingCommands = JSON.parse(pim)
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
