class Obj {
    constructor(sprite){
        this.sprite = sprite;
        this.onHover;
        this.static = false;
        this.old = {x: this.sprite.position.x, y: this.sprite.position.y}
    }

    move(x = null, y = null) {
        if (y !== null) {
            this.old.y = this.sprite.position.y;
            this.sprite.position.y = y;
        }
        if (x !== null) {    
            this.old.x = this.sprite.position.x;
            this.sprite.position.x = x;
        }
    }
}


function checkCollision(first, other, ox = 0, oy = 0){
    return first.x < other.x + other.width &&
           first.x + first.width > other.x + ox &&
           first.y < other.y + other.height &&
           first.y + first.height > other.y
}

export { Obj, checkCollision }