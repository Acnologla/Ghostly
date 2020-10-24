<template>
    <div id="page">
    
    </div>
</template>

<script>

import {GraphicsController} from "../game/graphics/index.js";

export default {
    name: "home",
    mounted() {
        let graphics = new GraphicsController();
        document.getElementById("page").appendChild(graphics.app.view);
        graphics.loadMap("room").then((n) => { console.log(n) })
    }
}
</script>
