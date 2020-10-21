import Vue from 'vue'
import Notifications from 'vue-notification'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {dmy, time, truncate,number} from '../assets/filters'
import PortalVue from 'portal-vue'

Vue.use(PortalVue)
Vue.use(Notifications)

Vue.filter('number', number)
Vue.filter('dmy', dmy)
Vue.filter('time', time)
Vue.filter('truncate', truncate)


export default async ({ app }) => {
  defineCustomElements(window)
  return app.store.dispatch('auth/persistentUser', {}, {root: true}).then(() => {
    return app.store.dispatch('classificazione/load', {}, {root: true})
  })
}
