import _clone from 'lodash/clone'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _dateFormat from 'date-fns/format'
import { repoFilename } from '../assets/filters'
import Vue from 'vue'
import { syncStates } from '../store/db'
import { v4 as uuidv4 } from 'uuid'

const root = { root: true }

// const newRec = ({ _attachments = {}, classification = {}, description = '', note = {}, job_id = '', job_description = '', type = 'comment', files = [] }) => ({
//   "date": _dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
//   _attachments,
//   type,
//   job_id,
//   job_description,
//   description,
//   note,
//   classification,
//   files
// })

const dbName = 'appuntimm'
export const state = () => {
  return {
    list: [],
    lavoroCorrente: {},
    $record: {},
    record: {},
    browserFilter: {},
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
  getAttachment () {
     // solo per test
  },
  async setDemo({ commit, dispatch, state }, data) {
    const table = state.dbName

    for (let i = 0; i < 10; i++) {

      let rndDate = new Date(2020, 6, Math.floor(Math.random() * 29) + 1)
      let random = Math.floor(Math.random() * 100)

      let data = {
        _id: null,
        tipo: 'EVENTO',
        syncStatus: syncStates['NOT_SYNC'],
        lastUpdate_UTCDate: rndDate,
        insert_UTCDate: rndDate,
        lastUpdateUser: null,
        insertUser: null,
        data: {
          EV_Type: 'set',
          EV_RifLavoroID: '7f55fb72-26b3-4977-ada8-de71952c3847',
          EV_Descrizione: `descrizione random ${random}`,
          EV_Note: null,
          EV_Classificazione: null,
        },
        listaRisorse: []
      }

      let fileIndex
      let maxFiles = Math.floor(Math.random() * 6)
      for (fileIndex = 0; fileIndex < maxFiles; fileIndex++) {
        let responseFile = await dispatch('api/getFile', { url: `https://picsum.photos/1000` }, root)

        let file = responseFile.data
        let fileName = uuidv4()
        await dispatch('dm_resources/save', { id: fileName, file }, root)

        data.listaRisorse.push(fileName)
      }
      await dispatch('db/insertInto', { table, data }, root)
    }
  },
  addComment({ commit, dispatch, state, rootState }) {
    let comment = state.ui.message
    const table = state.dbName

    let data = {
      _id: null,
      tipo: 'EVENTO',
      syncStatus: syncStates['NOT_SYNC'],
      lastUpdate_UTCDate: new Date(),
      insert_UTCDate: new Date(),
      lastUpdateUser: rootState.auth.utente,
      insertUser: rootState.auth.utente,
      data: {
        EV_Type: 'comment',
        EV_RifLavoroID: state.lavoroCorrente.job_id,
        EV_Descrizione: comment,
        EV_Note: null,
        EV_Classificazione: null,
      },
      listaRisorse: []
    }

    return dispatch('db/insertInto', { table, data }, root)
      .then(() => {
        commit('addInList', data)
        commit('setMessage')
      })
  },
  addImage({ commit, dispatch, state, rootState }, { note = '', description = '', photo }) {
    const fileName = uuidv4() //DA CONCORDARE repoFilename(photo.name)
    const table = state.dbName

    let data = {
      _id: null,
      tipo: 'EVENTO',
      syncStatus: syncStates['NOT_SYNC'],
      lastUpdate_UTCDate: new Date(),
      insert_UTCDate: new Date(),
      lastUpdateUser: rootState.auth.utente,
      insertUser: rootState.auth.utente,
      data: {
        EV_Type: 'image',
        EV_RifLavoroID: state.lavoroCorrente,
        EV_Descrizione: description,
        EV_Note: note,
        EV_Classificazione: null,
      },
      listaRisorse: [fileName]
    }
    Vue.set(data, 'files', [])
    data.files.push(URL.createObjectURL(photo))

    return dispatch('dm_resources/save', { id: fileName, file: photo }, root)
      .then(() => {
        return dispatch('db/insertInto', { table, data }, root)
          .then(() => {
            commit('addInList', data)
            commit('setMessage')
            commit('setViewerStatusView')
          })
      })
  },
  save({ commit, dispatch, state }) {
    // TODO
  },
  load({ commit, dispatch, state }) {
    const table = state.dbName
    commit('setList', [])
    return dispatch('db/selectAll', { table }, root)
      .then((lista) => {
        lista.forEach((element) => {
          Vue.set(element, 'files', [])
          if (element.listaRisorse) {
            element.listaRisorse.forEach((res) => {
              dispatch('dm_resources/getById', res, root)
                .then((file) => element.files.push(URL.createObjectURL(file)))
            })
          }
          commit('addInList', element)
        })
        return lista
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
  setBrowserFilter(state, payload = null) { state.lavoroCorrente = payload },
  setMessage(state, payload = '') { state.ui.message = payload },
  setList(state, payload = []) { state.list = payload },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  },
  addInList(s, p) {
    if (!s.list) s.list = []
    s.list.push(p)
  },
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


      if(dateFilter !== null) dateBool = o.insert_UTCDate.includes(dateFilter)
      if(textFilter !== null) textBool =  (
        _get(o.data, 'EV_NOTE', '').includes(textFilter) ||
        _get(o.data, 'EV_Descrizione', '').includes(textFilter)
      )

      return (dateBool && textBool)
    })
  },
  appuntiByDate: (s, g) => _orderBy(s.list.filter(o => {
    return o.data.EV_RifLavoroID === s.lavoroCorrente.job_id
  }), 'lastUpdate_UTCDate')
}
