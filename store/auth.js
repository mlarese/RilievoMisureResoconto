import qs from 'qs'
export const state = () => ({
  loggedIn: false,
  token: '',
  utente: '',
  azienda: '',
  utenteDesc: '',
  aziendaDsc: ''
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
  },
  setUtenteDesc(state, payload) {
    state.utenteDesc = payload
  },
  setAziendaDesc(state, payload) {
    state.aziendaDesc = payload
  }
}

const AUTH_RECORD_ID = 'auth_record_id'
const table = 'auth'
const root = { root: true }

export const actions = {
  async persistentUser({ commit, dispatch }) {
    const id = AUTH_RECORD_ID
    return await dispatch('db/selectById_system', { table, id }, root)
      .then((res) => {
        commit('setUtente', res.utente)
        commit('setAzienda', res.azienda)
        commit('setToken', res.token)
        commit('setUtenteDesc', res.utenteDesc)
        commit('setAziendaDesc', res.aziendaDesc)
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
    const url = '/api/Users/authenticate'
    return dispatch('api/post', { url, data, options }, root)
      .then((res) => {
        return dispatch('setAuth', { token: res.data }) //(commit, dispatch, state, res.data)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  },
  setAuth({ commit, dispatch, state }, { token }) {
    // Decodifica payload token
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )

    let tokenJson = JSON.parse(jsonPayload)
    commit('setToken', token)
    commit('setUtente', tokenJson.utente)
    commit('setAzienda', tokenJson.azienda)
    commit('setUtenteDesc', tokenJson.utenteDesc)
    commit('setAziendaDesc', tokenJson.aziendaDesc)

    const data = {
      _id: AUTH_RECORD_ID,
      token: state.token,
      utente: tokenJson.utente,
      azienda: tokenJson.azienda,
      utenteDesc: tokenJson.utenteDesc,
      aziendaDesc: tokenJson.aziendaDesc
    }

    const id = AUTH_RECORD_ID
    return dispatch('db/selectById_system', { table, id }, root)
      .then((res) => {
        console.log('found login')

        commit('setUtente', res.utente)
        commit('setAzienda', res.azienda)
        commit('setUtenteDesc', res.utenteDesc)
        commit('setAziendaDesc', res.aziendaDesc)
        commit('setToken', res.token)
        commit('setLoggedIn', true)
      })
      .catch((e) => {
        console.log('selectById_system', e)
        if (e.status && e.status === 404) {
          console.log('--- adding auth record')
          return dispatch('db/insertInto_system', { table, data }, root)
            .catch((err) => {
              console.log(err)
            })
            .then((res1) => {
              // Inserito correttamente
              commit('setLoggedIn', true)
            })
        }
      })
  },

  doLogout({ commit, dispatch, state }) {
    const id = AUTH_RECORD_ID

    return dispatch('db/selectById_system', { table, id }, root)
      .then((res) => {
        console.log(res)

        return dispatch('db/delete_system', { table, data: res }, root)
          .then(() => {
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
