package controllers

import (
	"github.com/revel/revel"
	"sync"
	"github.com/acnologla/Ghostly/app/room"
)

var Rooms = map[string]*room.Room{}
var RoomMutex = sync.RWMutex{}

func getRoom(roomID string) *room.Room{
	RoomMutex.RLock()
	defer RoomMutex.RUnlock()
	room := Rooms[roomID]
	return room
}

func setRoom(room room.Room){
	RoomMutex.Lock()
	defer RoomMutex.Unlock()
	Rooms[room.ID] = &room
}

type WebSocket struct {
	*revel.Controller
}

func (c WebSocket) Index(username string,roomID string, ws revel.ServerWebSocket) revel.Result {
	if username != "" && ws != nil{
		if room := getRoom(roomID); room != nil{
			room.Mutex.RLock()
			if room.FindPlayer(username){
				ws.MessageSendJSON("Conectado")
				room.Mutex.RUnlock()
			}else{
				room.Mutex.RUnlock()
			}
		}
	}
	return nil
}