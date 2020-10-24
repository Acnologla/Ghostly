<template>
</template>
<script>
export default{
    name: "room",
    async created(){
          const socket = new WebSocket(`ws://localhost:9000/ws/room?username=${this.$route.query.username}&roomID=${this.$route.params.room}`)
          socket.onmessage = function(message){
              console.log(message)
          }
    }
}
</script>