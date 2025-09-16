export default function Table({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(c => <th key={c.accessor} className="px-3 py-2 text-left font-medium">{c.header}</th>)}
            {actions && <th className="px-3 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t">
              {columns.map(c => <td key={c.accessor} className="px-3 py-2">{row[c.accessor]}</td>)}
              {actions && (
                <td className="px-3 py-2 space-x-2">
                  {actions.map(a => (
                    <button key={a.label} onClick={() => a.onClick(row)} className={`px-2 py-1 rounded border ${a.variant === 'danger' ? 'text-red-600 border-red-300' : ''}`}>
                      {a.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
