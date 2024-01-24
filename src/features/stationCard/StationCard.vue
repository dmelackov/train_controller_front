<template>
  <div class="station"  >
    <button class="station__save" @click="saveStation">
      <saveIcon />
    </button>
    <dl class="station__info">
      <dt class="station__uuid"  @click="copy(uuidCopy)">{{ stationProps.station.uuid }}</dt>
      <div class="station__train train">
        <div class="train__name">
          <div class="train__info">
            {{ stationProps.station.info?.train_name }}
            <div class="train__status"></div>
          </div>
          <trainIcon />
        </div>
        <div class="station__controls">
          <dd class="station__change">
            <input type="text" class="" v-model="stationName">

            <changeIcon />
          </dd>
          <arrowIcon />
          <select class="station__select" v-model="selectedStation">
            <option disabled value="">Выбрать станцию</option>
            <option :value="station.name" v-for="station in stationProps.sortedByStantion" :key="station">{{station.name}}</option>
          </select>
        </div>
        <div class="train__checkbox">
          <label for="twoWay">В две стороны?</label>
          <input type="checkbox" class="train__way" id="twoWay" v-bind="twoWay">
        </div>
      </div>
      <Button @click="goToStation">Go</Button>
    </dl>
    <div class="inventory">
      Inventory
      <div class="inventory__container">
        <div class="inventory__item" v-for="item in stationProps.station.info?.inventories" :key="item">
           {{ item }}
        </div>
      </div>
      <div class="inventory__more">
        <button class="inventory__btn" >
          <showArrowIcon />
        </button>
      </div>
    </div>

  </div>
</template>
  
<script setup>
import showArrowIcon from '@/shared/icon/showArrowIcon.vue';
import saveIcon from '@/shared/icon/saveIcon.vue';
import changeIcon from '@/shared/icon/changeIcon.vue'
import trainIcon from '@/shared/icon/trainIcon.vue';
import arrowIcon from '@/shared/icon/arrowIcon.vue';
import Button from '@/shared/button/Button.vue';
import { api } from '@/app/api';
import { defineProps,ref, watch} from 'vue'
import { useClipboard } from '@vueuse/core'
//Пропс с Stations.vue
const stationProps = defineProps( {
  station: Object,           
  sortedByStantion: Array       
})

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
  try
  {
    console.log(`Пришло: uuid:${stationProps.station.uuid}, select:${selectedStation.value}`)
    await api.set_station_schedule(
      stationProps.station.uuid,      //uuid пропса
      selectedStation.value,          //Выбранная станция
      twoWay.value)                   //Выбор туда-сюда
    console.log(`Станция ${stationProps.station.name} uuid:${stationProps.station.uuid}. Отправлена на ${selectedStation.value}. В две стороны? ${twoWay.value}`)
  }
  catch(error)
  {
    console.log(`Ошибка отправки на станцию`, error)
  }
}

</script>
  
<style lang="scss" scoped>
.inventory {
  font-size: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;

  &__items {
    background-color: rgb(39, 39, 39);
    color: white;
    margin-top: -5px;
    padding: 10px;
  }

  &__btn {
    cursor: pointer;
    transition: 0.1s ease-in;
    border-radius: 6px;
    padding: 2px 10px;

    &:hover {

      svg {
        transition: 0.2s ease-in;
        fill: var(--orange) !important;

      }
    }

  }

  &__more {
    display: flex;
    justify-content: center;

  }

  &__container {

    padding-top: 5px;
    padding-right: 20px;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;

  }

  &__item {
    font-size: 12px;
    width: fit-content;
    height: fit-content;
  }
}

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
      margin-left: 16px;
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
  