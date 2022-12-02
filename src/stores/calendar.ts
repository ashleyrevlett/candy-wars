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
    advanceDate() {
      // currentDay could be a string if rehydrated from pinia,
      // or a date if page hasn't been refreshed
      const newDay = dayjs(this.currentDay).add(1, 'day')
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