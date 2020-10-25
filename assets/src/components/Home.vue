<template>
    <div id="page">
    
    </div>
</template>

<script>

import { start, app } from "../game/game.js";

let ticker;


export default {
    name: "home",
    async mounted() {
        document.getElementById("page").appendChild(app.view);
        ticker = await start();
    },
    beforeDestroy() {
        ticker.destroy()
    }
}
</script>
