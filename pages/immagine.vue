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
        width="600"
        height="600"
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
      let ctx = this.c.getContext('2d')
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
      let elencoCMD = jsonData.DrawingCommands
      console.log(jsonData.Image_W)
      // Tipo di disegno
      // DL=DrawLine; DR=DrawRectangle; DS=DrawString; DI=DrawImage; FP=FillPolygon;

      let ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)

      for (let i in elencoCMD) {
        let DrawCommand = elencoCMD[i]

        let punti = DrawCommand.Points
        let startPoint = punti[0]
        let endPoint = punti[punti.length - 1]

        ctx = c.getContext('2d')

        switch (DrawCommand.DrawType) {
          case 'DL':
            // DL=DrawLine
            if (DrawCommand.PenWidth > 0) {
              ctx.lineWidth = DrawCommand.PenWidth
              ctx.strokeStyle = this.toColor(DrawCommand.PenColor)
              ctx.moveTo(startPoint.X, startPoint.Y)
              ctx.lineTo(endPoint.X, endPoint.Y)
              ctx.stroke()
            }
            break
          case 'DR':
            // DrawRectangle

            // ctx.beginPath();
            // ctx.rect(20, 20, 150, 100);
            // ctx.stroke();

            break
          case 'DS':
            // DrawString
            break
          case 'DI':
            // DrawImage
            break
          case 'FP':
            // FillPolygon

            let region = new Path2D()
            ctx.lineWidth = DrawCommand.PenWidth
            ctx.strokeStyle = this.toColor(DrawCommand.PenColor)
            region.moveTo(startPoint.X, startPoint.Y)

            let index
            for (index = 1; index < punti.length; index++) {
              region.lineTo(punti[index].X, punti[index].Y)
            }

            region.closePath()

            // Fill path
            ctx.fillStyle = this.toColor(DrawCommand.BackColor)
            ctx.fill(region, 'evenodd')

            break
          default:
          // null
        }
      }
      console.log('finito')
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
