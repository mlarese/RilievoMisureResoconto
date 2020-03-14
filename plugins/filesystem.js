
/**
window.webkitStorageInfo.requestQuota(PERSISTENT, 10024*10024, (grantedBytes) => {
  window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes,successHandler, errorHandler)
}, e => console.log('Error', e))


function errorHandler(event) {console.dir(event)}
function successHandler(fileSystem) {
  console.dir(fileSystem)

  fileSystem.root.getFile("disarcivescostanti.txt", { create: true }, (fileEntry) => console.dir(fileEntry)
    ,errorHandler)
}
**/


console.log('setting filesystem')
