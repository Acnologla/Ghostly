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
        <button @click="init" v-if="username == players[0]">
            Iniciar jogo
        </button>
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
        init(){
            if (2 > this.players.length ){
                return alert("Precisa ter ao menos 2 jogadores para iniciar um jogo")
            }
            this.ws.send(JSON.stringify({Message: "Init"}))
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
              if (message.Message == "Connected"){
                  if (message.Author === this.username) return;
                  this.players.push(message.Author)
              }
              if (message.Message == "Disconnect"){
                  const index = this.players.indexOf(message.Author)
                  console.log(index)
                  this.players.splice(index,1)
              }
              if (message.Message == "Start"){
                  alert("Jogo começou")
              }
          }
          socket.onclose = () =>{
              this.$router.push({name: "rooms"})
          }
    }
}
</script>