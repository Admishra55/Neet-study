export default function BatchCard({ title, onClick }) {
  return (
    <div
      className="p-4 bg-white dark:bg-gray-700 rounded shadow cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}
