
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
                console.log(res.data)
                commit('setList', res.data)
                return res.data
            })
            .catch((e) => {
                console.log(e)
                return e
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
    getListaClassEventi: (state) => {
        return _filter(state.list, function(c) {
            return c.CCTipo === 'EV_CLASSIFICAZIONE'
        })
    }
}
