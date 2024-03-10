import { defineStore } from 'pinia'
import { api, websocketApi } from '../api'
import { ref } from 'vue'
export const useStationStore = defineStore('station', () => {
  const stations = ref([])

  websocketApi.emitter.on('update_station_list', getStations())
  websocketApi.emitter.on('update_station', (event) => {
    updateStationInfo(event.uuid)
  })
  /**
   * @async
   */
  async function getStations() {
    try {
      stations.value = await api.getStations()

      const stationsPromises = stations.value.map(async (station) => {
        if (!station.info) {
          station.info = await fetchStationInfo(station.uuid)
        }
      })
      await Promise.all(stationsPromises)
    } catch (error) {
      console.error('Ошибка при инициализации компонента:', error)
    }
  }

  /**
   * @async
   * @param {string} uuid
   */
  async function updateStationInfo(uuid) {
    try {
      stations.value.find((st) => st.uuid == uuid).info = await fetchStationInfo(uuid)
    } catch (error) {
      console.error(`Ошибка обновления станций:${uuid}`, error)
    }
  }

  /**
   * @async
   * @param {string} uuid
   * @returns {Promise<Object>}
   */

  async function fetchStationInfo(uuid) {
    try {
      return await api.getStationInfo(uuid)
    } catch (error) {
      console.error('Ошибка фетча информации', error)
      throw error
    }
  }
  /**
   * @async
   * @param {string} uuid
   * @returns {Promise<boolean>}
   */
  async function getWaysForTrain(uuid) {
    try {
      if (!Array.isArray(stations.value)) {
        throw new Error('station.value не массив')
      }
      const filteredStations = stations.value.filter((station) => {
        if (!station.info || station.info.train_present) {
          return false
        }
        if (station.info.train_enroute) {
          return station.uuid !== uuid
        }
        return true
      })
      return filteredStations
    } catch (error) {
      console.error('Error in getWaysForTrain:', error)
      throw error
    }
  }

  return {
    getStations,
    stations,
    fetchStationInfo,
    updateStationInfo,
    getWaysForTrain
  }
})
