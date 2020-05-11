import { appDirRes, fs } from '../assets/filesystem'

const root = { root: true }
export const state = () => {
  return {
    listaRisorse: [],
    record: {
      _id: null,
      rifID: null,
      type: '',
      filename: '',
      thumbnail: ''
    },
    dbName: 'sysResources'
  }
}

export const actions = {
  update({ commit, dispatch, state }, {azienda, risorsa}) {
    // Chiamata al ws per scaricare la risorsa
    let url = `api/risorse/getRisorsa?azienda=${azienda}&catalogo=${risorsa.catalogo}&codice=${risorsa.codice}`

    dispatch('api/get', { url }, { root: true})
    .then((res) => {
      // Risorsa scaricata correttamente
      
      // -> Verifica lo stato della risorsa
      // -> La risorsa è dismessa (?? eliminiamo / liberiamo spazio ??)

      // salva il file della risorsa localmente
      // dispatch('saveFile', { file: res.imgStr, path: appDirRes(), fs, store: this.$store})
      let path = appDirRes()
      let curFileName
      let reader = new FileReader();
      reader.readAsBinaryString(res.imgStr)
      reader.onload = (data) => {
        let fileBlob = data.currentTarget.result
        curFileName = `${path}/${file.name}`

        fs.writeFile(curFileName, fileBlob, (res) => {
          console.log('-- Saving Photo')
          if(res) {
            alert('Errore nel salvataggio')
            console.log(res)
            // store.commit('app/setError',res, {root: true})
          }

        })
      }
      
      // Aggiorna la risorsa con i nuovi dati
      commit('setHash', res.hash)
      commit('setPath', curFileName)
      
      // salva la risorsa (con il nuovo hash e percorso locale)
      dispatch('save')
    })
    .catch((e) => {
      console.log(e)
      return e
    })   
  },
  
  load({ commit, dispatch, state }) {
    const table = state.dbName
    return dispatch('db/selectAll', { table }, root)
      .then((res) => {
        commit('setList', res)
        commit('setRecord', {})
        return res
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  getById({ dispatch, commit, state }, id) {
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root).then((rec) =>
      commit('setRecord', rec)
    )
  },
  getByAziendaCatalogoCodice({ dispatch, commit, state }, filtro){

  },
  save({ dispatch, commit, state }) {
    const rec = state.record
    const table = state.dbName
    const isInsert = !rec._id
    let actionName = 'db/update'
    if (isInsert) {
      actionName = 'db/insertInto'
    }
    return dispatch(actionName, { table, data: rec }, root)
      .then(() => {
        return dispatch('load')
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  deleteByID({ dispatch, commit, state }, id) {
    console.log('start deleteByID ' + id)
    const table = state.dbName
    dispatch('db/selectById', { table, id }, root)
      .then((rec) => dispatch('deleteDoc', rec))
      .catch((e) => {
        console.log(e)
        return e
      })
  },
  deleteDoc({ dispatch, commit, state }, rec) {
    let actionName = 'db/delete'
    console.log('start deleteDoc ' + rec)
    const table = state.dbName
    return dispatch(actionName, { table, data: rec }, root)
      .then(() => {
        return dispatch('load')
      })
      .catch((e) => {
        console.log(e)
        return e
      })
  }
}

export const mutations = {
  setRecord(state, payload = {}) {
    state.record = payload
  },
  setLista(state, payload = []) {
    state.listaRisorse = payload
  }
}

export const getters = {}
