import { appDirRes, fs } from '../assets/filesystem'
import PouchDb from 'pouchdb'

const root = { root: true }
const table = 'resources'

export const state = () => {
  return { }
}

export const actions = {
  load({ dispatch }, withFiles = false) {
    return dispatch('db/selectAll_system', { table, option: { attachments: withFiles } }, root)
      .then((lista) => {
        return lista
      })
  },
  async save({ dispatch }, { id, file }) {
    const db = new PouchDb(table)
    await db
      .putAttachment(id, id, file, file.type)
      .then((result) => {
        return result
      })

  },
  getById({ dispatch, commit, state }, id) {
    const db = new PouchDb(table)
    return db
      .getAttachment(id, id)
      .then((blob) => {
        return blob
      })
  },
  getUrlById({ dispatch, commit, state }, id) {
    const db = new PouchDb(table)
    return db
      .getAttachment(id, id)
      .then((blob) => {
        return URL.createObjectURL(blob)
      })
  }
}

export const mutations = {}

export const getters = {}
