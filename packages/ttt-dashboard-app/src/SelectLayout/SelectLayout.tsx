import { FunctionComponent } from "preact";
import { useState, useEffect } from "preact/hooks";
import { getLayouts } from "../lib/layoutApi";


export const SelectLayout: FunctionComponent = () => {
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
          <li key={layout.layoutId}>{layout.name}</li>
        ))}
      </ul>
    </div>
  );

}

export default SelectLayout