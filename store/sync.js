import _clone from 'lodash/clone'
import {dbList} from './db'

const root = { root: true }
export const state = () => {
  return {
    updatingStatus: false,                        // è in corso l'aggiornamento dello stato
    statusUpdated: false,                         // lo stato è stato aggiornato
    synchronized: false,                          // la app sta sincronizzando i dati
    synchronizing: false,                         // la app è sincronizzata
    dbStatus: {}                                  // stato dei db
  }
}

export const actions = {
  async updateStatus ({commit, dispatch}) {
    commit('setUpdatingStatus', true)

    let dbStatus = {}
    let synchronized = false

    for(let dbName in dbList) {
      let curStatus = await dispatch('db/dbInfo', dbName, {root: true})
      dbStatus[dbName] = curStatus

      if(curStatus.doc_count > 0) {
        if(dbName !== 'auth') {
          synchronized = true
        }
      }
    }

    commit('setSynchronized', synchronized)
    commit('setDbStatus', dbStatus)
    commit('setUpdatingStatus', false)
    commit('setStatusUpdated', true)
  },
  importAll ({commit, dispatch, rootState}) {
    commit('setSynchronizing', true)

    const all = [
      dispatch('importLavori')
    ]

    return Promise.all(all)
      .then(() => {
        commit('setSynchronizing', false)
        return dispatch('updateStatus')
      })

  },
  importLavori ({commit, dispatch}) {
    const url = '/lavori/getall'
    return dispatch('api/get', {url}, {root: true})
      .then(res => {
        const {data} = res
        dispatch('db/bulkInsertInto', {table: 'lavori', data}, {root: true})
      })
  }
}

export const mutations = {
  setDbStatus (s, p) { s.dbStatus = p},
  setUpdatingStatus (s, p) { s.updatingStatus = p},
  setStatusUpdated (s, p) { s.statusUpdated = p},
  setSynchronized (s, p) { s.synchronized = p},
  setSynchronizing (s, p) { s.synchronizing = p}
}

export const getters = {
  canUpdate: s => s.statusUpdated === false
}
