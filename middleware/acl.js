import axios from 'axios'

export default async function ({route, store, redirect, app}) {

  console.log('acl'+new Date())
  if (!route.name) {
    return redirect('/login')
  } else if (route.name !== 'login') {
    if (!store.state.auth.loggedIn) {

      return redirect('/login')
    }
  }
}
