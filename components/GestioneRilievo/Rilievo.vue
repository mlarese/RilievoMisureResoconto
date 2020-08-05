<template>
  <div>
    <Panel>
      <div slot="toolbarTitle">
        <div v-if="$vuetify.breakpoint.xsOnly">
          <b>{{ record.descrizione }}</b>
          <v-spacer></v-spacer>
        </div>
        <div v-else>
          Gestione rilievo
        </div>
      </div>
      <v-btn
        icon
        class="mr-1"
        @click="openEditForm()"
        slot="panelToolbarRight"
        v-if="$vuetify.breakpoint.xsOnly"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <div slot="mainContent">
        <div v-if="$vuetify.breakpoint.smAndUp">
          <p>{{ record.descrizione }}</p>
          <v-divider></v-divider>
        </div>

        <v-tabs centered>
          <v-tab>FORI</v-tab>
          <v-tab>SCHEDE</v-tab>
          <v-tab>DOCS</v-tab>
          <v-tab>FOTO</v-tab>

          <v-tab-item
            :class="
              $vuetify.breakpoint.xsOnly
                ? 'tabs__content_small'
                : 'tabs__content_large'
            "
          >
            <v-container>
              <v-btn
                rounded
                color="primary"
                dark
                small
                @click="addPos()"
                class="ma-2"
              >
                posizione<v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-row
                v-for="pos in listaPosizioni"
                :key="pos._id"
                class="pa-0 ma-0"
              >
                <v-col cols="12" sm="6" offset-sm="3">
                  <v-card>
                    <v-card-title class="blue white--text py-1">
                      <span class="headline">{{ pos.posizioneDesc }}</span>

                      <v-spacer></v-spacer>

                      <v-menu bottom left>
                        <template v-slot:activator="{ on }">
                          <v-btn dark icon v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item>
                            <v-list-item-title>Modifica</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title>Duplica</v-list-item-title>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title>Elimina</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-card-title>

                    <div v-for="det in listaDettagli" :key="det._id">
                      <v-col
                        v-if="det.RifPosID == pos._id"
                        cols="12"
                        @click="apriDettaglio(det._id)"
                      >
                        <v-card>
                          <div class="d-flex flex-no-wrap ">
                            <v-avatar size="125" tile>
                              <!-- <v-img :src="getIMG_base64(det.macroComandi)"></v-img> -->
                              <ImmagineDet
                                :drawingCommands="det.drawingCommands"
                                :imgWidth="imgWidth"
                                :imgHeight="imgHeight"
                              ></ImmagineDet>
                            </v-avatar>
                            <div>
                              <v-card-title v-text="det.descrizione">
                                <v-spacer></v-spacer>
                                <v-menu bottom left>
                                  <template v-slot:activator="{ on }">
                                    <v-btn dark icon v-on="on">
                                      <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-list>
                                    <v-list-item>
                                      <v-list-item-title
                                        >Modifica</v-list-item-title
                                      >
                                    </v-list-item>
                                    <v-list-item>
                                      <v-list-item-title
                                        >Duplica</v-list-item-title
                                      >
                                    </v-list-item>
                                    <v-list-item>
                                      <v-list-item-title
                                        >Elimina</v-list-item-title
                                      >
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </v-card-title>

                              <v-card-subtitle
                                v-text="det.Descrizione"
                              ></v-card-subtitle>
                            </div>
                          </div>
                        </v-card>
                      </v-col>
                    </div>
                    <v-card-actions>
                      <v-btn
                        rounded
                        color="success"
                        dark
                        absolute
                        fab
                        small
                        bottom
                        right
                        @click="addDettaglio(pos._id)"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </div>
    </Panel>
    <popupPosEdit ref="popupPosEdit" />


    <v-dialog
      :value="showArticoloSelection"
      
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="700px"
    >
    <selezioneArticoli />
    </v-dialog>
  </div>
</template>

<style scoped>
.tabs__content_small {
  height: calc(100vh - 110px);
  overflow: auto;
}
.tabs__content_large {
  min-height: 200px;
  max-height: calc(100vh - 250px);
  overflow: auto;
}
</style>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ImmagineDet from '~/components/GestioneRilievo/ImmagineDet'
import popupPosEdit from '../../components/GestioneRilievo/posizioneEdit'
import Panel from '../Containers/Panel'
import selezioneArticoli from './selezioneArticoli'

