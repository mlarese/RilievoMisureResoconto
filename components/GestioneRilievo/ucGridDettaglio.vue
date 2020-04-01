<template>
  <div>
    <DxDataGrid
    ref="dgvDetRefKey"
      :data-source="listaDettagli"
      :show-borders="true"
      :showColumnHeaders="false"
      row-template="dataRowTemplate"
    >
      <template #dataRowTemplate="rowInfo">
        <tbody v-if="rowInfo.data.data.RifPosID == templateData.key._id">
          <tr>
            <td>
              <div>
                <DxButton
                  @click="onEdit(cell)"
                  icon="edit"
                  hint="Modifica lavoro"
                />
                <DxButton
                  @click="onDelete(cell)"
                  icon="trash"
                  hint="Cancella lavoro"
                />
              </div>
            </td>
            <td>
              <img :src="getIMG_base64(rowInfo.data.data.drawingCMD)" />
            </td>
            <td>
              {{ rowInfo.data.data.Descrizione }}
            </td>
          </tr>
        </tbody>
      </template>
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxEditing } from 'devextreme-vue/data-grid'
import ArrayStore from 'devextreme/data/array_store'
import DataSource from 'devextreme/data/data_source'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ucIMG from '~/components/GestioneRilievo/ucIMGViewer'

export default {
  components: { DxDataGrid, DxColumn, DxEditing, ucIMG },
  props: {
    templateData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('rilievoDet', ['listaDettagli']),
    dataGrid: function() {
      return this.$refs['dgvDetRefKey'].instance
    }
  },
  // data() {
  //   return {
  //     dataSource: this.getTasks(this.templateData.key._id)
  //   }
  // },
   methods: {
    // getTasks(key) {
    //     return new DataSource({
    //       store: new ArrayStore({
    //         data: this.listaDettagli,
    //         key: '_id'
    //       }),
    //       filter: ['RifPosID', '=', key]
    //     })
      
    // },
    filtraPerPosizioneID(){
      this.dataGrid.filter(['RifPosID', '=', this.templateData.key._id])
    },
    getIMG_base64(rowData) {
      if (rowData) {
        return generaIMG(rowData)
      }
    }
  },
  mounted(){
    this.filtraPerPosizioneID()
  }
}

function generaIMG(jsonData) {
  let c = document.createElement('canvas')
  c.width = 200
  c.height = 200

  // let c = document.getElementById('canvas')

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

          // console.log(DrawCommand)
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
    // console.log('finito')
  }
  let img = c.toDataURL()
  // console.log(img)
  return img
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
