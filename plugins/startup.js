import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications)

export default async ({ app }) => {
  return await app.store.dispatch('auth/persistentUser', {}, {root: true})
}
