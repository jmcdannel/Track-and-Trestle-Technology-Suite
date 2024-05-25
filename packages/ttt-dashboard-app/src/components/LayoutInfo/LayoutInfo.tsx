import { FunctionComponent } from "preact"
import { deviceStatus } from "../../stores/DccStore"
import { LayoutStat } from "./LayoutStat"
import CpuChip from "../../assets/icons/cpu-chip"
import Power from "../../assets/icons/power"
import Cloud from "../../assets/icons/cloud"
import Cog from "../../assets/icons/cog"
import Bolt from "../../assets/icons/bolt"
import BoltSlash from "../../assets/icons/bolt-slash"
import ServerStack from "../../assets/icons/server-stack"

export const LayoutInfo: FunctionComponent = () => {

  console.log('deviceStatus', deviceStatus.value)
  return (
    <>
      <section className="
        flex 
        flex-col 
        overflow-y-auto 
        border-2
        rounded-2xl 
        border-cyan-500 
        bg-cyan-950 
        h-full
        text-xl 
        text-green-500">
        <header className="
          bg-cyan-900
          px-6
          py-2 
          flex
          items-center
          justify-between
        ">
          <h1 className="text-base flex">
            <Power className="w-6 h-6 stroke-amber-400 mr-2" />
            DCC-EX
          </h1>
          <aside className="flex">
            <span className="p-1 bg-cyan-600 text-slate-800 rounded-lg text-xs ml-2 flex items-center">
              <CpuChip className="w-6 h-6 stroke-amber-400 mr-2" />
              {deviceStatus.value.deviceType}
            </span>
            <span className="p-1 bg-cyan-600 text-slate-800 rounded-lg text-xs ml-2 flex items-center">
              <ServerStack className="w-6 h-6 stroke-amber-400 mr-2" />
              {deviceStatus.value.version}
            </span>
            <span className="p-1 bg-cyan-600 text-slate-800 rounded-lg text-xs ml-2 flex items-center">
              <Cloud className="w-6 h-6 stroke-amber-400 mr-2" />
              {deviceStatus.value.clientId}
            </span>
          </aside>
        </header>
        <main className="
          flex-grow
          px-6
          py-2 ">
          <div class="flex flex-wrap">
            <LayoutStat icon={<Bolt className="w-6 h-6 stroke-green-500" />} val={deviceStatus.value.trackASetting} label="Track A" />
            <LayoutStat icon={<BoltSlash className="w-6 h-6 stroke-red-500" />} val={deviceStatus.value.trackBSetting} label="Track B" />
            <LayoutStat icon={<CpuChip className="w-6 h-6 stroke-white" />} val={deviceStatus.value.freeRam?.replace(/Free RAM=/, '').trim() || ''} label="RAM" />
            <LayoutStat icon={<Power className="w-6 h-6 stroke-white" />} val={deviceStatus.value.powerStatus} label="Power" />
            <LayoutStat icon={<Cog className="w-6 h-6 stroke-blue-500" />} val={deviceStatus.value.motorShield} label="Motor Shield" />
          </div>
        </main>
      </section>      
    </>
  )

}

export default LayoutInfo