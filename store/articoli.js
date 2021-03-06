import _clone from 'lodash/clone'
import _filter from 'lodash/filter'
import uuid from 'uuid/v1'
import Vue from 'vue'
import { syncStates } from './db'

const root = { root: true }
const demoRecord = () => ({
  uid: uuid(),
  catalogo: 'AGILE',
  codice: 'SER',
  macroComandi: 'MACRO:DEMO1',
  ui: {
    filterText: ''
  }
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
      imgURL: null,
      risorsaPrinc: {},
      catalogoDesc: null,
      aziendaDesc: null
    }
  }
}
export const actions = {
  async load({ commit, dispatch, state }) {
    const table = state.dbName
    commit('setList')
    let listaCataloghi = await dispatch('db/selectAll', { table }, root)

    for (const cat of listaCataloghi) {
      const listaArt = cat.data.JSArticoli
      if (!listaArt) continue;
      if (cat.syncStatus != syncStates['COMPLETO']) continue

        for (let art of listaArt) {

          try {
            const res = await dispatch('dm_resources/getRisorsaById', art.JSImmagineRisID, root)
            Vue.set(art, 'risorsa', res) 
          } catch (error) {
            // risorsa non presente
          }

          Vue.set(art, 'catalogoDesc', cat.data.JSCatalogoDesc)
          Vue.set(art, 'aziendaDesc', cat.data.JSAzienda.JSDenominazione)
          Vue.set(art, 'catalogoCodice', cat.data.JSCatalogoID)

          Vue.set(art, '_id', `${cat.data.JSAzienda.JSUID}.${cat.data.JSCatalogoID}.${art.JSCodice}`)
          commit('addInList', art)

        }
    }
    return listaCataloghi
  },
  async getById({ dispatch, commit, state }, id) {
    const azienda = id.split('.')[0]
    const catCod = id.split('.')[1]
    const artCod = id.split('.')[2]

    const table = state.dbName
    commit('setList')

    var listaCataloghi = await dispatch('db/selectAll', { table }, root)

    for (const cat of listaCataloghi) {

      if (cat.data.JSAzienda.JSUID == azienda && cat.data.JSCatalogoID === catCod) {

        for (const art of cat.data.JSArticoli) {

          if (art.JSCodice === artCod) {
            var risorsaPrinc = await dispatch('dm_resources/getRisorsaById', art.JSImmagineRisID, root)

            commit('setUiRisorsaPrinc', risorsaPrinc)
            commit('setUiCatalogoDesc', cat.data.JSCatalogoDesc)
            commit('setUiAziendaDesc', cat.data.JSAzienda.JSDenominazione)
            
            for (const res of art.JSRisorse) {
              var urlRes = await dispatch('dm_resources/getRisorsaById', res.JSRisID, root)
              
              Vue.set(res, 'risorsa', urlRes)
              
            }
            commit('setRecord', art)
            return art
          }

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
  },
  setUiRisorsaPrinc(state, payload = {}) {
    state.ui.risorsaPrinc = payload
  },
  setUiCatalogoDesc(state, payload = null) {
    state.ui.catalogoDesc = payload
  },
  setUiAziendaDesc(state, payload = null) {
    state.ui.aziendaDesc = payload
  }
}

export const getters = {
  getListaFiltrata: (s) =>
    _filter(s.list, function (o) {
      if (s.ui.filterText) {
        //JSDescrizione catalogoDesc
        // aziendaDesc
        return (
          (
            ((o.JSDescrizione) && o.JSDescrizione.toLowerCase().includes(s.ui.filterText.toLowerCase())) ||
            ((o.catalogoDesc) && o.catalogoDesc.toLowerCase().includes(s.ui.filterText.toLowerCase())) ||
            ((o.aziendaDesc) && o.aziendaDesc.toLowerCase().includes(s.ui.filterText.toLowerCase())))
        )
      } else {
        return true
      }
    })

}
