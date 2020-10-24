<template>
</template>
<script>
export default{
    name: "room",
    async mount(){
          const socket = new WebSocket('ws://'+window.location.host+`/ws/room?username=${this.$route.query.username}&room=${this.$route.params.room}`)

    }
}
</script>