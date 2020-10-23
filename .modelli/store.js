import _CloneDeep from "lodash/cloneDeep";
import _CloneDeep from 'lodash/cloneDeep'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import _orderBy from 'lodash/orderBy'
import { v4 as uuidv4 } from 'uuid'
import { visibleRecord, syncStates, internalStates } from './db'
import Vue from 'vue'

const root = { root: true }
const emptyRecord = () => ({
  _id: null,
  tipo: '',
  syncStatus: syncStates['NOT_SYNC'],
  lastUpdate_UTCDate: null,
  insert_UTCDate: null,
  lastUpdateUser: null,
  insertUser: null,
  data: {
  }
})

export const state = () => ({
  list: [],
  $record: {
    data: {
    }
  },
  record: { data: {} },
  dbName: '',
  modalita: 'FIND',
  ui: {
    title: '',
    formTitleSuffix: '',
    filter: {}
  }
})

export const actions = {
  load({ commit, dispatch, state }, withFile = false) {
    const table = state.dbName
    commit('setList', [])
    return dispatch('db/selectAll', { table }, root).then(lista => {
      lista.forEach(element => {
        if (withFile && element.data.imgFileName) {
          dispatch('dm_resources/getRisorsaById', element.data.imgFileName, root).then(res => {
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
      dispatch('dm_resources/getRisorsaById', rec.data.imgFileName, root).then(url => {
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
  },
  safeDelete({ dispatch, commit, state }, rec) {
    const table = state.dbName
    return dispatch('db/safeDelete', { table, data: rec }, root)
      .then(() => {
        return dispatch('load')
      })
      .catch(e => {
        console.log(e)
        return e
      })
  },
  deleteByID({ dispatch, commit, state }, id) {
    console.log('start deleting' + id)
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root)
      .then(rec => dispatch('deleteDoc', rec))
      .catch(e => {
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
      .catch(e => {
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

export const actions = {
}

export const getters = {
}
