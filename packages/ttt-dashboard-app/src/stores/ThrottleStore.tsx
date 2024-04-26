
import { signal } from "@preact/signals";


export interface ThrottleType {
  address: number,
  speed: number,
}

export const throttles = signal<ThrottleType[]>([]);

export const appendToLog = (throttle:ThrottleType) => {
  throttles.value = [...throttles.value, throttle];
}

export const upsertThrottle = (throttle:ThrottleType) => {
  const idx = throttles.value.findIndex((t) => t.address === throttle.address);
  if (idx === -1) {
    appendToLog(throttle);
  } else {
    throttles.value = [...throttles.value.slice(0, idx), throttle, ...throttles.value.slice(idx + 1)];
  }
}

export const clearLog = () => {
  throttles.value = [];
}