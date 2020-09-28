export default class JSArtProp {
    // _id: string | nulls
    // _rev: string | null
    JSAPropName: string = ''
    JSAPropOrder: string = ''
    JSAPropMenu: string = ''
    JSAPropLabel: string = ''
    JSADataType: string = ''
    JSAAutoCalcExp: string = ''
    JSAPropTables: string = ''
    JSAWizard: string = ''
    JSARequired: string = ''

    private _isRequired: boolean = false;
    public get isRequired(): boolean {
        let res: boolean = false
        if (this.JSARequired) {
            if (this.JSARequired.toUpperCase() === 'TRUE') {
                res = true
            }
        }
        return res
    }
    
    private _isDatiGenerali : boolean = false;
    public get isDatiGenerali() : boolean {
        let res: boolean = false
        if (this.JSAWizard) {
            if (this.JSAWizard.toUpperCase() === 'PWA.DG') {
                res = true
            }
        }
        return res
    }

}