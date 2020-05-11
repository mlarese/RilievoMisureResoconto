import _clone from 'lodash/clone'
import { dbList } from './db'

const root = { root: true }
export const state = () => {
  return {
    updatingStatus: false, // è in corso l'aggiornamento dello stato
    statusUpdated: false, // lo stato è stato aggiornato
    synchronized: false, // la app sta sincronizzando i dati
    synchronizing: false, // la app è sincronizzata
    dbStatus: {} // stato dei db
  }
}

export const actions = {
  async updateStatus({ commit, dispatch }) {
    commit('setUpdatingStatus', true)
    commit('setSynchronizing', false)
    commit('setSynchronizing', false)

    let dbStatus = {}
    let synchronized = false

    for (let dbName in dbList) {
      let curStatus = await dispatch('db/dbInfo', dbName, { root: true })
      dbStatus[dbName] = curStatus

      if (curStatus.doc_count > 0) {
        if (dbName !== 'auth') {
          synchronized = true
        }
      }
    }

    commit('setSynchronized', synchronized)
    commit('setDbStatus', dbStatus)
    commit('setUpdatingStatus', false)
    commit('setStatusUpdated', true)
  },
  syncAll({ commit, dispatch, rootState }){
    // Importa nuovi dati se ce ne sono
    dispatch('importAll')
    // Esporta nuovi dati e modifiche se ce ne sono
    dispatch('exportAll')
    // Verifica se le risorse necessarie sono valide per le anagrafiche memorizzate
    // In tal senso andrà ad aggiornarle (scaricarle)
    dispatch('syncRisorse')
  },
  importAll({ commit, dispatch, rootState }) {
    //commit('setSynchronizing', true)
    // const url = '/api/sincronizza/getHeadersByType?tipo='
    // dispatch('api/get', { url: url + 'LAVORO' }, { root: true })

    const url = '/api/sincronizza/getAllHeaders'

    // Chiede tutti gli header delle varie collection
    dispatch('api/get', { url }, { root: true })
      .then((apiResponse) => {

        if (apiResponse.data == null || apiResponse.data.lengh == 0) {
          // Sul server non sono presenti dati da scaricare
        }
 
        // Ha ricevuto gli header
        apiResponse.data.forEach((remote) => {
          // Differenzia in funzione del tipo
          let tableName
          switch (remote.tipo){
            case "LAVORO":
              tableName = 'lavori'              
              break;
            case "CATALOGO":
              tableName = 'cataloghi'              
              break;
            }

          // Verifica se esiste UID
          dispatch('db/selectById', { table: tableName, id: remote._id }, { root: true })
            .then((res) => {
              // Record trovato
              // Verifica se la data di ogni singolo remote è maggiore di quella memorizzata
              if (Date.parse(remote.lastUpdateDate) > Date.parse(res.lastUpdateDate)) {
                // Importante per il DB per capire di quale revione stiamo parlando 
                remote._rev = res._rev
                // Record da aggiornare
                dispatch('db/update', { table: tableName, data: remote },{ root: true })
                  .then(() => {
                    console.log('aggiornato', remote)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              }
            })
            .catch((err) => {
              if (err.status && err.status === 404) {
                // Record non presente localmente
                // Provvede ad inserirlo

                // ?? Da valotare se nel caso di un catalogo, salvarlo con uno stato U
                // ?? Solo quando siamo sicuri di aver scaricato tutte le risorse lo possiamo mettere P
                dispatch('db/insertInto', { table: tableName, data: remote },{ root: true })
                  .then(() => {
                    console.log('inserito', remote)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              }else{
                throw err
              }
            })
        })
      })
      .catch((err) => {
        // Errore durante la chiamata al server 
        console.log(err)
      })

      commit('setUpdatingStatus', false)
      commit('setStatusUpdated', true)

    // const all = [
    //   dispatch('importLavori'),
    //   dispatch('importCataloghi'),
    //   dispatch('importRilievi')
    // ]

    // return Promise.all(all).then(() => {
    //   commit('setSynchronizing', false)
    //   return dispatch('updateStatus')
    // })
  },
  exportAll({ commit, dispatch }) {
    // Preleva tutti i lavori
    dispatch('gestione_lavori/load', {}, { root: true }).then((res) => {
      res.forEach((lavoro) => {
        // Invia solamente i lavori che non hanno AgileID
        //  in quanto le modifiche su lavori già sincronizzati
        //  vengono direttamente caricare sul server
        if (lavoro.agileID == 0){         
          // Imposta il record dell'attuale lavoro
          commit('gestione_lavori/setRecord', lavoro, { root: true })
          // Invia il lavoro al ws e lo salva (senza aggiungere data e use ultima modifica )
          dispatch('gestione_lavori/save', {doUpload: true, saveLacalAnyway: false, rawData: true}, { root: true })
        }
      })
    })
  },
  syncRisorse({ commit, dispatch }){
    // Carica la lista di tutti i cataloghi
    dispatch('cataloghi/load', {}, { root: true })
    .then((listaCataloghiLocali) => {
      // Scorre i cataloghi locali
      listaCataloghiLocali.forEach((catalogoLocal) => {
        // per ogni catalogo recupera le risorse necessarie
        var listaRisorseDelCatalogo = catalogoLocal.data.JSRisorseNecessarie
        // Scorre le risorse del catalogo
        listaRisorseDelCatalogo.forEach((risorsaNecessaria) => {
          // verifica se in locale la risorsa esiste e se ha lo stesso hash
          var filtro = {
            azienda: catalogoLocal.JSAzienda.JSUID,
            catalogo: risorsaNecessaria.JSCatalogo,
            codice: risorsaNecessaria.JSRisID
          }
          dispatch('risorse/getByAziendaCatalogoCodice', { filtro }, { root: true })
          .then((risorsaLocale) => {
            // La risorsa esiste
            // Verifica l'hash della risorsa
            if (risorsaNecessaria.hash == risorsaLocale.hash){
              // a) La risorsa è aggiornata -> continua con la risorsa sucessiva
            }else{
              // b) Hash diverso, si deve aggiornare la risorsa
              dispatch('resourceManager/update', { risorsa: risorsaNecessaria }, { root: true})
            }
          })
          .catch((err) => {
            if (err.status && err.status === 404) {
              // Risorsa non presente localmente, si deve scaricare             
              dispatch('resourceManager/update', { risorsa: risorsaNecessaria }, { root: true})              
            }else{
              throw err
            }
          })
        })
      })
    })
  }
  // importLavori({ commit, dispatch }) {
  //   const url = '/api/Lavori'
  //   return dispatch('api/get', { url }, { root: true }).then((res) => {
  //     const { data } = res
  //     return dispatch(
  //       'db/bulkInsertInto',
  //       { table: 'lavori', data },
  //       { root: true }
  //     )
  //   })
  // },
  // importCataloghi({ commit, dispatch }) {},
  // importRilievi({ commit, dispatch }) {},

  // async uploadSingoloLavoro({ commit, dispatch }, lavoro) {
  //   // Prepara l'header da inviare
  //   let header = {
  //     tipo: 'LAVORO', // tipo(lavoro, contatto, rilievo ...)
  //     GUID: lavoro._id, //- GUID
  //     agileID: lavoro.agileID, //- ID di Agile(null se nuovo)
  //     lastUpdateDate: lavoro.lastUpdateDate, //- data ultima modifica
  //     lastUpdateUser: lavoro.lastUpdateUser, //- utente ultima modifica
  //     insertDate: lavoro.insertDate //- (ev data / utente di inserimento?)
  //   }

  //   let data = {
  //     header,
  //     jsonData: JSON.stringify(lavoro)
  //   }

  //       //commit('setSynchronizing', true)
  //       const options = {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
    
  //       const url = '/api/Sincronizza/uploadSingleData'

  //   return dispatch('api/post', { url, data, options }, { root: true })
  //     .then((res) => {
  //       console.log(res)
  //       lavoro.agileID = res.data
  //       commit('gestione_lavori/setRecord', lavoro, { root: true })
  //       dispatch('gestione_lavori/save', {}, { root: true })
  //     })
  //     .catch((e) => {
  //       throw e
  //     })
  // },

  
  
}

export const mutations = {
  setDbStatus(s, p) {
    s.dbStatus = p
  },
  setUpdatingStatus(s, p) {
    s.updatingStatus = p
  },
  setStatusUpdated(s, p) {
    s.statusUpdated = p
  },
  setSynchronized(s, p) {
    s.synchronized = p
  },
  setSynchronizing(s, p) {
    s.synchronizing = p
  }
}

export const getters = {
  canUpdate: (s) => s.statusUpdated === false
}
