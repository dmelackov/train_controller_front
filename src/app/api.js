import axios from "axios";
import mitt from "mitt";

axios.defaults.baseURL = "http://owbalancer.ddns.net:8765/api";

export const api = {
  async get_stations() {
    return (await axios.get("/station")).data;
  },
  async get_station_info(station) {
    return (await axios.get("/station/" + station)).data;
  },
  async set_station_name(station, name) {
    let data = await axios.post("/station/" + station, { station_name: name });
    return data;
  },
  async get_factories() {
    return (await axios.get("/factories")).data;
  },
  async get_factory_info(factory) {
    return (await axios.get("/factories/" + factory)).data;
  },
  async get_factory_inventory(factory, inventory) {
    return (await axios.get(`/inventory/${factory}/${inventory}`)).data;
  },
  async get_config() {
    return (await axios.get("/factory_config")).data;
  },
  async set_station_schedule(
    source_station,
    destionation_station,
    twoway = false
  ) {
    let data = await axios.post("/schedule/" + source_station, {
      station_uuid: destionation_station,
      twoway: twoway,
    });
    return data;
  },
};

class WebSocketManager {
  constructor() {
    this.emitter = mitt();
  }
  open() {
    this.socket = new WebSocket("ws://owbalancer.ddns.net:8765/site");
    const self = this;
    this.socket.addEventListener("message", (msg) => {
      let json = JSON.parse(msg.data);
      if (json.action == "update_station")
        self.emitter.emit("update_station", { uuid: json.uuid });
      if (json.action == "update_station_list")
        self.emitter.emit("update_station_list");
    });
  }
  sendMessage(data) {
    this.socket.send(JSON.stringify(data));
  }
}

export const websocket_api = new WebSocketManager();
console.log(websocket_api);
