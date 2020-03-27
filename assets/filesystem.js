import BBPromise from 'bluebird'
export let fs = null
BrowserFS.configure({fs: 'HTML5FS', options: {}}, (e) => {
  fs = BrowserFS.BFSRequire('fs')
  BBPromise.promisifyAll(fs);
})
export const getFs = () => fs
export const initFs = () => fs

export const readDirFs = async (dir) => {
  const stats = await fs.readdirAsync(dir)
    .then((files) => {
      const pAll = []
      for(let file of files) pAll.push(fs.statAsync(`${dir}/${file}`))
      return Promise.all(pAll).then(stats => ({files, stats}) )
    })

  return stats
}
export const createBaseFs = async () => {
  fs.mkdir(rootDir)
  fs.mkdir(appDir)
  fs.mkdir(appDirCatalogs)
  fs.mkdir(appDirDocs)
  fs.mkdir(appDirImages)
}

export const rootDir = '/apps'
export const appDir = `${rootDir}/rilievomisure`
export const appDirImages = `${appDir}/Immagini`
export const appDirCatalogs = `${appDir}/Cataloghi`
export const appDirDocs = `${appDir}/Docs`


export const walkFileSystem = async (dir) => {
  dir = dir || appDir
  let fileStats = await readDirFs(dir)
  const {files, stats} = fileStats
  const fileItems = []

  for(let i = 0; i < files.length;i++) {
    let name = files[i]
    let stat = stats[i]
    let size = stat.size
    let isDirectory = stat.isDirectory()
    let curDir = `${dir}/${name}`


    let curFileItem = {
      name,
      isDirectory,
      size
    }
    if(isDirectory) {
      let items = await walkFileSystem(curDir)
      curFileItem['items'] = items
    }
    fileItems.push(curFileItem)
  }

  return fileItems
}

export const getExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

export const previewFile = (file, ref=null) =>  {
  fs.readFile(file, async (err, buffer) => {
    let data = await buffer
    const ext = getExtension(file)
    let type = null
    if(ext === 'png' || ext === 'jpg'  || ext === 'jpeg'  || ext === 'gif') {
      type = 'image'
      let imgB64 = `data:image/${ext};base64,`+ btoa(buffer.toString())
      let img = ref
      img.src = imgB64;
    }

  })
}
