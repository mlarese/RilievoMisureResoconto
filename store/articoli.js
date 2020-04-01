import _clone from 'lodash/clone'
import uuid from 'uuid/v1'

const root = { root: true }
const demoRecord = () =>({
    uid: uuid(),
    catalogo: 'AGILE',
    codice: 'SER',
    macroComandi: 'MACRO:DEMO1',
    propertys: [
        {name: 'L', label: 'Larghezza', type: 'DEC'},
        {name: 'H_SX', label: 'Altezza', type: 'DEC'},
        {name: 'H_DX', label: 'Altezza dx', type: 'DEC'}
    ]
  })

export const state = () => {
  return {
    list: [],
    $record: {},
    record: {},
    dbName: 'articoli',
    ui: {
      title: 'Articoli',
      filter: {}
    }
  }
}
export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName
    dispatch('db/selectAll', { table }, root)
      .then((res) => {
        commit('setList', res)
        commit('setRecord', {})
        return res
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  getById({ dispatch, commit, state }, id) {
    if (id == 'demo') {
        commit('setRecord', demoRecord())
    } else {
      const table = state.dbName
      dispatch('db/selectById', { table, id }, root).then((rec) =>
        commit('setRecord', rec)
      )
    }
  }
}

export const mutations = {
  setList(state, payload = []) {
    state.list = payload
  },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  }
}

export const getters = {}
