import { dbList } from './db'

const root = { root: true }
const table = dbList['CFG']
const id = 'cfg_record_id'

export const state = () => {
    return {
        cfg: {}
    }
}

export const actions = {
    load({ commit, dispatch, state }) {
        return dispatch('db/selectById', { table, id }, root)
            .then((res) => {
                commit('setCfg', res)
                return res
            })
            .catch((e) => {
                console.log('selectById', e)
            })
    }
}

export const mutations = {
    setCfg(state, payload) {
        state.cfg = payload.data
    }
}

export const getters = {
    getEV_ClassificazioneList: (s) => {
        return s.cfg.EV_ClassificazioneList
    },
    getAPI_BaseUrl: (s) => {
        return s.cfg.API_BaseUrl
    }
}