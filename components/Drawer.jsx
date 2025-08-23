export default function Drawer({ data, onSelect }) {
  const subjects = [...new Set(data.map(item => item.Subject))];
  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-800 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      {subjects.map((subj, i) => (
        <div key={i} className="mb-2">
          <button
            onClick={() => {}}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            {subj}
          </button>
        </div>
      ))}
    </aside>
  );
}
