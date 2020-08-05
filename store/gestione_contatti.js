import _cloneDeep from 'lodash/cloneDeep'
import _filter from 'lodash/filter'
import { v4 as uuidv4 } from 'uuid'
import { visibleRecord, syncStates, internalStates } from './db'
import Vue from 'vue'

const root = { root: true }
const emptyRecord = () => ({
  _id: null,
  tipo: 'CONTATTO',
  syncStatus: syncStates['NOT_SYNC'],
  lastUpdate_UTCDate: null,
  insert_UTCDate: null,
  lastUpdateUser: null,
  insertUser: null,
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
      imgURL: '',
      title: 'Gestione contatti',
      formTitleSuffix: 'Contatto',
      filter: { text: '' }
    }
  }
}

export const actions = {
  load({ commit, dispatch, state }, withFile = false) {
    const table = state.dbName
    commit('setList', [])
    return dispatch('db/selectAll', { table }, root).then((lista) => {
      lista.forEach((element) => {
        if (withFile && element.data.imgFileName) {
          dispatch(
            'dm_resources/getRisorsaById',
            element.data.imgFileName,
            root
          ).then((res) => {
            //console.log(url)
            if (res && res.thumbnailUrl) {
              Vue.set(element, 'imgURL', res.thumbnailUrl)
            } else {
              Vue.set(element, 'imgURL', null)
            }
          })
        }
        commit('addInList', element)
      })
      return lista
    })
  },
  async getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    const rec = await dispatch('db/selectById', { table, id }, root)
    commit('setRecord', rec)
    dispatch('loadUiImgUrl', rec.data.imgFileName)
  },
  async save({ dispatch, commit, state, rootState }) {
    const isInsert = !state.$record._id
    const table = state.dbName
    let actionName = 'db/update'

    if (isInsert) {
      actionName = 'db/insertInto'
    }

    commit('setLastUpdate_UTCDate', new Date().toJSON())
    commit('setLastUpdateUser', rootState.auth.utente)

    if (isInsert) {
      commit('setSyncStatus', syncStates['NOT_SYNC'])
      commit('setInsert_UTCDate', new Date().toJSON())
      commit('setInsertUser', rootState.auth.utente)

      // Salva localmente
      const res = await dispatch(
        actionName,
        { table, data: state.$record },
        root
      )

      // Recupera il nuov ID e lo imposta
      commit('setLocalID', res.id)

      // tenta l'upload in background altrimenti sarà caricato durante la sincronizzazione
      // chiamata async in modo da non bloccare l'utente
      dispatch(
        'sync/UPLOAD',
        {
          table,
          data: state.$record,
          callback: () => {
            console.log('callback')
            dispatch('getById', state.$record._id), dispatch('load') // ricarica i dati
          }
        },
        root
      )
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

    // Genera un nuovo filename per la risorsa
    const fileName = uuidv4()

    // Salva fisicamente il file come risorsa
    await dispatch('dm_resources/salvaBlob', { id: fileName, blob: file }, root)

    // Aggiorna il nuovo nome del file
    let listaRis = [fileName]

    // Aggiorna i riferimenti alla risorsa
    commit('setImgFileName', fileName)
    commit('setListaRisorse', listaRis)

    // Salva il documento
    await dispatch('save')

    dispatch('loadUiImgUrl', fileName)
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
  },
  annullaModifiche({ dispatch, commit, state }) {
    commit('setRecord', state.record)
  },
  loadUiImgUrl({ commit, dispatch }, fileName) {
    if (fileName && fileName !== '') {
      dispatch('dm_resources/getRisorsaById', fileName, root).then((url) => {
        if (url && url.thumbnailUrl) {
          commit('setUiImgUrl', url.thumbnailUrl)
        } else {
          commit('setUiImgUrl')
        }
      })
    } else {
      commit('setUiImgUrl')
    }
  }
}
export const mutations = {
  setList(state, payload = []) {
    state.list = payload
  },
  addInList(state, payload) {
    if (!state.list) state.list = []
    state.list.push(payload)
  },
  resetRecord(state) {
    state.record = emptyRecord()
    state.$record = emptyRecord()
  },
  setRecord(state, payload = {}) {
    state.record = payload
    state.$record = _cloneDeep(payload)
  },
  setLocalID(state, payload = {}) {
    state.record._id = payload
    state.$record._id = payload
  },
  setSyncStatus(state, payload = {}) {
    state.record.syncStatus = payload
    state.$record.syncStatus = payload
  },
  setLastUpdate_UTCDate(state, payload = {}) {
    state.record.lastUpdate_UTCDate = payload
    state.$record.lastUpdate_UTCDate = payload
  },
  setLastUpdateUser(state, payload = {}) {
    state.record.lastUpdateUser = payload
    state.$record.lastUpdateUser = payload
  },
  setInsert_UTCDate(state, payload = {}) {
    state.record.insert_UTCDate = payload
    state.$record.insert_UTCDate = payload
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
  },
  setUiImgUrl(state, payload = null) {
    state.ui.imgURL = payload
  }
}

export const getters = {
  noDeletedList: (s) => s.list.filter(visibleRecord),

  filteredList: (s) =>
    _filter(s.list, function(o) {
      if (s.ui.filter.text === null) {
        return true
      } else {
        return (
          (o.data.CONDescrizione &&
            o.data.CONDescrizione.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            )) ||
          (o.data.CONNote &&
            o.data.CONNote.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            )) ||
          (o.data.CONIndirizzo &&
            o.data.CONIndirizzo.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            ))
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
