const { useState, useEffect } = React;
import Drawer from './components/Drawer.jsx';
import Viewer from './components/Viewer.jsx';
import BatchCard from './components/BatchCard.jsx';
import useGoogleSheet from './utils/useGoogleSheet.js';

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const { data, loading } = useGoogleSheet();

  if (loading) return <div className="p-6">Loading...</div>;

  const batches = [...new Set(data.map(item => item.Batch))];

  return (
    <div className="flex">
      <Drawer data={data} onSelect={setSelectedItem} />
      <main className="flex-1 p-6 overflow-y-auto">
        {!selectedItem && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {batches.map((batch, i) => (
              <BatchCard key={i} title={batch} onClick={() => {}} />
            ))}
          </div>
        )}
        {selectedItem && <Viewer item={selectedItem} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
