package room

import (
	"sync"
)

const (
	Waiting = iota
	Started
)

// Event is an message from websocket
type Event struct {
	Message string `json:"Message"`
	Author  string `json:"Author"`
	Data    [2]float32 `json:"Data"`
}

// Player stores
type Player struct {
	Name    string
	Connected bool
	Channel chan Event
}

// Room is a struct that stores the state of a single room with physics
type Room struct {
	Players []*Player
	ID      string
	State   int
	Events  chan string
	Mutex   sync.RWMutex
	Objects []*object
	Tilemap []layer
}

// Broadcast Send to all palyers
func (room *Room) Broadcast(event Event) {
	for _, player := range room.Players {
		player.Channel <- event
	}
}

// FindPlayer finds a player but name
func (room *Room) FindPlayer(playerName string) bool {
	for _, player := range room.Players {
		if player.Name == playerName {
			return true
		}
	}
	return false
}

// GetUsernames get all usernames and join in one array
func (room *Room) GetUsernames() (usernames []string) {
	for _, player := range room.Players {
		usernames = append(usernames, player.Name)
	}
	return
}

// PlayerIndex gets the index of a player
func (room *Room) PlayerIndex(playerName string) int {
	for i, player := range room.Players {
		if player.Name == playerName {
			return i
		}
	}
	return -1
}

// AddPlayer adds a player
func (room *Room) AddPlayer(playerName string) {
	channel := make(chan Event, 20)
	player := Player{
		Name:    playerName,
		Channel: channel,
	}
	room.Players = append(room.Players, &player)
}

// RemovePlayer removes the player from the player
func (room *Room) RemovePlayer(playerName string) {
	i := room.PlayerIndex(playerName)
	if i != -1 {
		copy(room.Players[i:], room.Players[i+1:])
		room.Players[len(room.Players)-1] = nil
		room.Players = room.Players[:len(room.Players)-1]
	}
}

// Start starts the gameLoop and all the things
func (room *Room) Start() {
	if room.State != Started {
		room.State = Started
		for i := range room.Players {

			shapeV := shape{
				500,
				500,
				67,
				94,
				0,
				0,
				500,
				500,
			}

			plr := object{
				uint(i),
				shapeV,
			}
			room.Objects = append(room.Objects, &plr)
		}
		go gameLoop(room)
	}
}
