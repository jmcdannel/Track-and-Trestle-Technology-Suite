// import clientPromise from "../lib/mongodb";

type SelectLayoutProps = {
  layouts: any[];
};

export default function LayoutList({ layouts }: SelectLayoutProps) {
  return (
    <div>
      <h1>Layouts</h1>
      <ul>
        {layouts.map((layout) => (
          <li key={layout.layoutId}>
            <h2>{layout.layoutId}</h2>
            <p>{layout.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
