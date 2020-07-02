import _clone from 'lodash/clone'
import _orderBy from 'lodash/orderBy'
import _dateFormat from 'date-fns/format'
const root = { root: true }

const newRec = ({_attachments = {}, classification = {}, description = '', note = {}, job_id = '', job_description = '', type = 'comment', files = [] }) => ({
    "date": _dateFormat(new Date (), 'yyyy-MM-dd HH:mm:ss'),
    _attachments,
    type,
    job_id,
    job_description,
    description,
    note,
    classification,
    files
  })

const dbName = 'appuntimm'
export const state = () => {
  return {
    list: [],
    lavoroCorrente: {},
    $record: {},
    record: {},
    dbName,
    ui: {
      message: '',
      title: 'Appunti multimediali',
      filter: ''
    }
  }
}
export const actions = {
  setDemo ({ commit, dispatch, state }, data) {
    return dispatch('db/bulkInsertInto', { table: dbName, data},{ root: true })
  },
  addComment ({ commit, dispatch, state }) {
    let comment = state.ui.message
    const table = state.dbName
    let data = newRec({...state.lavoroCorrente, note: comment, description: comment})
    return dispatch('db/insertInto', { table, data}, root)
      .then(() => {
        dispatch('load')
        commit('setMessage')
      })
  },
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
      const table = state.dbName
      dispatch('db/selectById', { table, id }, root).then((rec) =>
        commit('setRecord', rec)
      )
  }
}

export const mutations = {
  setLavoroCorrente(state, payload = {}) { state.lavoroCorrente = payload },
  setMessage(state, payload = '') { state.ui.message = payload },
  setList(state, payload = []) { state.list = payload },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  }
}

export const getters = {
  appuntiFiltered: (s, g) => _orderBy(s.list, 'date'),
  appuntiByDate: (s, g) => _orderBy(s.list, 'date')
}
