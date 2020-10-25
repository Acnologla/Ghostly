import {checkCollision} from "./helpers.js"
let dir = {"x":"width", "y": "height"}

class Layer {
    constructor(id, info, data, texture, tiles) {
        this.info = info;
        this.data = data;
        this.id = id;
        this.texture = texture;
        this.tiles = tiles;
    }

    render(){
        for (let y = 0; y < this.info.map_height; y++) {
            for (let x = 0; x < this.info.map_width; x++) {
                let place = y * this.info.map_height + x;
                if (this.data[place] != 0) {
                    this.texture.addFrame(this.tiles[this.data[place] - 1], x * this.info.tile_width, y * this.info.tile_height);
                }
            }
        }
    }

    set(x, y, z) {
        this.data[y * this.info.width + x] = z;
        this.texture.clear();
    }

    get(x, y) { return this.data[y * this.info.width + x]; }
}

class TileMap {
    constructor(info, tiles, layers, collision_layer, gates_layer) {
        this.info = info;
        this.tiles = tiles;
        this.layers = layers;
        this.collision_layer = collision_layer;
        this.gates_layer = gates_layer;
        this.static = true;
    }
    
    toTilePos(x,y){
        return [
            Math.floor(x/this.info.tile_width),
            Math.floor(y/this.info.tile_height)
        ];
    }
    
    getNextTiles(x,y){
        let place = this.toTilePos(x,y);
        let colliding = []
        for(let y = -1; y < 2; y++) {
            for(let x = -1; x < 2; x++) {   
                let xtile = x+place[0];  
                let ytile = y+place[1];
                let value = this.collision_layer.data[ytile*this.info.map_width + xtile];
                if(y+place[1] >= 0  && x+place[0] >= 0 && value != 0 && value != undefined) { 
                    let rect = new PIXI.Rectangle(
                        xtile*this.info.tile_width,
                        ytile*this.info.tile_height,
                        this.info.tile_width,
                        value == 2 ? this.info.tile_height/1.5 : this.info.tile_height
                    )
                    rect.obj_id = value;
                    rect.tile_x = xtile;
                    rect.tile_y = ytile;
                    colliding.push(rect);
                }
            }
        }
        return colliding;
    }

    checkCollision(axis, target){
        let sprite = target.sprite;
        let rect = new PIXI.Rectangle(sprite.position.x, sprite.position.y, sprite.width, sprite.height);
        let collided = []
        let tiles = this.getNextTiles(sprite.position.x, sprite.position.y); 
        for(let i = 0; i < tiles.length; i++){
            if(checkCollision(tiles[i], rect)){
                collided.push({type: 1, id: tiles[i].obj_id, tilex: tiles[i].tile_x, tiley: tiles[i].tile_y})
                let correction = rect[axis] < target.old[axis] ? ((tiles[i][axis] + tiles[i][dir[axis]]) - rect[axis] ) : -((rect[axis] + rect[dir[axis]]) - tiles[i][axis] );
                
                if(Math.abs(correction) > sprite[dir[axis]])
                    return false;
    
                if(axis == "x") {
                    target.move(sprite.position.x + correction);
                    return true;
                } else {
                    target.move(null, sprite.position.y + correction);
                    return true;
                }
            }
        }
        return collided;
    }
}

export { TileMap, Layer }