<template>
  <div class="station"  >
    <button class="station__save" @click="saveStation">
      <saveIcon />
    </button>
    <dl class="station__info">
      <dt class="station__uuid"  @click="copy(uuidCopy)">{{ station.uuid }}</dt>
      <div class="station__train train" >
        <div class="train__name">
          <trainIcon v-if="station.info?.train_present"/>
          <div class="train__info">
            <p v-if="station.info?.train_present">
              {{ station.info?.train_name }}
            </p>
            <p v-if="!station.info?.train_present && station.info?.train_enroute">
              Enroute
            </p>
            <p v-if="!station.info?.train_present && !station.info?.train_enroute">
              Not present
            </p>
          </div>
        </div>
        <div class="station__controls">
          <dd class="station__change">
            <input type="text" class="" v-model="stationName">

            <changeIcon />
          </dd>
          <arrowIcon v-if="station.info?.train_present"/>
          <select class="station__select" v-model="selectedStation" v-if="station.info?.train_present">
            <option disabled value="">Выбрать станцию</option>
            <option :value="station_.uuid" v-for="station_ in route_stations" :key="station_.uuid">{{station_.name}}</option>
          </select>
        </div>
        <div class="train__checkbox" v-if="station.info?.train_present">
          <label for="twoWay">В две стороны?</label>
          <input type="checkbox" class="train__way" id="twoWay" v-bind="twoWay">
        </div>
      </div>
      <Button @click="goToStation" v-if="station.info?.train_present">Go</Button>
    </dl>
  </div>
</template>
  
<script setup>
import saveIcon from '@/shared/icon/saveIcon.vue';
import changeIcon from '@/shared/icon/changeIcon.vue'
import trainIcon from '@/shared/icon/trainIcon.vue';
import arrowIcon from '@/shared/icon/arrowIcon.vue';
import Button from '@/shared/button/Button.vue';
import { api } from '@/app/api';
import { computed, defineProps,ref, watch} from 'vue'
import { useClipboard } from '@vueuse/core'
import { useStationStore } from '@/app/store/stationStore';
//Пропс с Stations.vue
const stationProps = defineProps( {
  station: Object     
})

const stationStore = useStationStore()
const uuidCopy  = ref(stationProps.station.uuid) 
const { copy } = useClipboard({ uuidCopy })

// Название станции 
const stationName = ref(stationProps.station.info?.station_name);
watch(() => stationProps.station.info?.station_name, (newValue) => {
  stationName.value = newValue;
});

//Выбранная станция
const selectedStation = ref('')
//Выбор туда-сюда
const twoWay = ref(false)

const route_stations = computed(()=> {
    return stationStore.stations.slice().filter((station)=>{
        if (!station.info)
            return false
        if (station.uuid == stationProps.station_uuid)
            return false
        if (station.info.train_present)
            return false
        if (station.info.train_enroute)
            return false
        return true
    })
})

//Сохранение имени станции
//Я хуй его знает что с сохнанением но я попытался сделать номальную отладку чтобы ты понял что не так 
const saveStation = async()=>
{
  try 
  {
    console.log(stationProps.station.uuid, stationName.value);
    await api.set_station_name(
      stationProps.station.uuid,      //uuid спропса 
      stationName.value               //Выбранная станция
    )
    console.log(`Имя станции сохранено`)
  }
  catch(error)
  {
    console.log(`Ошибка сохранения имени станции на имя ${stationName.value}. uuid:${stationProps.station.uuid}`, error)
  }
}
//Выбор станции  (надо допилить перебор массива чтобы исключить станцию с которой ты выбераешь)
const goToStation = async ()=>
{
  if (selectedStation.value == "") return
  try
  {
    console.log(`Пришло: uuid:${stationProps.station.uuid}, select:${selectedStation.value}`)
    await api.set_station_schedule(
      stationProps.station.uuid,      //uuid пропса
      selectedStation.value,          //Выбранная станция
      twoWay.value)                   //Выбор туда-сюда
    selectedStation.value = ""
      console.log(`Станция ${stationProps.station.name} uuid:${stationProps.station.uuid}. Отправлена на ${selectedStation.value}. В две стороны? ${twoWay.value}`)
  }
  catch(error)
  {
    console.log(`Ошибка отправки на станцию`, error)
  }
}

</script>
  
<style lang="scss" scoped>

button {
  background-color: transparent;
}

.train {
  width: fit-content;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__checkbox {
    display: flex;
    align-items: center;

    & label {
      font-size: 16px;
      user-select: none;
      margin: 0 8px 0 0;
    }

    & input {
      width: 16px;
      height: 16px;
    }
  }

  &__status {
    position: absolute;
    right: -10px;
    top: 0;
    z-index: 1;
    aspect-ratio: 1/1;
    width: 6px;
    background-color: var(--orange);
    border-radius: 100%;

  }

  &__name {
    display: flex;
    align-items: center;

    & svg {
      margin-right: 16px;
    }
  }

  &__info {
    position: relative;
    font-size: 20px;
  }
}

.station {
  display: flex;
  gap: 40px;
  position: relative;
  background-color: var(--black);
  border-radius: 10px;
  color: white;
  padding: 10px;
  width: 500px;
  height: 192px;

  &__select {
    padding: 6px;
    border-radius: 6px;
    background-color: rgb(58, 58, 58);
    color: white;
    border: none;
    font-family: "Montserrat", sans-serif;
  }

  &__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-grow: 1;
  }

  &__controls {
    gap: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

  }

  &__save {
    position: absolute;
    right: 10px;
    top: 10px;

  }

  &__info {
    min-width: 450px;
    display: flex;
    flex-direction: column;
  }

  &__uuid {
    font-size: 12px;
    margin-bottom: 10px;
    color: rgb(189, 189, 189);
    cursor: pointer;
  }

  &__change {

    position: relative;
    width: fit-content;
    display: flex;
    align-items: center;

    & svg {
      position: absolute;
      right: 0;
      pointer-events: none;
      margin-right: 4px;  
      z-index: 0;
    }

    & input {

      font-family: "Montserrat", sans-serif;
      border-radius: 6px;
      padding: 6px 20px 6px 6px;
      background-color: rgb(58, 58, 58);
      border: none;
      color: white;
    }

  }


}
</style>
  