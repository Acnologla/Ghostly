import TileMap from "./tilemap.js"

// Creates the app instance globally because it's unique.
let app = new PIXI.Application({ resizeTo: window });
PIXI.AbstractRenderer.autoDensity = true;

// The graphic controllers render everything that we need and sync
// to the game instance.
class Scene {
    constructor() {
        this.tilemaps = [];
        this.objects = [];
        this.camera = new PIXI.Container();
        app.stage.addChild(this.camera);
    }

    // Loads map files
    loadMap(loader, name) {
        loader
            .add(name + '_sprites', 'src/assets/maps/' + name + '/tiles.png')
            .add(name + '_atlas', 'src/assets/maps/' + name + '/tileset.json')
            .add(name + '_map', 'src/assets/maps/' + name + '/map.json');
    }

    // Compiles map to Tilemap instance
    compileMap(resources, name) {
        let atlas = resources[name + "_atlas"].data;
        let map_size = [atlas.imagewidth / atlas.tilewidth, atlas.imageheight / atlas.tileheight]

        let collision_map;
        let tiles = [];
        let layers = [];

        for (let y = 0; y < map_size[1]; y++) {
            for (let x = 0; x < map_size[0]; x++) {
                var texture = new PIXI.Texture(resources[name + "_sprites"].texture, new PIXI.Rectangle(x * atlas.tilewidth, y * atlas.tileheight, atlas.tilewidth, atlas.tileheight));
                tiles.push(texture);
            }
        }

        for (let i = 0; i < resources[name + "_map"].data.layers.length; i++) {
            let layer = resources[name + "_map"].data.layers[i];

            if (layer.name == "collision") {
                collision_map = layer.data.map(a => a > 0 ? a - tiles.length : 0);
                continue;
            }

            var tilemap_layer = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache[name + '_sprites']);

            for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                    if (layer.data[y * layer.height + x] != 0) {
                        tilemap_layer.addFrame(tiles[layer.data[y * layer.height + x] - 1], x * atlas.tilewidth, y * atlas.tileheight);
                    }
                }
            }

            layers.push(tilemap_layer);
        }

        const info = {
            tilewidth: atlas.tilewidth,
            tileheight: atlas.tileheight,
            mapwidth: atlas.imagewidth,
            mapheight: atlas.imageheight,
        }

        return new TileMap(name, info, tiles, layers, collision_map)
    }
}


export { Scene, app }