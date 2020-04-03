import _clone from 'lodash/clone'
import { v1 as uuid } from 'uuid'

const root = { root: true }
export const state = () => {
  return {
    lavoroID: 0,
    listaPosizioni: {},
    listaSchedeGenerali: {},
    $record: {},
    record: {},
    dbName: 'rilievi',
    ui: {
      title: 'Rilievo'
    }
  }
}

function mapFunction(doc) {
  emit(doc.lavoroID)
}

export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName

    let reduceFunction = {
      key: state.lavoroID,
      include_docs: true,
      limit: 1
    }
    // Carica il rilievo
    dispatch('db/query', { table, mapFunction, reduceFunction }, root)
      .then((rilievo) => {
        if (Object.keys(rilievo).length === 0) {
          console.log('nessun rilievo, provvede a crearne uno provvisorio')
          commit('setEmptyRecord')
          dispatch('save')
        } else {
          commit('setRecord', rilievo[0])
          commit('rilievoPos/setRiferimentoARilievo', rilievo[0]._id, root)
          commit('rilievoDet/setRiferimentoARilievo', rilievo[0]._id, root)
          
          // carica le posizioni
          dispatch('rilievoPos/load', {}, root)
            .then((posizioni) => {
              commit('setPosizioni', posizioni)
              // carica i dettagli
              dispatch('rilievoDet/load', {}, root)
                .then((dettagli) => {
                  commit('setDettagli', dettagli)
                  return rilievo
                })
                .catch((e) => {
                  console.log(e)
                  return e
                })
            })
            .catch((e) => {
              console.log(e)
              return e
            })
        }
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  loadPosizioni({ dispatch, commit, state }) {
    // carica le posizioni
    // dispatch('', {}, root)
    // .then(() => {
    //   return state.listaPosizioni    
    // })
    return state.listaPosizioni    

  },
  save({ dispatch, commit, state }) {
    const rec = state.$record
    const table = state.dbName
    const isInsert = !rec._id
    let actionName = 'db/update'
    if (isInsert) {
      actionName = 'db/insertInto'
    }

    return dispatch(actionName, { table, data: rec }, root)
      .then((rec) => {
        return rec
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  }
}
export const mutations = {
  setRiferimentoAlLavoro(state, payload = {}) {
    state.lavoroID = payload
  },
  setPosizioni(state, payload = {}) {
    state.listaPosizioni = payload
  },
  setDettagli(state, payload = {}) {
    state.listaDettagli = payload
  },
  setEmptyRecord(state) {
    state.record.lavoroID = state.lavoroID
    state.record.dataCreazione = new Date().toLocaleString()
    state.$record = _clone(state.record)
  },
  setRecord(state, payload = {}) {
    state.record = {}
    state.record.lavoroID = payload.lavoroID
    state.record.dataCreazione = payload.dataCreazione
    state.record._id = payload._id

    state.$record = _clone(state.record)
  },
  setModalita(state, payload = {}) {
    state.modalita = payload
  }
}
// export const getters = {
//   listaPosizioni: s => s.listaPosizioni
// }