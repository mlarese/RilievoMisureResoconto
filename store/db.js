import PouchDb from 'pouchdb'
import _map from 'lodash/map'
const dbList = {
  'lavori': new PouchDb('lavori')
}

console.log('db inited')
export const state = () => {
  return {

  }
}

const emptyFn = function () { }
export const actions = {
  selectById({ commit, dispatch }, { table, id, options = { include_docs: true }, callback = emptyFn }) {
    console.log('db.js -> selectById ' + id)

    const db = dbList[table]
    const res = db.get(id, options, callback)
    return res
  },
  selectAll({ commit, dispatch }, { table, options = { include_docs: true }, callback = emptyFn }) {
    console.dir('db.js -> selectAll')
    const db = dbList[table]
    const res = db.allDocs(options)
    return res
      .then(records => _map(records.rows, 'doc'))
  },
  update({ commit, dispatch }, { table, data, options = { force: true }, callback = emptyFn }) {
    const db = dbList[table]
    db.get(data._id).then(function (doc) {

      const result = {};

      Object.keys(doc)
        .forEach(key => result[key] = doc[key]);

      Object.keys(data)
        .forEach(key => result[key] = data[key]);

      // Risalva il doc appena aggiornato
      return db.put(result, options);
    }).then(function (response) {
      // handle response
    }).catch(function (err) {
      console.log(err);
    });
  },
  insertInto({ commit, dispatch }, { table, data, options = null, callback = emptyFn }) {
    const db = dbList[table]
    console.dir('db.js -> insertInto')
    console.dir(data)
    return db.post(data, options, callback)
  },
  delete({ commit, dispatch }, { table, data, options = null, callback = emptyFn }) {
    const db = dbList[table]
    console.dir('db.js -> delete')
    console.log(data)
    return db.remove(data, options, callback)
  }
}

export const mutations = {
}

export const getters = {
}
