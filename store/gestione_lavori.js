import _clone from 'lodash/clone'
import _filter from 'lodash/filter'
import uuid from 'uuid/v1'
import { visibleRecord } from './db'
import Vue from 'vue'

const root = { root: true }
const emptyRecord = () => ({
  committenteDesc: null,
  descrizione: null,
  luogo: null,
  note: null,
  isPreferito: false
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
  save({ dispatch, commit, state }) {
    const rec = state.$record
    const table = state.dbName
    const isInsert = !rec._id
    let actionName = 'db/update'
    if (isInsert) {
      actionName = 'db/insertInto'
    }

    return dispatch(actionName, { table, data: rec }, root)
      .then(() => {
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
          return o.isPreferito === s.ui.filter.preferito
        } else {
          return (
            (o.committenteDesc
              .toLowerCase()
              .includes(s.ui.filter.text.toLowerCase()) ||
              o.descrizione
                .toLowerCase()
                .includes(s.ui.filter.text.toLowerCase()) ||
              o.luogo.toLowerCase().includes(s.ui.filter.text.toLowerCase())) &&
            o.isPreferito === s.ui.filter.preferito
          )
        }
      } else {
        /* tutti */
        if (s.ui.filter.text == "") {
          return true
        } else {
          return (
            o.committenteDesc
              .toLowerCase()
              .includes(s.ui.filter.text.toLowerCase()) ||
            o.descrizione
              .toLowerCase()
              .includes(s.ui.filter.text.toLowerCase()) ||
            o.luogo.toLowerCase()
              .includes(s.ui.filter.text.toLowerCase())
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
