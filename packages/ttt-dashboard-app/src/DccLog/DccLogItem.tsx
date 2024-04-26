import { FunctionComponent } from "preact";
interface DccLogType {
  message: string,
  id: string
}

interface DccLogItemProps {
  item: DccLogType
}


export const DccLogItem: FunctionComponent<DccLogItemProps> = ({ item }) => {

  return (
    <pre>{item.message}</pre>
  );

}

export default DccLogItem