package controllers

import (
	"github.com/revel/revel"
	"crypto/rand"
    "unsafe"
)

type App struct {
	*revel.Controller
}

var alphabet = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")


func genCode() string{
	b := make([]byte, 6)
    rand.Read(b)
    for i := 0; i < 6; i++ {
        b[i] = alphabet[b[i] / 5]
    }
    return *(*string)(unsafe.Pointer(&b))
}

func (c App) Index() revel.Result {
	return c.Render()
}

func (c App) GetRooms() revel.Result {
	roomsArr := []Room{}
	for _, room := range Rooms{
		roomsArr = append(roomsArr,room)
	}
	return c.RenderJSON(roomsArr)
}

func (c App) JoinRoom(username string, roomID string) revel.Result {
	if username != ""{
		RoomMutex.Lock()
		defer RoomMutex.Unlock()
		if room,ok := Rooms[roomID];ok{
			if len(room.Players) > 9{
				return c.RenderText("The room is full")
			}
			if !findPlayer(room,username){
				room.Players = append(room.Players,username)
				return c.RenderText(roomID)
			}else{
				return c.RenderText("Username arleady taken")
			}
		}else{
			return c.RenderText("Invalid room")
		}
	}
	return c.RenderText("Invalid username")
}

func (c App) CreateRoom(owner string) revel.Result{
	println(owner)
	v := c.Params.Form.Get("owner")
	println(v)
	if owner != ""{
		room := Room{}
		room.Players = make([]string,0,10)
		room.Players = append(room.Players,owner)
		room.ID = genCode()
		RoomMutex.Lock()
		Rooms[room.ID] = room
		RoomMutex.Unlock()
		return c.RenderText(room.ID)
	}
	return c.RenderText("Invalid username")
}