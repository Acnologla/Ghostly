
import e from "express";
import { Scene, app } from "./scene.js";

let resources;
let stage;

async function startGraphics(){
    stage = new Scene();
    resources = await loadToStage(stage);

    let ticker = new PIXI.Ticker();
    ticker.autoStart = true;
    ticker.start();

    ticker.addOnce(onStart);    
    ticker.add(gameLoop);

    return ticker
}

// Starts the loading screen and things like that.
async function loadToStage(stage){
    return new Promise((resolve, _) => {
        const loader = new PIXI.Loader()
        .add("ghost.png", "src/assets/sprites/ghost.png");

        stage.loadMap(loader, "room");

        loader.load((_, resources) => {
            let room = stage.compileMap(resources, "room");
            stage.camera.addChild( room.layers[0] );

            loader.destroy();

            resolve(resources)
        });
    })
}

/**
 ** |----------------------------------|
 ** |           Game logic             |
 ** |--------------------------------- | 
 **/

let keys = {"w":false, "s": false, "a": false, "d": false}

window.addEventListener('keydown', (e) => {
    if (keys[e.key.toLowerCase()] === false) {
        keys[e.key.toLowerCase()] = true;
    }
})

window.addEventListener('keyup', (e) => {
    if (keys[e.key.toLowerCase()] === true) {
        keys[e.key.toLowerCase()] = false;
    }
})

function onStart(){
    let sprite = new PIXI.Sprite(resources["ghost.png"].texture);
    sprite.pivot.set(100,100)
    sprite.scale.set(0.5,0.5)    
    stage.camera.position.set(app.screen.width/2, app.screen.height/2);
    stage.camera.pivot.copy(sprite.position);
    stage.camera.addChild( sprite );
}

function gameLoop(){
    
}

function gameEnd(){

}


export { startGraphics, app}