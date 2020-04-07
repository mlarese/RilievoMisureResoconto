<template>
  <v-container class="grey lighten-5">
    <v-row>
      <template>
        <v-col :md="6" :sm="12">
          <v-card >
            <DxButton @click="salva()" text="salva" />
            <DxButton @click="applicaMC()" text="applica MC" />
            <DxButton @click="applicaMod()" text="applica modifica" />
          </v-card>
          <v-spacer></v-spacer>
          <v-card>
            <div>
              <p>elenco delle proprieta</p>
            </div>
          </v-card>
          <v-card >
            <v-textarea
              clearable
              outlined
              name="input-7-1"
              label="macro comandi"
              v-model="record.macroComandi"
            />
          </v-card>
          <v-card >
            <v-textarea
              clearable
              outlined
              name="input-7-1"
              label="Descrizione"
              v-model="record.descrizione"
            />
          </v-card>
        </v-col>
        <v-col :md="6" :sm="12">
          <v-card >
            <ImmagineDet
              :drawingCommands="record.drawingCommands"
              :imgWidth="imgWidth"
              :imgHeight="imgHeight"
            ></ImmagineDet>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { DxButton, DxTextArea } from 'devextreme-vue'

import ImmagineDet from '~/components/GestioneRilievo/ImmagineDet'
import ucProprieta from '~/components/GestioneRilievo/ucProprieta'
import { DxBox, DxItem } from 'devextreme-vue/box'

export default {
  components: {
    ucProprieta,
    ImmagineDet,
    DxBox,
    DxItem,
    DxButton,
    DxTextArea
  },
  computed: {
    ...mapState('rilievoDet', ['record'])
  },
  data() {
    return {
      imgBase64: '',
      imgWidth: 1000,
      imgHeight: 800,
      drawingCommands: ''
    }
  },
  methods: {
    ...mapActions('rilievoDet', ['save']),
    ...mapMutations('rilievoDet', ['setMacroComandi', 'setDrawingCommands']),
    salva: function() {
      this.save()
    },
    applicaMC() {
      window.GPROD.resetStrutturaSerramento()
      this.applicaMod()
    },
    applicaMod() {
      let mc = this.record.macroComandi.replace(/(?:\r\n|\r|\n)/g, '||')
      let result = JSON.parse(window.GPROD.setMacroComandi(mc))
      if (result.state) {
        let mcTotali = JSON.parse(window.GPROD.getMacroComandi()).data
        this.setMacroComandi(mcTotali)
        this.loadDrawingCommands(mcTotali)
      } else {
        console.log(result.data)
      }
    },
    loadDrawingCommands(mc) {
      // if (mc) {
      //   let mc = this.record.macroComandi.replace(/(?:\r\n|\r|\n)/g, '||')
      //   let result = JSON.parse(window.GPROD.setMacroComandi(mc))
      //   if (result.state) {          
      //   } else {
      //     console.log(result.data)
      //   }
      // }

      try {
        let jsStr = window.GPROD.getDrawingCommands(
          this.imgWidth,
          this.imgHeight
        )

        let jsonDataObj = JSON.parse(jsStr)

        if (jsonDataObj.state) {
          let pmiEl = JSON.parse(jsonDataObj.data)
          this.setDrawingCommands(pmiEl)
          // let newMC = JSON.parse(window.GPROD.getMacroComandi())

          // this.setMacroComandi(newMC.data)
          // this.drawingCommands = pmiEl
        } else {
          throw jsonDataObj.data
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
