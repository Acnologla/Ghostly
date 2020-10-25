class TileMap {
    constructor(name, info, tiles, layers, collision){
        this.info = info;
        this.name = name;
        this.tiles = tiles;
        this.layers = layers;
        this.collision = collision;
        this.static = true;
    }

    getNextTiles(x,y){
        let place = [Math.floor(x/this.info.tilewidth),Math.floor(y/this.info.tileheight)];
        let tiles = []

        for(let y = -1; y < 2; y++) {
            for(let x = -1; x < 2; x++) {   
                let xtile =  (x+place[0]);  
                let ytile =  (y+place[1]);
                let value = this.collision[ytile*this.info.mapwidth + xtile];
                if(y+place[1] >= 0  && x+place[0] >= 0 && value != 0 && value != undefined) { 
                    tiles.push(new PIXI.Rectangle(
                        xtile*this.info.tilewidth,
                        ytile*this.info.tileheight,
                        this.info.tilewidth,
                        value == 2 ? this.info.tileheight/2 : this.info.tileheight
                    ));
                    
                }
            }
        }
        return tiles;
    }
}

export default TileMap;