
import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
    posizioniDelLavoro: new Array<Posizione>()
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    posizioni: state => state.posizioniDelLavoro,
}

export const mutations: MutationTree<RootState> = {
    setPosizioni: (state, posizioni: Array<Posizione>) => {
        state.posizioniDelLavoro = posizioni
    }
}

export const actions: ActionTree<RootState, RootState> = {
    async save({ commit, dispatch }, pos: Posizione) {
        
        let action: string
        if (pos._id) {
            action = 'db/update'
        } else {
            action = 'db/insertInto'
        }
        await dispatch(action, { table: 'posizioni', data: pos }, { root: true })
        await dispatch('loadPosizioni', pos.lavoroID)
    },

    async loadPosizioni({ commit, dispatch }, lavoroID: string) {
        let mapFunction = (doc: any, emit: any) => {emit(doc.lavoroID)} 

        let reduceFunction = {
            key: lavoroID,
            include_docs: true
        }

        const res = await dispatch('db/query', { table: 'posizioni', mapFunction, reduceFunction }, { root: true })  
        commit('setPosizioni', res)
    }
}

export class Posizione {
    _id: string = ''
    _rev: string = ''
    lavoroID: string = ''
    descrizione: string = ''
    posizione: string = ''
}