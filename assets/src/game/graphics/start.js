const resolutionX = 800;
const resolutionY = 600;


const ratio = 667/1366;

function createPIXI(){
    var app = new PIXI.Application(resolutionX, resolutionY);
    app.renderer.autoResize = true;

    app.renderer.resize(window.innerWidth,Math.abs(ratio*window.innerWidth))  

    // Temporary
    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth,Math.abs(ratio*window.innerWidth))  

        // CASO VÁ REDIMENSIONAR COM O JOGO!
        // app.stage.scale.set(window.innerWidth/1366,window.innerWidth/1366);
    })

    return app 
}

function loadMap(app, name){
    var loader = new PIXI.loaders.Loader();

    loader.add('src/assets/img/tile.png');
        
    loader.load((loader, resources) => {
        var texture = new PIXI.Texture(loader.resources["src/assets/img/tile.png"].texture, new PIXI.Rectangle(0, 0, 200, 200));
        var tiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['src/assets/img/tile.png']);
        app.stage.addChild(tiles);
        tiles.addFrame(texture, 0, 0);
    });
}

export {createPIXI, loadMap};