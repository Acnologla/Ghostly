import TileMap from "./tilemap.js"

const ratio = 667/1366;

function createPIXI(){
    var app = new PIXI.Application(window.innerWidth, window.innerHeight);
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth,Math.abs(ratio*window.innerWidth))  
    app.stage.scale.set(0.5,0.5);
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth,Math.abs(ratio*window.innerWidth))  
    })
    return app 
}

function loadMap(app, name){
    return new Promise((res, rej) => {
        var loader = new PIXI.loaders.Loader();

        loader
            .add('src/assets/img/tile.png')
            .add('atlas','src/game/map/tileset.json')
            .add('map','src/game/map/map.json');
    
        loader.load((loader, resources) => {
            let atlas = resources.atlas.data;
            let map_size = [atlas.imagewidth/atlas.tilewidth, atlas.imageheight/atlas.tileheight]
    
            let tiles = []
    
            for(let y = 0; y < map_size[1]; y++){ 
                for(let x = 0; x < map_size[0]; x++){    
                    var texture = new PIXI.Texture(resources["src/assets/img/tile.png"].texture, new PIXI.Rectangle(x*atlas.tilewidth, y*atlas.tileheight, atlas.tilewidth, atlas.tileheight));
                    tiles.push(texture);
                }   
            }
    
            let collision_map;
            let layers = []
    
            for(let i = 0; i < resources.map.data.layers.length; i++) {
                let layer = resources.map.data.layers[i];
    
                if (layer.name == "collision"){
                    collision_map = layer.data.map(a => a > 0 ? a - tiles.length : 0);
                    continue;
                }
    
                var tilemap_layer = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['src/assets/img/tile.png']);
                app.stage.addChild(tilemap_layer);
                 
                for(let y = 0; y < layer.height; y++){ 
                    for(let x = 0; x < layer.width; x++){    
                        if (layer.data[y*layer.height + x] != 0){
                            tilemap_layer.addFrame(tiles[layer.data[y*layer.height + x]-1], x*atlas.tilewidth, y*atlas.tileheight);
                        }
                    }
                }

                layers.push(tilemap_layer);
            }

            res(new TileMap("seila", tiles, layers, collision_map))
        });
    });
}

export {createPIXI, loadMap};