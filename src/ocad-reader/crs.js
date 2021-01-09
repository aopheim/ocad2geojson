const crsGrids = require('./crs-grids')
const TdPoly = require('./td-poly')

// OCAD uses 1/100 mm of "paper coordinates" as units, we
// want to convert to meters in real world
const hundredsMmToMeter = 1 / (100 * 1000)

module.exports = class Crs {
  constructor(scalePar) {
    const { x: easting, y: northing, m: scale, i: gridId } = scalePar

    this.easting = Number(easting)
    this.northing = Number(northing)
    this.scale = Number(scale)
    this.gridId = Number(gridId)

    this.grid = crsGrids.find(g => g[0] === this.gridId)
    const [, code, catalog, name] = this.grid || [this.gridId, 0, null, null]
    this.code = code
    this.catalog = catalog
    this.name = name
  }

  // Converts a map coordinate (OCAD paper coordinates) to
  // the a coordinate in this CRS
  toProjectedCoord(coord) {
    return new TdPoly(
      coord[0] * hundredsMmToMeter * this.scale + this.easting,
      coord[1] * hundredsMmToMeter * this.scale + this.northing,
      coord.xFlags,
      coord.yFlags
    )
  }

  // Converts a CRS coordinate to
  // map coordinate (OCAD paper coordinates)
  toMapCoord(coord) {
    return new TdPoly(
      (coord[0] - this.easting) / hundredsMmToMeter / this.scale,
      (coord[1] - this.northing) / hundredsMmToMeter / this.scale,
      coord.xFlags,
      coord.yFlags
    )
  }
}
