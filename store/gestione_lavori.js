import _CloneDeep from 'lodash/cloneDeep'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import { visibleRecord, syncStates, internalStates } from './db'
import { repoFilename } from '../assets/filters'
import Vue from 'vue'

const root = { root: true }
const emptyRecord = () => ({
  _id: null,
  tipo: 'LAVORO',
  syncStatus: syncStates['NOT_SYNC'],
  lastUpdate_UTCDate: null,
  insert_UTCDate: null,
  lastUpdateUser: null,
  insertUser: null,
  data: {
    GL_CommittenteDesc: null,
    GL_Oggetto: null,
    GL_Indirizzo: null,
    GL_Note: null,
    isPreferito: false,
    imgFileName: null
  }
})

export const state = () => {
  return {
    list: [],
    $record: {
      data: {
        GL_CommittenteDesc: null,
        GL_Oggetto: null,
        GL_Indirizzo: null,
        GL_Note: null,
        isPreferito: false,
        imgFileName: null
      }
    },
    record: { data: {} },
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
  load({ commit, dispatch, state }, withFile = false) {
    const table = state.dbName
    commit('setList', [])
    return dispatch('db/selectAll', { table }, root)
      .then((lista) => {
        lista.forEach((element) => {
          if (withFile && element.data.imgFileName) {
            dispatch('dm_resources/getUrlById', element.data.imgFileName, root)
              .then((url) => {
                //console.log(url)
                if (url && url.thumbnailUrl) {
                  Vue.set(element, 'imgURL', url.thumbnailUrl)
                } else {
                  Vue.set(element, 'imgURL', null)
                }
              })
          }
          commit('addInList', element)
        })
        return lista
      })
/*     const table = state.dbName
      return dispatch('db/selectAll', { table }, root)
      .then((res) => {
        commit('setList', res)
        // commit('setRecord', {})
        return res
      })
      .catch((e) => {
        console.log(e)
        return e
      }) */
  },
  async getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    const rec = await dispatch('db/selectById', { table, id }, root)
    commit('setRecord', rec)

    if (rec.data.imgFileName) {
      dispatch('dm_resources/getUrlById', rec.data.imgFileName, root)
        .then((url) => {
          //console.log(url)
          if (url && url.thumbnailUrl) {
            Vue.set(state.ui, 'imgURL', url.thumbnailUrl)
            //console.log(state.ui.imgURL)
          } else {
            Vue.set(state.ui, 'imgURL', null)
          }
        })
    } else {
      Vue.set(state.ui, 'imgURL', null)
    }
  },
  async save({ dispatch, commit, state, rootState }) {
    const isInsert = !state.$record._id
    const table = state.dbName
    let actionName = 'db/update'

    if (isInsert) {
      actionName = 'db/insertInto'
    }

    //console.log('save actionname:' + actionName)

    commit('setLastUpdate_UTCDate', new Date().toJSON())
    commit('setLastUpdateUser', rootState.auth.utente)

    if (isInsert) {
      commit('setSyncStatus', syncStates['NOT_SYNC'])
      commit('setInsert_UTCDate', new Date().toJSON())
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

    // Genera un nuovo filename per la risorsa
    const fileName = repoFilename(file.name)

    // Salva fisicamente il file come risorsa
    await dispatch('dm_resources/save', { id: fileName, file }, root)

    // Aggiorna il nuovo nome del file
    let listaRis = [fileName]

    // Aggiorna i riferimenti alla risorsa
    commit('setImgFileName', fileName)
    commit('setListaRisorse', listaRis)

    // Salva il documento
    await dispatch('save')

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
  },
  annullaModificheRecord({ dispatch, commit, state }) {
    commit('setRecord', state.record)
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
    state.$record = payload
    state.record = _CloneDeep(payload)
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
  }

}

export const getters = {
  noDeletedList: (s) => s.list.filter(visibleRecord),
  filteredList: (s) =>
    _filter(s.list, function (o) {
      if (s.ui.filter.preferito) {
        /* preferiti */
        if (s.ui.filter.text === null) {
          return o.data.isPreferito === s.ui.filter.preferito
        } else {
          return (
            (
              ((o.data.GL_CommittenteDesc) && o.data.GL_CommittenteDesc.toLowerCase().includes(s.ui.filter.text.toLowerCase())) ||
              ((o.data.GL_Oggetto) && o.data.GL_Oggetto.toLowerCase().includes(s.ui.filter.text.toLowerCase())) ||
              ((o.data.GL_Indirizzo) && o.data.GL_Indirizzo.toLowerCase().includes(s.ui.filter.text.toLowerCase()))) &&
            o.data.isPreferito === s.ui.filter.preferito
          )
        }
      } else {
        /* tutti */
        if (s.ui.filter.text === null) {
          return true
        } else {
          return (
            ((o.data.GL_CommittenteDesc) && o.data.GL_CommittenteDesc.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            )) ||
            ((o.data.GL_Oggetto) && o.data.GL_Oggetto.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            )) ||
            ((o.data.GL_Indirizzo) && o.data.GL_Indirizzo.toLowerCase().includes(
              s.ui.filter.text.toLowerCase()
            ))

        // if (s.ui.filter.text === null) {
        //   return true
        // } else {
        //   return ((o.data.GL_CommittenteDesc && o.data.GL_CommittenteDesc.toLowerCase().includes(s.ui.filter.text.toLowerCase())) ||
        //     (o.data.GL_Oggetto && o.data.GL_Oggetto.toLowerCase().includes(s.ui.filter.text.toLowerCase())) ||
        //     (o.data.GL_Indirizzo && o.data.GL_Indirizzo.toLowerCase().includes(s.ui.filter.text.toLowerCase()))

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
