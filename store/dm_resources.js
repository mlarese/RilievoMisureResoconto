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
  async salvaBlob({ dispatch }, { id, blob }) {
    // Crea la risorsa dal blob
    const risorsa = await dispatch('getRisorsaFromBlob', blob)
    // salva fisicamente
    await dispatch('salvaRisorsa', { id, risorsa })
  },
  async salvaRisorsa({ dispatch }, { id, risorsa }) {
    const db = new PouchDb(table)
    let file = await fetch(risorsa.fileUrl).then(r => r.blob());
    let fileThumbnail = await fetch(risorsa.thumbnailUrl).then(r => r.blob());

    db.put({
      _id: id,
      type: getMainType(file.type),
      _attachments: {
        [id]: {
          content_type: file.type,
          data: file
        },
        ['t_' + id]: {
          content_type: fileThumbnail.type,
          data: fileThumbnail
        }
      }
    }).catch(function (err) {
      console.log(err);
    });

  },
  async getRisorsaById({ }, id) {
    try {
      const db = new PouchDb(table)
      const res = await db.get(id, { attachments: true, binary: true })
      const mainFile = res._attachments[id]
      const thumbFile = res._attachments['t_' + id]
      return {
        type: res.type,
        typeFile: mainFile.data.type,
        fileUrl: URL.createObjectURL(mainFile.data),
        thumbnailUrl: URL.createObjectURL(thumbFile.data),
      }
    } catch (error) {
      console.dir(error)
    }
  },

  async getBlobById({ dispatch, commit, state }, id) {
    const db = new PouchDb(table)
    return db
      .getAttachment(id, id)
      .then((blob) => {
        return blob
      })
  },

  async getRisorsaFromBlob({ dispatch, commit, state }, blob) {

    var typeFile = blob.type
    var type = ''        // utile per individuare il componente che vusializza la risorsa
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
        end: 0
      });
      if (tmpTmb.length > 0) {
        thumbnailUrl = URL.createObjectURL(tmpTmb[0].blob)
      }

    } else if (blob.type.startsWith('audio/')) {
      type = 'audio'
      thumbnailUrl = '/images/audio.png'

    } else {
      type = 'image'

      try {
        fileUrl = await resizeImage(fileUrl, 1000, 1000)
      } catch (err) {
        console.log(err)
      }

      try {
        thumbnailUrl = await resizeImage(fileUrl, 300, 300)
      } catch (err) {
        console.log(err)
      }

    }

    const myRes = { typeFile, type, thumbnailUrl, fileUrl }
    //console.dir(myRes)
    return myRes
  }

}

function resizeImage(fileUrl, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = fileUrl;
    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width <= maxWidth && height <= maxHeight) {
        resolve(fileUrl);
      }

      let newWidth;
      let newHeight;

      if (width > height) {
        newHeight = height * (maxWidth / width);
        newWidth = maxWidth;
      } else {
        newWidth = width * (maxHeight / height);
        newHeight = maxHeight;
      }

      let canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      let context = canvas.getContext('2d');

      context.drawImage(image, 0, 0, newWidth, newHeight);

      resolve(canvas.toDataURL())
    };
    image.onerror = reject;
  });
}

function getMainType(fileType) {
  if (fileType === 'application/pdf') {
    return 'pdf'
  }

  if (fileType.startsWith('video/')) {
    return 'video'
  }

  if (fileType.startsWith('audio/')) {
    return 'audio'
  }

  return 'image'
}

export const mutations = {}

export const getters = {}
