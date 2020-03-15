export const emptyStructure = () => ([
  {  'name': 'Cataloghi', 'isDirectory': true},
  {  'name': 'Documenti', 'isDirectory': true},
  {  'name': 'Immagini', 'isDirectory': true}
])

export const fileManagerColumns = (columns) => {
  for(let column of columns) {
    if(column.dataField === 'name') column.caption = 'Nome'
    if(column.dataField === 'size') column.visible = false
    if(column.dataField === 'dateModified') column.visible = false
    console.log(column.dataField)
  }
  console.log(columns)
  return columns
}

