import { checkCollision, CollidingTile } from './helpers.js'
const dir = { x: 'width', y: 'height' }

class Layer {
  constructor (id, info, data, texture, tiles) {
    this.info = info
    this.data = data
    this.id = id
    this.texture = texture
    this.tiles = tiles
  }

  render () {
    for (let y = 0; y < this.info.map_height; y++) {
      for (let x = 0; x < this.info.map_width; x++) {
        const place = y * this.info.map_height + x
        if (this.data[place] !== 0) {
          this.texture.addFrame(this.tiles[this.data[place] - 1], x * this.info.tile_width, y * this.info.tile_height)
        }
      }
    }
  }

  set (x, y, z, rec = false) {
    if (!this.data[y * this.info.map_width + x]) { return }

    this.data[y * this.info.map_width + x] = z

    if (rec) {
      this.set(x, y - 1, z, rec)
      this.set(x, y + 1, z, rec)
      this.set(x - 1, y, z, rec)
      this.set(x + 1, y, z, rec)
    }

    if (this.texture) {
      this.texture.clear()
    }
  }

  get (x, y) { return this.data[y * this.info.width + x] }
}

class TileMap {
  constructor (info, tiles, layers, collisionLayer, gatesLayer) {
    this.info = info
    this.tiles = tiles
    this.layers = layers
    this.collisionLayer = collisionLayer
    this.gatesLayer = gatesLayer
    this.static = true
  }

  toTilePos (x, y) {
    return [
      Math.floor(x / this.info.tile_width),
      Math.floor(y / this.info.tile_height)
    ]
  }

  getNextTiles (x, y) {
    const place = this.toTilePos(x, y)
    const colliding = []
    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        const xtile = x + place[0]
        const ytile = y + place[1]
        const value = this.collisionLayer.data[ytile * this.info.map_width + xtile]
        if (y + place[1] >= 0 && x + place[0] >= 0 && value) {
          const rect = new PIXI.Rectangle(
            xtile * this.info.tile_width,
            ytile * this.info.tile_height,
            this.info.tile_width,
            value === 2 ? this.info.tile_height / 1.5 : this.info.tile_height
          )
          rect.obj_id = value
          rect.tile_x = xtile
          rect.tile_y = ytile
          colliding.push(rect)
        }
      }
    }
    return colliding
  }

  checkCollision (axis, target) {
    const sprite = target.sprite
    const rect = new PIXI.Rectangle(sprite.position.x, sprite.position.y, sprite.width, sprite.height)
    const collided = []
    const tiles = this.getNextTiles(sprite.position.x, sprite.position.y)
    for (let i = 0; i < tiles.length; i++) {
      if (checkCollision(tiles[i], rect)) {
        const tile = tiles[i].obj_id
        collided.push(new CollidingTile(tile, tiles[i].tile_x, tiles[i].tile_y))

        const correction = rect[axis] < target.old[axis] ? ((tiles[i][axis] + tiles[i][dir[axis]]) - rect[axis]) : -((rect[axis] + rect[dir[axis]]) - tiles[i][axis])

        if (Math.abs(correction) > sprite[dir[axis]]) { return collided }

        if (axis === 'x') {
          target.move(sprite.position.x + correction)
        } else {
          target.move(null, sprite.position.y + correction)
        }

        break
      }
    }
    return collided
  }
}

export { TileMap, Layer }
