import { Scene, app } from './scene.js'
import { Obj, CollidingTile } from './helpers.js'

import { keys } from './keys.js'

let scene
let resources
let following
const speed = 6
let plr
let sendMove

// Starts Game and Graphics
async function start (move) {
  scene = new Scene()
  resources = await loadToStage(scene)
  // Game loop start
  const ticker = new PIXI.Ticker()
  ticker.autoStart = true
  ticker.start()
  ticker.addOnce(onStart)
  ticker.add(gameLoop)

  sendMove = move;

  return ticker
}

// Starts the loading screen and things like that.
async function loadToStage (scene) {
  return new Promise((resolve) => {
    const loader = new PIXI.Loader().add('ghost.png', '../src/assets/sprites/ghost.png')
    scene.loadMap(loader, 'room')
    loader.load((_, resources) => {
      scene.tilemap = scene.compileMap(resources, 'room')
      for (let i = 0; i < scene.tilemap.layers.length; i++) {
        scene.camera.addChild(scene.tilemap.layers[i].texture)
      }
      loader.destroy()
      resolve(resources)
    })
  })
}

function movePlr () {
  if (plr) {
    plr.velocity.x = (keys.d - keys.a) * speed
    plr.velocity.y = (keys.s - keys.w) * speed
  }
}

function createPlrSprite () {
  const sprite = new PIXI.Sprite(resources['ghost.png'].texture)
  sprite.position.set(500, 500)
  sprite.scale.set(0.5, 0.5)

  scene.camera.addChild(sprite)

  following = sprite

  sprite.velocity = { x: 0, y: 0 }

  const obj = new Obj(sprite, false)

  scene.objects.push(obj)

  plr = scene.objects[0].sprite

  scene.objects[0].onMove = function(){
    sendMove(plr.position.x, plr.position.y)
  }
}

function removeGate (x, y) {
  scene.tilemap.gates_layer.set(x, y, 0, true)
  scene.tilemap.collision_layer.set(x, y, 0, false)
  scene.tilemap.gates_layer.render()
}

function removeObj (i) {
  scene.camera.container.removeChild(scene.objects[i].sprite)
  scene.objects.splice(i, 1)
}

function solveCollision (dt) {
  for (let i = 0; i < scene.objects.length; i++) {
    const obj = scene.objects[i]

    if (!obj.static) {
      let colliding = []

      obj.move(obj.sprite.position.x + obj.sprite.velocity.x * dt)
      let corrected = scene.tilemap.checkCollision('x', obj)
      if (corrected.length === 0) {
        for (let j = 0; j < scene.objects.length; j++) {
          if (i !== j) {
            const corrected = obj.checkCollision('x', scene.objects[j])
            if (corrected) {
              colliding.push(scene.objects[j])
              break
            }
          }
        }
      } else colliding = colliding.concat(corrected)

      obj.move(null, obj.sprite.position.y + obj.sprite.velocity.y * dt)
      corrected = scene.tilemap.checkCollision('y', obj)

      if (corrected.length === 0) {
        for (let j = 0; j < scene.objects.length; j++) {
          if (i !== j) {
            const corrected = obj.checkCollision('y', scene.objects[j])
            if (corrected) {
              colliding.push(scene.objects[j])
              break
            }
          }
        }
      } else colliding = colliding.concat(corrected)

      for (let i = 0; i < colliding.length; i++) {
        if (obj.handleCollision) {
          obj.handleCollision(colliding[i])
        }
      }
    }
  }
}

// Wot

let players = {}

function AddPlayer(id){
  const sprite = new PIXI.Sprite(resources['ghost.png'].texture)
  sprite.position.set(300, 500)
  sprite.scale.set(0.5, 0.5)
  scene.camera.addChild(sprite)
  sprite.velocity = { x: 0, y: 0 }
  scene.objects.push(new Obj(sprite, false))
  players[id] = sprite;
}

function RemPlayer(id){
  scene.camera.container.removeChild(players[id]);
  delete players[id];
}

function MvPlr(id, x, y){
  if (!players[id]) {
    AddPlayer(id)
  }
  players[id].position.x = x;
  players[id].position.y = y;
}


// Game stage

function onStart () {
  createPlrSprite()
}

function gameLoop (dt) {
  movePlr()
  solveCollision(dt)
  scene.camera.toFollow(following, dt, 0.2)
}

export { start, Scene, app, AddPlayer, RemPlayer, MvPlr }
