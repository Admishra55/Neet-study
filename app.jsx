
const { useEffect, useMemo, useState } = React;
function cls(...x){ return x.filter(Boolean).join(' '); }
const LS_KEYS={progress:"neetapp.progress.v2",bookmarks:"neetapp.bookmarks.v2",theme:"neetapp.theme"};
const loadLS=(k,f)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch{return f;}};
const saveLS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
function ytToEmbed(url){ if(!url) return ""; try{ const u=new URL(url); const list=u.searchParams.get("list"); if(list) return `https://www.youtube.com/embed/videoseries?list=${list}`; const v=u.searchParams.get("v"); if(v) return `https://www.youtube.com/embed/${v}`; if(u.hostname.includes("youtu.be")){const id=u.pathname.replace('/',''); return `https://www.youtube.com/embed/${id}`;} }catch(e){} return url; }
function driveToDl(url){ try{const u=new URL(url); if(u.hostname.includes("drive.google.com")){const parts=u.pathname.split("/"); const idx=parts.indexOf("d"); if(idx!==-1 && parts[idx+1]){const id=parts[idx+1]; return `https://drive.google.com/uc?export=download&id=${id}`;}} }catch(e){} return url; }
function pdfViewer(url){ if(!url) return ""; const u=driveToDl(url); if(u.toLowerCase().endsWith(".pdf")) return u; return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(u)}`; }
function Button({className="",...p}){ return <button {...p} className={cls("rounded-2xl px-3 py-2 border shadow-sm hover:shadow transition",className)} />; }
function Badge({children}){ return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">{children}</span>; }
function Toggle({checked,onChange,label}){ return (<label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" className="h-4 w-4" checked={checked} onChange={e=>onChange(e.target.checked)} /><span className="text-sm">{label}</span></label>); }
function App(){
  const [data,setData]=useState({batches:[]});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [activeBatch,setActiveBatch]=useState("");
  const [activeSubject,setActiveSubject]=useState("");
  const [activeChapter,setActiveChapter]=useState("");
  const [viewerItem,setViewerItem]=useState(null);
  const [search,setSearch]=useState("");
  const [progress,setProgress]=useState(()=>loadLS(LS_KEYS.progress,{}));
  const [bookmarks,setBookmarks]=useState(()=>loadLS(LS_KEYS.bookmarks,{}));
  const [theme,setTheme]=useState(()=>loadLS(LS_KEYS.theme,"light"));

  useEffect(()=>saveLS(LS_KEYS.progress,progress),[progress]);
  useEffect(()=>saveLS(LS_KEYS.bookmarks,bookmarks),[bookmarks]);
  useEffect(()=>{ saveLS(LS_KEYS.theme,theme); document.documentElement.classList.toggle("dark",theme==="dark"); document.body.className=theme==="dark"?"bg-neutral-900 text-neutral-100":"bg-neutral-50 text-neutral-900"; },[theme]);

  useEffect(()=>{
    (async()=>{
      try{
        setLoading(true);
        const res = await fetch("data/content.json?ts="+Date.now());
        const j = await res.json();
        setData(j);
        const b = j.batches?.[0];
        setActiveBatch(b?.name || "");
        setActiveSubject(b?.subjects?.[0]?.name || "");
      }catch(e){
        console.error(e); setError("Failed to load content.json");
      }finally{ setLoading(false); }
    })();
  },[]);

  const batch = useMemo(()=> data.batches.find(b=>b.name===activeBatch) || {subjects:[]}, [data,activeBatch]);
  const subjects = batch.subjects || [];
  const chapters = useMemo(()=> (subjects.find(s=>s.name===activeSubject)?.chapters || []), [subjects,activeSubject]);
  const items = useMemo(()=>{
    const ch = chapters.find(c=>c.name===activeChapter);
    const arr = ch?.items || [];
    if(!search.trim()) return arr;
    const q = search.toLowerCase();
    return arr.filter(it => (it.title||"").toLowerCase().includes(q) || (it.type||"").toLowerCase().includes(q));
  },[chapters,activeChapter,search]);

  function openItem(it){ setViewerItem(it); }
  function toggleProgress(it){ setProgress(p=>({...p,[it.title]:!p[it.title]})); }
  function toggleBookmark(it){ setBookmarks(b=>{ const n={...b}; if(n[it.title]) delete n[it.title]; else n[it.title]=it; return n; }); }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 p-4">
        <aside className="space-y-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Batches</h2>{loading&&<span className="text-xs">Loading…</span>}</div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="mt-2 flex flex-wrap gap-2">
              {data.batches.map(b=>(
                <Button key={b.name} onClick={()=>{setActiveBatch(b.name); setActiveSubject(b.subjects?.[0]?.name || ""); setActiveChapter(""); setViewerItem(null);}}
                  className={cls("text-sm", activeBatch===b.name ? "bg-black text-white dark:bg-white dark:text-black" : "")}>{b.name}</Button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Subjects</h2>
              <div className="flex items-center gap-2">
                <Badge>{subjects.length}</Badge>
                <Button className="text-xs" onClick={()=> setTheme(theme==="light"?"dark":"light")}>{theme==="light" ? "Dark" : "Light"} mode</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map(s=>(
                <Button key={s.name} onClick={()=>{setActiveSubject(s.name); setActiveChapter(""); setViewerItem(null);}}
                  className={cls("text-sm", activeSubject===s.name ? "bg-black text-white dark:bg-white dark:text-black" : "")}>{s.name}</Button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Chapters</h2>
            <div className="space-y-2 max-h-[45vh] overflow-auto pr-1">
              {chapters.map(ch=>(
                <button key={ch.name} onClick={()=>setActiveChapter(ch.name)}
                  className={cls("w-full text-left px-3 py-2 rounded-xl border transition", activeChapter===ch.name ? "bg-neutral-100 dark:bg-neutral-700" : "bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700")}>{ch.name}</button>
              ))}
              {chapters.length===0 && <div className="text-sm text-neutral-500">No chapters yet.</div>}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-2"><h2 className="text-lg font-semibold">Bookmarks</h2><Badge>{Object.keys(bookmarks).length}</Badge></div>
            <div className="space-y-2 max-h-[25vh] overflow-auto pr-1">
              {Object.keys(bookmarks).length===0 && <div className="text-sm text-neutral-500">No bookmarks yet.</div>}
              {Object.values(bookmarks).map((it)=>(
                <div key={it.title} className="flex items-center justify-between gap-2 border rounded-xl px-3 py-2">
                  <div className="text-sm line-clamp-2"><div className="font-medium">{it.title}</div><div className="text-xs text-neutral-500">{(it.type||'').toUpperCase()}</div></div>
                  <div className="flex items-center gap-2"><Button className="text-xs" onClick={()=>openItem(it)}>Open</Button><Button className="text-xs" onClick={()=>toggleBookmark(it)}>Remove</Button></div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div><h1 className="text-xl md:text-2xl font-bold">{activeBatch || "NEET Batches"}</h1>
                {activeSubject && <div className="text-sm text-neutral-600 dark:text-neutral-300">Subject: {activeSubject}{activeChapter?` • Chapter: ${activeChapter}`:""}</div>}
              </div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items…" className="w-full md:w-80 border rounded-2xl px-3 py-2 text-sm outline-none focus:ring bg-white dark:bg-neutral-900"/>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold">Items</h2><div className="text-xs text-neutral-600 dark:text-neutral-300">Click to open in viewer</div></div>
            {!activeChapter && <div className="text-sm text-neutral-500">Select a chapter.</div>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(it=>{
                const isVideo=!!it.videoLink; const done=!!progress[it.title]; const marked=!!bookmarks[it.title];
                return (
                  <div key={it.title} className="border rounded-2xl p-3 flex flex-col gap-2 hover:shadow transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1"><div className="font-medium line-clamp-2">{it.title}</div><div className="text-xs text-neutral-500">{isVideo ? "Lecture" : "PDF"}</div></div>
                      <div className="flex flex-col gap-2 items-end">
                        <Toggle checked={done} onChange={()=>toggleProgress(it)} label={done?"Done":"Mark done"}/>
                        <Button className={cls("text-xs", marked ? "bg-black text-white dark:bg-white dark:text-black": "")} onClick={()=>toggleBookmark(it)}>{marked?"Bookmarked":"Bookmark"}</Button>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                      <Button className="text-sm w-full" onClick={()=>openItem(it)}>Open</Button>
                      {!isVideo && it.pdfLink && (<a className="text-sm w-full text-center rounded-2xl px-3 py-2 border hover:shadow" href={driveToDl(it.pdfLink)} target="_blank" rel="noreferrer" download>Download</a>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold">Viewer</h2>{viewerItem&&<div className="text-sm text-neutral-600 dark:text-neutral-300">{viewerItem.title}</div>}</div>
            {!viewerItem ? (<div className="text-sm text-neutral-500">Open any lecture or PDF to view here.</div>) :
              viewerItem.videoLink ? (
                <div className="w-full aspect-video overflow-hidden rounded-xl border">
                  <iframe className="w-full h-full" src={ytToEmbed(viewerItem.videoLink)} title={viewerItem.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
                </div>
              ) : (
                <div className="w-full h-[70vh] overflow-hidden rounded-xl border"><iframe className="w-full h-full" src={pdfViewer(viewerItem.pdfLink)} title={viewerItem.title} frameBorder="0"/></div>
              )
            }
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Your Stats</h2>
            <div className="text-sm flex flex-wrap gap-3">
              <div><span className="font-semibold">Completed:</span> {Object.values(progress).filter(Boolean).length}</div>
              <div><span className="font-semibold">Bookmarked:</span> {Object.keys(bookmarks).length}</div>
              <div><span className="font-semibold">Total Items:</span> {subjects.reduce((acc,s)=>acc+(s.chapters||[]).reduce((a,c)=>a+(c.items||[]).length,0),0)}</div>
            </div>
          </div>
        </main>
      </div>
      <footer className="text-center text-xs text-neutral-500 py-6">NEET Web App • JSON powered • No code edits for updates</footer>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
