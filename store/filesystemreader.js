import {walkFileSystem, createBaseFs, appDir} from '../assets/filesystem'

export const state = () => {
  return {
    fileItems: []
  }
}
export const actions = {
  async load ({commit}, id) {
    const entryPoint = id

    await createBaseFs(entryPoint)
    const files = await walkFileSystem(`${appDir}/${id}`)
    commit('setFileItems', files)
  }
}

export const mutations = {
  setFileItems(state, payload = []) {
    state.fileItems = payload
  }
}


export const getters = {
  noDeletedList: s => s.list.filter(visibleRecord),
  isEdit: (s) => s.modalita === 'EDIT',
  isAdd: (s) => s.modalita === 'ADD',
  formTitle: (s, g) => (g.isEdit)?`Modifica ${s.ui.formTitleSuffix}`:`Aggiungi ${s.ui.formTitleSuffix}`,
  buttonAddTitle: (s) => `Aggiungi ${s.ui.formTitleSuffix}`
}
