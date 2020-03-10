import _clone from 'lodash/clone'

const root = { root: true }
export const state = () => {
  return {
    list: {}
  }
}
export const actions = {
  importLavori ({commit, dispatch, rootState}) {
    const url = '/lavori/getall'
    return dispatch('api/get', {url}, {root: true})
      .then(res => {
        console.dir(res);
      })
  }
}

export const mutations = {
}

export const getters = {
}
