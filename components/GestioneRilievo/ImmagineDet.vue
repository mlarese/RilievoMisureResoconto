<template>
  <v-img :src="getIMG_base64(macroComandi)" ref="ucIMG"></v-img>
</template>

<script>
export default {
  props: { macroComandi: { default: '' } },

  methods: {
    getIMG_base64(mc) {
      if (!mc) {
        return
      }
      
      let c = document.createElement('canvas')
      c.width = 200 //this.$refs.ucIMG.width
      c.height = 200 //this.$refs.ucIMG.height
      let jsonData = {}
      try {
        window.GestoreImmagini.resetStrutturaSerramento()
        let jsonDataString = window.GestoreImmagini.getDrawingCommands(
          mc,
          c.width,
          c.width
        )

        let jsonDataObj = JSON.parse(jsonDataString)

        if (jsonDataObj.state) {
          jsonData = JSON.parse(jsonDataObj.data)

          //this.generaIMG(pmiEl)
        } else {
          throw jsonDataObj.data
        }
      } catch (e) {
        console.log(e)
      }

      if (!jsonData) {
        return
      }

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

              // console.log(DrawCommand)
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
              null
          }
        }
        // console.log('finito')
      }
      let img = c.toDataURL()
      // console.log(img)
      return img
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
