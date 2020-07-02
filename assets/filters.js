import formatSt from 'date-fns/format'
import addMinutes from 'date-fns/addMinutes'
import numeral from 'numeral'

numeral.register('locale', 'it', {
  delimiters: { thousands: '.', decimal: ',' },
  currency: { symbol: '€' }
})
numeral.locale('it')

export const dmySt = (date) => {
  if (!date) return ''
  let ldate = null

  if (date.date) {
    ldate = new Date(date.date)
  } else {
    ldate = new Date(date)
  }

  const offs = -ldate.getTimezoneOffset()
  // ldate = addMinutes(ldate, offs)
  return formatSt(ldate, 'dd/MM/yyyy')
}

export const dmy = (date) => {
  if (!date) return ''
  let ldate = null

  if (date.date) {
    ldate = new Date(date.date)
  } else {
    ldate = new Date(date)
  }

  const offs = -ldate.getTimezoneOffset()
  //ldate = addMinutes(ldate, offs)
  return formatSt(ldate, 'dd/MM/yyyy')
}

export const time = (date, pattern='HH:mm') => {
export const currentFullTime = () => {
  return formatSt(new Date(), 'HH:mm:ss') + ' '
}

export const repoFilename = (fileName) => {
  let ldate = new Date()
  //ldate = addMinutes(ldate, offs)
  return formatSt(ldate, 'yyyyMMddHHmmss') + '_' + fileName
}

export const time = (date, pattern = 'HH:mm:ss') => {
  if (!date) return ''
  let ldate = null

  if (date.date) {
    ldate = new Date(date.date)
  } else {
    ldate = new Date(date)
  }

  const offs = -ldate.getTimezoneOffset()
  //ldate = addMinutes(ldate, offs)
  return formatSt(ldate, pattern)
}

export const timeNoTZ = (date, pattern = 'HH:mm:ss') => {
  if (!date) return ''
  let ldate = null

  if (date.date) {
    ldate = new Date(date.date)
  } else {
    ldate = new Date(date)
  }

  return formatSt(ldate, pattern)
}

export const truncate = (value, limit, appendText = '...') => {
  if (!value) return ''
  if (value.length > limit) {
    value = value.substring(0, limit) + appendText
  }
  return value
}

export const number = (value, format = '0,0') => {
  if (!value) return 0
  value = value * 1
  return numeral(value).format(format)
}

export const currentYMD = () => formatSt(new Date(), 'yyyy-MM-dd')

