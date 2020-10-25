import { Scene, app } from "./scene.js";
import { Obj } from "./helpers.js";

let scene;
let resources;
let following;
let speed = 8;

// Starts Game and Graphics
async function start() {

    scene = new Scene();
    resources = await loadToStage(scene);

    // Game loop start
    let ticker = new PIXI.Ticker();
    ticker.autoStart = true;
    ticker.start();
    ticker.addOnce(onStart);
    ticker.add(gameLoop);

    return ticker
}

// Starts the loading screen and things like that.
async function loadToStage(scene) {
    return new Promise((resolve, _) => {
        const loader = new PIXI.Loader().add("ghost.png", "src/assets/sprites/ghost.png");
        scene.loadMap(loader, "room");
        loader.load((_, resources) => {
            scene.tilemap = scene.compileMap(resources, "room");
            for (let i = 0; i < scene.tilemap.layers.length; i++) {
                scene.camera.addChild(scene.tilemap.layers[i].texture);
            }
            loader.destroy();
            resolve(resources);
        });
    })
}

let keys = { "w": false, "s": false, "a": false, "d": false }

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

function onStart() {
    // Creates a player
    let sprite = new PIXI.Sprite(resources["ghost.png"].texture);
    sprite.position.set(500, 500)
    sprite.scale.set(0.5, 0.5)

    // Add to camera
    scene.camera.addChild(sprite);
    following = sprite;

    // Sets as a object
    sprite.velocity = { x: 0, y: 0 };
    scene.objects.push(new Obj(sprite));

    // Creates a player
    sprite = new PIXI.Sprite(resources["ghost.png"].texture);
    sprite.position.set(300, 500)
    sprite.scale.set(0.5, 0.5)

    // Add to camera
    scene.camera.addChild(sprite);

    // Sets as a object
    sprite.velocity = { x: 0, y: 0 };
    scene.objects.push(new Obj(sprite));
}

function solveCollision(dt){
    let plr = scene.objects[0].sprite;
    plr.velocity.x = (keys['d'] - keys['a']) * speed * dt;
    plr.velocity.y = (keys['s'] - keys['w']) * speed * dt;

    for (let i = 0; i < scene.objects.length; i++) {
        let obj = scene.objects[i];
        if (!obj.static) {

            obj.move(obj.sprite.position.x + obj.sprite.velocity.x);
            let corrected = scene.tilemap.checkCollision("x", obj);

            if(corrected.length == 0) {
                for (let j = 0; j < scene.objects.length; j++) {
                    if (i != j){
                        let corrected = obj.checkCollision("x", scene.objects[j]);
                        if(corrected)break;
                    }
                }
            }

            obj.move(null, obj.sprite.position.y + obj.sprite.velocity.y);
            corrected = scene.tilemap.checkCollision("y", obj);

            if(corrected.length == 0) {
                for (let j = 0; j < scene.objects.length; j++) {
                    if (i != j){
                        let corrected = obj.checkCollision("y", scene.objects[j]);
                        if(corrected)break;
                    }
                }
            }
        }
    }
}

function gameLoop(dt) {
    solveCollision(dt);
    scene.camera.toFollow(following, dt, 0.2)
}

export { start, Scene, app }