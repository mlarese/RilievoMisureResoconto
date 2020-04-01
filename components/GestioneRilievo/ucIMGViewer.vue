<template>
  <canvas
    id="myCanvas"
    width="200"
    height="200"
    style="border:1px solid #000000;"
  ></canvas>
</template>

<script>
export default {
  props: {
    drawingCMD: {
      type: Object,
      default: () => ''
    }
  },
  watch: {
    drawingCMD: function(newVal, oldVal) {
      // watch it
      if (newVal) {
        generaIMG(newVal)
      }
    }
  },
  mounted: function() {
    generaIMG(this.drawingCMD)
  }
}

function generaIMG(jsonData) {
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
            ctx.strokeStyle = toColor(penColor)
            ctx.moveTo(startPoint.X, startPoint.Y)
            ctx.lineTo(endPoint.X, endPoint.Y)
            ctx.stroke()
          }

          break
        case 'DR':
          // DrawRectangle

          console.log(DrawCommand)
          ctx.beginPath()
          ctx.fillStyle = toColor(backColor)
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
          ctx.strokeStyle = toColor(penColor)
          region.moveTo(startPoint.X, startPoint.Y)

          let index
          for (index = 1; index < punti.length; index++) {
            region.lineTo(punti[index].X, punti[index].Y)
          }

          region.closePath()

          // Fill path
          ctx.fillStyle = toColor(backColor)
          ctx.fill(region, 'evenodd')

          break
        default:
        // null
      }
    }
    console.log('finito')
  }
}

function toColor(num) {
  num >>>= 0
  var b = num & 0xff,
    g = (num & 0xff00) >>> 8,
    r = (num & 0xff0000) >>> 16,
    a = ((num & 0xff000000) >>> 24) / 255
  return 'rgba(' + [r, g, b, a].join(',') + ')'
}
</script>
