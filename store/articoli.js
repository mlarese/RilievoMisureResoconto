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
              .then((res) => {
                Vue.set(art, 'risorsa', res)
                Vue.set(art, 'catalogoDesc', cat.data.JSCatalogoDesc)
                Vue.set(art, 'aziendaDesc', cat.data.JSAzienda.JSDenominazione)
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
  async getById({ dispatch, commit, state }, id) {
    const azienda = id.split('.')[0]
    const catCod = id.split('.')[1]
    const artCod = id.split('.')[2]

    const table = state.dbName
    commit('setList')

    var listaCataloghi = await dispatch('db/selectAll', { table }, root)

    for (const cat of listaCataloghi) {

      if (cat.data.JSAzienda.JSUID = azienda && cat.data.JSCatalogoID === catCod) {

        for (const art of cat.data.JSArticoli) {

          if (art.JSCodice === artCod) {
            var risorsaPrinc = await dispatch('dm_resources/getUrlById', art.JSImmagineRisID, root)

            Vue.set(state.ui, 'risorsaPrinc', risorsaPrinc)
            Vue.set(state.ui, 'catalogoDesc', cat.data.JSCatalogoDesc)
            Vue.set(state.ui, 'aziendaDesc', cat.data.JSAzienda.JSDenominazione)
          }

          for (const res of art.JSRisorse) {
            var urlRes = await dispatch('dm_resources/getUrlById', res.JSRisID, root)

            Vue.set(res, 'risorsa', urlRes)

          }
          commit('setRecord', art)
          return art

        }
      }


    }

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
