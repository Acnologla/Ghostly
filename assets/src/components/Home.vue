<template>
    <div id="page">
    
    </div>
</template>

<script>

import * as Game from "../game/graphics/start.js";

export default {
    name: "home",
    mounted() {
        console.log(Game)
        let app = Game.createPIXI();
        document.getElementById("page").appendChild(app.view);
        
        Game.loadMap(app,"normal")
    }
}
</script>
