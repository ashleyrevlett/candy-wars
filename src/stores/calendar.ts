import dayjs from 'dayjs'
import { defineStore } from "pinia"
import SETTINGS from "../settings";


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
    advanceTime() {
      // currentDay could be a string if rehydrated from pinia,
      // or a date if page hasn't been refreshed
      let newDay = null
      if (this.currentHour + 1 >= SETTINGS.schoolEndHour) {
        const hoursToNextDay = (24 - this.currentHour) + 9 // starts at 9am
        newDay = dayjs(this.currentDay).add(hoursToNextDay, 'hour')
      } else {
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
    },
    currentHour: state => dayjs(state.currentDay).hour(),
  },
});