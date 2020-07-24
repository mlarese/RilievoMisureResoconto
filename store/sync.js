import _clone from 'lodash/clone'
import { dbList, syncStates, internalStates } from './db'

const emptyFn = function () { }
const root = { root: true }
export const state = () => {
  return {
    synchronized: false, // la app sta sincronizzando i dati
    syncLog: '',
    listaOggettiLocali: [],
    listaRisorseLocali: []
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
    const listaCataloghi = await dispatch('cataloghi/load', {}, { root: true })
    listaOggettiLocali.push(...listaCataloghi)
    const listaEventi = await dispatch('appuntimm/load', {}, { root: true })
    listaOggettiLocali.push(...listaEventi)

    return listaOggettiLocali
  },
  async syncAll({ commit, dispatch }) {
    try {
      commit('setSynchronizing', true)
      commit('newLog', 'Inizio sincronizzazione')

      commit('logMe', 'Carica le risorse locali')
      const risorseLocali = await dispatch('dm_resources/load', {}, root)
      commit('logMe', `Ottenute ${risorseLocali.length} risorse locali`)

      if (!risorseLocali) risorseLocali = []
      commit('setListaRisorseLocali', risorseLocali)

      // Crea la lista di tutti gli oggetti da inviare al WS
      commit('logMe', 'Ottenimento oggetti locali')
      const listaOggettiLocali = await dispatch('getElencoOggettiLocali')
      commit('logMe', `Ottenuti ${listaOggettiLocali.length} oggetti locali`)

      if (!listaOggettiLocali) listaOggettiLocali = []
      commit('setListaOggettiLocali', listaOggettiLocali)

      var listaDaInviare = []
      // Preleva solamente l'header
      // TODO ottimizzato nel caso di nuovi oggetti: invia subito i dati (senza files)
      listaOggettiLocali.forEach((obj) => {

        // la lista delle risorse potrebbe trarre in inganno
        // rappresenta la lista delle risorse necessarie
        // e non quelle effettivamente sincronizzate
        // al ws inviamo invece la lista dlle risorse effettive
        // Così se ne mancano ce lo dice
        var risorseEffettive = []
        if (obj.listaRisorse) {
          if (risorseLocali) {
            obj.listaRisorse.forEach((res) => {
              risorseLocali.forEach((element) => {
                if (element._id == res) {
                  risorseEffettive.push(res)
                }
              })
            })
          }
        }

        let objToSend = {
          _id: obj._id,
          tipo: obj.tipo,
          lastUpdate_UTCDate: obj.lastUpdate_UTCDate,
          listaRisorse: risorseEffettive
        }

        listaDaInviare.push(objToSend)
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
          // Ottiene la tabella del DB in funzione del tipo oggetto
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
      commit('setSynchronizing', false)
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

      // Come defaul come primo salvataggio del record viene impostato il flag come download parziale
      remoteDoc.syncStatus = syncStates['PARTIAL_SYNC']

      let localDoc
      try {
        commit('logMe', `---> Lettura dell'oggetto locale da db`)
        localDoc = await dispatch('db/selectById', { table, id: docID }, root)

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

      // Verifica se sono presenti tutte le risorse
      if (remoteDoc.listaRisorse && remoteDoc.listaRisorse.length > 0) {
        for (var fileName of remoteDoc.listaRisorse) {
          if (!fileName) continue

          let risorsaPresente = false
          for (var element of state.listaRisorseLocali) {
            if (element._id == fileName) {
              // presente
              risorsaPresente = true
            }
          }
          if (risorsaPresente) continue

          commit('logMe', `--->> Inizio DOWNLOAD risorsa  ${fileName}`)
          var urlGet = `/api/sincronizza/downloadSingleRes?fileName=${fileName}`
          var responseFile = await dispatch('api/getFile', { url: urlGet }, root)
          var file = responseFile.data

          commit('logMe', `--->> Salvataggio locale della risorsa`)
          await dispatch('dm_resources/save', { id: fileName, file }, root)

          // una volta inserita la aggiunge anche alla lista delle risorse locali in modo da non riscaricarla
          state.listaRisorseLocali.push(fileName)
        }
      }

      // Provvede a salvare il record come completato
      await dispatch('db/updateProp', { table, docID, prop: 'syncStatus', value: syncStates['COMPLETO'] }, root)

    } catch (err) {
      console.error();
      // Gestire meglio i vari tipi di errori
      commit('logMe', `ERRORE durante il DOWNLOAD: di ${data.tipo} - ${data._id} ${err}`)
      commit('logMe', `--> ${err}`)
    }
  },

  async UPLOAD({ dispatch, commit, state }, { table, data, callback = emptyFn }) {
    try {
      const docID = data._id
      const url = '/api/sincronizza/uploadSingleData'
      const urlFile = '/api/sincronizza/uploadSingleRes'


      let localDoc = {}
      if (data.data) {
        // è stato passato l'oggetto con i dati
        localDoc = data
      }
      else {
        // L'egge l'oggetto dal DB locale per ottenere i dati
        commit('logMe', `---> Lettura oggetto locale`)
        localDoc = await dispatch('db/selectById', { table, id: docID }, root)
      }

      // Carica l'oggetto nel cloud
      commit('logMe', `---> Invio oggetto al ws`)
      const response = await dispatch('api/post', { url, data: localDoc }, root)

      // I dati sono stati caaricati correttamente
      // Viene salvato il record come parzialmente sincronizzato
      localDoc.syncStatus = syncStates['PARTIAL_SYNC']
      await dispatch('db/update', { table, data: localDoc }, root)

      // La risposta conterrà l'elenco delle risorse che mancano
      if (response.data) {
        for (var fileName of response.data) {

          commit('logMe', `--->> Lettura della risorsa localmente - ${fileName}`)
          const file = await dispatch('dm_resources/getById', fileName, root)

          commit('logMe', `--->> Invio al ws della risorsa`)
          const responseFile = await dispatch('api/postFile', { url: urlFile, data: { data, file, fileName } }, root)
        }
      }

      // Se siamo arrivati fino a qui significa che abbiamo completato il caricamento delle risorse
      // Viene impostato lo stato come completamente sincronizzato
      // localDoc.syncStatus = syncStates['COMPLETO']
      await dispatch('db/updateProp', { table, docID, prop: 'syncStatus', value: syncStates['COMPLETO'] }, root)

      // se presente
      callback()
    } catch (error) {
      console.error();
      // Gestire meglio i vari tipi di errori
      commit('logMe', `ERRORE durante UPLOAD: di ${data.tipo} - ${data._id} ${err}`)
      commit('logMe', `--> ${err}`)
    }
  },
  async DELETE({ dispatch, commit, state }, { table, data }) {
    // TODO
  },

  async randomInsert({ dispatch, commit, state }) {
    const table = 'contatti'
    let fileName = ''
    var i;
    for (i = 0; i < 10; i++) {
      let passi = Math.floor(Math.random() * 100) + 100;
      var url = `https://picsum.photos/1000`
      var responseFile = await dispatch('api/getFile', { url }, root)
      fileName = `randomFile${passi}`

      let data = {
        _id: null,
        tipo: 'CONTATTO',
        syncStatus: syncStates['NOT_SYNC'],
        lastUpdate_UTCDate: new Date(),
        data: {
          CONDescrizione: `random contact ${passi}`,
          CONIndirizzo: `random indirizzo ${passi}`,
          CONTelefono: `random telefono ${passi}`,
          CONEmail: `random email ${passi}`,
          CONNote: `random note ${passi}`,
          imgFileName: fileName
        },
        listaRisorse: [fileName]
      }

      let res = await dispatch('db/insertInto', { table, data }, root)

      var file = responseFile.data
      await dispatch('dm_resources/save', { id: fileName, file }, root)
    }

  }
}

export const mutations = {
  setListaRisorseLocali(s, p) {
    s.listaRisorseLocali = p
  },
  setListaOggettiLocali(s, p) {
    s.listaOggettiLocali = p
  },
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
