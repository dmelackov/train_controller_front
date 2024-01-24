import { defineStore } from 'pinia'
import {ref} from 'vue'
import { api, websocket_api } from '../api'
export const useStationStore = defineStore('station',()=>
{
    const stations = ref([])

    websocket_api.emitter.on("update_station_list", getStations);
    websocket_api.emitter.on("update_station", (event) => {
        updateStationInfo(event.uuid)
    })

    async function getStations(){
        try {
            stations.value = await api.get_stations();
            
           await Promise.all(stations.value.map(async (station) => {
                if(station.info)
                    return;
                station.info = await fetchStationInfo(station.uuid)
            }))
          } catch (error) {
            console.error("Ошибка при инициализации компонента:", error);
          }
    }
    async function updateStationInfo(uuid){
        stations.value.find((st) => st.uuid == uuid).info = await fetchStationInfo(uuid)
    }

    async function fetchStationInfo(uuid)
    {
        try{
            return await api.get_station_info(uuid);
        }
        catch(error)
        {
            console.error('Ошибка фетча информации', error)
            throw error
        }
    }
    return  {getStations,stations,fetchStationInfo,updateStationInfo}
}
)
