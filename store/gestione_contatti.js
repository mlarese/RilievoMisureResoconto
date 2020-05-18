import _clone from 'lodash/clone'
import _filter from 'lodash/filter'
import { v4 as uuidv4 } from 'uuid'
import { visibleRecord } from './db'

const root = { root: true }
const emptyRecord = () => ({
  tipo: null,
  agileID: 0,
  _id: null,
  lastUpdateDate: null,
  lastUpdateUser: null,
  insertDate: null,
  insertUser: null,
  data: {
    CONDescrizione: null,
    CONIndirizzo: null,
    CONTelefono: null,
    CONEmail: null,
    CONNote: false
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
        CONNote: false
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
  getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root).then((rec) =>
      commit('setRecord', rec)
    )
  },
  async upload({ dispatch, commit, state }) {
    let data = state.$record
    const url = '/api/Sincronizza/uploadSingleData'

    // Invia i dati al WS
    return await dispatch('api/post', { url, data }, { root: true })
  },
  async save(
    { dispatch, commit, state, rootState },
    { doUpload, saveLacalAnyway, rawData }
  ) {
    const isInsert = !state.$record._id
    let actionName = 'db/update'

    if (isInsert) {
      actionName = 'db/insertInto'
    }

    // Per rowData si intente la manipolazione di dati base
    // necessario per un salvataggio as is
    if (!rawData) {
      commit('setLastUpdateDate', new Date().toJSON())
      commit('setLastUpdateUser', rootState.auth.utente)

      if (isInsert) {
        commit('setLocalID', uuidv4())
        commit('setInsertDate', new Date().toJSON())
        commit('setInsertUser', rootState.auth.utente)
      }
    }

    if (doUpload) {
      // Invia i dati al WS
      await dispatch('upload')
        .then((res) => {
          commit('setAgileID', res.data)
        })
        .catch((err) => {
          if (saveLacalAnyway) {
            // ignora l'errore di connessione per salvare localmente
            console.log(err)
          } else {
            throw err
          }
        })
    }

    // Salva effettivamente su db
    const table = state.dbName
    return dispatch(actionName, { table, data: state.$record }, root)
      .then(() => {
        // ?????
        return dispatch('load')
      })
      .catch((e) => {
        console.log(e)
        return e
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
  setAgileID(state, payload = {}) {
    state.record.agileID = payload
    state.$record.agileID = payload
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
  }
}

export const getters = {
  noDeletedList: (s) => s.list.filter(visibleRecord),

  filteredList: (s) =>
    _filter(s.list, function(o) {
      if (s.ui.filter.text == '') {
        return true
      } else {
        return (
          o.data.CONDescrizione.toLowerCase().includes(
            s.ui.filter.text.toLowerCase()
          ) ||
          o.data.CONNote.toLowerCase().includes(
            s.ui.filter.text.toLowerCase()
          ) ||
          o.data.CONIndirizzo.toLowerCase().includes(
            s.ui.filter.text.toLowerCase()
          )
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
