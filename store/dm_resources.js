import { getMetadata, getThumbnails } from 'video-metadata-thumbnails';
import PouchDb from 'pouchdb'

const root = { root: true }
const table = 'resources'

export const state = () => {
  return {}
}

export const actions = {
  load({ dispatch }, withFiles = false) {
    return dispatch('db/selectAll_system', { table, option: { attachments: withFiles } }, root)
      .then((lista) => {
        return lista
      })
  },
  async save({ dispatch }, { id, file }) {
    const db = new PouchDb(table)
    await db
      .putAttachment(id, id, file, file.type)
      .then((result) => {
        return result
      })

  },
  getById({ dispatch, commit, state }, id) {
    const db = new PouchDb(table)
    return db
      .getAttachment(id, id)
      .then((blob) => {
        return blob
      })
  },
  async getUrlById({ dispatch, commit, state }, id) {
    const db = new PouchDb(table)
    return db
      .getAttachment(id, id)
      .then((blob) => {
        return dispatch('getUrlFromBlob', blob)
      })
  },

  async getUrlFromBlob({ dispatch, commit, state }, blob) {

    var typeFile = blob.type
    var type = ''        // utile per individuare il componente che vusialuzza la risorsa
    var thumbnailUrl = '' // antiprima del file
    var fileUrl = URL.createObjectURL(blob)      // file vero e proprio


    if (blob.type === 'application/pdf') {
      type = 'pdf'
      try {

        const pdfjs = await import('pdfjs-dist/build/pdf');
        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        var pdf = await pdfjs.getDocument(URL.createObjectURL(blob)).promise
        console.log('PDF loaded')

        var page = await pdf.getPage(1)
        var canvas = document.createElement("canvas");
        canvas.height = 600;
        canvas.width = 600;
        var viewport = page.getViewport({ scale: 1 });
        var canvasContext = canvas.getContext('2d');

        await page.render({ canvasContext, viewport }).promise
        thumbnailUrl = canvas.toDataURL()

      } catch (err) {
        console.log("pdfThumbnails error: could not open page 1 of document. Not a pdf ?" + err);
      }

    } else if (blob.type.startsWith('video/')) {
      type = 'video'

      const tmpTmb = await getThumbnails(blob, {
        quality: 0.6,
        start: 0,
        end:0
      });
      if (tmpTmb.length > 0){
        thumbnailUrl = URL.createObjectURL(tmpTmb[0].blob)
      }

    } else if (blob.type.startsWith('audio/')) {
      type = 'audio'
      thumbnailUrl = '/images/audio.png'

    } else {
      type = 'image'
      thumbnailUrl = fileUrl
    }

    const myRes = { typeFile, type, thumbnailUrl, fileUrl }
     //console.dir(myRes)
    return myRes
  }

}

export const mutations = {}

export const getters = {}
