import _clone from 'lodash/clone'

const root = { root: true }
export const state = () => {
  return {
    list: {},
    $record: {},
    record: {},
    dbName: 'lavori',
    modalita: 'FIND',
    ui: {
      title: 'lavori',
      filter: {}
    }
  }
}
export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName
    dispatch('db/selectAll', { table }, root)
      .then(res => {
        commit('setList', res)
        commit('setRecord', {})
        return res
      })
      .catch(e => {
        console.log(e)
        return e
      })
  },
  getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root)
      .then(rec => commit('setRecord', rec))
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
      .then(() => {
        return dispatch('load')
      })
      .catch(e => {
        console.log(e)
        return e
      })
  },
  deleteByID({ dispatch, commit, state }, id) {
    console.log('start deleting' + id)
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root)
      .then(rec => dispatch('deleteDoc', rec))
      .catch(e => {
        console.log(e)
        return e
      })
  },
  deleteDoc({ dispatch, commit, state }, rec) {
    let actionName = 'db/delete'
    console.log('start deleting2' + rec)
    const table = state.dbName
    return dispatch(actionName, { table, data: rec }, root)
    .then(() => {
      return dispatch('load')
    })
    .catch(e => {
      console.log(e)
      return e
    })
  },
  impostaModalitaVisualizzazione({ dispatch, commit, state }, modalita) {
    commit('setRecord', modalita)
  }
}

export const mutations = {
  setList(state, payload = {}) {
    state.list = payload
  },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  },
  setModalita(state, payload = {}){
    state.modalita = payload
  }
}

export const getters = {
}
