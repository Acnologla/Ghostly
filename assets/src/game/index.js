import * as Utils from "./graphics/utils.js"

class GraphicsController {
    constructor(){
        this.app = Utils.createPIXI();
        this.tilemaps = []
        this.camera = new PIXI.Container();
        this.app.stage.addChild(this.camera);
    }

    loadMap(loader, name){
        return new Promise((res, _) => {
            Utils.loadMapIntoPIXI(loader, this.app,name).then((map) => {
                map.layers[0].scale.set(0.2,0.2);
                this.tilemaps.push(map);
                this.camera.addChild(map.layers[0])
                res(map);
            })
        })
    }
}



export {GraphicsController}