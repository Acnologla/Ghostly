let dir = {"x":"width", "y": "height"}
let steps = 10;

class Obj {
    constructor(sprite, collidable){
        this.sprite = sprite;
        this.onHover;
        this.static = false;
        this.old = {x: this.sprite.position.x, y: this.sprite.position.y}

        this.toFuture = this.old;
        this.step = 0;

        this.collidable = collidable;
    }

    interpolate(){
        if(this.step < steps){
            let step = (1/steps);
            this.sprite.position.x += (this.toFuture.position.x - this.sprite.position.x)*step;
            this.sprite.position.y += (this.toFuture.position.y - this.sprite.position.y)*step;
        }
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

    checkCollision(axis, other){
        let sprite = this.sprite;
        let rect = new PIXI.Rectangle(sprite.position.x, sprite.position.y, sprite.width, sprite.height);
        let sprite_other = other.sprite;
        let rect_other = new PIXI.Rectangle(sprite_other.position.x, sprite_other.position.y, sprite_other.width, sprite_other.height);
        if(checkCollision(rect, rect_other)){
            if(other.collidable){
                let correction = rect[axis] < this.old[axis] ? ((rect_other[axis] + rect_other[dir[axis]]) - rect[axis] ) : -((rect[axis] + rect[dir[axis]]) - rect_other[axis]);

                if(Math.abs(correction) > sprite[dir[axis]])
                    return false;
    
                if (axis == "x") {
                    this.move(sprite.position.x + correction)
                    return true;
                } else {
                    this.move(null, sprite.position.y + correction);
                    return true;
                }   
            } else {
                return true;
            }
        }
        return false;
    }
}

class CollidingObj {
    constructor(id, x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.id = id;
    }
}

class CollidingTile {
    constructor(id, x, y){
        this.x = x;
        this.y = y;
        this.id = id;
    }
}

function checkCollision(first, other, ox = 0, oy = 0){
    return first.x < other.x + other.width &&
           first.x + first.width > other.x + ox &&
           first.y < other.y + other.height &&
           first.y + first.height > other.y
}


export { Obj, checkCollision, CollidingObj, CollidingTile }