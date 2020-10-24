<template>
    <div id="page">
    
    </div>
</template>

<script>

import {GraphicsController} from "../game/graphics/index.js";
import {Player, Match} from "../game/physics/game.js"

let ticker = PIXI.Ticker.shared;

export default {
    name: "home",
    async mounted() {
        let graphics = new GraphicsController();
        let match = new Match();

        var loader = new PIXI.Loader();
        loader.add("src/img/ghost.png");

        match.objs.push(new Player(0, 0, 100, 100));

        document.getElementById("page").appendChild(graphics.app.view);

        await graphics.loadMap(loader, "room");

        const texture = PIXI.Texture.from('src/img/ghost.png');

        graphics.camera.scale.x = Math.sin(performance.now()/1000) + 2;
        graphics.camera.scale.y = Math.sin(performance.now()/1000) + 2;
        ticker = PIXI.Ticker.shared;
        ticker.start();
        
        ticker.add(function (dt) {
            for(let i = 0; i < match.objs.length; i++) {    
                let sprite = match.objs[i].sprite;
                if (!sprite) {
                    match.objs[i].sprite = new PIXI.Sprite(texture);
                    sprite = match.objs[i].sprite;
                    sprite.pivot.set(250,250)
                    sprite.scale.set(0.2,0.2)
                    
                    graphics.camera.position.set(graphics.app.screen.width/2, graphics.app.screen.height/2);
                    graphics.camera.pivot.copy(sprite.position);
                    graphics.camera.addChild(sprite)
                } else {
                    sprite.position.x = Math.sin(performance.now()/2000)*1000 + 1000;
                    sprite.position.y = Math.sin(performance.now()/1500)*1000 + 1000;
                    graphics.camera.position.set(graphics.app.screen.width/2, graphics.app.screen.height/2);
                    graphics.camera.pivot.x = (sprite.position.x - graphics.camera.pivot.x) * dt + graphics.camera.pivot.x;
                    graphics.camera.pivot.y = (sprite.position.y - graphics.camera.pivot.y) * dt + graphics.camera.pivot.y;
                }
            }
            graphics.app.renderer.render(graphics.app.stage);
        });
        
    },
    beforeDestroy() {
        ticker.destroy()
    },
}
</script>
