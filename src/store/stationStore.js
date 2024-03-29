import { defineStore } from "pinia";
import { api, websocket_api } from '../app/api'
import {ref} from 'vue'
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
    async function getWaysForTrain(uuid) {
        try {
            const filteredStations = stations.value.filter((station) => {
                if (!station.info) {
                    return false;
                }
                if (station.info.train_present) {
                    return false;
                }
                if (station.info.train_enroute) {
                    return station.uuid !== uuid;
                }
                return true; 
            });
    
            return filteredStations;
        } catch (error) {
            console.error('Error in getWaysForTrain:', error);
            throw error;
        }
    }
    
    return  {getStations,stations,fetchStationInfo,updateStationInfo,getWaysForTrain}
}
)
