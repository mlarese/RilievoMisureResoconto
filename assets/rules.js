export const required = value => !!value || 'Required.'
export const  min = v => (v && v.length >= 8) || 'Min 8 characters'

export const rules = {required, min}