export default {
  components: {
    ImmagineDet,
    popupPosEdit,
    Panel,
    selezioneArticoli
  },
  props: [],
  computed: {
    ...mapState('rilievo', ['listaPosizioni']),
    ...mapState('rilievo', ['listaDettagli']),
    ...mapState('rilievo', ['record']),
    ...mapGetters('rilievo', ['formTitle', 'isEdit', 'isAdd', 'isView'])
  },
  data() {
    return {
      imgWidth: 1000,
      imgHeight: 800,
      showArticoloSelection: false
    }
  },
  methods: {
    ...mapMutations('rilievoDet', { setRecordRilievoDet: 'setRecord' }),
    ...mapMutations('rilievoPos', ['setRecord']),
    ...mapActions('rilievoPos', { saveRow: 'save', deleteRow: 'deleteByID' }),
    ...mapActions('rilievo', { saveRilievo: 'save' }),
    ...mapMutations('rilievo', ['setViewMode']),
    salvaModifiche(){
      this.saveRilievo()
      this.setViewMode()
    },
    annullaModifiche(){
      this.setViewMode()
    },
    addPos() {
      this.$refs.popupPosEdit.open('Nuova posizione', '', 1).then((data) => {
        if (data) {
          this.insertRow(data)
        }
      })
    },
    insertRow(data) {
      let newPos = {}
      newPos.posizioneDesc = data.NomePosizione
      newPos.PosQta = data.QtaPosizione
      newPos.rilievoID = this.record._id
      this.setRecord(newPos)
      this.saveRow()
    },
    updateRow({ data }) {
      console.log(data)
      this.setRecord(data)
      this.saveRow()
    },
    removeRow({ data }) {
      console.log(data._id)
      this.deleteRow(data._id)
    },
    addDettaglio(posID){
      this.showArticoloSelection = true
    },
    _addDettaglio(posID) {
      let newDettaglio = {
        rilievoID: this.record._id,
        RifPosID: posID,
        macroComandi: 'MACRO:DEMO1'
      }
      this.setRecordRilievoDet(newDettaglio)
      this.$router.push(`/dettaglio/add`)
    },
    apriDettaglio(id) {
      this.$router.push(`/dettaglio/${id}`)
    },
    _getDrawingCommands(mc) {
      // Ottiene i drawing commands
      let drawingCommands = {}
      try {
        let result = {}
        window.GPROD.resetStrutturaSerramento()

        result = JSON.parse(window.GPROD.setMacroComandi(mc))
        if (!result.state) {
          throw result.data
        }

        let jsonDataString = window.GPROD.getDrawingCommands(
          this.imgWidth,
          this.imgHeight
        )

        let jsonDataObj = JSON.parse(jsonDataString)

        if (jsonDataObj.state) {
          drawingCommands = JSON.parse(jsonDataObj.data)
        } else {
          throw jsonDataObj.data
        }
      } catch (e) {
        console.log(e)
      }

      return drawingCommands
    }
  }
}

// function generaIMG(mc) {
//   let c = document.createElement('canvas')
//   c.width = 200
//   c.height = 200
//   let jsonData = {}
//   try {
//     window.GestoreImmagini.resetStrutturaSerramento()
//     let jsonDataString = window.GestoreImmagini.getDrawingCommands(
//       mc,
//       c.width,
//       c.width
//     )

//     let jsonDataObj = JSON.parse(jsonDataString)

//     if (jsonDataObj.state) {
//       jsonData = JSON.parse(jsonDataObj.data)

//       //this.generaIMG(pmiEl)
//     } else {
//       throw jsonDataObj.data
//     }
//   } catch (e) {
//     console.log(e)
//   }

//   if (!jsonData){
//     return
//   }

//   // let c = document.getElementById('canvas')

//   //console.log(jsonData)
//   // Tipo di disegno
//   // DL=DrawLine; DR=DrawRectangle; DS=DrawString; DI=DrawImage; DP=FillPolygon;

//   let ctx = c.getContext('2d')
//   ctx.clearRect(0, 0, c.width, c.height)

//   for (let indx in jsonData.PIMElements) {
//     let element = jsonData.PIMElements[indx]
//     let elencoCMD = element.DrawingCommands
//     let penWidth = element.PenWidth
//     let penColor = element.ForeColor
//     let backColor = element.BackColor
//     let objType = element.ObjType

//     if (objType == 'Divisore') {
//       let a = 1
//     }

//     for (let i in elencoCMD) {
//       let DrawCommand = elencoCMD[i]

//       let punti = DrawCommand.Points

//       if (!punti) {
//         continue
//       }

//       let startPoint = punti[0]
//       let endPoint = punti[punti.length - 1]

//       ctx = c.getContext('2d')

//       switch (DrawCommand.DrawType) {
//         case 'DL':
//           // DL=DrawLine
//           if (penWidth > 0) {
//             ctx.lineWidth = penWidth
//             ctx.strokeStyle = toColor(penColor)
//             ctx.moveTo(startPoint.X, startPoint.Y)
//             ctx.lineTo(endPoint.X, endPoint.Y)
//             ctx.stroke()
//           }

//           break
//         case 'DR':
//           // DrawRectangle

//           // console.log(DrawCommand)
//           ctx.beginPath()
//           ctx.fillStyle = toColor(backColor)
//           ctx.fillRect(
//             startPoint.X,
//             startPoint.Y,
//             endPoint.X - startPoint.X,
//             endPoint.Y - startPoint.Y
//           )
//           ctx.stroke()

//           break
//         case 'DS':
//           // DrawString
//           break
//         case 'DI':
//           // DrawImage
//           break
//         case 'DP':
//           // FillPolygon

//           let region = new Path2D()
//           ctx.lineWidth = penWidth
//           ctx.strokeStyle = toColor(penColor)
//           region.moveTo(startPoint.X, startPoint.Y)

//           let index
//           for (index = 1; index < punti.length; index++) {
//             region.lineTo(punti[index].X, punti[index].Y)
//           }

//           region.closePath()

//           // Fill path
//           ctx.fillStyle = toColor(backColor)
//           ctx.fill(region, 'evenodd')

//           break
//         default:
//           null
//       }
//     }
//     // console.log('finito')
//   }
//   let img = c.toDataURL()
//   // console.log(img)
//   return img
// }

// function toColor(num) {
//   num >>>= 0
//   var b = num & 0xff,
//     g = (num & 0xff00) >>> 8,
//     r = (num & 0xff0000) >>> 16,
//     a = ((num & 0xff000000) >>> 24) / 255
//   return 'rgba(' + [r, g, b, a].join(',') + ')'
// }
</script>
