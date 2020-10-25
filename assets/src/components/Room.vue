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
        return {
            players: []
        }
    },
    async created(){
          const socket = new WebSocket(`ws://localhost:9000/ws/room?username=${this.$route.query.username}&roomID=${this.$route.params.room}`)
          socket.onmessage = (message) =>{
              if (this.players.length == 0){
                  this.players = JSON.parse(message.data)
                  return
              }
              if (message.data == '"ping"') return;
              message = JSON.parse(message.data)
              console.log(message)
              if (message.Message == "Connected"){
                  if (message.Author === this.$route.query.username) return;
                  this.players.push(message.Author)
              }
              if (message.Message == "Disconnect"){
                  const index = this.players.indexOf(message.Author)
                  console.log(index)
                  this.players.splice(index,1)
              }
          }
          socket.onclose = () =>{
              this.$router.push({name: "rooms"})
          }
    }
}
</script>