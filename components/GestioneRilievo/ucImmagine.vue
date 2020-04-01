<template>
  <div>
    <div>
      <DxButton @click="applicaMC" text="genera img" />
      <DxButton @click="cleanIMG" text="clean" />
      <DxTextArea :height="90" :read-only="false" :value.sync="macroComando" />
    </div>
    <div>
      <canvas
        @click="selezionaOggetto"
        id="myCanvas"
        width="200"
        height="200"
        style="border:1px solid #000000;"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { DxButton, DxTextArea } from 'devextreme-vue'

export default {
  components: {
    DxButton,
    DxTextArea
  },
  data() {
    return {
      macroComando: 'MACRO:DEMO1'
    }
  },
  methods: {
    cleanIMG: function(event) {
      let c = document.getElementById('myCanvas')
      let ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)
    },
    applicaMC: function(evet) {
      let c = document.getElementById('myCanvas')
      let jsonDataString = window.GestoreImmagini.getDrawingCommands(
        this.macroComando,
        c.width,
        c.height,
        -1,
        -1
      )
      let jsonData = JSON.parse(jsonDataString)
      this.generaIMG(jsonData)
    },
    selezionaOggetto: function(evt) {
      let c = document.getElementById('myCanvas')
      var rect = c.getBoundingClientRect()

      let x = evt.clientX - rect.left
      let y = evt.clientY - rect.top
      let jsonDataString = window.GestoreImmagini.getDrawingCommands(
        '',
        c.width,
        c.height,
        x,
        y
      )
      let jsonData = JSON.parse(jsonDataString)
      this.generaIMG(jsonData)
    },
    generaIMG: function(jsonData) {
      let c = document.getElementById('myCanvas')

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

        if (objType == 'Divisore'){
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
              ctx.beginPath();
              ctx.fillStyle = this.toColor(backColor)
              ctx.fillRect(startPoint.X, startPoint.Y, endPoint.X - startPoint.X, endPoint.Y - startPoint.Y);
              ctx.stroke();

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
</script>
