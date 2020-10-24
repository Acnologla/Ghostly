<template>
    <div id="page">
    
    </div>
</template>

<script>
export default {
    name: "home",
    mounted() {
        var resolutionX = 800;
        var resolutionY = 600;
        
        var app = new PIXI.Application(resolutionX, resolutionY);
        document.getElementById("page").appendChild(app.view);
        var tileSizeX = 400;
        var tileSizeY = 400;

        var loader = new PIXI.loaders.Loader();
        loader.add('src/assets/img/tile.png');
        loader.load(function(loader, resources) {
            var texture = new PIXI.Texture(loader.resources["src/assets/img/tile.png"].texture, new PIXI.Rectangle(0, 0, 200, 200));

            var tiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['src/assets/img/tile.png']);
            app.stage.addChild(tiles);

            tiles.addFrame(texture, 0, 0);
        });
    }
}
</script>
