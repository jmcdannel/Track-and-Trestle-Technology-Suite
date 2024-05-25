
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

export interface DccDeviceStatusType {
  trackAPower: boolean | null,
  trackASetting: string | null,
  trackBPower: boolean | null,
  trackBSetting: string | null,
  freeRam: string | null,
  powerStatus: string | null,
  clientId: string | null,
  motorShield: string | null,
  deviceType: string | null,
  version: string | null
}

export const deviceStatus = signal<DccDeviceStatusType>({
  trackAPower: null,
  trackASetting: null,
  trackBPower: null,
  trackBSetting: null,
  freeRam: null,
  powerStatus: null,
  clientId: null,
  motorShield: null,
  deviceType: null,
  version: null
});

export const updateDeviceStatus = (key: string, value: any) => {
  deviceStatus.value = {
    ...deviceStatus.value,
    [key]: value
  };
}
