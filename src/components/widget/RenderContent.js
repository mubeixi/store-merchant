export const RenderContent = {
  props: {
    option: Object
  },
  render (h) {

    if (this.option.render) {
      return this.option.render(h, this.option.scope)
    }
    const { row, $index } = this.option.scope
    const { column } = this.option
    const property = column.prop
    let value = row[property]
    // console.log(column.prop,value)
    if (column && column.formatter) {
      let val = column.formatter(row, column, value, $index)
      return <span>{val}</span>
    }
    if (column.type === 'index') {
        value = $index + 1
    }
    if (!value && value !== 0) {
      value = '-'
    }
    return <span>{value}</span>
  }
}
