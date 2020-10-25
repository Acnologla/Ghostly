package room

import (
	"sync"
	"time"
)

const fps = 60

const (
	Started  = iota
	Waiting 
)


type Room struct{
	Players []string
	ID string
	State int
	Mutex sync.RWMutex `json:"-"`
}

func (room *Room) FindPlayer(playerName string) bool{
	for _, player := range room.Players{
		if player == playerName{
			return true
		}
	}
	return false
}

func (room *Room) Start(){
	room.Mutex.Lock()
	defer room.Mutex.Unlock()
	if room.State != Started{
		room.State = Started
		go func(){
			for {
				//TODO mutex here
				time.Sleep(time.Millisecond * (1000 / fps))
			}
		}()
	}
}