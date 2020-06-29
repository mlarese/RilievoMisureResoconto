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

    let dbStatus = {}
    let synchronized = false

    // for (let dbName in dbList) {
    //   let table = dbList[dbName]
    //   let curStatus = await dispatch('db/dbInfo', table, { root: true })
    //   dbStatus[table] = curStatus

    //   if (curStatus.doc_count > 0) {
    //     if (table !== 'auth') {
    //       synchronized = true
    //     }
    //   }
    // }

    commit('setSynchronized', synchronized)
    commit('setDbStatus', dbStatus)
    commit('setUpdatingStatus', false)
    commit('setStatusUpdated', true)
  },

  async getElencoOggettiLocali({ commit, dispatch }) {
    var listaOggettiLocali = []
    const listaLavori = await dispatch('gestione_lavori/load',{}, root)
    listaOggettiLocali.push(...listaLavori)
    const listaContatti = await dispatch('gestione_contatti/load', {}, { root: true })
    listaOggettiLocali.push(...listaContatti)
    // const listaCataloghi = await dispatch('cataloghi/load', {}, { root: true })
    // listaOggettiLocali.push(...listaCataloghi)
    // const listaEventi = await dispatch('eventi/load', {}, { root: true })
    // listaOggettiLocali.push(...listaEventi)

    return listaOggettiLocali
  },
  async syncAll({ commit, dispatch }) {

    commit('setUpdatingStatus', true)
    commit('setSynchronizing', false)

    // Crea la lista di tutti gli oggetti da inviare al WS
    var listaOggettiLocali = await dispatch('getElencoOggettiLocali')

    var listaDaInviare = []
    // Preleva solamente l'header
    listaOggettiLocali.forEach((obj) => {
      listaDaInviare.push({
        _id: obj._id,
        tipo: obj.tipo,
        lastUpdateDate: obj.lastUpdateDate,
        listaRisorse: obj.listaRisorse
      })
    })

    const url = '/api/sincronizza/uploadAllHeaders'
    const apiResponse = await dispatch('api/post',{ url, data: listaDaInviare }, root )

    // Nessun dato da aggiornare
    if (apiResponse.data){      
      // Il ws ci risponderà con un elenco di oggetti che vanno ulteriormente sincronizzati
      for (var obj of apiResponse.data) {
        // Differenzia in funzione del tipo
        let storeName
        let table = dbList[obj.tipo]
        
        await dispatch(obj.action, {table, data: obj})
      }
    }

    commit('setSynchronized', true)
    commit('setUpdatingStatus', false)
    commit('setStatusUpdated', true)
  },

    async DOWNLOAD({ dispatch, commit, state }, {table, data}) {
        
      const docID = data._id    
      const url = '/api/sincronizza/downloadSingleData'
      
      // scarica l'oggetto dal cloud
      const response = await dispatch('api/post', { url, data }, root)
      let remoteDoc = response.data
    
      if (!remoteDoc) return
      
      let localDoc
      try
      {
        localDoc = await dispatch('db/selectById', { table, id: docID }, root)
        // Aggiorna il record con i dati interni
        remoteDoc._rev = localDoc._rev
        if (localDoc._attachments)
          remoteDoc._attachments = localDoc._attachments        

        // Aggiorna il record
        await dispatch('db/update', { table, data: remoteDoc }, root)

      }catch(error){
        if (error.status == "404"){
          // Questo record non è presente localmente
          // Inserisce il record
          await dispatch('db/insertInto', { table, data: remoteDoc }, root)
        }
      }
      // Imposta il flag come dato parziale
      // verrà reimpostato quando saranno sincronizzate tutte le risorse
      // await dispatch('db/selectById', { table, id: docID }, root)
  
      // Verifica se sono presenti tutte le risorse
      if (remoteDoc.listaRisorse){
        for (var fileName of remoteDoc.listaRisorse){
          if (remoteDoc._attachments){
            if (remoteDoc._attachments.hasOwnProperty(fileName)) {
              const myAllegato = remoteDoc._attachments[fileName]
              if (myAllegato && myAllegato.data) {
                // risorsa già presente
                continue
              }
            }
          }
          var urlGet = `/api/sincronizza/downloadSingleRes?fileName=${fileName}`
          var responseFile = await dispatch('api/getFile', { url: urlGet }, root)
          var file = responseFile.data

          // var type = contentResult.contentType
          // var file = new Blob([contentResult.fileContents], {type})
          await dispatch('db/putAttachment', 
            { table, docID, 
              file, 
              fileName  },
               root)
        }
      }
    },
    async UPLOAD({ dispatch, commit, state }, {table, data}) {

      const docID = data._id
      const url = '/api/sincronizza/uploadSingleData'
      const urlFile = '/api/sincronizza/uploadSingleRes'
      
      // L'egge l'oggetto dal DB locale
      let localDoc = await dispatch('db/selectById', { table, id: docID }, root)

      // Carica l'oggetto nel cloud
      const response = await dispatch('api/post', { url, data: localDoc }, root)
    
      // La risposta conterrà l'elenco delle risorse che mancano
      if (response.data){
        for (var fileName of response.data){
          const file = await dispatch('db/getAttachment', { table, docID, fileName  }, root)
          const responseFile = await dispatch('api/postFile', { url: urlFile, data: {data, file, fileName}}, root)
          console.log(responseFile)
        }
      }
    },
    async DELETE({ dispatch, commit, state }, {table, data}) {
      // TODO
    }
  // importAll({ commit, dispatch, rootState }) {
  //   //commit('setSynchronizing', true)
  //   // const url = '/api/sincronizza/getHeadersByType?tipo='
  //   // dispatch('api/get', { url: url + 'LAVORO' }, { root: true })

  //   const url = '/api/sincronizza/getAllObjects'

  //   // Chiede tutti gli header delle varie collection
  //   dispatch('api/get', { url }, { root: true })
  //     .then((apiResponse) => {
  //       if (apiResponse.data == null || apiResponse.data.lengh == 0) {
  //         // Sul server non sono presenti dati da scaricare
  //         return
  //       }

  //       // Ha ricevuto gli header
  //       apiResponse.data.forEach((remote) => {
  //         // Differenzia in funzione del tipo
  //         let tableName
  //         switch (remote.tipo) {
  //           case 'LAVORO':
  //             tableName = 'lavori'
  //             break
  //           case 'CATALOGO':
  //             tableName = 'cataloghi'
  //             break
  //         }

  //         // Verifica se esiste UID
  //         dispatch(
  //           'db/selectById',
  //           { table: tableName, id: remote._id },
  //           { root: true }
  //         )
  //           .then((res) => {
  //             // Record trovato

  //             // Deve effettuareun merge

  //             // Verifica se la data di ogni singolo remote è maggiore di quella memorizzata
  //             if (
  //               Date.parse(remote.lastUpdateDate) >
  //               Date.parse(res.lastUpdateDate)
  //             ) {
  //               // Importante per il DB per capire di quale revione stiamo parlando
  //               remote._rev = res._rev
  //               // Record da aggiornare
  //               dispatch(
  //                 'db/update',
  //                 { table: tableName, data: remote },
  //                 { root: true }
  //               )
  //                 .then(() => {
  //                   console.log('aggiornato', remote)
  //                 })
  //                 .catch((err) => {
  //                   console.log(err)
  //                 })
  //             }
  //           })
  //           .catch((err) => {
  //             if (err.status && err.status === 404) {
  //               // Record non presente localmente
  //               // Provvede ad inserirlo

  //               // ?? Da valutare se nel caso di un catalogo, salvarlo con uno stato U
  //               // ?? Solo quando siamo sicuri di aver scaricato tutte le risorse lo possiamo mettere P
  //               dispatch(
  //                 'db/insertInto',
  //                 { table: tableName, data: remote },
  //                 { root: true }
  //               )
  //                 .then(() => {
  //                   console.log('inserito', remote)
  //                 })
  //                 .catch((err) => {
  //                   console.log(err)
  //                 })
  //             } else {
  //               throw err
  //             }
  //           })
  //       })
  //     })
  //     .catch((err) => {
  //       // Errore durante la chiamata al server
  //       console.log(err)
  //     })

  //   commit('setUpdatingStatus', false)
  //   commit('setStatusUpdated', true)

  //   // const all = [
  //   //   dispatch('importLavori'),
  //   //   dispatch('importCataloghi'),
  //   //   dispatch('importRilievi')
  //   // ]

  //   // return Promise.all(all).then(() => {
  //   //   commit('setSynchronizing', false)
  //   //   return dispatch('updateStatus')
  //   // })
  // },

    // ricarica tutti gli oggetti locali
    // listaOggettiLocali = await dispatch('getElencoOggettiLocali')
    // listaOggettiLocali.forEach((obj) => {
    //   // Verifica se le risorse sono presenti localmente altrimenti le scarica
    //   let listaAllegati = obj._attachments
    //   let difference = obj.listaRisorse.filter(
    //     (x) => !listaAllegati.includes(x)
    //   )
    //   difference.forEach((resourceName) => {
    //     dispatch('downloadRisorsa').then((file) => {
    //       dispatch('db/putAttachment', { tableName, doc: obj, file })
    //     })
    //   })
    // })
  
  // async uploadSingleObj({ commit, dispatch }, { storeName, id }) {
  //   // Preleva l'oggetto locale

  //   dispatch(`${storeName}/getById`, id, { root: true })
  //     .then((data) => {
  //       // Record trovato
  //       // const jstr = JSON.stringify(data)
  //       const url = '/api/sincronizza/uploadSingleData'
  //       // Caricaa l'oggetto nel cloud
  //       dispatch('api/post', { url, data }, { root: true })
  //         .then((response) => {
  //           // La risposta dovrà contenere l'elenco delle risorse che mancano
  //           response.data.forEach((resourceName) => {
  //             dispatch('getFile', { resourceName }).then((file) => {
  //               dispatch('uploadRisorsa', file)
  //             })
  //           })
  //         })
  //         .catch(console.error)
  //     })
  //     .catch(console.error)
  // },


  // syncRisorse({ commit, dispatch }) {
  //   // Carica la lista di tutti i cataloghi
  //   dispatch('cataloghi/load', {}, { root: true }).then(
  //     (listaCataloghiLocali) => {
  //       // Scorre i cataloghi locali
  //       listaCataloghiLocali.forEach((catalogoLocal) => {
  //         // per ogni catalogo recupera le risorse necessarie
  //         var listaRisorseDelCatalogo = catalogoLocal.data.JSRisorseNecessarie
  //         // Scorre le risorse del catalogo
  //         listaRisorseDelCatalogo.forEach((risorsaNecessaria) => {
  //           // verifica se in locale la risorsa esiste e se ha lo stesso hash
  //           var filtro = {
  //             azienda: catalogoLocal.JSAzienda.JSUID,
  //             catalogo: risorsaNecessaria.JSCatalogo,
  //             codice: risorsaNecessaria.JSRisID
  //           }
  //           dispatch(
  //             'risorse/getByAziendaCatalogoCodice',
  //             { filtro },
  //             { root: true }
  //           )
  //             .then((risorsaLocale) => {
  //               // La risorsa esiste
  //               // Verifica l'hash della risorsa
  //               if (risorsaNecessaria.hash == risorsaLocale.hash) {
  //                 // a) La risorsa è aggiornata -> continua con la risorsa sucessiva
  //               } else {
  //                 // b) Hash diverso, si deve aggiornare la risorsa
  //                 dispatch(
  //                   'resourceManager/update',
  //                   { risorsa: risorsaNecessaria },
  //                   { root: true }
  //                 )
  //               }
  //             })
  //             .catch((err) => {
  //               if (err.status && err.status === 404) {
  //                 // Risorsa non presente localmente, si deve scaricare
  //                 dispatch(
  //                   'resourceManager/update',
  //                   { risorsa: risorsaNecessaria },
  //                   { root: true }
  //                 )
  //               } else {
  //                 throw err
  //               }
  //             })
  //         })
  //       })
  //     }
  //   )
  // }
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
