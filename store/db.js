import PouchDb from 'pouchdb'
import _map from 'lodash/map'
import Vue from 'vue'

export const dbList = {
  LAVORO: 'lavori',
  CATALOGO: 'cataloghi',
  CONTATTO: 'contatti',
  EVENTO: 'appuntimm',
  CFG: 'config',
  CLASSIFICAZIONE: 'classificazione'
}

export const syncStates = {
  NOT_SYNC: 'L',
  PARTIAL_SYNC: 'P',
  COMPLETO: 'C'
}

export const internalStates = {
  ADDED: 'A',
  MODIFIED: 'M',
  DELETED: 'D'
}

export const systemDBList = {
  auth: new PouchDb('auth'), //DB di sistema - contiene l'utente attualmente loggato, NON dipende da azienda
  resources: new PouchDb('resources'),
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

const emptyFn = function () { }
export const actions = {
  async selectById_system({ }, { table, id, options = { include_docs: true }, callback = emptyFn }) {
    const db = systemDBList[table]
    const res = await db.get(id, options, callback)
    return res
  },
  async selectById({ rootState }, { table, id, options = { include_docs: true }, callback = emptyFn }) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const res = db.get(id, options, callback)
    // console.dir(res)
    return res
  },
  async selectAll({ rootState }, { table, options = { include_docs: true } }) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const res = db.allDocs(options)
    return res.then((records) => _map(records.rows, 'doc'))
  },
  async selectAll_system({ rootState }, { table, options = { include_docs: true } }) {
    const db = new PouchDb(table)
    const res = db.allDocs(options)
    return res.then((records) => _map(records.rows, 'doc'))
  },
  async query({ rootState }, { table, mapFunction, reduceFunction }) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const res = db.query(mapFunction, reduceFunction)
    return res.then((records) => _map(records.rows, 'doc'))
  },
  async merge(
    { commit, dispatch, rootState },
    { table, data, options = { force: true }, callback = emptyFn }
  ) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
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

  getAttachment({ commit, dispatch, rootState }, { table, docID, fileName }) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    return db
      .getAttachment(docID, fileName)
      .then((blob) => {
        return blob
      })
      .catch((err) => console.log(err))
  },
  async update(
    { commit, dispatch, rootState },
    { table, data, options = { force: true }, callback = emptyFn }
  ) {
    if (!data.internalStatus) Vue.set(data, 'internalStatus', 'updated')
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const doc = await db.get(data._id)
    data._rev = doc._rev
    return db.put(data, options)
  },
  async updateProp({ rootState }, { table, docID, prop, value }) {
    const options = { force: true }
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    const doc = await db.get(docID)
    doc[prop] = value
    return db.put(doc, options)
  },
  async bulkInsertInto({ commit, dispatch, rootState }, { table, data }) {
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    for (let doc of data) {
      delete doc._ID
      doc['_id'] = doc.uid
    }
    return db.bulkDocs(data)
  },
  async insertInto({ commit, dispatch, rootState }, { table, data, options = null, callback = emptyFn }) {
    Vue.set(data, 'internalStatus', 'added')
    console.log(rootState.auth.azienda)
    const db = new PouchDb(rootState.auth.azienda + '_' + table)
    return db.post(data, options, callback)
  },
  async insertInto_system({ commit, dispatch, rootState },{ table, data, options = null, callback = emptyFn }) {
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
  async delete_system(
    { commit, dispatch },
    { table, data, options = null, callback = emptyFn }
  ) {
    console.log(table, data)
    const db = new PouchDb(table)
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
