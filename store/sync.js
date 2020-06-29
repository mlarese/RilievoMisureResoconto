import { dbList } from './db'

const root = { root: true }
export const state = () => {
  return {
    synchronized: false, // la app sta sincronizzando i dati
    syncLog: ''
  }
}

export const actions = {

  async updateStatus({ commit, dispatch }) {
    // TODO
    // Sarebbe interessate ...
  },
  async getElencoOggettiLocali({ commit, dispatch }) {
    var listaOggettiLocali = []
    const listaLavori = await dispatch('gestione_lavori/load', {}, root)
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
    try {
      commit('setSynchronizing', true)
      commit('newLog', 'Inizio sincronizzazione')

      // Crea la lista di tutti gli oggetti da inviare al WS
      commit('logMe', 'Ottenimento oggetti locali')
      var listaOggettiLocali = await dispatch('getElencoOggettiLocali')
      commit('logMe', `Ottenuti ${listaOggettiLocali.length} oggetti locali`)

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

      commit('logMe', `Inizio Upload al ws degli oggetti locali`)
      const url = '/api/sincronizza/uploadAllHeaders'
      const apiResponse = await dispatch('api/post', { url, data: listaDaInviare }, root)
      commit('logMe', `Invio terminato`)

      // Nessun dato da aggiornare
      if (apiResponse.data) {
        // Il ws ci risponderà con un elenco di oggetti che vanno ulteriormente sincronizzati
        commit('logMe', `Ricevuti ${apiResponse.data.length} oggetti da sincronizzare`)

        for (var obj of apiResponse.data) {
          commit('logMe', `Inizio azione ${obj.action} di ${obj.tipo} - ${obj._id}`)
          // Ottiene la tabella DB in funzione del tipo oggetto
          let table = dbList[obj.tipo]
          await dispatch(obj.action, { table, data: obj })
        }

      } else {
        commit('logMe', `Nessun dato da sincronizzare`)
      }

      commit('logMe', `Sincronizzazione completata!`)

    } catch (err) {
      console.error();

      // Gestire meglio i vari tipi di errori
      commit('logMe', `ERRORE durante la sincronizzazione: ${err}`)
    }

    commit('setSynchronizing', false)
  },

  async DOWNLOAD({ dispatch, commit, state }, { table, data }) {

    try {
      const docID = data._id
      const url = '/api/sincronizza/downloadSingleData'

      // scarica l'oggetto dal cloud
      const response = await dispatch('api/post', { url, data }, root)
      let remoteDoc = response.data

      if (remoteDoc) {
        commit('logMe', `---> Ricevuto correttamente oggetto da ws`)
      } else {
        commit('logMe', `---> Errore imprevisto, nessun oggetto richiseto ricevuto`)
        return
      }

      let localDoc
      try {
        commit('logMe', `---> Lettura dell'oggetto locale da db`)
        localDoc = await dispatch('db/selectById', { table, id: docID }, root)
        // Aggiorna il record con i dati interni
        remoteDoc._rev = localDoc._rev
        if (localDoc._attachments)
          remoteDoc._attachments = localDoc._attachments

        // Aggiorna il record
        commit('logMe', `---> Aaggiornamento dell'oggetto locale nel db`)
        await dispatch('db/update', { table, data: remoteDoc }, root)

      } catch (error) {
        if (error.status == "404") {
          // Questo record non è presente localmente
          // Inserisce il record
          commit('logMe', `---> Oggetto locale non presente, inizio inserimento nel db`)
          await dispatch('db/insertInto', { table, data: remoteDoc }, root)
        }
      }
      // Imposta il flag come dato parziale
      // verrà reimpostato quando saranno sincronizzate tutte le risorse
      // await dispatch('db/selectById', { table, id: docID }, root)

      // Verifica se sono presenti tutte le risorse
      if (remoteDoc.listaRisorse) {
        for (var fileName of remoteDoc.listaRisorse) {
          if (remoteDoc._attachments) {
            if (remoteDoc._attachments.hasOwnProperty(fileName)) {
              const myAllegato = remoteDoc._attachments[fileName]
              if (myAllegato && myAllegato.data) {
                // risorsa già presente
                continue
              }
            }
          }
          commit('logMe', `--->> Inizio DOWNLOAD risorsa  ${fileName}`)
          var urlGet = `/api/sincronizza/downloadSingleRes?fileName=${fileName}`
          var responseFile = await dispatch('api/getFile', { url: urlGet }, root)
          var file = responseFile.data

          commit('logMe', `--->> Salvataggio locale della risorsa`)
          await dispatch('db/putAttachment', { table, docID, file, fileName }, root)
        }
      }
    } catch (err) {
      console.error();
      // Gestire meglio i vari tipi di errori
      commit('logMe', `ERRORE durante il DOWNLOAD: di ${data.tipo} - ${data._id} ${err}`)
      commit('logMe', `--> ${err}`)
    }
  },

  async UPLOAD({ dispatch, commit, state }, { table, data }) {

    const docID = data._id
    const url = '/api/sincronizza/uploadSingleData'
    const urlFile = '/api/sincronizza/uploadSingleRes'

    // L'egge l'oggetto dal DB locale
    commit('logMe', `---> Lettura oggetto locale`)
    let localDoc = await dispatch('db/selectById', { table, id: docID }, root)

    // Carica l'oggetto nel cloud
    commit('logMe', `---> Invio oggetto al ws`)
    const response = await dispatch('api/post', { url, data: localDoc }, root)

    // La risposta conterrà l'elenco delle risorse che mancano
    if (response.data) {
      for (var fileName of response.data) {
        commit('logMe', `--->> Lettura della risorsa localmente - ${fileName}`)
        const file = await dispatch('db/getAttachment', { table, docID, fileName }, root)
        commit('logMe', `--->> Invio al ws della risorsa`)
        const responseFile = await dispatch('api/postFile', { url: urlFile, data: { data, file, fileName } }, root)
        console.log(responseFile)
      }
    }
  },
  async DELETE({ dispatch, commit, state }, { table, data }) {
    // TODO
  }
}

export const mutations = {
  newLog(s, p) {
    s.syncLog = ''
    s.syncLog = p
  },
  logMe(s, p) {
    s.syncLog = s.syncLog.concat('\r\n', p)
  },
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
