const root = { root: true }

export const state = () => {
  return {
    list: [],
    record: {},
    dbName: 'cataloghi'
  }
}
export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName
    return dispatch('db/selectAll', { table }, root)
      .then((res) => {
        commit('setList', res)
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
    const rec = state.record
    const table = state.dbName
    const isInsert = !rec._id
    let actionName = 'db/update'

    if (isInsert) {
      actionName = 'db/insertInto'
    }

    return dispatch(actionName, { table, data: rec }, root)
      .then((rec) => {
        // commit('setRecord', rec)
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  }
}

export const mutations = {
  setList(state, payload = []) {
    state.list = payload
  },
  setRecord(state, payload = []) {
    state.record = payload
  },
  resetRecord(state) {
    state.record = {}
  }
}
