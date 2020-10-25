package room

import (
	"encoding/json"
	"io/ioutil"
	"reflect"
	"time"
)

const fps = 60

type object struct {
	ID    uint
	Shape shape
}

type colissionLayer struct {
	Data   []int `json:"data"`
	Height int   `json:"height"`
	Width  int   `json:"width"`
}

func (this *colissionLayer) GetNextTiles(x, y int) (tiles []*shape) {
	place := [2]int{x / this.Width, y / this.Height}
	for y := -1; y < 2; y++ {
		xtile := x + place[0]
		ytile := y + place[1]
		value := this.Data[ytile*this.Width+xtile]
		if y+place[1] >= 0 && x+place[0] >= 0 && value != 0 {
			hei := this.Height
			if value == 2 {
				hei = hei / 2
			}
			tiles = append(tiles, &shape{
				X:      xtile * this.Width,
				Y:      ytile * this.Height,
				Width:  this.Width,
				Height: hei,
			})
		}
	}
	return
}

var colission = colissionLayer{}

type shape struct {
	X        int
	Y        int
	Width    int
	Height   int
	Velocity int
}

func checkColission(first, other *shape, ox, oy int) bool {
	return first.X < other.Y+other.Width &&
		first.X+first.Width > other.X+ox &&
		first.Y < other.Y+other.Height &&
		first.Y+first.Height > other.Y
}

func fixCollision(axis string, target *shape, others []interface{}) {
	oldX := target.X
	oldY := target.Y
	if axis == "x" {
		target.X += target.Velocity
	} else {
		target.Y += target.Velocity
	}
	for _, other := range others {
		otherType := reflect.Indirect(reflect.ValueOf(other)).Type()
		if otherType.String() == "room.colissionLayer" {
			realOther := other.(*colissionLayer)
			tiles := realOther.GetNextTiles(target.X, target.Y)
			for _, tile := range tiles {
				if checkColission(tile, target, 0, 0) {
					num := 0
					if axis == "x" {
						if target.X < oldX {
							num = (tile.X + tile.Width) - target.X
						} else {
							num = -((tile.X + tile.Width) - target.X)
						}
						target.X += num
					} else {
						if target.Y < oldY {
							num = (tile.Y + tile.Height) - target.Y
						} else {
							num = -((tile.Y + tile.Height) - target.Y)
						}
						target.Y += num
					}
					break
				}
			}
		}
	}
}

func gameLoop(room *Room) {
	for {
		//TODO mutex here
		time.Sleep(time.Millisecond * (1000 / fps))
	}
}

func init() {
	collisionBytes, _ := ioutil.ReadFile("./app/room/collision.json")
	json.Unmarshal([]byte(collisionBytes), &colission)
}
