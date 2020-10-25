import { Scene, app } from "./scene.js";
import { checkCollision, Player, fixCollision } from "./helpers.js";

let resources;
let stage;
let objs = [];
let toFollow = []

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
            stage.camera.addChild(room.layers[0]);
            objs.push(room);
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
    sprite.position.set(500,500)
    sprite.scale.set(0.5,0.5)    
    stage.camera.position.set(app.screen.width/2, app.screen.height/2);
    stage.camera.addChild( sprite );
    toFollow = sprite;
    sprite.velocity = {x: 0, y: 0};
    objs.push(new Player(sprite));

    sprite = new PIXI.Sprite(resources["ghost.png"].texture);
    sprite.position.set(500,500)
    sprite.scale.set(0.5,0.5)    
    stage.camera.position.set(app.screen.width/2, app.screen.height/2);
    stage.camera.addChild( sprite );
    sprite.velocity = {x: 0, y: 0};
    objs.push(new Player(sprite));

    sprite = new PIXI.Sprite(resources["ghost.png"].texture);
    sprite.position.set(500,500)
    sprite.scale.set(0.5,0.5)    
    stage.camera.position.set(app.screen.width/2, app.screen.height/2);
    stage.camera.addChild( sprite );
    sprite.velocity = {x: 0, y: 0};
    objs.push(new Player(sprite));
}

function gameLoop(dt){

    // Moves player
    objs[1].sprite.velocity.x = (keys['d'] - keys['a'])*8*dt;
    objs[1].sprite.velocity.y = (keys['s'] - keys['w'])*8*dt;
    objs[2].sprite.velocity.x = Math.sin(performance.now()/2000)*5

    // Solves collision
    for(let i = 0; i < objs.length; i++){
        if (!objs[i].static) {
            if(!objs[i].sprite.velocity) objs[i].sprite.velocity = {x: 0, y: 0};
            if(objs[i].sprite.velocity.x != 0)fixCollision("x", objs[i], objs,i+1);
            if(objs[i].sprite.velocity.y != 0)fixCollision("y", objs[i], objs,i+1);
        }
    }

    // Makes camera follow the player
    if (toFollow) {
        stage.camera.position.set(app.screen.width/2, app.screen.height/2);
        stage.camera.pivot.x += (toFollow.position.x - stage.camera.pivot.x + toFollow.width/2)*dt*0.2;
        stage.camera.pivot.y += (toFollow.position.y - stage.camera.pivot.y + toFollow.height/2)*dt*0.2;
    }

}

function gameEnd(){

}


export { startGraphics, app }