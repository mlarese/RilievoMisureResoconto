import _clone from 'lodash/clone'

const root = { root: true }
export const state = () => {
  return {
    record: {
      rilievoID: 0,
    },
    dbName: 'rilievoDG'
  }
}

export const actions = {

  async getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    let rec = await dispatch('db/selectById', { table, id }, root)
    commit('setRecord', rec)
    return rec    
  },

  async save({ dispatch, commit, state }) {
    const rec = state.record
    const table = state.dbName
    const isInsert = !rec._id
    let actionName = 'db/update'
    if (isInsert) {
      actionName = 'db/insertInto'
    }

    const result = await dispatch(actionName, { table, data: rec }, root)

    if (result.ok) {
        commit('setRecordID', result.id)
    }
    dispatch('rilievo/loadDatiGen', {}, root)
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
  setRecordID(state, payload) {
    state.record._id = payload
  },
  setRecord(state, payload = {}) {
    state.record = payload
  },
}
