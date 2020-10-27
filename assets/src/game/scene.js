import { TileMap, Layer } from './tilemap.js'

// Creates the app instance globally because it's unique.
const app = new PIXI.Application({ resizeTo: window })
PIXI.AbstractRenderer.autoDensity = true

class Camera {
  constructor () {
    this.container = new PIXI.Container()
    this.container.filters = [new PIXI.filters.CRTFilter({ vignetting: 0 }), new PIXI.filters.BulgePinchFilter({
      radius: 1000,
      strength: 0.1
    }),
    new PIXI.filters.RGBSplitFilter([5, 0], [0, 0], [0, 0])]
  }

  addChild (obj) {
    this.container.addChild(obj)
  }

  toFollow (follow, dt = 1, size = 1) {
    this.container.position.set(app.screen.width / 2, app.screen.height / 2)
    this.container.pivot.x += (follow.position.x - this.container.pivot.x + follow.width / 2) * dt * size
    this.container.pivot.y += (follow.position.y - this.container.pivot.y + follow.height / 2) * dt * size
  }
}

// The graphic controllers render everything that we need and sync
// to the game instance.
class Scene {
  constructor () {
    this.tilemap = null
    this.objects = []
    this.camera = new Camera()
    app.stage.addChild(this.camera.container)
  }

  // Loads map files
  loadMap (loader, name) {
    loader
      .add(name + '_sprites', '../src/assets/maps/' + name + '/tiles.png')
      .add(name + '_atlas', '../src/assets/maps/' + name + '/tileset.json')
      .add(name + '_map', '../src/assets/maps/' + name + '/map.json')
      .add(name + '_gates', '../src/assets/maps/' + name + '/gates.json')
  }

  getTiles (name, info, resources) {
    const tiles = []
    for (let y = 0; y < info.tileset_height; y++) {
      for (let x = 0; x < info.tileset_width; x++) {
        const rect = new PIXI.Rectangle(x * info.tile_width, y * info.tile_height, info.tile_width, info.tile_height)
        const texture = new PIXI.Texture(resources[name + '_sprites'].texture, rect)
        tiles.push(texture)
      }
    }
    return tiles
  }

  getInfo (atlas, width, height) {
    return {
      tileset_width: atlas.imagewidth / atlas.tilewidth,
      tileset_height: atlas.imageheight / atlas.tileheight,
      tile_width: atlas.tilewidth,
      tile_height: atlas.tileheight,
      map_width: width,
      map_height: height
    }
  }

  // Compiles map to Tilemap instance
  compileMap (resources, name) {
    // Resources data
    const atlas = resources[name + '_atlas'].data
    const mapData = resources[name + '_map'].data
    const spritesData = PIXI.utils.TextureCache[name + '_sprites']

    // Textures and infos
    const info = this.getInfo(atlas, mapData.layers[0].width, mapData.layers[0].height)
    const tiles = this.getTiles(name, info, resources)
    const layers = []

    let collisionMap
    let gatesMap

    for (let i = 0; i < mapData.layers.length; i++) {
      const layerData = mapData.layers[i]
      const tilemap = new PIXI.tilemap.CompositeRectTileLayer(0, spritesData)

      if (layerData.name === 'collision') {
        collisionMap = new Layer(i, info, layerData.data.map(a => a > 0 ? a - tiles.length : 0))
        continue
      } else if (layerData.name === 'gates') {
        gatesMap = new Layer(i, info, layerData.data, tilemap, tiles)
      }

      const layer = new Layer(i, info, layerData.data, tilemap, tiles)
      layer.render()

      layers.push(layer)
    }

    return new TileMap(info, tiles, layers, collisionMap, gatesMap)
  }
}

export { Scene, app }
