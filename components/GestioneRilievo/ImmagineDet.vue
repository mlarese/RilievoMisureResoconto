<template>
  <div>
    <v-img
      :src="getIMG_base64(drawingCommands)"
      ref="ucIMG"
      :width="imgWidth"
      :height="imgHeight"
      @click="clickEvent"
      class="pa-0 ma-0"
    ></v-img>
    <!-- <canvas id="mycanvas"></canvas>
    <v-img :src="getIMG_base64(drawingCommands)" ref="ucIMG" contain></v-img>-->
  </div>
</template>

<script>
export default {
  props: {
    drawingCommands: { default: '' },
    imgWidth: { default: 200 },
    imgHeight: { default: 200 },
    ignoraQuote: { type: Boolean, default: true },
    EsclusiEvidenziati: { type: Boolean, default: true }
  },
  data() {
    return {
      fattoreScala: 1,
      P0bitmapX: 0,
      P0bitmapY: 0
    }
  },
  methods: {
    clickEvent(e) {
      let ImagePoint = {
        X: e.clientX - this.$refs.ucIMG.$el.getBoundingClientRect().left , //+ 12 è il padding del container......
        Y: e.clientY - this.$refs.ucIMG.$el.getBoundingClientRect().top
      }
      // let ImagePoint = {
      //   X: e.pageX - e.offsetX,
      //   Y: e.pageY - e.offsetY
      // }
      let RealPoint = this.getRealPoint(ImagePoint)
      let a = this.$refs.ucIMG.$el.getBoundingClientRect().left
      this.$emit('onImageClick', RealPoint)
    },
    impostaGestoreCoordinate(PIMElements) {
      // Per ottenere il fattore di scala deve determinare gli estremi dell'immagine
      let Xmax = 0
      let Xmin = 0
      let Ymax = 0
      let Ymin = 0
      for (const element of PIMElements) {
        if (!Xmin || Xmin > element.InfoDis_XMin) {
          Xmin = element.InfoDis_XMin
        }
        if (!Xmax || Xmax < element.InfoDis_XMax) {
          Xmax = element.InfoDis_XMax
        }
        if (!Ymin || Ymin > element.InfoDis_YMin) {
          Ymin = element.InfoDis_YMin
        }
        if (!Ymax || Ymax < element.InfoDis_YMax) {
          Ymax = element.InfoDis_YMax
        }
      }

      // Imposta i margini
      let margineSX = this.imgWidth / 20
      let margineTOP = this.imgHeight / 20
      let margineBOTTOM = this.imgHeight / 20

      let ScalaX = (Xmax - Xmin) / (this.imgWidth - margineSX * 2)
      let ScalaY = (Ymax - Ymin) / (this.imgHeight - margineTOP - margineBOTTOM)

      this.fattoreScala = Math.max(ScalaX, ScalaY)

      let l = (Xmax - Xmin) / this.fattoreScala
      this.P0bitmapX = margineSX - Xmin / this.fattoreScala
      this.P0bitmapY = this.imgHeight - margineBOTTOM + Ymin / this.fattoreScala
    },
    getImagePoint(RealPoint) {
      let p = {
        X: RealPoint.X / this.fattoreScala + this.P0bitmapX,
        Y: -RealPoint.Y / this.fattoreScala + this.P0bitmapY
      }
      return p
    },
    getRealPoint(ImagePoint) {
      let p = {
        X: (ImagePoint.X - this.P0bitmapX) * this.fattoreScala,
        Y: -(ImagePoint.Y - this.P0bitmapY) * this.fattoreScala
      }
      return p
    },
    getIMG_base64(PIM) {
      if (!PIM) {
        return
      }
      
      let c = document.createElement('canvas')
      // let c = document.getElementById('mycanvas')
      c.width = this.imgWidth
      c.height = this.imgHeight

      this.impostaGestoreCoordinate(PIM.PIMElements)
      let ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)

      this.disegnaSuImmagineEsistente(c, PIM.PIMElements)

      // Evidenzia eventuali elementi
      if (!this.EsclusiEvidenziati) {
        this.disegnaSuImmagineEsistente(c, PIM.PIMElementsHL)
      }

      let img = c.toDataURL()
      // console.log(img)
      return img
    },

    disegnaSuImmagineEsistente(c, PIMElements) {
      for (const element of PIMElements) {
        let elencoCMD = element.DrawCmds
        let penWidth = element.PenWidth
        let penColor = element.ForeColor
        let backColor = element.BackColor
        let ObjID = element.ObjID
        let startPoint = 0
        let endPoint = 0

        if (this.ignoraQuote) {
          if (element.ElType === 'QU') {
            continue
          }
        }

        let ctx = c.getContext('2d')
        let isPath = false
        for (const DrawCommand of elencoCMD) {
          switch (DrawCommand.DrawType) {
            case 'BGP':
              // INIZIO sequenza del path
              isPath = true
              ctx.beginPath()
              ctx.fillStyle = this.toColor(backColor)
              ctx.lineWidth = penWidth
              ctx.strokeStyle = this.toColor(penColor)
              break

            case 'CGP':
              // FINE sequenza del path
              isPath = false
              ctx.fill()
              ctx.stroke()
              ctx.closePath()
              break

            case 'DL':
              // DL=DrawLine
              startPoint = this.getImagePoint(DrawCommand.Points[0])
              endPoint = this.getImagePoint(DrawCommand.Points[1])

              if (!isPath) {
                ctx.beginPath()
                ctx.fillStyle = this.toColor(backColor)
                ctx.lineWidth = penWidth
                ctx.strokeStyle = this.toColor(penColor)
                ctx.moveTo(startPoint.X, startPoint.Y)
              }

              ctx.lineWidth = penWidth
              ctx.strokeStyle = this.toColor(penColor)
              ctx.lineTo(endPoint.X, endPoint.Y)

              if (!isPath) {
                ctx.stroke()
                ctx.closePath()
              }

              break
            case 'DR':
              // DrawRectangle

              startPoint = this.getImagePoint(DrawCommand.Points[0])
              endPoint = this.getImagePoint(DrawCommand.Points[1])

              ctx.lineWidth = penWidth
              ctx.strokeStyle = this.toColor(penColor)
              ctx.fillStyle = this.toColor(backColor)
              ctx.beginPath()

              ctx.rect(
                startPoint.X,
                startPoint.Y,
                endPoint.X - startPoint.X,
                endPoint.Y - startPoint.Y
              )
              ctx.closePath()
              ctx.fill()
              ctx.stroke()

              break
            case 'DS':
              // DrawString
              let x = 0
              let y = 0

              if (DrawCommand.Points.length == 2) {
                let P0 = this.getImagePoint(DrawCommand.Points[0])
                let P1 = this.getImagePoint(DrawCommand.Points[1])

                let MyPoint_X = 0
                let MyPoint_Y = 0
                let dx,
                  dy = 0

                if (P0.X > P1.X) {
                  MyPoint_X = P1.X
                  dx = P0.X - P1.X
                } else {
                  MyPoint_X = P0.X
                  dx = P1.X - P0.X
                }

                if (P0.Y > P1.Y) {
                  MyPoint_Y = P1.Y
                  dy = P0.Y - P1.Y
                } else {
                  MyPoint_Y = P0.Y
                  dy = P1.Y - P0.Y
                }

                x = MyPoint_X + dx / 2
                y = MyPoint_Y + dy / 2
              } else {
                let P0 = this.getImagePoint(DrawCommand.Points[0])
                x = P0.X
                y = P0.Y
              }

              if (DrawCommand.TextDir === 'V') {
                ctx.rotate(Math.PI / 2)
              }
              ctx.textBaseline = 'middle'
              ctx.textAlign = 'center'
              ctx.fillStyle = 'blue'
              ctx.font = DrawCommand.FontSize / this.fattoreScala + 'px Arial'

              ctx.fillText(DrawCommand.Text, x, y)

              if (DrawCommand.TextDir === 'V') {
                ctx.rotate(-(Math.PI / 2))
              }

              break
            case 'DI':
              // DrawImage
              break
            case 'DP':
              // FillPolygon
              startPoint = this.getImagePoint(DrawCommand.Points[0])

              ctx.beginPath()
              ctx.lineWidth = penWidth
              ctx.strokeStyle = this.toColor(penColor)
              ctx.fillStyle = this.toColor(backColor)

              ctx.moveTo(startPoint.X, startPoint.Y)

              const punti = DrawCommand.Points
              let index
              for (index = 1; index < punti.length; index++) {
                let myP = this.getImagePoint(punti[index])
                ctx.lineTo(myP.X, myP.Y)
              }

              ctx.closePath()

              // Fill path
              ctx.fill()
              ctx.stroke()
              break
            default:
              null
          }
        }
        // console.log('finito')
      }
    },

    toColor(num) {
      num >>>= 0
      var b = num & 0xff,
        g = (num & 0xff00) >>> 8,
        r = (num & 0xff0000) >>> 16,
        a = (((num & 0xff000000) >>> 24) / 255).toFixed(1)
      return 'rgba(' + [r, g, b, a].join(',') + ')'
    },
    drawArrowhead(context, from, to, radius) {
      var x_center = to.x
      var y_center = to.y

      var angle
      var x
      var y

      context.beginPath()

      angle = Math.atan2(to.y - from.y, to.x - from.x)
      x = radius * Math.cos(angle) + x_center
      y = radius * Math.sin(angle) + y_center

      context.moveTo(x, y)

      angle += (1.0 / 3.0) * (2 * Math.PI)
      x = radius * Math.cos(angle) + x_center
      y = radius * Math.sin(angle) + y_center

      context.lineTo(x, y)

      angle += (1.0 / 3.0) * (2 * Math.PI)
      x = radius * Math.cos(angle) + x_center
      y = radius * Math.sin(angle) + y_center

      context.lineTo(x, y)

      context.closePath()

      context.fill()
    }
  }
}
</script>
