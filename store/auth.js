import qs from 'qs'
export const state = () => ({
  loggedIn: false,
  token: '',
  utente: '',
  azienda: ''
})

export const mutations = {
  setLoggedIn(state, payload) {
    state.loggedIn = payload
  },
  setToken(state, payload) {
    state.token = payload
  },
  setUtente(state, payload) {
    state.utente = payload
  },
  setAzienda(state, payload) {
    state.azienda = payload
  }
}

const AUTH_RECORD_ID = 'auth_record_id'
const table = 'auth'

const setAuth = (commit, dispatch, state, token) => {
  // Decodifica payload token
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  let tokenJson = JSON.parse(jsonPayload)
  commit('setToken', token)
  commit('setUtente', tokenJson.utente)
  commit('setAzienda', tokenJson.azienda)
  const data = {
    _id: AUTH_RECORD_ID,
    token: state.token,
    utente: tokenJson.utente,
    azienda: tokenJson.azienda
  }

  const id = AUTH_RECORD_ID
  return dispatch('db/selectById_system', { table, id }, { root: true })
    .then((res) => {
      console.log('found login')
    })
    .catch((e) => {
      console.log('selectById_system', e)
      if (e.status && e.status === 404) {
        console.log('--- adding auth record')
        return dispatch(
          'db/insertInto_system',
          { table: 'auth', data },
          { root: true }
        ).then((res1) => {
          commit('setUtente', res1.utente)
          commit('setAzienda', res1.azienda)
          commit('setToken', res1.token)
          commit('setLoggedIn', true)
        })
      }
    })
}

export const actions = {
  async persistentUser({ commit, dispatch }) {
    const id = AUTH_RECORD_ID
    return await dispatch('db/selectById_system', { table, id }, { root: true })
      .then((res) => {
        //console.log('found login', res)
        commit('setUtente', res.utente)
        commit('setAzienda', res.azienda)
        commit('setToken', res.token)
        commit('setLoggedIn', true)
        return res
      })
      .catch((e) => {
        console.log('selectById', e)
      })
  },
  doLogin({ commit, dispatch, state }, data) {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return dispatch(
      'api/post',
      { url: '/api/Users/authenticate', data, options },
      { root: true }
    )
      .then((res) => {
        return setAuth(commit, dispatch, state, res.data)
      })
      .catch((e) => {
        throw e
      })
  },
  doLogout({ commit, dispatch, state }) {
    const id = AUTH_RECORD_ID

    return dispatch('db/selectById_system', { table, id }, { root: true })
      .then((res) => {
        console.log(res)

        return dispatch(
          'db/delete_system',
          { table, data: res },
          { root: true }
        ).then(() => {
          commit('setLoggedIn', false)
          commit('setToken', '')
          commit('setUtente', '')
          commit('setAzienda', '')
        })
      })
      .catch((e) => {
        console.log('selectById', e)
      })
  }
}

export const getters = {}
