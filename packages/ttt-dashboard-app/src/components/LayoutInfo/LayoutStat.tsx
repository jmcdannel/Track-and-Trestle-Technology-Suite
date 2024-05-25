import { FunctionComponent, JSX } from "preact"
import Power from "../../assets/icons/power"



interface LayoutStatProps {
  icon: JSX.Element
  val: string | null
  label: string | null
}


export const LayoutStat: FunctionComponent<LayoutStatProps> = ({ icon, val, label }) => {
  const max = 10
  const labelSize = label?.length || 0
  const size = labelSize < max ? 'w-full sm:w-full xl:w-1/2' : 'w-full sm:w-full xl:w-full'
  console.log('size', size, label?.length)

  return (
    <div class={`p-1 ${size}`}>
      <div class="flex items-center px-2 py-3 shadow-sm rounded-md bg-slate-700">
        <div class="p-3 rounded-full bg-indigo-600 bg-opacity-75">
          {icon}
        </div>
        <div class="mx-5">
          {val && val.length ? (
            <h4 class="text-xl font-semibold text-cyan-400">{val}</h4>
          ) : (
            <div class="animate-pulse bg-gray-600 rounded w-20 ">
              &nbsp;
            </div>
          )}          
          <div class="text-gray-200 text-xs">{label}</div>  
        </div>
      </div>
    </div>
  )

}



export default LayoutStat