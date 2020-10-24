class TileMap {
    constructor(name, info, tiles, layers, collision){
        this.info = info;
        this.name = name;
        this.tiles = tiles;
        this.layers = layers;
        this.collision = collision;
    }
}

export default TileMap;