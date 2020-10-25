package room

import (
	"sync"
)

const (
	Waiting = iota
	Started
)

type Event struct{
	Message string   `json:"Message"`
	Author  string   `json:"Author"`
}

type Player struct{
	Name string
	Channel chan Event
}

type Room struct {
	Players []*Player
	ID      string
	State   int
	Events  chan string 
	Mutex   sync.RWMutex 
}

func (room *Room) Broadcast(event Event){
	for _,player := range room.Players{
		player.Channel <- event
	}
}

func (room *Room) FindPlayer(playerName string) bool {
	for _, player := range room.Players {
		if player.Name == playerName {
			return true
		}
	}
	return false
}

func (room *Room) GetUsernames() (usernames []string){
	for _,player := range room.Players{
		usernames = append(usernames,player.Name)
	}
	return
}

func (room *Room) PlayerIndex(playerName string) int{
	for i,player := range room.Players{
		if player.Name == playerName{
			return i
		}
	}
	return -1
}

func (room *Room) AddPlayer(playerName string){
	channel := make(chan Event,20)
	player := Player{
		Name: playerName,
		Channel: channel,
	}
	room.Players = append(room.Players,&player)
}

func (room *Room) RemovePlayer(playerName string){
	i := room.PlayerIndex(playerName)
	if i != -1{
		copy(room.Players[i:], room.Players[i+1:]) 
		room.Players[len(room.Players)-1] = nil
		room.Players = room.Players[:len(room.Players)-1]
	}
}

func (room *Room) Start() {
	if room.State != Started {
		room.State = Started
		go gameLoop(room)
	}
}
