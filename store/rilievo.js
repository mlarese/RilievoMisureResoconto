import _clone from 'lodash/clone'

const root = { root: true }
export const state = () => {
  return {
    lavoroID: 0,
    listaPosizioni: [],
    listaDettagli: [],
    listaSchedeGenerali: {},
    $record: {},
    record: {},
    dbName: 'rilievi',
    ui: {
      title: 'Rilievo'
    }
  }
}

export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName

    function mapFunctionRilievo(doc) {
      emit(doc.lavoroID)
    }

    let reduceFunctionRilievo = {
      key: state.lavoroID,
      include_docs: true,
      limit: 1
    }

    // Carica il rilievo
    dispatch(
      'db/query',
      {
        table,
        mapFunction: mapFunctionRilievo,
        reduceFunction: reduceFunctionRilievo
      },
      root
    )
      .then((rilievo) => {
        if (Object.keys(rilievo).length === 0) {
          console.log('nessun rilievo, provvede a crearne uno provvisorio')
          commit('setEmptyRecord')
          dispatch('save')
        } else {
          commit('setRecord', rilievo[0])
        }

        dispatch('loadPosizioni').catch((e) => {
          console.log(e)
        })

        dispatch('loadDettagli').catch((e) => {
          console.log(e)
        })
      })
      .catch((e) => {
        console.log(e)
      })
  },
  loadPosizioni({ dispatch, commit, state }) {
    const table = 'rilievoPos'

    function mapFunctionPos(doc) {
      emit(doc.rilievoID)
    }

    let reduceFunctionPos = {
      key: state.record._id,
      include_docs: true
    }

    dispatch(
      'db/query',
      { table, mapFunction: mapFunctionPos, reduceFunction: reduceFunctionPos },
      root
    )
      .then((res) => {
        commit('setPosizioni', res)
      })
      .catch((e) => {
        console.log(e)
      })
  },
  loadDettagli({ commit, dispatch, state }) {
    const table = 'rilievoDet'

    function mapFunctionDet(doc) {
      emit(doc.rilievoID)
    }

    let reduceFunctionDet = {
      key: state.record._id,
      include_docs: true
    }

    dispatch(
      'db/query',
      { table, mapFunction: mapFunctionDet, reduceFunction: reduceFunctionDet },
      root
    )
      .then((res) => {
        commit('setDettagli', res)
      })
      .catch((e) => {
        console.log(e)
      })
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
        commit('setRecordID', rec.id)
        dispatch('load')
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
  setRecordID(state, payload) {
    state.record._id = payload
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
