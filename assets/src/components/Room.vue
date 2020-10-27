<template>
    <div id="page">
        <h1 v-if="players.length > 0">
            Dono da sala: {{players[0]}}
        </h1>
        <h2>
            Players:
        </h2>
        <p v-for="player in players" :key="player">
            {{player}}
        </p>
    </div>
</template>
<script>

import { start, app, AddPlayer, RemPlayer, MvPlr } from "../game/game.js";
let ticker;

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
            this.ws.send(JSON.stringify({
                Message: "Move",
                Data: [x,y]
            }))
        }
    },
    async created(){

          const socket = new WebSocket(`ws://localhost:9000/ws/room?username=${this.username}&roomID=${this.$route.params.room}`)
          this.ws = socket

          socket.onmessage = async (message) => {
              if (this.players.length == 0){
                  this.players = JSON.parse(message.data)
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
                    console.log("queeeeeeeeeeeEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
                    break
                  case "Disconnect":
                    RemPlayer(message.Author);
                    break
                  case "Move":
                    if (message.Author == this.username)return;
                    //MvPlr(message.Author, message.Data[0], message.Data[1])
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