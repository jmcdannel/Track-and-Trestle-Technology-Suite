import { FunctionComponent, JSX } from "preact";
interface DccLogType {
  message: string,
  id: string
}

interface DccLogItemProps {
  item: DccLogType
}


export const DccLogItem: FunctionComponent<DccLogItemProps> = ({ item }): JSX.Element => {
  const dccRegex = /<\*\s(.*?)\s\*>/;

  function renderDccItem(item: DccLogType) {
    switch (item.message.charAt(1)) {
      case '*' : 
        const match = item.message.match(dccRegex)
        const formattedMessage = match ? match[1] : ''
        return (
          <>
            <span className="text-red-500 bg-violet-800 m-1 rounded-full py-1 px-3 text-sm">STATUS</span>
            <span className="text-cyan-900">{formattedMessage}</span>
          </>
        )
      case 'l' : return (
        <>
          <span className="text-green-500 bg-blue-900 m-1 rounded-full py-1 px-3 text-sm">LOCO</span>
          <span className="text-cyan-900">{item.message}</span>
        </>
        )
      case 'H' : return (
        <>
          <span className="text-fuchsia-300 bg-blue-900 m-1 rounded-full py-1 px-3 text-sm">TURNOUT</span>
          <span className="text-cyan-900">{item.message}</span>
        </>
      )
      case 'Y' : return (
        <>
          <span className="text-yellow-500 bg-blue-900 m-1 rounded-full py-1 px-3 text-sm">OUTPUT</span>
          <span className="text-cyan-900">{item.message}</span>
        </>
      )
      default: return (
        <>
          <span className="text-blue-500 bg-blue-900 m-1 rounded-full py-1 px-3 text-sm">DCC</span>
          <span className="text-cyan-900">{item.message}</span>
        </>
      )
    }
  }

  function renderItem(item: DccLogType) {
    if (item.message.startsWith('<')) { // dcc command
      return renderDccItem(item); // Add a return statement here
    } else {
      return (
        <pre>{item.message}</pre>
      )
    }
  }

  return (
    <pre className="p-1 mb-1 bg-violet-300 rounded-full">
      {renderItem(item)}
    </pre>
  )

}

export default DccLogItem