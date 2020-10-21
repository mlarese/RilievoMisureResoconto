export default class SyncObj {
    tipo = ''                           // lavoro, contatto, rilievo ...
    _id = ''
    action = ''
    lastUpdate_UTCDate: Date | null = null
    lastUpdateUser = ''
    insert_UTCDate: Date | null = null
    insertUser = ''
    data: any
    listaRisorse = new Array<string>()
}