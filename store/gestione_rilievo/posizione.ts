export default class Posizione {
    _id: string | null
    _rev: string | null
    descrizione: string | null
    qta: number

    constructor() {
        this._id = null
        this._rev = null
        this.descrizione = null
        this.qta = 0
    }
}