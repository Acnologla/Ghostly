import TileMap from "./tilemap.js";

let dir = {"x":"width", "y": "height"}

class Player {
    constructor(sprite){
        this.sprite = sprite;
    }
}


function checkCollision(first,other, ox = 0, oy = 0){
    return first.x < other.x + other.width &&
           first.x + first.width > other.x + ox &&
           first.y < other.y + other.height &&
           first.y + first.height > other.y
}

function fixCollision(axis, target, others){
    let sprite = target.sprite;
    let old = {x: sprite.position.x, y: sprite.position.y}

    sprite.position[axis] += sprite.velocity[axis];
    let rect = new PIXI.Rectangle(sprite.position.x, sprite.position.y, sprite.width, sprite.height);

    for(let i = 0; i < others.length; i++){
        let other = others[i];
        if(other == target)continue;
        if(other instanceof TileMap) {
            let tiles = other.getNextTiles(sprite.position.x, sprite.position.y); 
            for(let i = 0; i < tiles.length; i++){
                if(checkCollision(tiles[i], rect)){
                    sprite.position[axis] += rect[axis] < old[axis] ? ((tiles[i][axis] + tiles[i][dir[axis]]) - rect[axis] ) : -((rect[axis] + rect[dir[axis]]) - tiles[i][axis] );
                    break;
                }
            }
        }
    }
}

export {checkCollision, Player, fixCollision};