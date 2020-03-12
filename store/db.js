import PouchDb from 'pouchdb'
import _map from 'lodash/map'

export const dbList = {
  'lavori': new PouchDb('lavori'),
  'auth': new PouchDb('auth')
}

export const state = () => {
  return {

  }
}

const emptyFn = function () {}
export const actions = {
  async selectById({ commit, dispatch }, { table, id, options = { include_docs: true }, callback = emptyFn }) {
    const db = dbList[table]
    const res = await db.get(id, options, callback)
    return res
  },
  async selectAll({ commit, dispatch }, { table, options = { include_docs: true }, callback = emptyFn }) {
    const db = dbList[table]
    const res = db.allDocs(options)
    return res
      .then(records => _map(records.rows, 'doc'))
  },
  async merge({ commit, dispatch }, { table, data, options = { force: true }, callback = emptyFn }) {
    const db = dbList[table]
    try {
      if(!data._id) {
        console.log('---- insert into')
        return await db.post(data, options, callback )
      }
      const doc = await db.get(data._id)
      const response = await db.put(data, options, callback )
      console.log('---- put')
    } catch (err) {
      console.log('---- insert into error')
      return await db.post(data, options, callback )
    }
  },

  async update({ commit, dispatch }, { table, data, options = { force: true }, callback = emptyFn }) {
    const db = dbList[table]
    db.get(data._id).then(function (doc) {
      const result = {};
      Object.keys(doc)
        .forEach(key => result[key] = doc[key]);

      Object.keys(data)
        .forEach(key => result[key] = data[key]);
      return db.put(result, options);
    }).then(function (response) {
      // handle response
    }).catch(function (err) {
      console.log(err);
    });
  },
  async bulkInsertInto({ commit, dispatch }, { table, data}) {
    const db = dbList[table]
    return db.bulkDocs(data)
  },
  async insertInto({ commit, dispatch }, { table, data, options = null, callback = emptyFn }) {
    const db = dbList[table]
    return db.post(data, options, callback)
  },
  async delete({ commit, dispatch }, { table, data, options = null, callback = emptyFn }) {
    const db = dbList[table]
    return db.remove(data, options, callback)
  },
  async dbInfo ({ commit, dispatch }, table) {
    const db = dbList[table]
    var result = await db.info()
    return result
  }

}

export const mutations = {
}

export const getters = {
}
