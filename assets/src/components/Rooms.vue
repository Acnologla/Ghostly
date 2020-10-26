<template>
    <div>
        <p v-if="error">{{error}}</p>
        <input  @change="save" v-model="username" placeholder="username" >
        <button @click="create" id="create">Create room</button>
        <input placeholder="join Room" @click="join" id ="join">
        <div style="cursor:pointer" @click="join(room.ID)" v-for="room in rooms" :key="room.ID">
            <h1>Codigo: {{room.ID}}</h1>
            <h2>Jogadores: {{room.Players.length}}</h2>
        </div>
    </div>
</template>
<script>
import axios from "axios"
export default {
    name: "rooms",
    data() {
        return {
            rooms: [],
            error: null,
            username: localStorage.getItem("username") || ""
        }
    },
    created() {
        axios.post("http://localhost:9000/room/list").then(rooms => {
            this.rooms = rooms.data
        })
        setInterval(() => {
            axios.post("http://localhost:9000/room/list").then(rooms => {
                this.rooms = rooms.data
            })
        }, 5000)
    },
    methods: {
        save(){
            if (4 > this.username.length){
                this.error = "Seu nome de usuario precisa ter no minimo 4 caracteres"
            }
            else if (this.username.length > 15){
                this.error = "Seu nome de usuario pode ter no maximo 15 caracteres"
            }
            else if ( !/^\w*$/g.test(this.username)){
                this.error = "Seu nome nao pode ter caracteres especiais"
            }
            else{
                this.error = null
            }
            localStorage.setItem("username",this.username)
        },
        async create() {
            if (this.error) return;
            const params = new URLSearchParams();
            params.append("owner", this.username)
            try {
                const room = await axios.post("http://localhost:9000/room", params)
                this.$router.push({ name: "room", params: { room: room.data }})
            } catch (err) {
                alert(err.response.data)
            }

        },
        async join(id) {
            if (this.error) return;
            if (!id){
                id = document.getElementById("join").value
            }
            const params = new URLSearchParams();
            params.append("username", this.username)
            try {
                const room = await axios.post(`http://localhost:9000/room/${id}/join`, params)
                this.$router.push({ name: "room", params: { room: room.data }})
            } catch (err) {
                alert(err.response.data)
            }
        }
    }
}
</script>