package controllers

import (
	"crypto/rand"
	"github.com/acnologla/Ghostly/app/room"
	"github.com/revel/revel"
	"unsafe"
)

type partialRoom struct {
	Players []string
	ID      string
}

type App struct {
	*revel.Controller
}

var alphabet = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")

func genCode() string {
	b := make([]byte, 6)
	rand.Read(b)
	for i := 0; i < 6; i++ {
		b[i] = alphabet[b[i]/5]
	}
	return *(*string)(unsafe.Pointer(&b))
}

func (c App) Index() revel.Result {
	return c.Render()
}

func (c App) GetRooms() revel.Result {
	roomsArr := []partialRoom{}
	for _, currentRoom := range Rooms {
		if currentRoom.State == room.Started {
			continue
		}
		usernames := currentRoom.GetUsernames()
		roomsArr = append(roomsArr, partialRoom{
			ID:      currentRoom.ID,
			Players: usernames,
		})
	}
	return c.RenderJSON(roomsArr)
}

func (c App) JoinRoom(username string, roomID string) revel.Result {
	c.Response.Status = 400
	if username != "" {
		if room := getRoom(roomID); room != nil {
			room.Mutex.Lock()
			defer room.Mutex.Unlock()
			if len(room.Players) > 9 {
				return c.RenderText("The room is full")
			}
			if !room.FindPlayer(username) {
				c.Response.Status = 200
				room.AddPlayer(username)
				return c.RenderText(roomID)
			} else {
				return c.RenderText("Username arleady taken")
			}
		} else {
			return c.RenderText("Invalid room")
		}
	}
	return c.RenderText("Invalid username")
}

func (c App) CreateRoom(owner string) revel.Result {
	if owner != "" {
		roomCreated := room.Room{}
		roomCreated.Players = make([]*room.Player, 0, 10)
		roomCreated.AddPlayer(owner)
		roomCreated.ID = genCode()
		setRoom(&roomCreated)
		return c.RenderText(roomCreated.ID)
	}
	c.Response.Status = 400
	return c.RenderText("Invalid username")
}
