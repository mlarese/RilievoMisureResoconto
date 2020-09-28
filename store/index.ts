export const strict = false

import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import RilievoModule from '~/store/rilievoModule'
export function getRilievoModule(store: Store<any>): RilievoModule {
  return getModule(RilievoModule, store)
}