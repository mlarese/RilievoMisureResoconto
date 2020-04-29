import PouchDb from 'pouchdb'
import _map from 'lodash/map'
import Vue from 'vue'
import { mapState } from 'vuex'

export const dbList = []
export const systemDBList = {
  auth: new PouchDb('auth'), //DB di sistema - contiene l'utente attualmente loggato, NON dipende da azienda
  // lavori: new PouchDb('lavori'),
  // allegati: new PouchDb('allegati'),
  // rilievi: new PouchDb('rilievi'),
  // rilievoDet: new PouchDb('rilievoDet'),
  // rilievoPos: new PouchDb('rilievoPos'),
  // sysResources: new PouchDb('sysResources')
}
const AUTH_RECORD_ID = 'auth_record_id'

export const state = () => {
  return {}
}

export const visibleRecord = (o) => {
  if (!o.internalStatus) return true
  if (o.internalStatus === 'updated') return true
  if (o.internalStatus === 'added') return true
  if (o.internalStatus === 'added-deleted') return false
  return true
}

const emptyFn = function() {}
export const actions = {
  async selectById_system(
    { commit, dispatch, rootState },
    { table, id, options = { include_docs: true }, callback = emptyFn }
  ) {
    const db = systemDBList[table]
    const res = await db.get(id, options, callback)
    return res
  },
  async selectById(
    { commit, dispatch, rootState },
    { table, id, options = { include_docs: true }, callback = emptyFn }
  ) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const res = await db.get(id, options, callback)
    return res
  },
  async selectAll(
    { commit, dispatch, rootState },
    { table, options = { include_docs: true }, callback = emptyFn }
  ) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const res = db.allDocs(options)
    return res.then((records) => _map(records.rows, 'doc'))
  },
  async query(
    { commit, dispatch, rootState },
    { table, mapFunction, reduceFunction, callback = emptyFn }
  ) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const res = db.query(mapFunction, reduceFunction)
    return res.then((records) => _map(records.rows, 'doc'))
  },
  async merge(
    { commit, dispatch, rootState },
    { table, data, options = { force: true }, callback = emptyFn }
  ) {
    const db =new PouchDb(rootState.auth.azienda + '_' + table)
    try {
      if (!data._id) {
        console.log('---- insert into')
        return await db.post(data, options, callback)
      }
      const doc = await db.get(data._id)
      const response = await db.put(data, options, callback)
      console.log('---- put')
    } catch (err) {
      console.log('---- insert into error')
      return await db.post(data, options, callback)
    }
  },

  async update(
    { commit, dispatch, rootState },
    { table, data, options = { force: true }, callback = emptyFn }
  ) {
    if (!data.internalStatus) Vue.set(data, 'internalStatus', 'updated')
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    return db.put(data, options)
  },
  async update_(
    { commit, dispatch, rootState },
    { table, data, options = { force: true }, callback = emptyFn }
  ) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    db.get(data._id)
      .then(function(doc) {
        const result = {}
        Object.keys(doc).forEach((key) => (result[key] = doc[key]))

        Object.keys(data).forEach((key) => (result[key] = data[key]))
        return db.put(result, options)
      })
      .then(function(response) {
        // handle response
      })
      .catch(function(err) {
        console.log(err)
      })
  },
  async bulkInsertInto({ commit, dispatch, rootState }, { table, data }) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    for (let doc of data) {
      delete doc._ID
      doc['_id'] = doc.uid
    }
    return db.bulkDocs(data)
  },
  async insertInto(
    { commit, dispatch, rootState },
    { table, data, options = null, callback = emptyFn }
  ) {
    Vue.set(data, 'internalStatus', 'added')
    console.log(rootState.auth.azienda)
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    return db.post(data, options, callback)
  },
  async insertInto_system(
    { commit, dispatch, rootState },
    { table, data, options = null, callback = emptyFn }
  ) {
    Vue.set(data, 'internalStatus', 'added')
    const db = systemDBList[table]
    return db.post(data, options, callback)
  },
  async safeDelete({ commit, dispatch, rootState }, { table, data }) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    if (data.internalStatus === 'updated')
      Vue.set(data, 'internalStatus', 'deleted')
    else Vue.set(data, 'internalStatus', 'added-deleted')
    return db.put(data)
  },
  async delete(
    { commit, dispatch, rootState },
    { table, data, options = null, callback = emptyFn }
  ) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    return db.remove(data, options, callback)
  },
  async dbInfo({ commit, dispatch, rootState }, table) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    var result = await db.info()
    return result
  }
}

export const mutations = {}

export const getters = {}
