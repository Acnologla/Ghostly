<template>
    <div>
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
        move(){
            this.ws.send(JSON.stringify({
                Message: "Move"
            }))
        }
    },
    async created(){
          const socket = new WebSocket(`ws://localhost:9000/ws/room?username=${this.username}&roomID=${this.$route.params.room}`)
          this.ws = socket
          socket.onmessage = (message) =>{
              
              if (this.players.length == 0){
                  this.players = JSON.parse(message.data)
                  return
              }
              message = JSON.parse(message.data)
              if (message == 'Ping'){
                  socket.send(JSON.stringify({Message: "pong", Author: this.username}))
                  return;
              }
              console.log(message)
              switch(message.Message){
                  case "Connected":
                    if (message.Author === this.username) return;
                    this.players.push(message.Author)
                  break
                  case "Disconnect":
                    const index = this.players.indexOf(message.Author)
                    this.players.splice(index,1)
                  break
                  case "Move":
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