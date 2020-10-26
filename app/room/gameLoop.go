package room

import (
	"encoding/json"
	"io/ioutil"
	"time"
)

const fps = 30

type object struct {
	ID    uint
	Shape shape
}

type layer struct {
	Data      []int `json:"data"`
	MapHeight int   `json:"height"`
	MapWidth  int   `json:"width"`
	Width     int
	Height    int
}

type shape struct {
	X      int
	Y      int
	Width  int
	Height int
	VelX   int
	VelY   int
	OldX   int
	OldY   int
}

type scene struct {
	objs    []object
	tilemap layer
}

var collision = layer{}

func checkColission(first, other *shape, ox, oy int) bool {
	return first.X < other.Y+other.Width &&
		first.X+first.Width > other.X+ox &&
		first.Y < other.Y+other.Height &&
		first.Y+first.Height > other.Y
}

func (coll 	layer) getNextTiles(x, y int) (tiles []*shape, ids []int) {
	place := [2]int{x / coll.Width, y / coll.Height}
	for y := -1; y < 2; y++ {
		xtile := x + place[0]
		ytile := y + place[1]
		idx := ytile*coll.MapWidth + xtile
		value := coll.Data[idx]
		if y+place[1] >= 0 && x+place[0] >= 0 && value != 0 {
			hei := coll.Height
			if value == 2 {
				hei = hei / 2
			}
			tiles = append(tiles, &shape{
				X:      xtile * coll.Width,
				Y:      ytile * coll.Height,
				Width:  coll.Width,
				Height: hei,
			})
			ids = append(ids, value)
		}
	}
	return
}

func (coll layer) checkCollision(axis int, target object) ([]shape, []int) {

	targetShape := target.Shape
	collided := []shape{}
	collided_ids := []int{}

	tiles, _ := coll.getNextTiles(targetShape.X, targetShape.Y)
	for _, tile := range tiles {
		if checkColission(tile, &targetShape, 0, 0) {
//			id := ids[i]
			/*correction := 0
			if axis == 0 {
				if targetShape.X < targetShape.OldX {
					correction = (tile.X + tile.Width) - targetShape.X
				} else {
					correction = -((targetShape.X + targetShape.Width) - tile.X);
				}
			}*/
		}
	}
	return collided, collided_ids
}

func gameLoop(room *Room) {
	for {
		//TODO mutex here
		time.Sleep(time.Millisecond * (1000 / fps))
	}
}

func init() {
	collisionBytes, _ := ioutil.ReadFile("./app/room/collision.json")
	json.Unmarshal([]byte(collisionBytes), &collision)
	collision.Width = 100
	collision.Height = 100
}
