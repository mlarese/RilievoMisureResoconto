import qs from 'qs'
export const state = () => ({
  user: {
    userName: 'guest',
    userId: '0'
  },
  loggedIn:false,
  token: ''
})

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setLoggedIn(state, payload) {
    state.loggedIn = payload
  },
  setToken(state, payload) {
    state.token = payload
  }
}

const AUTH_RECORD_ID = 'auth_record_id'
const authRecord = (token, user) => ({token, user, _id: AUTH_RECORD_ID})
const table = 'auth'

const setAuth = (commit, dispatch, token, user) => {
  commit('setToken', token)
  const data = authRecord(token, user)
  const id = AUTH_RECORD_ID

  return dispatch('db/selectById',{table, id}, {root: true} )
    .then(res => {
      console.log('found login')
    })
    .catch(e => {
      console.log('selectById', e)
      if(e.status && e.status===404) {
        console.log('--- adding auth record')
        return dispatch('db/insertInto',{table: 'auth', data}, {root: true})
          .then(res1 => {
            commit('setLoggedIn', true)
          })
      }

    })
}

export const actions = {
  async persistentUser ({commit, dispatch, rootState}) {
    const id = AUTH_RECORD_ID
    return await dispatch('db/selectById',{table, id}, {root: true} )
      .then(res => {
        //console.log('found login', res)
        commit('setUser', res.user)
        commit('setToken', res.token)
        commit('setLoggedIn', true)
        return res
      })
      .catch(e => {
        console.log('selectById', e)
      })
  },
  doLogin ({commit, dispatch}, data) {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return dispatch('api/post', {url: '/api/Users/authenticate', data, options}, {root: true})
      .then(res => {
        return setAuth(commit, dispatch, res.data, data.username)
      })
      .catch(e => {
        console.dir('post /api/Users/authenticate', e)
      })
  }
}

export const getters = {
}
