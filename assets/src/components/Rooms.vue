<template>
    <div id="page">
        <p v-if="error">{{error}}</p>
        <input  id="username" @change="save" v-model="username" placeholder="username" >
        <button @click="create" id="create">Create room</button>
        <input placeholder="join Room" @click="join" id ="join">
        <div id="room" style="cursor:pointer" @click="join(room.ID)" v-for="room in rooms" :key="room.ID">
            <h1>Codigo: {{room.ID}}</h1>
            <h2>Jogadores: {{room.Players.length}}</h2>
        </div>
    </div>
</template>

<style scoped>

    #room {
        padding:20px;
        background: rgb(31, 31, 31);  
        color: #fff;
        text-align: center; 
    }

    #page{
        background: rgb(39, 39, 39);
        position: absolute;
        width:100vw;
        height:100vw;
    }

    input {
        margin-left: auto;
        display: -webkit-box;
        margin-right: auto;
        background: none;
        border: none;
        padding: 15px;
        background: rgb(51, 51, 51);
        margin: 20px;
        border-radius: 10px;
        left: 50%;
        color: #fff;
        position: relative;
        transform: translate(-50%, 0);
    }

    button {
        display: -webkit-box;
        margin-right: auto;
        background: none;
        border: none;
        padding: 15px;
        background: rgb(51, 51, 51);
        margin: 20px;
        border-radius: 10px;
        left: 50%;
        color: #fff;
        position: relative;
        transform: translate(-50%, 0);
    }



</style>

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
        const interval = setInterval(() => {
            if (this.$route.name === "rooms"){
                axios.post("http://localhost:9000/room/list").then(rooms => {
                    this.rooms = rooms.data
                })
            }else{
                clearInterval(interval)
            }
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