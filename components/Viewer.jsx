export default function Viewer({ item }) {
  if (!item) return null;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">{item.Title}</h1>
      {item.VideoLink && (
        <iframe
          className="w-full aspect-video mb-4"
          src={`https://www.youtube.com/embed/${item.VideoLink.includes('list=') ? 'videoseries?list=' + item.VideoLink.split('list=')[1] : item.VideoLink}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
      {item.PdfLink && (
        <iframe
          className="w-full h-[600px] border rounded"
          src={item.PdfLink}
        ></iframe>
      )}
    </div>
  );
}
