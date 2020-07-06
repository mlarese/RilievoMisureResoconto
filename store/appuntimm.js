import _clone from 'lodash/clone'
import _orderBy from 'lodash/orderBy'
import _isNumber from 'lodash/isNumber'
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
      viewerStatus: 'view', //loadimage view
      message: '',
      title: 'Appunti multimediali',
      filter: ''
    }
  }
}
export const actions = {
  getAttachment ({ commit, dispatch, state }, {record, itemName}) {
    return dispatch('db/getAttachment', { table: dbName, docID: record._id, fileName: itemName},{ root: true })
  },
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
  addImage ({ commit, dispatch, state }, {note = '', description = '', photo}) {
    const table = state.dbName
    let data = newRec({...state.lavoroCorrente, note, description})

    console.dir(photo)
    return
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
  setViewerStatusView(state) { state.ui.viewerStatus = 'view' },
  setViewerStatusLoadImage(state) { state.ui.viewerStatus = 'loadimage' },
  setViewerStatus(state, payload = 'view') { state.viewerStatus = payload },
  setLavoroCorrente(state, payload = {}) { state.lavoroCorrente = payload },
  setMessage(state, payload = '') { state.ui.message = payload },
  setList(state, payload = []) { state.list = payload },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  }
}

export const getters = {
  appuntiFiltered: (s, g) => {
    if(s.ui.filter === null || s.ui.filter === '' ) return g.appuntiByDate
    let dateFilter = null
    let textFilter = null

    if(s.ui.filter.includes('/')) {
      let aDateFilter = s.ui.filter.split('/')

      if(aDateFilter.length === 2) {
        if(s.ui.filter.includes(' ')) {
          let af = aDateFilter[1].split(' ')
          textFilter = af[1]
          aDateFilter[1] = af[0]
        }
        dateFilter = aDateFilter[1] + '-' + aDateFilter[0]
      }

      else if(aDateFilter.length === 3) {
        if(s.ui.filter.includes(' ')) {
          let af = aDateFilter[2].split(' ')
          textFilter = af[1]
          aDateFilter[2] = af[0]
        }
        dateFilter = aDateFilter[2] + '-' + aDateFilter[1] + '-' + aDateFilter[0]
      }
    } else {
        textFilter = s.ui.filter
    }

    // console.log('---- dateFilter ',dateFilter)
    // console.log('---- textFilter ',textFilter)

    return g.appuntiByDate.filter(o => {
      let dateBool = true
      let textBool = true

      if(dateFilter !== null) dateBool = o.date.includes(dateFilter)
      if(textFilter !== null) textBool =  (o.note.includes(textFilter) || o.description.includes(textFilter))

      return (dateBool && textBool)
    })
  },
  appuntiByDate: (s, g) => _orderBy(s.list.filter(o => o.job_id === s.lavoroCorrente.job_id), 'date')
}
