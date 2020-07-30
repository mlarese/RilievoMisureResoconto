
import { dbList } from './db'
import _filter from 'lodash/filter'

export const state = () => ({
    list: []
})

const RECORD_ID = 'CLASSIFICAZIONE'
const table = dbList['CLASSIFICAZIONE']
const root = { root: true }

export const actions = {
    load({ commit, dispatch }) {
        return dispatch('db/selectById', { table, id: RECORD_ID }, root)
            .then((res) => {
                commit('setList', res.data)
                return res.data
            })
            .catch((e) => {
                console.log('nessuna classificazione presente a db', e)
            })
    },
    getDescrizioneById({ state }, id) {
        const cl = state.list.find(c => c.CCID === id)
        if (cl) return cl.CCDescrizione
        return ''
    }
}

export const mutations = {
    setList(state, payload) {
        state.list = payload
    }
}

export const getters = {
    listaClassEventi: (state) => {
        return _filter(state.list, function (c) {
            return c.CCTipo === 'EV_CLASSIFICAZIONE'
        })
    }
}
