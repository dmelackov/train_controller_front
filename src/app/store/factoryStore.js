import { defineStore } from 'pinia'
import { api, websocketApi } from '../api'
import { ref } from 'vue'

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
 * @property {string} uuid
 * @property {Inventory} inventories
 */

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

    factories.value = factories.value.map((element) => ({
      uuid: element,
      inventories: {}
    }))
    await fetchFactoryDetails(factories.value)
  }

  /**
   * @async
   * @param {Factory[]} factories - Array of Factories
   */

  async function fetchFactoryDetails(factories) {
    console.log(factories)
    for (const factory of factories) {
      const info = await fetchFactoryInfo(factory.uuid)
      for (const inventory of info.inventories) {
        factory.inventories[inventory] = await fetchFactoryInventory(factory.uuid, inventory)
      }
      factory.info = info
    }
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
