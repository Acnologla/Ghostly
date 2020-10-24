import * as Utils from "./utils.js"

class GraphicsController {
    constructor(){
        this.app = Utils.createPIXI();
        this.tilemaps = []
    }

    loadMap(name){
        return new Promise((res, _) => {
            Utils.loadMapIntoPIXI(this.app,name).then((map) => {
                this.tilemaps.push(map);
                res(map);
            })
        })
    }
}



export {GraphicsController}