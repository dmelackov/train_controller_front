import axios from "axios"
import mitt from "mitt"

const ip = "http://owbalancer.ddns.net:8765/"

export const api = {
    async get_stations() {
        return (await axios.get(ip + "station")).data
    },
    async get_station_info(station) {
        return (await axios.get(ip + "station/" + station)).data
    },
    async set_station_name(station, name) {
        let data = await axios.post(ip + "station/" + station, { station_name: name })
        return data
    },
    async set_station_schedule(source_station, destionation_station, twoway=false){
        let data = await axios.post(ip + "schedule/" + source_station, { station_uuid: destionation_station, twoway: twoway })
        return data
    }
}

class WebSocketManager {
    constructor(){
        this.emitter = mitt()
    }
    open(){
        this.socket = new WebSocket('ws://owbalancer.ddns.net:8765/site')
        const self = this
        this.socket.addEventListener("message", (msg) => {
            let json = JSON.parse(msg.data)
            if (json.action == "update_station")
                self.emitter.emit("update_station", {uuid: json.uuid})
            if (json.action == "update_station_list")
                self.emitter.emit("update_station_list")
        });
    }
    sendMessage(data) {
        this.socket.send(JSON.stringify(data))
    }
}


export const websocket_api = new WebSocketManager()
console.log(websocket_api)