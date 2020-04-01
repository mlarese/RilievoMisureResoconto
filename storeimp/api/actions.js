import axios from 'axios'

export const notifyError = (err, translate = null) => {
  let text = 'Error'
  let title = 'Error'
  let type = 'error'

  if (err.response.data && err.response.data.error_message) {
    text = err.response.data.error_message
  } else if (err.response.statusText) {
    text = err.response.statusText
  } else if (err.message) {
    text = err.message
  }

  if (translate) {
    title = translate(title)
    text = translate(text)
  }
  return {title, text, type}
}

export const notifySuccess = ({title, text}) => ({title, text, type: 'success'})

export const baseURL = 'http://89.46.65.174:1001';
const instance = axios.create({
  baseURL,
  timeout: 90000,
  headers: {'Content-Type': 'application/json'},
  withCredentials: false
})

export const actions = {
  init ({commit}) {
    commit('error')
    commit('hasError')
  },
  get ({commit, getters, state, rootState}, {url, options = {}, debug = false}) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')

    if (!options.headers) options.headers = {}
    if(rootState.auth.token) options.headers['authorization'] = rootState.auth.token

    return instance.get(url, options)
      .then(res => {
        commit('isAjax')
        return res
      })
      .catch(err => {
        console.log('get', url)
        console.dir(err)

        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  post ({commit, getters, state, rootState}, {url, data = {}, options = {}}) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')
    //console.log('---- post', url, data, options)

    if (!options.headers) options.headers = {}
    if(rootState.auth.token) options.headers['authorization'] = rootState.auth.token

    return instance.post(url, data, options)
      .then(res => {
        commit('isAjax')
        return res
      })
      .catch(err => {
        console.log('err','post',url)
        console.log(err)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  put ({commit, getters, state, rootState}, {url, data, options = {}}) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')

    if (!options.headers) options.headers = {}
    if(rootState.auth.token) options.headers['authorization'] = rootState.auth.token

    return instance.put(url, data, options)
      .then(res => {
        commit('isAjax')
        return res
      })
      .catch(err => {
        console.log(err)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  delete ({commit, getters, state, rootState}, {url, options = {}}) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')
    console.log(url)

    if (!options.headers) options.headers = {}
    if(rootState.auth.token) options.headers['authorization'] = rootState.auth.token

    return instance.delete(url, options)
      .then(res => {
        commit('isAjax')
        return res
      })
      .catch(err => {
        console.log(err)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  }
}
