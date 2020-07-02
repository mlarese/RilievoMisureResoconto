import _clone from 'lodash/clone'
import _filter from 'lodash/filter'
import { v4 as uuidv4 } from 'uuid'
import { visibleRecord, syncStates, internalStates } from './db'
import { repoFilename } from '../assets/filters'

const root = { root: true }
const emptyRecord = () => ({
  _id: null,
  tipo: 'CONTATTO',
  syncStatus: syncStates['NOT_SYNC'],
  lastUpdateDate: null,
  data: {
    CONDescrizione: null,
    CONIndirizzo: null,
    CONTelefono: null,
    CONEmail: null,
    CONNote: null,
    imgFileName: null
  }
})

export const state = () => {
  return {
    list: [],
    $record: {
      data: {
        CONDescrizione: null,
        CONIndirizzo: null,
        CONTelefono: null,
        CONEmail: null,
        CONNote: null,
        imgFileName: null
      }
    },
    record: {},
    dbName: 'contatti',
    modalita: 'FIND',
    ui: {
      title: 'Gestione contatti',
      formTitleSuffix: 'Contatto',
      filter: { text: '' }
    }
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
  async getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    const rec = await dispatch('db/selectById', { table, id }, root)
    commit('setRecord', rec)
  },
  async upload({ dispatch, commit, state }) {
    let data = state.$record
    const url = '/api/Sincronizza/uploadSingleData'

    // Invia i dati al WS
    return await dispatch('api/post', { url, data }, { root: true })
  },
  async save({ dispatch, commit, state, rootState }) {
    const isInsert = !state.$record._id
    const table = state.dbName
    let actionName = 'db/update'

    if (isInsert) {
      actionName = 'db/insertInto'
    }

    commit('setLastUpdateDate', new Date().toJSON())
    commit('setLastUpdateUser', rootState.auth.utente)

    if (isInsert) {
      commit('setSyncStatus', syncStates['NOT_SYNC'])
      commit('setInsertDate', new Date().toJSON())
      commit('setInsertUser', rootState.auth.utente)

      // Salva localmente
      const res = await dispatch(actionName, { table, data: state.$record }, root)

      // Recupera il nuov ID e lo imposta
      commit('setLocalID', res.id)

      // tenta l'upload in background altrimenti sarà caricato durante la sincronizzazione
      // chiamata async in modo da non bloccare l'utente
      dispatch('sync/UPLOAD', {
        table, data: state.$record, callback: () => {
          console.log('callback')
          dispatch('getById', state.$record._id), dispatch('load') // ricarica i dati
        }
      }, root)
    } else {
      // Una modifica deve per forza prima essere sincronizzata con il ws
      // Se tutto va a buon fine provvede a salvarla localmente
      try {
        await dispatch('sync/UPLOAD', { table, data: state.$record }, root)
        await dispatch(actionName, { table, data: state.$record }, root)
      } catch (error) {
        console.error()
      }
    }
  },
  async addImgPrinc({ dispatch, commit, state }, file) {
    const docID = state.$record._id
    const table = state.dbName
    const oldFileName = state.$record.data.imgFileName

    // Genera un nuovo filename per la risorsa
    const newFileName = repoFilename(file.name)

    // Salva fisicamente il file come allegato
    await dispatch('db/putAttachment', { table, docID, file, fileName: newFileName }, root)

    // Ricarica il record dopo aver salvato l'allegato
    // (necessario per ottenere la nuova versione del record)
    await dispatch('getById', docID)

    // Aggiorna il nuovo nome del file
    let listaRis = []
    listaRis.push(newFileName)

    // Aggiorna i riferimenti alla risorsa
    commit('setImgFileName', newFileName)
    commit('setListaRisorse', listaRis)

    // Salva il documento
    await dispatch('save', {
      doUpload: false,
      saveLacalAnyway: true,
      rawData: true
    })

  },

  safeDelete({ dispatch, commit, state }, rec) {
    const table = state.dbName
    return dispatch('db/safeDelete', { table, data: rec }, root)
      .then(() => {
        return dispatch('load')
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  deleteByID({ dispatch, commit, state }, id) {
    console.log('start deleting' + id)
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
    console.log('start deleting2' + rec)
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
  setList(state, payload = []) {
    state.list = payload
  },
  resetRecord(state) {
    state.record = emptyRecord()
    state.$record = emptyRecord()
  },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _clone(payload)
  },
  setLocalID(state, payload = {}) {
    state.record._id = payload
    state.$record._id = payload
  },
  setSyncStatus(state, payload = {}) {
    state.record.syncStatus = payload
    state.$record.syncStatus = payload
  },
  setLastUpdateDate(state, payload = {}) {
    state.record.lastUpdateDate = payload
    state.$record.lastUpdateDate = payload
  },
  setLastUpdateUser(state, payload = {}) {
    state.record.lastUpdateUser = payload
    state.$record.lastUpdateUser = payload
  },
  setInsertDate(state, payload = {}) {
    state.record.insertDate = payload
    state.$record.insertDate = payload
  },
  setInsertUser(state, payload = {}) {
    state.record.insertUser = payload
    state.$record.insertUser = payload
  },
  setModalita(state, payload = {}) {
    state.modalita = payload
  },
  setEditMode(state) {
    state.modalita = 'EDIT'
  },
  setNewMode(state) {
    state.modalita = 'ADD'
  },
  setViewMode(state) {
    state.modalita = 'VIEW'
  },
  setFiltro(state, payload = {}) {
    state.filter = payload
  },
  setListaRisorse(state, payload) {
    state.record.listaRisorse = payload
    state.$record.listaRisorse = payload
  },
  addRisorsa(state, payload) {
    if (!state.record.listaRisorse) {
      state.record.listaRisorse = []
    }
    state.record.listaRisorse.push(payload)
    state.$record.listaRisorse = state.record.listaRisorse
  },
  setImgFileName(state, payload) {
    state.record.data.imgFileName = payload
    state.$record.data.imgFileName = payload
  }
}

export const getters = {
  noDeletedList: (s) => s.list.filter(visibleRecord),

  filteredList: (s) =>
    _filter(s.list, function (o) {
      if (s.ui.filter.text == '') {
        return true
      } else {
        return (
          ((o.data.CONDescrizione) && o.data.CONDescrizione.toLowerCase().includes(s.ui.filter.text.toLowerCase())) ||
          ((o.data.CONNote) && o.data.CONNote.toLowerCase().includes(s.ui.filter.text.toLowerCase())) ||
          ((o.data.CONIndirizzo) && o.data.CONIndirizzo.toLowerCase().includes(s.ui.filter.text.toLowerCase()))
        )
      }
    }),

  isView: (s) => s.modalita === 'VIEW',
  isEdit: (s) => s.modalita === 'EDIT',
  isAdd: (s) => s.modalita === 'ADD',
  formTitle: (s, g) =>
    g.isEdit
      ? `Modifica ${s.ui.formTitleSuffix}`
      : `Aggiungi ${s.ui.formTitleSuffix}`,
  buttonAddTitle: (s) => `Aggiungi ${s.ui.formTitleSuffix}`
}
