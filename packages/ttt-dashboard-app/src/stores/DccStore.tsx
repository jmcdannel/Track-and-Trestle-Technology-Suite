
import { signal } from "@preact/signals";


export interface DccLogType {
  message: string,
  id: string
}

export const log = signal<DccLogType[]>([]);

export const appendToLog = (message:string) => {
  log.value = [...log.value, { message, id: Math.random().toString() }];
}

export const clearLog = () => {
  log.value = [];
}