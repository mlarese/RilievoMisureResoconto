// import {serviceWorker} from '../plugins/swlisteners'
export const state = () => ({})

export const actions = {
  loadEvents({ dispatch, commit, rootState }) {
    const token = rootState.auth.token

    // serviceWorker.active.postMessage({
    //   type: 'caricaEventi',
    //   token
    // })
  }
}
