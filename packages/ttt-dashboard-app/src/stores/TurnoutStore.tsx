
import { signal } from "@preact/signals";


export interface TurnoutType {
  turnoutId: number,
  state: boolean,
}

export const turnouts = signal<TurnoutType[]>([]);

export const appendToLog = (turnout:TurnoutType) => {
  turnouts.value = [...turnouts.value, turnout];
}

export const clearLog = () => {
  turnouts.value = [];
}
