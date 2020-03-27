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
  }
  return columns
}

export const saveFile = (file, path, fs) => {
  let reader = new FileReader();
  reader.readAsBinaryString(file)
  reader.onload = (data) => {
    let fileBlob = data.currentTarget.result
    let curFileName = prompt('Nome immagine', file.name)
    curFileName = `${path}/${curFileName}`
    fs.writeFile(curFileName, fileBlob, (res) => {})
  }

}

