import _clone from 'lodash/clone'
import uuid from 'uuid/v1'
import Vue from 'vue'

const root = { root: true }
const demoRecord = () => ({
  uid: uuid(),
  catalogo: 'AGILE',
  codice: 'SER',
  macroComandi: 'MACRO:DEMO1',
  propertys: [
    { name: 'L', label: 'Larghezza', type: 'DEC' },
    { name: 'H_SX', label: 'Altezza', type: 'DEC' },
    { name: 'H_DX', label: 'Altezza dx', type: 'DEC' }
  ]
})

export const state = () => {
  return {
    list: [],
    $record: {},
    record: {},
    dbName: 'cataloghi',
    ui: {
      title: 'Articoli',
      filter: {},
      imgURL: null
    }
  }
}
export const actions = {
  load({ commit, dispatch, state }) {
    const table = state.dbName
    commit('setList')
    return dispatch('db/selectAll', { table }, root)
      .then((listaCataloghi) => {
        listaCataloghi.forEach(cat => {
          cat.data.JSArticoli.forEach(art => {
            dispatch('dm_resources/getUrlById', art.JSImmagineRisID, root)
              .then((url) => {
                Vue.set(art, 'imgURL', url)
              })
            Vue.set(art, '_id', `${cat.data.JSAzienda.JSUID}.${cat.data.JSCatalogoID}.${art.JSCodice}`)
            commit('addInList', art)
          })
        });
        return listaCataloghi
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  getById({ dispatch, commit, state }, id) {
    const azienda = id.split('.')[0]
    const catCod = id.split('.')[1]
    const artCod = id.split('.')[2]

    const table = state.dbName
    commit('setList')
    dispatch('db/selectAll', { table }, root)
      .then((listaCataloghi) => {
        listaCataloghi.forEach(cat => {
          if (cat.data.JSAzienda.JSUID = azienda && cat.data.JSCatalogoID === catCod) {
            cat.data.JSArticoli.forEach(art => {
              if (art.JSCodice === artCod) {
                dispatch('dm_resources/getUrlById', art.JSImmagineRisID, root)
                  .then((url) => {
                    Vue.set(state.ui, 'imgURL', url)
                  })
                commit('setRecord', art)
                return art
              }
            })
          }
        });
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  }
}

export const mutations = {
  setList(state, payload = []) {
    state.list = payload
  },
  addInList(s, p) {
    if (!s.list) s.list = []
    s.list.push(p)
  },
  setRecord(state, payload = {}) {
    state.record = payload
  }
}

export const getters = {}
