import { defineStore } from "pinia";
import { api } from '../app/api'
import {ref} from 'vue'
export const useStationStore = defineStore('factory',()=>
{
    const factories = ref([])

    async function getFactories(){
        factories.value = await api.get_factories();
        for (let i = 0; i < factories.value.length; i++) {
            const element = factories.value[i];
            factories.value[i] = {"uuid": element}
        }
        let promises = factories.value.map(async (factory) => {
            let info = await fetchFactoryInfo(factory.uuid)
            factory.info = info
        })    
        await Promise.all(promises)
    }

    async function fetchFactoryInfo(uuid) {
        return await api.get_factory_info(uuid)
    }

    async function fetchFactoryInventory(uuid, inventory)
    {
        return await api.get_factory_inventory(uuid, inventory);
    }
    
    return  {factories,getFactories,fetchFactoryInfo,fetchFactoryInventory}
}
)
