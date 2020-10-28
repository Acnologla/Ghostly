<template>
    <div>
      <div id="page"></div>
    </div>
</template>
<script>

import { start, app, AddPlayer, RemPlayer, MvPlr } from "../game/game.js";
let ticker;

let last = Date.now();

export default{
    name: "room",
    data(){
        const username = localStorage.getItem("username")
        return {
            players: [],
            username,
            ws: null
        }
    },
    methods:{
        move(x,y){
            if(Date.now() - last >= (1000/30)){
                console.log("sending")
                this.ws.send(JSON.stringify({
                    Message: "Move",
                    Data: [x,y]
                }))
                last = Date.now()
            } 
        }
    },
    async created(){

          const socket = new WebSocket(`ws://${window.location.host}/ws/room?username=${this.username}&roomID=${this.$route.params.room}`)
          this.ws = socket

          socket.onmessage = async (message) => {
              if (this.players.length == 0){
                  this.players = JSON.parse(message.data)
                  for(let i = 0; i < this.players.length; i++) {
                      if(this.username != this.players[i]){
                        AddPlayer(this.players[i]);
                      }
                  }
                  return
              }

              message = JSON.parse(message.data)

              if (message == 'Ping'){
                  socket.send(JSON.stringify({Message: "pong", Author: this.username}))
                  return;
              }


              switch(message.Message){
                  case "Connected":
                    if (message.Author === this.username){
                        document.getElementById("page").innerHTML = ""
                        document.getElementById("page").appendChild(app.view);
                        ticker = await start(this.move);
                        return;
                    }
                    AddPlayer(message.Author);
                    break
                  case "Disconnect":
                    RemPlayer(message.Author);
                    break
                  case "Move":
                    if (message.Author == this.username)return;
                    MvPlr(message.Author, message.Data[0], message.Data[1])
                    console.log(`O player ${message.Author} se moveu para ${message.Data[0]}X | ${message.Data[1]}Y`)
                    break
              }
          }

          socket.onclose = () =>{
              this.$router.push({name: "rooms"})
          }

    }
}
</script>