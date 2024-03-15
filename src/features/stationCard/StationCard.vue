<template>
  <div class="station">
    <button class="station__save" @click="saveStationCard">
      <saveIcon />
    </button>
    <dl class="station__info">
      <dt class="station__uuid" @click="copy(uuidCopy)">{{ station.uuid }}</dt>
      <div class="station__train train">
        <div class="train__name">
          <div class="train__info">
            <input v-if="isTrainPresent" type="text" class="train__input" v-model="trainName" />
            <p v-else>No train</p>
            <span class="status"
              :class="{ enroute: isTrainEnroute && !isTrainPresent, nopresent: !isTrainEnroute }"></span>
          </div>
          <trainIcon />
        </div>
        <div class="station__controls">
          <dd class="station__change">
            <input type="text" v-model="stationName" />

            <changeIcon />
          </dd>
          <arrowIcon v-if="station.info?.train_present" />
          <select class="station__select" v-model="selectedStation" v-if="station.info?.train_present">
            <option disabled value="">Выбрать станцию</option>
            <option :value="station_.uuid" v-for="station_ in routeStations" :key="station_.uuid">
              {{ station_.name }}
            </option>
          </select>
        </div>
        <div class="train__checkbox" v-if="station.info?.train_present">
          <label :for="`twoWay-${station.uuid}`">В две стороны?</label>
          <input type="checkbox" class="train__way" :id="`twoWay-${station.uuid}`" v-bind="twoWay" />
        </div>
      </div>
      <Button @click="goToStation" v-if="station.info?.train_present">Go</Button>
    </dl>
  </div>
</template>

<script setup>
import saveIcon from '@/shared/icon/saveIcon.vue'
import changeIcon from '@/shared/icon/changeIcon.vue'
import trainIcon from '@/shared/icon/trainIcon.vue'
import arrowIcon from '@/shared/icon/arrowIcon.vue'
import Button from '@/shared/button/Button.vue'
import { api } from '@/app/api'
import { computed, defineProps, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useStationStore } from '@/app/store/stationStore'

const stationProps = defineProps({
  station: {
    type: Object,
    default: () => ({})
  }
})

const isTrainPresent = computed(() => stationProps.station.info?.train_present)
const isTrainEnroute = computed(() => stationProps.station.info?.train_enroute)
const stationStore = useStationStore()
const selectedStation = ref('')
const twoWay = ref(false)
const uuidCopy = ref(stationProps.station.uuid)
const { copy } = useClipboard({ uuidCopy })
const stationName = ref(stationProps.station.info?.station_name)
const trainName = ref(stationProps.station.info?.train_name)
watch(
  () => stationProps.station.info?.station_name,
  (newValue) => {
    stationName.value = newValue
  }
)
watch(
  () => stationProps.station.info?.train_name,
  (newValue) => {
    trainName.value = newValue
  }
)
const routeStations = computed(() => {
  return stationStore.stations.filter(({ uuid, info }) => {
    return (
      info && uuid !== stationProps.currentStationUUID && !info.train_present && !info.train_enroute
    )
  })
})

const saveStationCard = async () => {
  try {
    if (trainName.value.trim() == '' || stationName.value.trim() == '') return
    console.log(stationProps.station.uuid, stationName.value)
    await api.setStationName(stationProps.station.uuid, stationName.value, trainName.value)

    console.log(`Имя станции ${stationName.value} сохранено`)
  } catch (error) {
    console.log(
      `Ошибка сохранения имени станции на имя ${stationName.value}. uuid:${stationProps.station.uuid}`,
      error
    )
  }
}

const goToStation = async () => {
  if (selectedStation.value == '' || !selectedStation.value) return
  try {
    console.log(`Пришло: uuid:${stationProps.station.uuid}, select:${selectedStation.value}`)
    await api.setStationSchedule(stationProps.station.uuid, selectedStation.value, twoWay.value)
    selectedStation.value = ''
    console.log(
      `Станция ${stationProps.station.name} uuid:${stationProps.station.uuid}. Отправлена на ${selectedStation.value}. В две стороны? ${twoWay.value ? 'Да' : 'Нет'}`
    )
  } catch (error) {
    console.log(`Ошибка отправки на станцию`, error)
  }
}
</script>

<style lang="scss" scoped>
.status {
  position: absolute;
  right: -37px;
  top: 0;
  width: 8px;
  height: 8px;
  transition: 0.2s ease-in-out;
  animation-name: active;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  border-radius: 100%;
}

.nopresent {
  background-color: red !important;
}

.enroute {
  background-color: rgb(238, 202, 0);
}

@keyframes active {
  0% {
    background-color: rgb(66, 209, 0);
  }

  50% {
    background-color: rgb(0, 134, 11);
  }

  100% {
    background-color: rgb(66, 209, 0);
  }
}

.train {
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__input {
    font-family: 'Montserrat', sans-serif;
    border-radius: 6px;
    padding: 6px 20px 6px 6px;
    background-color: rgb(58, 58, 58);
    border: none;
    color: white;
  }

  &__checkbox {
    display: flex;
    align-items: center;
    accent-color: var(--orange);

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

  &__name {
    display: flex;
    align-items: center;

    & svg {
      margin-left: 10px;
    }
  }

  &__info {
    position: relative;
    font-size: 20px;
  }
}

.station {
  gap: 40px;
  position: relative;
  background-color: var(--black);
  border-radius: 10px;
  color: white;
  padding: 10px;
  width: 500px;
  min-height: 192px;

  &__select {
    padding: 6px;
    border-radius: 6px;
    background-color: rgb(58, 58, 58);
    color: white;
    border: none;
    font-family: 'Montserrat', sans-serif;
  }

  &__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-grow: 1;
  }

  &__controls {
    width: 100%;
    gap: 20px;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__save {
    cursor: pointer;
    background-color: var(--gray);
    border-radius: 100%;
    padding: 5px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 10px;
    top: 10px;
    height: 34px;
    width: 34px;
    transition: 0.1s ease-in-out;

    &:hover {
      background-color: var(--dark-gray);

      svg {
        transition: 0.1s ease-in-out;

        fill: var(--orange);
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__uuid {
    font-size: 12px;
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
      font-family: 'Montserrat', sans-serif;
      border-radius: 6px;
      padding: 6px 20px 6px 6px;
      background-color: rgb(58, 58, 58);
      border: none;
      color: white;
    }
  }
}
</style>
