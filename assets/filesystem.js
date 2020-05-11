import BBPromise from 'bluebird'
export let fs = null

export const setQuota = () => {
  let quota = 1 * 1024 * 1024 * 1024
  navigator.webkitPersistentStorage.requestQuota ( quota )
}
export const  calcQuota = () => {
  // you could also use it from webkitPersistentStorage
  navigator.webkitPersistentStorage.queryUsageAndQuota(
    (usedSpace, availableSpace) => ({
      um: 'Mb',
      usedSpace: usedSpace / (1024 * 1024 ),
      availableSpace: availableSpace / (1024 * 1024)
    })
  )
}
const configureFs = () => {
  setQuota()
  BrowserFS.configure({fs: 'HTML5FS', options: {}}, (e) => {
    fs = BrowserFS.BFSRequire('fs')
    BBPromise.promisifyAll(fs);
    console.log('done fs init')
  })
}
export const getFs = () => {
  if(!fs) configureFs()
  return fs
}
export const initFs = getFs

export const readDirFs = async (dir) => {
  const stats = await fs.readdirAsync(dir)
    .then((files) => {
      const pAll = []
      for(let file of files) pAll.push(fs.statAsync(`${dir}/${file}`))
      return Promise.all(pAll).then(stats => ({files, stats}) )
    })

  return stats
}

export const workAppDir = (entryPoint) =>`${appDir}/${entryPoint}`
export const appDirImages = (entryPoint) =>`${appDir}/${entryPoint}/Immagini`
export const appDirCatalogs = (entryPoint) =>`${appDir}/${entryPoint}/Cataloghi`
export const appDirDocs = (entryPoint) =>`${appDir}/${entryPoint}/Documents`
export const appDirRes = () =>`${appDir}/Resources`

export const createBaseFs = async (entryPoint) => {
  fs.mkdir(rootDir)
  fs.mkdir(appDir)
  fs.mkdir(workAppDir(entryPoint))
  fs.mkdir(appDirCatalogs(entryPoint), (err) => console.dir(err))
  fs.mkdir(appDirDocs(entryPoint), (err) => console.dir(err))
  fs.mkdir(appDirImages(entryPoint), (err) => console.dir(err))
  fs.mkdir(appDirRes(), (err) => console.dir(err))
}

export const rootDir = '/apps'
export const appDir = `${rootDir}/rilievomisure`

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
      if(ref) {
        let img = ref
        img.src = imgB64;
      }
      return imgB64
    }

    return null
  })
}
export const previewFileAsync = async (file, ref=null) =>  {
  const result = await fs.readFileAsync(file)
    .then(async (err, buffer) => {
      let data = await buffer
      const ext = getExtension(file)
      let type = null
      if(ext === 'png' || ext === 'jpg'  || ext === 'jpeg'  || ext === 'gif') {
        type = 'image'
        let imgB64 = `data:image/${ext};base64,`+ btoa(buffer.toString())
        if(ref) {
          let img = ref
          img.src = imgB64;
        }
        return imgB64
      }
      return null
    })
  return result
}
