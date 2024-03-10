import { defineStore } from 'pinia'
import { api, websocketApi } from '../api'
import { ref } from 'vue'
export const useFactoryStore = defineStore('factory', () => {
  const factories = ref([])

  websocketApi.emitter.on('update_inventory', (event) => {
    updateInventoryInfo(event.factory_uuid, event.inventory_name)
  })
  /**
   *  @async
   */
  async function getFactories() {
    factories.value = await api.getFactories()
    
    for (let i = 0; i < factories.value.length; i++) {
      const element = factories.value[i]
      factories.value[i] = { uuid: element, inventories: {} }
    }
    let promises = factories.value.map(async (factory) => {
      let info = await fetchFactoryInfo(factory.uuid)
      for (let i = 0; i < info.inventories.length; i++) {
        const element = info.inventories[i]
        factory.inventories[element] = await fetchFactoryInventory(factory.uuid, element)
      }
      factory.info = info
    })
    await Promise.all(promises)
  }
  /**
   * @async
   * @param {string} uuid
   * @returns {Promise<Array>}
   */
  function getFactory(uuid) {
    return factories.value.find((factorie) => factorie.uuid == uuid)
  }
  /**
   * @async
   * @param {string} uuid - Station uuid
   * @param {string} inventory - Inventory name
   */
  async function updateInventoryInfo(uuid, inventory) {
    getFactory(uuid).inventories[inventory] = await fetchFactoryInventory(uuid, inventory)
  }
  /**
   * @async
   * @param {string} uuid
   * @returns {Promise<Object>}
   */
  async function fetchFactoryInfo(uuid) {
    return await api.getFactoryInfo(uuid)
  }
  /**
   * @async
   * @param {string} uuid
   * @param {string} inventory - Inventory name
   * @returns {Promise<Object>}
   */
  async function fetchFactoryInventory(uuid, inventory) {
    return await api.getFactoryInventory(uuid, inventory)
  }

  return {
    factories,
    getFactories,
    fetchFactoryInfo,
    fetchFactoryInventory,
    updateInventoryInfo,
    getFactory
  }
})
