
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import SyncObj from '@/models/SyncObj'

export const state = () => ({
    posizioniDelLavoro: new Array<Posizione>(),
    table: 'posizioni'
})

export type rs = ReturnType<typeof state>

export const getters: GetterTree<rs, rs> = {
    posizioni: state => state.posizioniDelLavoro.sort((a, b) => (a.posizione > b.posizione) ? 1 : ((b.posizione > a.posizione) ? -1 : 0)),
}

export const mutations: MutationTree<rs> = {
    setPosizioni: (state, posizioni: Array<Posizione>) => {
        state.posizioniDelLavoro = posizioni
    }
}

export const actions: ActionTree<rs, rs> = {
    async save({ state, commit, dispatch, rootState }, pos: Posizione) {
        let action: string
        if (pos._id) {
            action = 'db/update'
        } else {
            action = 'db/insertInto'
            pos.insertUser = (rootState as any).auth.utente
            pos.insertDate = new Date()
        }

        pos.lastUpdateUser = (rootState as any).auth.utente
        pos.lastUpdateDate = new Date()

        await dispatch(action, { table: state.table, data: pos }, { root: true })
        await dispatch('loadPosizioni', pos.lavoroID)
    },


    async loadPosizioni({ state, commit, dispatch }, lavoroID: string) {
        let mapFunction = (doc: any, emit: any) => { emit(doc.lavoroID) }

        let reduceFunction = {
            key: lavoroID,
            include_docs: true
        }

        const res = await dispatch('db/query', { table: state.table, mapFunction, reduceFunction }, { root: true })
        commit('setPosizioni', res)
    },

    //====================//
    //=== SOLO PER SYNC ==//
    async save_x_sync({ state, commit, dispatch, rootState }, so: SyncObj) {
        const pos : Posizione = so.data
        let action: string
        if (pos._id) {
            action = 'db/update'
        } else {
            action = 'db/insertInto'
        }

        await dispatch(action, { table: state.table, data: pos }, { root: true })
        await dispatch('loadPosizioni', pos.lavoroID)
    },

    async getPosizioni_x_Sync({ state, commit, dispatch }) {

        let listaTmp = await dispatch('db/selectAll', { table: state.table }, { root: true }) as Array<Posizione>
        let listaResult = new Array<SyncObj>()

        for (const p of listaTmp) {
            let so: SyncObj = {
                tipo: 'POSIZIONE',
                _id: p._id,
                action: '',
                lastUpdate_UTCDate: p.lastUpdateDate,
                lastUpdateUser: p.lastUpdateUser,
                insert_UTCDate: p.insertDate,
                insertUser: p.insertUser,
                data: p,
                listaRisorse: new Array<string>(), // DA CAPIRE COME GESTIRE
            }
            listaResult.push(so)
        }
        return listaResult
    }
}

// export class Posizione extends SyncObj {
//     _id: string = ''
//     _rev: string = ''
//     lavoroID: string = ''
//     descrizione: string = ''
//     posizione: string = ''

//     lastUpdateDate: Date | null = null
//     lastUpdateUser = ''
//     insertDate: Date | null = null
//     insertUser = ''
// }


export class Posizione {
    _id: string = ''
    _rev: string = ''
    lavoroID: string = ''
    descrizione: string = ''
    posizione: string = ''

    lastUpdateDate: Date | null = null
    lastUpdateUser = ''
    insertDate: Date | null = null
    insertUser = ''
}
