<template>
  <div>
    <div>
      <DxButton @click="applicaMC" text="applica MC" />
      <DxButton @click="applicaMod" text="applica modifica" />
      <DxTextArea
        :height="90"
        :read-only="false"
        :value.sync="record.macroComandi"
      />
    </div>
    <div>
      <!-- <v-img :src="imgBase64" width="600" height="600" /> -->
      <ImmagineDet
        :drawingCommands="getDrawingCommands(record.macroComandi)"
        :imgWidth="imgWidth"
        :imgHeight="imgHeight"
      ></ImmagineDet>
    </div>
  </div>
</template>

<script>
import { DxButton, DxTextArea } from 'devextreme-vue'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import ImmagineDet from '~/components/GestioneRilievo/ImmagineDet'

export default {
  components: {
    DxButton,
    DxTextArea,
    ImmagineDet
  },
  computed: {
    ...mapGetters('rilievoDet', ['immagineProdotto']),
    ...mapState('rilievoDet', ['record'])
  },
  data() {
    return {
      macroComando: 'MACRO:DEMO1',
      imgBase64: '',
      imgWidth: 600,
      imgHeight: 600,
      drawingCommands: ''
    }
  },
  methods: {
    ...mapMutations('rilievoDet', ['setMacroComandi']),
    applicaMC() {
      window.GPROD.resetStrutturaSerramento()
      applicaMod()
    },
    applicaMod() {
      let result = JSON.parse(window.GPROD.setMacroComandi(this.macroComando))
      if (result.state) {
        this.setMacroComandi(window.GPROD.getMacroComandi())
      } else {
        console.log(result.data)
      }
    },
    getDrawingCommands(mc) {
      try {
        let jsStr = window.GPROD.getDrawingCommands(
          this.imgWidth,
          this.imgHeight
        )

        let jsonDataObj = JSON.parse(jsStr)

        if (jsonDataObj.state) {
          let pmiEl = JSON.parse(jsonDataObj.data)
          return pmiEl
          // let newMC = JSON.parse(window.GPROD.getMacroComandi())

          // this.setMacroComandi(newMC.data)
          // this.drawingCommands = pmiEl
        } else {
          throw jsonDataObj.data
        }
      } catch (e) {
        console.log(e)
      }
    },

    _getDrawingCommands: function(jsonData) {
      let c = document.createElement('canvas')
      c.width = this.imgWidth
      c.height = this.imgHeight
      //console.log(jsonData)
      // Tipo di disegno
      // DL=DrawLine; DR=DrawRectangle; DS=DrawString; DI=DrawImage; DP=FillPolygon;

      let ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)

      for (let indx in jsonData.PIMElements) {
        let element = jsonData.PIMElements[indx]
        let elencoCMD = element.DrawingCommands
        let penWidth = element.PenWidth
        let penColor = element.ForeColor
        let backColor = element.BackColor
        let objType = element.ObjType

        if (objType == 'Divisore') {
          let a = 1
        }

        for (let i in elencoCMD) {
          let DrawCommand = elencoCMD[i]

          let punti = DrawCommand.Points

          if (!punti) {
            continue
          }

          let startPoint = punti[0]
          let endPoint = punti[punti.length - 1]

          ctx = c.getContext('2d')

          switch (DrawCommand.DrawType) {
            case 'DL':
              // DL=DrawLine
              if (penWidth > 0) {
                ctx.lineWidth = penWidth
                ctx.strokeStyle = this.toColor(penColor)
                ctx.moveTo(startPoint.X, startPoint.Y)
                ctx.lineTo(endPoint.X, endPoint.Y)
                ctx.stroke()
              }

              break
            case 'DR':
              // DrawRectangle

              console.log(DrawCommand)
              ctx.beginPath()
              ctx.fillStyle = this.toColor(backColor)
              ctx.fillRect(
                startPoint.X,
                startPoint.Y,
                endPoint.X - startPoint.X,
                endPoint.Y - startPoint.Y
              )
              ctx.stroke()

              break
            case 'DS':
              // DrawString
              break
            case 'DI':
              // DrawImage
              break
            case 'DP':
              // FillPolygon

              let region = new Path2D()
              ctx.lineWidth = penWidth
              ctx.strokeStyle = this.toColor(penColor)
              region.moveTo(startPoint.X, startPoint.Y)

              let index
              for (index = 1; index < punti.length; index++) {
                region.lineTo(punti[index].X, punti[index].Y)
              }

              region.closePath()

              // Fill path
              ctx.fillStyle = this.toColor(backColor)
              ctx.fill(region, 'evenodd')

              break
            default:
            // null
          }
        }
        console.log('finito')
      }
      this.imgBase64 = c.toDataURL()
    },
    toColor(num) {
      num >>>= 0
      var b = num & 0xff,
        g = (num & 0xff00) >>> 8,
        r = (num & 0xff0000) >>> 16,
        a = ((num & 0xff000000) >>> 24) / 255
      return 'rgba(' + [r, g, b, a].join(',') + ')'
    }
  }
}

// selezionaOggetto: function(evt) {
//   let c = document.getElementById('myCanvas')
//   var rect = c.getBoundingClientRect()

//   let x = evt.clientX - rect.left
//   let y = evt.clientY - rect.top
//   let jsonDataString = window.GestoreImmagini.getDrawingCommands(
//     '',
//     c.width,
//     c.height,
//     x,
//     y
//   )
//   let jsonData = JSON.parse(jsonDataString)
//   this.generaIMG(jsonData)
// },
</script>
