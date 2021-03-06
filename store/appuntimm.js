import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'
import _clone from 'lodash/clone'
import _orderBy from 'lodash/orderBy'
import _get from 'lodash/get'
import _dateFormat from 'date-fns/format'
import Vue from 'vue'
import { syncStates } from '../store/db'
import { v4 as uuidv4 } from 'uuid'
import strutturaClassificazioneJson from '../storeimp/fixtures/classificazione'

const root = { root: true }
const dbName = 'appuntimm'

export const state = () => {
  return {
    list: [],
    lavoroCorrente: {},
    $record: { data: {} },
    record: { data: {} },

    //==  GALLERY ==
    gallery: {
      isShowingGallery: false,
      listaRisorseGallery: [],
      index: -1
    },
    // ==

    $files: [],
    browserFilter: {},
    strutturaDiClassificazione: {},
    modalita: 'VIEW',
    prevModalita: '',
    dbName,
    ui: {
      listaRisorse: [],
      index: -1,

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
  for (let key in classificazione) {
    let items = classificazione[key]
    // ret.push({type: 'header', name: key})

    if (_isArray(items))
      for (let i = 0; i < items.length; i++) ret.push({ type: 'item', name: items[i], group: key })
    else ret.push({ type: 'item', name: items, group: key })
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
  addPhotocamera({ commit, dispatch, state }) {
    commit('setPhotocameraMode')
    commit('app/setModalOpened', true, { root: true })
  },
  cancelPhotocamera({ commit, dispatch, state }) {
    commit('setViewMode')
    commit('app/setModalOpened', false, { root: true })
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
        EV_Type: 'Nota',
        EV_RifLavoroID: state.lavoroCorrente.job_id,
        EV_RifPosizioneID: state.lavoroCorrente.pos_id,
        EV_Descrizione: comment,
        EV_Classificazione: null
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
  async addSetImage({ commit, dispatch, state, rootState }) {
    const table = state.dbName
    let listaRisorse = []

    for (const risorsa of state.ui.listaRisorse) {
      let id = uuidv4()
      listaRisorse.push(id)
      await dispatch('dm_resources/salvaRisorsa', { id, risorsa }, root)
    }

    let data = {
      _id: state.$record._id,
      tipo: 'EVENTO',
      syncStatus: syncStates['NOT_SYNC'],
      lastUpdate_UTCDate: new Date(),
      insert_UTCDate: new Date(),
      lastUpdateUser: rootState.auth.utente,
      insertUser: rootState.auth.utente,
      data: {
        EV_Type: 'Immagine',
        EV_RifLavoroID: state.lavoroCorrente.job_id,
        EV_RifPosizioneID: state.lavoroCorrente.pos_id,
        EV_Descrizione: state.$record.data.EV_Descrizione,
        EV_Classificazione: state.$record.data.EV_Classificazione,
      },
      listaRisorse
    }

    return dispatch('db/insertInto', { table, data }, root)
      .then(() => {
        data.files = state.ui.listaRisorse
        commit('addInList', data)
        commit('setMessage')
        commit('setViewerStatusView')
      })

  },
  async addImage({ commit, dispatch, state, rootState }, photo) {
    const table = state.dbName

    let id = uuidv4()
    let listaRisorse = [id]
    await dispatch('dm_resources/save', { id, file: photo }, root)

    let data = {
      _id: state.$record._id,
      tipo: 'EVENTO',
      syncStatus: syncStates['NOT_SYNC'],
      lastUpdate_UTCDate: new Date(),
      insert_UTCDate: new Date(),
      lastUpdateUser: rootState.auth.utente,
      insertUser: rootState.auth.utente,
      data: {
        EV_Type: 'Immagine',
        EV_RifLavoroID: state.lavoroCorrente.job_id,
        EV_RifPosizioneID: state.lavoroCorrente.pos_id,
        EV_Descrizione: state.$record.data.EV_Descrizione,
        EV_Classificazione: state.$record.data.EV_Classificazione,
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
  async load({ commit, dispatch, state }) {
    const table = state.dbName
    commit('setList', [])
    let lista = await dispatch('db/selectAll', { table }, root)

    for (const element of lista) {
      if (!element.data) continue

      Vue.set(element, 'files', [])

      if (element.listaRisorse) {
        for (const res of element.listaRisorse) {
          var risorsa = await dispatch('dm_resources/getRisorsaById', res, root)
          element.files.push(risorsa)
        }
      }

      let ClassID = element.data.EV_Classificazione
      if (ClassID) {
        var classDesc = await dispatch('classificazione/getDescrizioneById', ClassID, root)
        element.data.ClassificazioneDesc = classDesc
      }

      commit('addInList', element)
    }

    return lista
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
  backToPrevModalita(state) {
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
  setRecord(state, payload = { data: {} }) {
    if (!payload.data) payload.data = {}
    state.record = payload
    state.$record = _clone(payload)
  },
  addInList(s, p) {
    if (!s.list) s.list = []
    s.list.push(p)
  },
  clearEventRecord(s) {
    s.record = { data: {} }
    s.$record = { data: {} }
    s.ui.listaRisorse = []
    s.ui.message = ''
  },
  showGallery(s, { lista, index }) {
    s.gallery.listaRisorseGallery = lista
    s.gallery.index = index
    s.gallery.isShowingGallery = true
  },
  hideGallery(s) {
    s.gallery.isShowingGallery = false
    s.gallery.listaRisorseGallery = []
    s.gallery.index = -1
  },
  setFilterText(s, p) {
    s.ui.filter = ''
  }
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
        for (let i = 0; i < aDateFilter.length; i++) {
          if (aDateFilter[i].length === 1) {
            aDateFilter[i] = '0' + aDateFilter[i]
          }
        }
        dateFilter = aDateFilter[1] + '-' + aDateFilter[0]
      }

      else if (aDateFilter.length === 3) {
        if (s.ui.filter.includes(' ')) {
          let af = aDateFilter[2].split(' ')
          textFilter = af[1]
          aDateFilter[2] = af[0]
        }
        for (let i = 0; i < aDateFilter.length; i++) {
          if (aDateFilter[i].length === 1) {
            aDateFilter[i] = '0' + aDateFilter[i]
          }
        }
        dateFilter = aDateFilter[2] + '-' + aDateFilter[1] + '-' + aDateFilter[0]
      }
    } else {
      textFilter = s.ui.filter
    }
    if (textFilter) textFilter = textFilter.toLowerCase()
    console.dir(g.appuntiByDate)
    return g.appuntiByDate.filter(o => {
      let dateBool = true
      let textBool = true

      if (dateFilter !== null) dateBool = o.insert_UTCDate.includes(dateFilter)
      if (textFilter !== null) textBool = (
        _get(o.data, 'ClassificazioneDesc', '').toLowerCase().includes(textFilter) ||
        _get(o.data, 'EV_NOTE', '').toLowerCase().includes(textFilter) ||
        _get(o.data, 'EV_Descrizione', '').toLowerCase().includes(textFilter)
      )

      return (dateBool && textBool)
    })
  },
  
  appuntiByDate: (s, g) => _orderBy(s.list.filter(o => {
    if (o.data.EV_RifLavoroID === s.lavoroCorrente.job_id) {
      if (s.lavoroCorrente.pos_id) {
        return o.data.EV_RifPosizioneID === s.lavoroCorrente.pos_id
      } else {
        return true
      }
    }
  }), 'insert_UTCDate'),

  isView: (s) => s.modalita === 'VIEW',
  isPhotocamera: (s) => s.modalita === 'PHOTOCAMERA',
  isEdit: (s) => s.modalita === 'EDIT',
  isBrowserCompleteInputVisible: (s) => s.modalita === 'EDIT',
  isBrowserLoadImagesVisible: (s) => s.modalita === 'PHOTOCAMERA',
  isAdd: (s) => s.modalita === 'ADD'
}
