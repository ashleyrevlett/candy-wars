import dayjs from 'dayjs'
import { defineStore } from "pinia"
import SETTINGS from "../settings";
import bellSFX from '../assets/audio/schoolBell.mp3'


export type CalendarState = {
  currentDay: Date,
};

export const useCalendarStore = defineStore({
  id: "calendarStore",
  state: () => ({
      currentDay: SETTINGS.startDate,
  } as CalendarState),
  persist: true,
  actions: {
    initStore() {
      this.currentDay = SETTINGS.startDate
    },
    advanceDate() {
      // currentDay could be a string if rehydrated from pinia,
      // or a date if page hasn't been refreshed
      let newDay = null
      if (dayjs(this.currentDay).hour() > 14) {
        const bellAudio = new Audio(bellSFX)
        bellAudio.volume = .6
        bellAudio.play()
        newDay = dayjs(this.currentDay).add(18, 'hour')
      } else {
        console.log("Before 3 pm, adding 1 hour")
        newDay = dayjs(this.currentDay).add(1, 'hour')
      }
      this.currentDay = newDay.toDate()
    }
  },
  getters: {
    daysSinceStart: state => {
      const day = dayjs(state.currentDay)
      const startDay = dayjs(SETTINGS.startDate)
      return day.diff(startDay, 'day') + 1
    }
  },
});