import {TileMap, Layer} from "./tilemap.js"

// Creates the app instance globally because it's unique.
let app = new PIXI.Application({ resizeTo: window });
PIXI.AbstractRenderer.autoDensity = true;

class Camera {
    constructor() {
        this.container = new PIXI.Container();
    }

    addChild(obj) {
        this.container.addChild(obj);
    }

    toFollow(follow, dt = 1, size = 1) {
        this.container.position.set(app.screen.width / 2, app.screen.height / 2);
        this.container.pivot.x += (follow.position.x - this.container.pivot.x + follow.width / 2) * dt * size;
        this.container.pivot.y += (follow.position.y - this.container.pivot.y + follow.height / 2) * dt * size;
    }
}

// The graphic controllers render everything that we need and sync
// to the game instance.
class Scene {
    constructor() {
        this.tilemap;
        this.objects = [];
        this.camera = new Camera();
        app.stage.addChild(this.camera.container);
    }

    // Loads map files
    loadMap(loader, name) {
        loader
            .add(name + '_sprites', 'src/assets/maps/' + name + '/tiles.png')
            .add(name + '_atlas', 'src/assets/maps/' + name + '/tileset.json')
            .add(name + '_map', 'src/assets/maps/' + name + '/map.json')
            .add(name + '_gates', 'src/assets/maps/' + name + '/gates.json');
    }

    getTiles(name, info, resources){
        let tiles = []
        for (let y = 0; y < info.tileset_height; y++) {
            for (let x = 0; x < info.tileset_width; x++) {
                let rect = new PIXI.Rectangle(x * info.tile_width, y * info.tile_height, info.tile_width, info.tile_height);
                let texture = new PIXI.Texture(resources[name + "_sprites"].texture, rect);
                tiles.push(texture);
            }
        }
        return tiles;
    }

    getInfo(atlas,width,height){
        return { 
            tileset_width: atlas.imagewidth / atlas.tilewidth,
            tileset_height: atlas.imageheight / atlas.tileheight,
            tile_width: atlas.tilewidth,
            tile_height: atlas.tileheight,
            map_width: width,
            map_height: height
        };
    }

    // Compiles map to Tilemap instance
    compileMap(resources, name) {
        
        // Resources data
        let atlas = resources[name + "_atlas"].data;
        let map_data = resources[name + "_map"].data;
        let sprites_data = PIXI.utils.TextureCache[name + '_sprites'];

        // Textures and infos
        let info = this.getInfo(atlas,map_data.layers[0].width,map_data.layers[0].height);
        let tiles = this.getTiles(name, info, resources);
        let layers = [];

        let collision_map;
        let gates_map;

        for (let i = 0; i < map_data.layers.length; i++) {
            let layer_data = map_data.layers[i];
            let tilemap = new PIXI.tilemap.CompositeRectTileLayer(0, sprites_data);

            if (layer_data.name == "collision") {
                collision_map = new Layer(i, info, layer_data.data.map(a => a > 0 ? a - tiles.length : 0));
                continue;
            }else if (layer_data.name == "gates") {
                gates_map = new Layer(i, info, layer_data.data, tilemap);
            }

            for (let y = 0; y < info.map_height; y++) {
                for (let x = 0; x < info.map_width; x++) {
                    let place = y * info.map_height + x;
                    if (layer_data.data[place] != 0) {
                        tilemap.addFrame(tiles[layer_data.data[place] - 1], x * atlas.tilewidth, y * atlas.tileheight);
                    }
                }
            }

            layers.push(new Layer(i, info, layer_data.data, tilemap))
        }

        return new TileMap(info, tiles, layers, collision_map, gates_map)
    }
}


export { Scene, app }