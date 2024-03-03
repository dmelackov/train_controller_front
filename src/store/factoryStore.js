import { defineStore } from "pinia";
import { api, websocket_api} from '../app/api'
import {ref} from 'vue'
export const useFactoryStore = defineStore('factory',()=>
{
    const factories = ref([])

    websocket_api.emitter.on("update_inventory", (event) => {
        update_inventory_info(event.factory_uuid, event.inventory_name)
    })

    async function getFactories(){
        factories.value = await api.get_factories();
        for (let i = 0; i < factories.value.length; i++) {
            const element = factories.value[i];
            factories.value[i] = {"uuid": element, inventories: {}}
        }
        let promises = factories.value.map(async (factory) => {
            let info = await fetchFactoryInfo(factory.uuid)
            for (let i = 0; i < info.inventories.length; i++) {
                const element = info.inventories[i];
                factory.inventories[element] = await fetchFactoryInventory(factory.uuid, element)
            }
            factory.info = info
        })    
        await Promise.all(promises)
    }

    function get_factory(uuid){
        return factories.value.find((v) => v.uuid == uuid)
    }

    async function update_inventory_info(uuid, inventory){
        get_factory(uuid).inventories[inventory] = await fetchFactoryInventory(uuid, inventory)
    }

    async function fetchFactoryInfo(uuid) {
        return await api.get_factory_info(uuid)
    }

    async function fetchFactoryInventory(uuid, inventory)
    {
        return await api.get_factory_inventory(uuid, inventory);
    }


    return  {factories,getFactories,fetchFactoryInfo,fetchFactoryInventory, update_inventory_info,get_factory}
}
)
