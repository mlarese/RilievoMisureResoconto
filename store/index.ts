export const strict = false

import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import RilievoModule from '~/store/rilievoModule'
// import PosizionekModule from '~/store/posizioneModule'

export function getRilievoModule(store: Store<any>): RilievoModule {
  return getModule(RilievoModule, store)
}

// export function getPosizioneModule(store: Store<any>): PosizioneModule {
//   return getModule(PosizioneModule, store)
// }