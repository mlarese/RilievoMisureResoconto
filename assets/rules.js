export const required = value => !!value || 'Obbligatorio.'
export const  min = v => (v && v.length >= 8) || 'Min 8 caratteri'

export const rules = {required, min}
