package controllers

import (
	"github.com/revel/revel"
	"sync"
)

type Room struct{
	Players []string
	ID string
}

func findPlayer(room Room,playerName string) bool{
	for _, player := range room.Players{
		if player == playerName{
			return true
		}
	}
	return false
}

var Rooms = map[string]Room{}
var RoomMutex = sync.RWMutex{}

type WebSocket struct {
	*revel.Controller
}

func (c WebSocket) Index(username string,roomID string, ws revel.ServerWebSocket) revel.Result {
	if username != ""{
		RoomMutex.Lock()
		defer RoomMutex.Unlock()
		if room,ok := Rooms[roomID];ok{
			if findPlayer(room,username){
				c.RenderText("Conected")
			}else{
				c.RenderText("You not in this room")
			}
		}else{
			return c.RenderText("Invalid room")
		}
	}
	return c.RenderText("Invalid username")
}