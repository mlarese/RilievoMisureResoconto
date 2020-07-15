import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'
import _clone from 'lodash/clone'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _dateFormat from 'date-fns/format'
import { repoFilename } from '../assets/filters'
import Vue from 'vue'
import { syncStates } from '../store/db'
import { v4 as uuidv4 } from 'uuid'
import strutturaClassificazioneJson from '../storeimp/fixtures/classificazione'
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
    $record: {data: {}},
    record: {data: {}},
    $files: [],
    browserFilter: {},
    strutturaDiClassificazione: {},
    modalita: 'VIEW',
    prevModalita: '',
    dbName,
    ui: {
      eventoEditStatus: 'none', // none editor
      viewerStatus: 'view', //loadimage view
      message: '',
      title: 'Appunti multimediali',
      filter: ''
    }
  }
}

const prepareClassificazione = (classificazione) => {
  let ret = []
  for(let key in classificazione) {
    let items = classificazione[key]
    // ret.push({type: 'header', name: key})

    if(_isArray(items))
      for(let i = 0; i < items.length; i++) ret.push({type: 'item', name: items[i], group: key})
      else ret.push({type: 'item', name: items, group: key})
  }
  return ret
}
export const actions = {
  editAppunto({ commit, dispatch, state }, appunto) {
    commit('setRecord', appunto)
    commit('setEditMode')
    commit('app/setModalOpened', true, { root: true })
  },
  cancelAppunto({ commit, dispatch, state }) {
    commit('setRecord', {})
    commit('setViewMode')
    commit('app/setModalOpened', false, { root: true })
  },
  addPhotocamera ({commit, dispatch, state}) {
    commit('setPhotocameraMode')
    commit('app/setModalOpened', true, {root: true})
  },
  cancelPhotocamera ({commit, dispatch, state}) {
    commit('setViewMode')
    commit('app/setModalOpened', false, {root: true})
  },
  async save({ dispatch, commit, state, rootState }) {
    const table = state.dbName
    let actionName = 'db/update'
    // da terminare

    commit('setViewMode')
    commit('setRecord', {})
    commit('app/setModalOpened', false, { root: true })
  },
  getStrutturaDiClassificazione({ commit }) {

    const payload = prepareClassificazione(strutturaClassificazioneJson)
    commit('setStrutturaDiClassificazione', payload)
  },
  getAttachment({ commit, dispatch, state }, { record, itemName }) {
    return dispatch('db/getAttachment', { table: dbName, docID: record._id, fileName: itemName }, { root: true })
  },
  setDemo({ commit, dispatch, state }, data) {
    return dispatch('db/bulkInsertInto', { table: dbName, data }, { root: true })
  },
  addComment({ commit, dispatch, state, rootState }) {
    let comment = state.ui.message
    const table = state.dbName

    let data = {
      _id: uuidv4(),
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
        // dispatch('editAppunto', data)
      })
  },
  addSetImage({ commit, dispatch, state, rootState }) {
    const table = state.dbName
    let listaRisorse = []

    state.$files.forEach(file => {
      let id = uuidv4()
      listaRisorse.push(id)
      dispatch('dm_resources/save', { id, file }, root)
    });

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
        EV_Descrizione: state.ui.message,
        EV_Classificazione: null,
      },
      listaRisorse
    }

    return dispatch('db/insertInto', { table, data }, root)
      .then(() => {
        commit('addInList', data)
        commit('setMessage')
        commit('setViewerStatusView')
      })

  },
  addImage({ commit, dispatch, state, rootState }, { photo }) {
    const fileName = uuidv4() //DA CONCORDARE repoFilename(photo.name)
    const table = state.dbName

    return
    ///////
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
  load({ commit, dispatch, state }) {
    const table = state.dbName
    commit('setList', [])
    return dispatch('db/selectAll', { table }, root)
      .then((lista) => {
        lista.forEach((element) => {
          Vue.set(element, 'files', [])
          if (element.listaRisorse) {
            element.listaRisorse.forEach((res) => {
              dispatch('dm_resources/getUrlById', res, root)
                .then((url) => element.files.push(url))
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
  setEventoEditStatusEditor(state) {
    state.ui.showEditor = true
    state.ui.eventoEditStatus = 'editor'
  },
  setEventoEditStatusNone(state) {
    state.ui.showEditor = false
    state.ui.eventoEditStatus = 'none'
  },
  setPhotocameraMode(state) {
    state.prevModalita = state.modalita
    state.modalita = 'PHOTOCAMERA'
  },
  setEditMode(state) {
    state.prevModalita = state.modalita
    state.modalita = 'EDIT'
  },
  setNewMode(state) {
    state.prevModalita = state.modalita
    state.modalita = 'ADD'
  },
  setViewMode(state) {
    state.prevModalita = state.modalita
    state.modalita = 'VIEW'
  },
  backToPrevModalita (state) {
    state.modalita = state.prevModalita
  },
  setStrutturaDiClassificazione(state, payload) { state.strutturaDiClassificazione = payload },
  setViewerStatusView(state) { state.ui.viewerStatus = 'view' },
  setViewerStatusLoadImage(state) { state.ui.viewerStatus = 'loadimage' },
  setViewerStatus(state, payload = 'view') { state.viewerStatus = payload },
  setLavoroCorrente(state, payload = {}) { state.lavoroCorrente = payload },
  setBrowserFilter(state, payload = null) { state.lavoroCorrente = payload },
  setMessage(state, payload = '') { state.ui.message = payload },
  setList(state, payload = []) { state.list = payload },
  setFiles(state, payload = []) { state.$files = payload },
  setRecord(state, payload = {data: {}}) {
    if(!payload.data) payload.data = {}
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
    if (s.ui.filter === null || s.ui.filter === '') return g.appuntiByDate
    let dateFilter = null
    let textFilter = null
    if (s.ui.filter.includes('/')) {
      let aDateFilter = s.ui.filter.split('/')

      if (aDateFilter.length === 2) {
        if (s.ui.filter.includes(' ')) {
          let af = aDateFilter[1].split(' ')
          textFilter = af[1]
          aDateFilter[1] = af[0]
        }
        dateFilter = aDateFilter[1] + '-' + aDateFilter[0]
      }

      else if (aDateFilter.length === 3) {
        if (s.ui.filter.includes(' ')) {
          let af = aDateFilter[2].split(' ')
          textFilter = af[1]
          aDateFilter[2] = af[0]
        }
        dateFilter = aDateFilter[2] + '-' + aDateFilter[1] + '-' + aDateFilter[0]
      }
    } else {
      textFilter = s.ui.filter
    }
    textFilter = textFilter.toLowerCase()
    //console.log('---- dateFilter ',dateFilter)
    //console.log('---- textFilter ',textFilter)
    return g.appuntiByDate.filter(o => {
      let dateBool = true
      let textBool = true
      let evClassificazione = o.data.EV_Classificazione
      if(!_isString(evClassificazione)) evClassificazione = ''

      if (dateFilter !== null) dateBool = o.insert_UTCDate.includes(dateFilter)
      if (textFilter !== null) textBool = (
        evClassificazione.toLowerCase().includes(textFilter) ||
        _get(o.data, 'EV_NOTE', '').toLowerCase().includes(textFilter) ||
        _get(o.data, 'EV_Descrizione', '').toLowerCase().includes(textFilter)
      )

      return (dateBool && textBool)
    })
  },
  appuntiByDate: (s, g) => _orderBy(s.list.filter(o => {
    return o.data.EV_RifLavoroID === s.lavoroCorrente.job_id
  }), 'lastUpdate_UTCDate'),
  isView: (s) => s.modalita === 'VIEW',
  isPhotocamera: (s) => s.modalita === 'PHOTOCAMERA',
  isEdit: (s) => s.modalita === 'EDIT',
  isBrowserCompleteInputVisible: (s) => s.modalita === 'EDIT',
  isBrowserLoadImagesVisible: (s) => s.modalita === 'PHOTOCAMERA',
  isAdd: (s) => s.modalita === 'ADD'
}
