import _clone from 'lodash/clone'

const root = { root: true }
export const state = () => {
  return {
    // rilievoID: 0,
    $record: {},
    record: {},
    dbName: 'rilievoPos'
  }
}

export const actions = {
  getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root).then((rec) =>
      commit('setRecord', rec)
    )
  },
  save({ dispatch, commit, state }) {
    const rec = state.$record
    const table = state.dbName
    const isInsert = !rec._id
    let actionName = 'db/update'
    if (isInsert) {
      actionName = 'db/insertInto'
      // rec.rilievoID = state.rilievoID
    }
    return dispatch(actionName, { table, data: rec }, root)
      .then(() => {
        return dispatch('rilievo/loadPosizioni', {}, root)
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
  // setRiferimentoARilievo(state, payload = {}) {
  //   state.rilievoID = payload
  // },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  }
}

export const getters = {}
