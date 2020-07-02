import axios from 'axios'
import {getFs} from '../assets/filesystem'
export default async function ({route, store, redirect, app}) {
  console.dir(arguments)

  if (!route.name) {
      return redirect('/login')
  } else if (route.name === 'browser') {
    return
  } else if (route.name !== 'login') {
      if (!store.state.auth.loggedIn) {
        return redirect('/login')
      } else {
        getFs()
      }
  }
}
