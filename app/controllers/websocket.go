package controllers

import (
	roomPackage "github.com/acnologla/Ghostly/app/room"
	"github.com/revel/revel"
	"sync"
	"time"
)

var Rooms = map[string]*roomPackage.Room{}
var RoomMutex = sync.RWMutex{}

func getRoom(roomID string) *roomPackage.Room {
	RoomMutex.RLock()
	defer RoomMutex.RUnlock()
	room := Rooms[roomID]
	return room
}

func setRoom(room *roomPackage.Room) {
	RoomMutex.Lock()
	defer RoomMutex.Unlock()
	Rooms[room.ID] = room
}

func deleteRoom(room *roomPackage.Room) {
	RoomMutex.Lock()
	defer RoomMutex.Unlock()
	delete(Rooms, room.ID)
}

func handleEvent(room *roomPackage.Room,username string, event roomPackage.Event){
	switch event.Message{
		case "Init":
			room.Mutex.Lock()
			defer room.Mutex.Unlock()
			if username == room.Players[0].Name && len(room.Players) > 1 {
				room.Start()
				room.Broadcast(roomPackage.Event{
					Message: "Start",
				})
			}
	}
}

type WebSocket struct {
	*revel.Controller
}

func (c WebSocket) Index(username string, roomID string, ws revel.ServerWebSocket) revel.Result {
	if username != "" && ws != nil  && roomID != "" {
		if room := getRoom(roomID); room != nil {
			room.Mutex.RLock()
			if room.FindPlayer(username) {
				pinged := true
				room.Broadcast(roomPackage.Event{
					Author:  username,
					Message: "Connected",
				})
				ws.MessageSendJSON(room.GetUsernames())
				room.Mutex.RUnlock()
				go func() {
					var msg roomPackage.Event
					for {
						err := ws.MessageReceiveJSON(&msg)
						if err != nil {
							return
						}
						if msg.Message == "pong"{
							pinged = true
						}
						go handleEvent(room,username,msg)
					}
				}()
				go func(){
					for {
						playerIndex := room.PlayerIndex(username)
						if playerIndex != -1{
							player := *room.Players[playerIndex]
							message := <- player.Channel
							err := ws.MessageSendJSON(message)
							if err !=nil{
								return
							}
						}else {
							return 
						}
					}
				}()
				for {
					err := ws.MessageSendJSON("Ping")
					if  err != nil || !pinged {
						room.Mutex.Lock()
						room.RemovePlayer(username)
						if len(room.Players) == 0 {
							deleteRoom(room)
						}
						room.Broadcast(roomPackage.Event{
							Author:  username,
							Message: "Disconnect",
						})
						room.Mutex.Unlock()
						return nil
					}
					pinged = false
					time.Sleep(time.Second * 5)
				}

			} else {
				room.Mutex.RUnlock()
			}
		}
	}
	return nil
}
