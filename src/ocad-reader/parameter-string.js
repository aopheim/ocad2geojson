const { StringDecoder } = require('string_decoder')

const decoder = new StringDecoder('utf8')

module.exports = class ParameterString {
  constructor(reader, indexRecord) {
    this.recType = indexRecord.recType

    const offset = reader.offset
    let strLen = 0
    while (reader.readByte()) strLen++
    const val = decoder.end(reader.buffer.slice(offset, offset + strLen))

    const vals = val.split('\t')
    this.values = { _first: vals[0], _pairs: [] }
    for (let i = 1; i < vals.length; i++) {
      const code = vals[i][0]
      const value = vals[i].substring(1)
      let codeValues = this.values[code]
      if (!codeValues) {
        this.values[code] = value
      } else {
        if (!Array.isArray(codeValues)) {
          codeValues = this.values[code] = [codeValues]
        }
        codeValues.push(value)
      }

      this.values._pairs.push({ code, value })
    }
  }
}
