export function useUtils() {
  function randomNumberInRange(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  return { randomNumberInRange }
}