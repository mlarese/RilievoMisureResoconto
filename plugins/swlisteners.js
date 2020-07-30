// listeners lato client delle risposte del server
console.log('--- configurazione dei listeners del sw')

export let serviceWorker = null
export default async (arg) => {

  const requestPermission = async () => {
    const resp = await Notification.requestPermission()

    console.log(resp)
  }

  requestPermission()
  if(navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', event => {
      console.log('---- risposta dal service worker getUtenti')
      console.dir(event.data)
    })

    navigator.serviceWorker.addEventListener('sync', event => {
      console.log ('---- evento sync da server')
    })

    navigator.serviceWorker.ready
      .then(sw => {
        serviceWorker = sw
      })
  }

}
