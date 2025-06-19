interface ConfigItemProps {
  title: string;
  items: Array<{
    code: string;
    description: string;
  }>;
}

export function ConfigSection({ title, items }: ConfigItemProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        {items.map((item, index) => (
          <li key={index}>
            <code className="bg-gray-100 px-1 rounded">{item.code}</code>
            {" - "}
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
