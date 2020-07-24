// funzionalita + listeners del service worker

const caricaEventi = (client, data) => {
  console.log('---- caricaEventi')

  const wsurl = 'https://agile4work.4innovation.srl:1002/api/Users/getAllUsers'

  const token = data.token
  fetch(wsurl,{
    method: 'get',
    headers: {
      'Content-type': 'application/json',
      Authorization:  token
    }
  })
    .then(resp => {
      resp.json().then(data => {
        client.postMessage({
          type: 'caricaEventiEseguita',
          data: data
        })

      })

    })

}

addEventListener('message', event => {
  console.log('---- message event')
  let params = event.data
  let client = event.source

  if(params.type === 'caricaEventi') caricaEventi(client, params)

})

addEventListener('sync', event => {
  console.log('----- sync su service worker', event.tag)

})
