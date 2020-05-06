import _clone from 'lodash/clone'
import _filter from 'lodash/filter'
import { v4 as uuidv4 } from 'uuid'
import { visibleRecord } from './db'
import Vue from 'vue'
import { DxRow } from 'devextreme-vue/responsive-box'

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
    GL_CommittenteDesc: null,
    GL_Descrizione: null,
    GL_Indirizzo: null,
    GL_Note: null,
    isPreferito: false
  }
})

export const state = () => {
  return {
    list: [],
    $record: {},
    record: {},
    dbName: 'lavori',
    modalita: 'FIND',
    ui: {
      title: 'Gestione Lavori',
      formTitleSuffix: 'Lavoro',
      filter: { preferito: false, text: '' }
    }
  }
}
export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName
    return dispatch('db/selectAll', { table }, root)
      .then((res) => {
        commit('setList', res)
        // commit('setRecord', {})
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

    // Prepara l'header da inviare
    // let header = {
    //   tipo: 'LAVORO', // tipo(lavoro, contatto, rilievo ...)
    //   GUID: lavoro._id, //- GUID
    //   agileID: lavoro.agileID, //- ID di Agile(null se nuovo)
    //   lastUpdateDate: lavoro.lastUpdateDate, //- data ultima modifica
    //   lastUpdateUser: lavoro.lastUpdateUser, //- utente ultima modifica
    //   insertDate: lavoro.insertDate, //- (ev data / utente di inserimento?)
    //   insertUser: lavoro.insertUser
    // }

    // let data = {
    //   header,
    //   jsonData: JSON.stringify(lavoro)
    // }

    // const options = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // }

    const url = '/api/Sincronizza/uploadSingleData'

    // Invia i dati al WS
    return await dispatch('api/post', { url, data }, { root: true })
    // .then((res) => {
    //   console.log(res)
    //   // Il ws restituisce AgileID
    //   // lavoro.agileID = res.data
    //   // commit('gestione_lavori/setRecord', lavoro, { root: true })
    //   // // Salva il lavoro con i nuovi dati restituiti dal WS
    //   // dispatch('gestione_lavori/save', {}, { root: true })
    // })
    // .catch((e) => {
    //   throw e
    // })
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
  },
  impostaModalitaVisualizzazione({ dispatch, commit, state }, modalita) {
    commit('setModalita', modalita)
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
      if (s.ui.filter.preferito) {
        /* preferiti */
        if (s.ui.filter.text === null) {
          return o.data.isPreferito === s.ui.filter.preferito
        } else {
          return (
            (o.data.GL_CommittenteDesc.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            ) ||
              o.data.GL_Descrizione.toLowerCase().includes(
                s.ui.filter.text.toLowerCase()
              ) ||
              o.data.GL_Indirizzo.toLowerCase().includes(s.ui.filter.text.toLowerCase())) &&
            o.data.isPreferito === s.ui.filter.preferito
          )
        }
      } else {
        /* tutti */
        if (s.ui.filter.text == '') {
          return true
        } else {
          return (
            o.data.GL_CommittenteDesc.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            ) ||
            o.data.GL_Descrizione.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            ) ||
            o.data.GL_Indirizzo.toLowerCase().includes(s.ui.filter.text.toLowerCase())
          )
        }
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
