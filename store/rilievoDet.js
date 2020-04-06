import _clone from 'lodash/clone'

const root = { root: true }
export const state = () => {
  return {
    record: {
      rilievoID: 0,
      RifPosID: 0,
      macroComandi: '',
      descrizione: ''
    },
    dbName: 'rilievoDet'
  }
}

export const actions = {
  getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root)
    .then((rec) =>
      commit('setRecord', rec)
    )
  },
  save({ dispatch, commit, state }) {
    const rec = state.record
    const table = state.dbName
    const isInsert = !rec._id
    let actionName = 'db/update'
    if (isInsert) {
      actionName = 'db/insertInto'
    }
    return dispatch(actionName, { table, data: rec }, root)
      .then(() => {
        return dispatch('rilievo/loadDettagli', {}, root)
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  deleteByID({ dispatch, commit, state }, id) {
    console.log('start deleteByID ' + id)
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root)
      .then((rec) => dispatch('deleteDoc', rec))
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  deleteDoc({ dispatch, commit, state }, rec) {
    let actionName = 'db/delete'
    console.log('start deleteDoc ' + rec)
    const table = state.dbName
    return dispatch(actionName, { table, data: rec }, root)
      .then(() => {
        return dispatch('load')
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  }
}

export const mutations = {
  setRiferimentoARilievo(state, payload = {}) {
    state.record.rilievoID = payload
  },
  setRiferimentoAPosizione(state, payload = {}) {
    state.record.RifPosID = payload
  },
  setMacroComandi(state, payload = {}) {
    state.record.macroComandi = payload
  },
  setRecord(state, payload = {}) {
    state.record = payload
  }
}

// export const getters = {
//   immagineProdotto: (s) => getIMG(s.$record.drawingCMD)
// }

// function getIMG(jsonData) {
//   if (!jsonData) {
//     return
//   }

//   let c = document.createElement('canvas')

//   //console.log(jsonData)
//   // Tipo di disegno
//   // DL=DrawLine; DR=DrawRectangle; DS=DrawString; DI=DrawImage; DP=FillPolygon;

//   let ctx = c.getContext('2d')
//   ctx.clearRect(0, 0, 1000, 1000)

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

//           console.log(DrawCommand)
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
//         // null
//       }
//     }
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
