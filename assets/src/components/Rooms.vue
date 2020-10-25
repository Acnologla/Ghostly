<template>
    <div>
        <input placeholder="username" id="username">
        <button @click="create" id="create">Create room</button>
        <div style="cursor:pointer" @click="join(room.ID)" v-for="room in rooms" :key="room.ID">
            <h1>Codigo: {{room.ID}}</h1>
            <h2>Jogadores: {{room.Players.length}}</h2>
            <h3>Estado: {{room.State === 1 ?"Começou" : "Não começou"}}</h3>
        </div>
    </div>
</template>
<script>
import axios from "axios"
export default {
    name: "rooms",
    data() {
        return {
            rooms: []
        }
    },
    created() {
        axios.post("http://localhost:9000/room/list").then(rooms => {
            this.rooms = rooms.data
        })
    },
    methods: {
        async create() {
            const params = new URLSearchParams();
            const username = document.getElementById("username").value
            params.append("owner", username)
            try {
                const room = await axios.post("http://localhost:9000/room", params)
                this.$router.push({ name: "room", params: { room: room.data }, query: { username } })
            } catch (err) {
                alert(err.response.data)
            }

        },
        async join(id) {
            const params = new URLSearchParams();
            const username = document.getElementById("username").value
            params.append("username", username)
            try {
                const room = await axios.post(`http://localhost:9000/room/${id}/join`, params)
                this.$router.push({ name: "room", params: { room: room.data }, query: { username } })
            } catch (err) {
                alert(err.response.data)
            }
        }
    }
}
</script>