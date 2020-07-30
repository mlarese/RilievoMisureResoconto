import axios from 'axios'

export const notifyError = (err, translate = null) => {
  let text = 'Errore'
  let title = 'Error'
  let type = 'error'

  if (!err.response) {
    return { title, text: 'Errore di connessione al server: nessuna risposta dal server', type }
  }

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
  return { title, text, type }
}

export const notifySuccess = ({ title, text }) => ({
  title,
  text,
  type: 'success'
})

const officialWsUrl = 'https://agile4work.4innovation.srl:1002'

export const baseURL = (() => {
  if (process.env.NODE_ENV === 'production') {
    return officialWsUrl
  } else {
    return process.env.LOCAL_WS_URL || officialWsUrl
  }
})()

const instance = axios.create({
  baseURL,
  timeout: 180000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
})

export const actions = {
  init({ commit }) {
    commit('error')
    commit('hasError')
  },
  get(
    { commit, getters, state, rootState },
    { url, options = {}, debug = false }
  ) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')

    if (!options.headers) options.headers = {}
    if (rootState.auth.token)
      options.headers['authorization'] = rootState.auth.token

    return instance
      .get(url, options)
      .then((res) => {
        commit('isAjax')
        return res
      })
      .catch((err) => {
        console.log('get', url)
        console.dir(err)

        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  post(
    { commit, getters, state, rootState },
    { url, data = {}, options = {} }
  ) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')
    //console.log('---- post', url, data, options)

    if (!options.headers) options.headers = {}
    if (rootState.auth.token)
      options.headers['authorization'] = rootState.auth.token

    return instance
      .post(url, data, options)
      .then((res) => {
        commit('isAjax')
        return res
      })
      .catch((err) => {
        console.log(err)
        console.log('err', 'post', url)
        console.log(err.response)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  put({ commit, getters, state, rootState }, { url, data, options = {} }) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')

    if (!options.headers) options.headers = {}
    if (rootState.auth.token)
      options.headers['authorization'] = rootState.auth.token

    return instance
      .put(url, data, options)
      .then((res) => {
        commit('isAjax')
        return res
      })
      .catch((err) => {
        console.log(err)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  delete({ commit, getters, state, rootState }, { url, options = {} }) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')
    console.log(url)

    if (!options.headers) options.headers = {}
    if (rootState.auth.token)
      options.headers['authorization'] = rootState.auth.token

    return instance
      .delete(url, options)
      .then((res) => {
        commit('isAjax')
        return res
      })
      .catch((err) => {
        console.log(err)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  postFile(
    { commit, getters, state, rootState },
    { url, data, options = {} }
  ) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')
    //console.log('---- post', url, data, options)

    if (!options.headers) options.headers = {}
    if (rootState.auth.token)
      options.headers['authorization'] = rootState.auth.token

    options.headers['Content-Type'] = 'multipart/form-data'
    var formData = new FormData()
    formData.append('file', data.file)
    formData.append('head', JSON.stringify(data.data))
    formData.append('filename', data.fileName)
    console.log(formData)
    return instance
      .post(url, formData, options)
      .then((res) => {
        commit('isAjax')
        return res
      })
      .catch((err) => {
        console.log(err)
        console.log('err', 'post', url)
        console.log(err.response)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  },
  getFile(
    { commit, getters, state, rootState },
    { url, options = {} }
  ) {
    commit('isAjax', true)
    commit('error')
    commit('hasError')
    //console.log('---- post', url, data, options)

    if (!options.headers) options.headers = {}
    if (rootState.auth.token)
      options.headers['authorization'] = rootState.auth.token

    options.responseType = 'blob'
    return instance
      .get(url, options)
      .then((res) => {
        commit('isAjax')
        return res
      })
      .catch((err) => {
        console.log(err)
        console.log('err', 'post', url)
        console.log(err.response)
        commit('isAjax')
        commit('error', err)
        commit('hasError', true)
        commit('notification', notifyError(err))
        return Promise.reject(err)
      })
  }

}
