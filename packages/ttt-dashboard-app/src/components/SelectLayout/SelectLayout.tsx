import { FunctionComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { getLayouts } from "../../lib/layoutApi";

interface SelectLayoutProps {
  onSelected: (layout: any) => void;
}

export const SelectLayout: FunctionComponent<SelectLayoutProps> = ({ onSelected }) => {

  const [layouts, setLayouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLayouts = async () => {
      const layouts = await getLayouts();
      setLayouts(layouts);
    };
    fetchLayouts();
  }, []);

  return (
    <div>
      <h1>Select Layout</h1>
      <ul>
        {layouts.map((layout) => (
          <li onClick={() => onSelected(layout.layoutId)} key={layout.layoutId}>{layout.name}</li>
        ))}
      </ul>
    </div>
  );

}

export default SelectLayout