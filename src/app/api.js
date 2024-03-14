import axios from 'axios'
import mitt from 'mitt'

axios.defaults.baseURL = 'http://owbalancer.ddns.net:8765/api'

/**
 * @typedef {Object} Stations
 * @property {string} uuid - Station id
 * @property {string} name - Station full name
 */

/**
 * @typedef {Object} Station
 * @property {string} station_name - Station full name
 * @property {boolean} train_enroute - Is enroute
 * @property {boolean} train_present - Is present
 * @property {string} train_name - Train full name
 */

/**
 * @typedef {Object} ItemStack
 * @property {string} item_name - Full name of item
 * @property {number} slots - Mount of occupied by item
 * @property {number} item_count - Total mount of items
 * @property {number} max_stack - Max mount of items in stack
 */

/**
 * @typedef {Object.<string, ItemStack>} Items
 */

/**
 * @typedef {Object} Inventory
 * @property {number} max_slots - Max slots
 * @property {number} used_slots - Used slots
 * @property {Items} items - Name and info about items
 */

/**
 * @typedef {Object} Factory
 * @property {Array<string>} inventories - Inventories of Factorie
 */

export const api = {
  /**
   * @async
   * @returns {Promise<Stations[]>}
   */
  async getStations() {
    return (await axios.get('/station')).data
  },
  /**
   * @async
   * @param {string} station - Station uuid
   * @returns {Promise<Station>}
   */
  async getStationInfo(station) {
    return (await axios.get('/station/' + station)).data
  },
  /**
   * @async
   * @param {string} station - Station uuid
   * @param {string} name - Station name
   * @returns {Promise<Object>} - Response by server
   */
  async setStationName(station, name) {
    let data = await axios.post('/station/' + station, { station_name: name })
    return data
  },
  /**
   * @async
   * @returns {Promise<Array<string>>}
   */
  async getFactories() {
    return (await axios.get('/factories')).data
  },
  /**
   * @async
   * @param {string} factory - uuid factory
   * @returns {Promise<Factory>}
   */
  async getFactoryInfo(factory) {
    return (await axios.get('/factories/' + factory)).data
  },
  /**
   * @async
   * @param {string} factory - Uuid factory
   * @param {string} inventory - Name inventory
   * @returns  {Promise<Inventory>} - Inventory object
   */
  async getFactoryInventory(factory, inventory) {
    return (await axios.get(`/inventory/${factory}/${inventory}`)).data
  },

  async getConfig() {
    return (await axios.get('/factory_config')).data
  },
  /**
   * @async
   * @param {string} source_station - Uuid station from
   * @param {string} destionation_station  - Uuid station to
   * @param {boolean} twoway - Is two ways
   * @returns {Promise<Object>} - Response by server
   */
  async setStationSchedule(source_station, destionation_station, twoway = false) {
    let data = await axios.post('/schedule/' + source_station, {
      station_uuid: destionation_station,
      twoway: twoway
    })
    return data
  }
}
/**
 * create WebSocket connection
 * @class
 */
class WebSocketManager {
  constructor() {
    this.emitter = mitt()
  }
  open() {
    this.socket = new WebSocket('ws://owbalancer.ddns.net:8765/site')
    const self = this
    this.socket.addEventListener('message', (msg) => {
      const json = JSON.parse(msg.data)
      const { action, uuid, factory, inventory } = json
      if (action == 'update_station') self.emitter.emit('update_station', { uuid: uuid })
      if (action == 'update_station_list') self.emitter.emit('update_station_list')
      if (action == 'update_inventory')
        self.emitter.emit('update_inventory', {
          factory_uuid: factory,
          inventory_name: inventory
        })
    })
  }
  /**
   * Sends a message via the WebSocket connection.
   * @param {Object} data - The data to be sent through the WebSocket connection.
   */
  sendMessage(data) {
    this.socket.send(JSON.stringify(data))
  }
}
export const websocketApi = new WebSocketManager()
