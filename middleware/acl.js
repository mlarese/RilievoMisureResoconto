import axios from 'axios'
import { getFs } from '../assets/filesystem'
export default async function ({ route, store, redirect, app }) {

  if (process.env.NODE_ENV === 'production') {
  }
  if (!route.name) {
    return redirect('/login')
  } else if (route.name !== 'login') {
    if (!store.state.auth.loggedIn) {
      return redirect('/login')
    }
  }
}
