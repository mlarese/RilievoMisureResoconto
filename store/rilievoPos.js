import _clone from 'lodash/clone'

const root = { root: true }
export const state = () => {
  return {
    rilievoID: 0,
    listaPosizioni: [],
    $record: {},
    record: {},
    dbName: 'rilievoPos'
  }
}

function mapFunction(doc) {
  emit(doc.rilievoID)
}

export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName

    let reduceFunction = {
      key: state.rilievoID,
      include_docs: true
    }

    dispatch('db/query', { table, mapFunction, reduceFunction }, root)
      .then((res) => {
        commit('setList', res)
        console.log(res)
        commit('setRecord', {})
        return res
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
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
      rec.rilievoID = state.rilievoID
    }
    return dispatch(actionName, { table, data: rec }, root)
      .then(() => {
        return dispatch('load')
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
    state.rilievoID = payload
  },
  setList(state, payload = []) {
    state.listaPosizioni = payload
  },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  }
}

export const getters = {}
