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

export const actions = {
  doLogin ({commit, dispatch}, data) {
    //data=JSON.stringify(data)
    data = qs.stringify(data);
    console.dir(data)
    const options = {
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'text/plain'
        //'Accept': '*/*'
      }
    }
    dispatch('api/post', {url: '/auth/login', data, options}, {root: true})
      .then(res => commit('setToken', 'YWRtaW4tQURNSU4yOS8wMi8yMDIwIDAwOjAwOjAw'))
      .catch(e => {
        commit('setToken', 'YWRtaW4tQURNSU4yOS8wMi8yMDIwIDAwOjAwOjAw')
        commit('setLoggedIn', true)
      })
  }
}

export const getters = {
}
