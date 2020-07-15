export const state = () => {
  return {
    ui: {
      tabsCameraPhoto: 0
    },
    file: null,
    imgUrl: null
  }
}
export const actions = {
}

export const mutations = {
  setList(state, payload = []) {
    state.list = payload
  }
}


export const getters = {
  isPhotocamera: s => s.ui.tabsCameraPhoto === 0,
  isPhotos: s => s.ui.tabsCameraPhoto === 1
}
