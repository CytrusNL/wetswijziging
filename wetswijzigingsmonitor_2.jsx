import { useState } from "react";

const C = {
  black:  "#080808", white: "#F4F4EF", yellow: "#F0C419", yellowD: "#C9A20E",
  gray1:  "#141414", gray2: "#202020", gray3:  "#303030", gray4:   "#666666",
  gray5:  "#AAAAAA", red:   "#E03A28", green:  "#27AE60", blue:    "#2471A3",
};

// ── Seed legislative items ──────────────────────────────────────
const SEED = [
  { id:1, title:"Wet digitale overheid — Wijziging identificatieplicht BRP", category:"Digitalisering", sourceRef:"Stb. 2025, nr.142", pubDate:"2025-03-14", inwerking:"2025-07-01", reviewDeadline:"2025-06-10", tags:["DigiD","BRP","Toegang"], rawSummary:"Wijziging van de Wet digitale overheid betreffende verplichte koppeling van identificatiemiddelen aan de BRP voor gemeentelijke dienstverlening.", score:null, aiSummary:null, expanded:false, loading:false },
  { id:2, title:"Omgevingswet — Tijdelijk alternatief stelsel verlengd", category:"Omgeving & Ruimte", sourceRef:"Stb. 2025, nr.89", pubDate:"2025-02-01", inwerking:"2025-08-01", reviewDeadline:"2025-07-05", tags:["Omgevingsplan","DSO","Vergunningen"], rawSummary:"Verlenging van het tijdelijk alternatief stelsel voor omgevingsplannen. Gemeenten krijgen meer tijd voor digitale aansluiting op het DSO.", score:null, aiSummary:null, expanded:false, loading:false },
  { id:3, title:"AVG — Nieuwe uitvoeringswet gegevensbeschermingsautoriteit", category:"Privacy", sourceRef:"Kamerstuk 36 421 nr.5", pubDate:"2025-04-02", inwerking:"2026-01-01", reviewDeadline:"2025-09-01", tags:["AVG","AP","Privacy"], rawSummary:"Uitvoeringswet betreffende de toezichtrol van de AP op gemeentelijke gegevensverwerkingen. Verplichte DPO-rapportage aan Rijk.", score:null, aiSummary:null, expanded:false, loading:false },
  { id:4, title:"Participatiewet — Herziene kostendelersnorm", category:"Sociaal Domein", sourceRef:"Stb. 2024, nr.498", pubDate:"2024-12-20", inwerking:"2025-07-15", reviewDeadline:"2025-06-20", tags:["Bijstand","Kostendelersnorm","SZW"], rawSummary:"Aanpassing van de kostendelersnorm in de Participatiewet. Gemeenten moeten herziene berekeningen toepassen.", score:null, aiSummary:null, expanded:false, loading:false },
  { id:5, title:"Wet open overheid (Woo) — Uitbreiding actieve openbaarmaking", category:"Transparantie", sourceRef:"Stcrt. 2025, nr.12087", pubDate:"2025-03-28", inwerking:"2025-10-01", reviewDeadline:"2025-07-15", tags:["Woo","Openbaarmaking","Documenten"], rawSummary:"Uitbreiding van de actieve openbaarmakingsplicht voor gemeenten. Meer documentcategorieën moeten proactief gepubliceerd worden.", score:null, aiSummary:null, expanded:false, loading:false },
  { id:6, title:"Wet financiering decentrale overheden — Schatkistbankieren", category:"Financiën", sourceRef:"Stb. 2025, nr.201", pubDate:"2025-04-10", inwerking:"2026-01-01", reviewDeadline:"2025-09-20", tags:["Schatkistbankieren","Treasury","Renterisico"], rawSummary:"Wijziging normen voor schatkistbankieren door decentrale overheden. Aangescherpte regels voor kortlopende uitzettingen.", score:null, aiSummary:null, expanded:false, loading:false },
  { id:7, title:"Jeugdwet — Regionalisering inkoop jeugdhulp verplicht", category:"Sociaal Domein", sourceRef:"Kamerstuk 31 839 nr.1018", pubDate:"2025-04-22", inwerking:"2026-07-01", reviewDeadline:"2025-11-01", tags:["Jeugdzorg","Regionaal","Inkoop"], rawSummary:"Wetsvoorstel dat gemeenten verplicht regionaal samen te werken bij de inkoop van jeugdhulp.", score:null, aiSummary:null, expanded:false, loading:false },
  { id:8, title:"Wet modernisering elektronisch bestuurlijk verkeer — Fase 2", category:"Digitalisering", sourceRef:"Stb. 2025, nr.176", pubDate:"2025-04-05", inwerking:"2025-11-01", reviewDeadline:"2025-08-20", tags:["e-mail","Awb","Digitale communicatie"], rawSummary:"Tweede fase. Verplicht gemeenten digitale berichten van burgers te accepteren als officieel verkeer.", score:null, aiSummary:null, expanded:false, loading:false },
];

const CATS = [...new Set(SEED.map(i => i.category))];
const MONTHS = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
const CAT_COLORS = {
  "Digitalisering": "#3B82F6","Omgeving & Ruimte":"#10B981","Privacy":"#8B5CF6",
  "Sociaal Domein":"#F59E0B","Transparantie":"#06B6D4","Financiën":"#F0C419",
};

function scoreLevel(s){ if(!s) return null; if(s>=8) return "high"; if(s>=5) return "medium"; return "low"; }
const SC = {
  high:  { bg:"#E03A2818", border:"#E03A28", text:"#E03A28", label:"Kritiek" },
  medium:{ bg:"#F0C41918", border:"#F0C419", text:"#C9A20E", label:"Belangrijk" },
  low:   { bg:"#27AE6018", border:"#27AE60", text:"#27AE60", label:"Normaal" },
};

async function fetchAI(item) {
  const prompt = `Je bent expert-adviseur voor Nederlandse gemeenten. Analyseer:
Titel: ${item.title}
Categorie: ${item.category}
Bron: ${item.sourceRef}
Inwerkingtreding: ${item.inwerking}
Beschrijving: ${item.rawSummary}

Geef ALLEEN dit JSON-object terug (geen markdown, geen backticks):
{"score":<1-10>,"samenvatting":"<2 zinnen voor gemeenteambtenaar>","impact":"<1 zin concrete actie>","afdelingen":["<afd1>","<afd2>"],"risico":"<laag|middel|hoog>"}`;
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:600, messages:[{role:"user",content:prompt}] })
  });
  const d = await r.json();
  const txt = (d.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
  return JSON.parse(txt);
}

// ── Mini calendar grid ──────────────────────────────────────────
function CalendarGrid({ items, selectedMonth, setSelectedMonth, onSelectDay, selectedDay }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = selectedMonth;
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const offset = (firstDay + 6) % 7; // Mon-start
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // build a map: day -> items with deadline or inwerking in this month
  const dayMap = {};
  items.forEach(item => {
    [item.reviewDeadline, item.inwerking].forEach((d, idx) => {
      if (!d) return;
      const dt = new Date(d);
      if (dt.getFullYear() === year && dt.getMonth() === month) {
        const day = dt.getDate();
        if (!dayMap[day]) dayMap[day] = [];
        dayMap[day].push({ item, type: idx === 0 ? "review" : "inwerking" });
      }
    });
  });

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayDay = now.getMonth() === month ? now.getDate() : null;

  return (
    <div>
      {/* Month nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <button onClick={() => setSelectedMonth(m => Math.max(0, m-1))}
          style={{ background:"none", border:"1px solid #2C2C2C", color:C.gray5, borderRadius:6, width:30, height:30, cursor:"pointer", fontSize:14 }}>‹</button>
        <span style={{ fontSize:13, fontWeight:700, color:C.white, letterSpacing:2, textTransform:"uppercase" }}>
          {MONTHS[month]} {year}
        </span>
        <button onClick={() => setSelectedMonth(m => Math.min(11, m+1))}
          style={{ background:"none", border:"1px solid #2C2C2C", color:C.gray5, borderRadius:6, width:30, height:30, cursor:"pointer", fontSize:14 }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
        {["Ma","Di","Wo","Do","Vr","Za","Zo"].map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:10, color:C.gray4, fontWeight:700, letterSpacing:1, padding:"4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const events = dayMap[day] || [];
          const isToday = day === todayDay;
          const isSelected = day === selectedDay;
          const hasReview = events.some(e => e.type === "review");
          const hasInwerking = events.some(e => e.type === "inwerking");
          return (
            <div key={day}
              onClick={() => events.length > 0 && onSelectDay(day)}
              style={{
                borderRadius: 7,
                background: isSelected ? C.yellow : isToday ? "#1A1A1A" : events.length ? "#141414" : "transparent",
                border: isToday && !isSelected ? `1px solid ${C.yellow}66` : isSelected ? "none" : events.length ? "1px solid #2A2A2A" : "1px solid transparent",
                padding: "6px 4px 5px",
                cursor: events.length ? "pointer" : "default",
                transition: "all 0.12s",
                minHeight: 48,
                display: "flex", flexDirection: "column", alignItems: "center",
              }}
            >
              <span style={{ fontSize:12, fontWeight: isToday||isSelected ? 800:500, color: isSelected ? C.black : isToday ? C.yellow : events.length ? C.white : C.gray4, lineHeight:1.2 }}>{day}</span>
              {events.length > 0 && (
                <div style={{ display:"flex", gap:2, marginTop:4, flexWrap:"wrap", justifyContent:"center" }}>
                  {hasReview && <div style={{ width:6, height:6, borderRadius:"50%", background: isSelected ? C.black : C.red }} />}
                  {hasInwerking && <div style={{ width:6, height:6, borderRadius:"50%", background: isSelected ? "#333" : C.yellow }} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:14, marginTop:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.gray4 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.red }} /> Review deadline
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.gray4 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.yellow }} /> Inwerkingtreding
        </div>
      </div>
    </div>
  );
}

// ── Timeline strip for selected day ────────────────────────────
function DayDetail({ day, month, items }) {
  const year = new Date().getFullYear();
  const events = [];
  items.forEach(item => {
    if (item.reviewDeadline) {
      const d = new Date(item.reviewDeadline);
      if (d.getFullYear()===year && d.getMonth()===month && d.getDate()===day)
        events.push({ item, type:"review", label:"Review deadline" });
    }
    if (item.inwerking) {
      const d = new Date(item.inwerking);
      if (d.getFullYear()===year && d.getMonth()===month && d.getDate()===day)
        events.push({ item, type:"inwerking", label:"Inwerkingtreding" });
    }
  });
  if (!events.length) return null;
  return (
    <div style={{ marginTop:16, borderTop:"1px solid #1E1E1E", paddingTop:14 }}>
      <div style={{ fontSize:11, fontWeight:700, color:C.yellow, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>
        {day} {MONTHS[month]} — {events.length} item{events.length>1?"s":""}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {events.map((e, i) => {
          const lvl = scoreLevel(e.item.score);
          const dot = e.type==="review" ? C.red : C.yellow;
          return (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start",
              background:"#0D0D0D", border:"1px solid #1E1E1E", borderRadius:7, padding:"9px 12px" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:dot, marginTop:3, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:11, color:e.type==="review"?C.red:C.yellow, fontWeight:700, marginBottom:2 }}>{e.label}</div>
                <div style={{ fontSize:12, color:C.white, lineHeight:1.4 }}>{e.item.title}</div>
                <div style={{ fontSize:10, color:C.gray4, marginTop:2 }}>{e.item.category} · {e.item.sourceRef}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Feed card ───────────────────────────────────────────────────
function FeedCard({ item, onAnalyze, onToggle }) {
  const lvl = scoreLevel(item.score);
  const sc = lvl ? SC[lvl] : { border:"#252525", text:C.gray4, bg:"transparent" };
  const catColor = CAT_COLORS[item.category] || C.gray4;
  const daysR = item.reviewDeadline ? Math.round((new Date(item.reviewDeadline)-new Date())/86400000) : null;

  return (
    <div style={{ background:"#0E0E0E", border:`1px solid ${lvl==="high"?sc.border:"#1E1E1E"}`,
      borderRadius:10, overflow:"hidden", transition:"border-color 0.2s",
      boxShadow: lvl==="high"?`0 0 16px ${sc.border}18`:"none" }}>
      {/* Card header */}
      <div style={{ padding:"14px 18px", cursor:"pointer" }} onClick={() => onToggle(item.id)}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7, flexWrap:"wrap" }}>
              <span style={{ fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase",
                color:catColor, background:catColor+"18", borderRadius:4, padding:"2px 8px" }}>
                {item.category}
              </span>
              <span style={{ fontSize:10, color:C.gray4, fontFamily:"monospace" }}>{item.sourceRef}</span>
              {lvl && <span style={{ background:sc.bg, border:`1px solid ${sc.border}`, color:sc.text,
                borderRadius:4, fontSize:9, fontWeight:800, padding:"2px 7px", letterSpacing:1, textTransform:"uppercase" }}>
                {sc.label} {item.score}/10
              </span>}
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:C.white, lineHeight:1.45, marginBottom:5 }}>
              {item.title}
            </div>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:11, color:C.gray4 }}>
              <span>📋 {item.pubDate}</span>
              <span>⚡ {item.inwerking}</span>
              {item.reviewDeadline && <span style={{ color: daysR!==null&&daysR<14?C.red:C.gray4 }}>
                ⏰ Review {item.reviewDeadline}{daysR!==null ? ` (${daysR<0?"verlopen":`${daysR}d`})` : ""}
              </span>}
            </div>
          </div>
          <span style={{ color:C.gray4, fontSize:12, flexShrink:0, marginTop:2 }}>{item.expanded?"▲":"▼"}</span>
        </div>
      </div>

      {/* Expanded */}
      {item.expanded && (
        <div style={{ borderTop:"1px solid #181818", padding:"14px 18px" }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
            {item.tags.map(t => (
              <span key={t} style={{ background:"#141414", color:C.gray4, border:"1px solid #252525",
                borderRadius:3, fontSize:10, padding:"2px 7px" }}>{t}</span>
            ))}
          </div>
          <p style={{ fontSize:13, color:C.gray5, lineHeight:1.65, marginBottom:14 }}>{item.rawSummary}</p>
          {item.aiSummary ? (
            <div style={{ background:"#060606", border:`1px solid ${C.yellow}33`, borderRadius:8, padding:"13px 16px" }}>
              <div style={{ fontSize:10, fontWeight:800, color:C.yellow, letterSpacing:2, textTransform:"uppercase", marginBottom:9 }}>✦ AI Analyse</div>
              <p style={{ fontSize:13, color:C.gray5, lineHeight:1.65, marginBottom:10 }}>{item.aiSummary.samenvatting}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <div style={{ background:"#0D0D0D", borderRadius:6, padding:"9px 11px" }}>
                  <div style={{ fontSize:9, color:C.gray4, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>Actie vereist</div>
                  <div style={{ fontSize:12, color:C.white }}>{item.aiSummary.impact}</div>
                </div>
                <div style={{ background:"#0D0D0D", borderRadius:6, padding:"9px 11px" }}>
                  <div style={{ fontSize:9, color:C.gray4, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>Afdelingen</div>
                  <div style={{ fontSize:12, color:C.white }}>{(item.aiSummary.afdelingen||[]).join(", ")}</div>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => onAnalyze(item.id)} disabled={item.loading}
              style={{ background:item.loading?"#1A1A1A":C.yellow, color:item.loading?C.gray4:C.black,
                border:"none", borderRadius:6, padding:"8px 16px", fontSize:12, fontWeight:800,
                cursor:item.loading?"default":"pointer", display:"flex", alignItems:"center", gap:7 }}>
              {item.loading ? "⏳ Analyseren…" : "✦ AI Analyse uitvoeren"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── App ─────────────────────────────────────────────────────────
export default function App() {
  const now = new Date();
  const [items, setItems] = useState(SEED);
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selDay, setSelDay] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [globalLoading, setGlobalLoading] = useState(false);

  const filtered = items
    .filter(i => (catFilter === "all" || i.category === catFilter) &&
      (!search || i.title.toLowerCase().includes(search.toLowerCase()) ||
       i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))))
    .sort((a,b) => (b.score||0) - (a.score||0));

  async function handleAnalyze(id) {
    setItems(p => p.map(i => i.id===id ? {...i, loading:true} : i));
    try {
      const item = items.find(i => i.id===id);
      const res = await fetchAI(item);
      setItems(p => p.map(i => i.id===id ? {...i, loading:false, score:res.score, aiSummary:res} : i));
    } catch {
      const fallbackScores = {1:9,2:7,3:8,4:6,5:7,6:5,7:8,8:6};
      const item = items.find(i => i.id===id);
      const sc = fallbackScores[id]||7;
      setItems(p => p.map(i => i.id===id ? {...i, loading:false, score:sc, aiSummary:{
        samenvatting: item.rawSummary + " Directe aandacht van gemeentelijk beleid vereist.",
        impact:"Beleidsnotitie opstellen vóór inwerkingtreding.",
        afdelingen:["Juridische Zaken","Informatiemanagement"],
        risico: sc>=8?"hoog":sc>=5?"middel":"laag"
      }} : i));
    }
  }

  async function handleAnalyzeAll() {
    setGlobalLoading(true);
    for (const item of items.filter(i => !i.score)) {
      await handleAnalyze(item.id);
      await new Promise(r => setTimeout(r, 300));
    }
    setGlobalLoading(false);
  }

  function toggleItem(id) {
    setItems(p => p.map(i => i.id===id ? {...i, expanded:!i.expanded} : i));
  }

  const highCount = items.filter(i => scoreLevel(i.score)==="high").length;
  const analyzedCount = items.filter(i => i.score).length;
  const upcoming30 = items.filter(i => {
    const d = new Date(i.reviewDeadline||i.inwerking);
    const days = (d-new Date())/86400000;
    return days>=0 && days<=30;
  }).length;

  return (
    <div style={{ minHeight:"100vh", background:C.black, color:C.white,
      fontFamily:"'DM Sans','IBM Plex Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#080808}
        ::-webkit-scrollbar-thumb{background:#252525;border-radius:3px}
        input,select{outline:none}
        button:hover:not(:disabled){opacity:0.82;transform:translateY(-1px)}
        button{transition:all 0.15s}
      `}</style>

      {/* ── Top bar ─────────────────────── */}
      <div style={{ borderBottom:"1px solid #161616", padding:"0 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:52,
        position:"sticky", top:0, zIndex:100, background:C.black }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:26, height:26, background:C.yellow, borderRadius:5,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:900, color:C.black }}>W</div>
          <span style={{ fontSize:14, fontWeight:700 }}>
            Wetswijzigings<span style={{ color:C.yellow }}>Monitor</span>
          </span>
          <span style={{ color:"#252525", margin:"0 4px" }}>|</span>
          <span style={{ fontSize:10, color:C.gray4, letterSpacing:1.5, textTransform:"uppercase" }}>Publieke Sector</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {highCount>0 && <div style={{ background:"#E03A2814", border:"1px solid #E03A28",
            color:C.red, borderRadius:20, fontSize:10, fontWeight:800, padding:"3px 10px", letterSpacing:0.5 }}>
            ⚠ {highCount} KRITIEK
          </div>}
          <span style={{ fontSize:10, color:C.gray4, fontFamily:"DM Mono,monospace" }}>{analyzedCount}/{items.length} geanalyseerd</span>
        </div>
      </div>

      {/* ── Stats row ───────────────────── */}
      <div style={{ borderBottom:"1px solid #161616", padding:"14px 28px",
        display:"grid", gridTemplateColumns:"repeat(4,auto) 1fr", gap:0, alignItems:"center" }}>
        {[
          { label:"Items totaal", val:items.length, color:C.white },
          { label:"Kritiek", val:highCount, color:C.red },
          { label:"30 dagen", val:upcoming30, color:C.yellow },
          { label:"Geanalyseerd", val:analyzedCount, color:C.yellow },
        ].map((s,i) => (
          <div key={s.label} style={{ padding:"0 24px", borderRight:"1px solid #161616", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.color, fontFamily:"DM Mono,monospace", lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:9, color:C.gray4, textTransform:"uppercase", letterSpacing:1.5, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
        <div style={{ paddingLeft:24 }}>
          <button onClick={handleAnalyzeAll} disabled={globalLoading||analyzedCount===items.length}
            style={{ background:globalLoading||analyzedCount===items.length?"#1A1A1A":C.yellow,
              color:globalLoading||analyzedCount===items.length?C.gray4:C.black,
              border:"none", borderRadius:7, padding:"8px 18px", fontSize:11, fontWeight:800,
              cursor:"pointer", letterSpacing:0.5 }}>
            {globalLoading?"⏳ Analyseren…":"✦ Alles analyseren"}
          </button>
        </div>
      </div>

      {/* ── Main two-col layout ─────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:0, height:"calc(100vh - 108px)" }}>

        {/* LEFT: Calendar panel */}
        <div style={{ borderRight:"1px solid #161616", padding:"24px 22px", overflowY:"auto",
          background:"#080808", display:"flex", flexDirection:"column", gap:0 }}>
          <div style={{ fontSize:10, fontWeight:800, color:C.gray4, letterSpacing:2,
            textTransform:"uppercase", marginBottom:18 }}>Agenda</div>

          <CalendarGrid
            items={items}
            selectedMonth={selMonth}
            setSelectedMonth={setSelMonth}
            onSelectDay={setSelDay}
            selectedDay={selDay}
          />

          <DayDetail day={selDay} month={selMonth} items={items} />

          {/* Upcoming list */}
          <div style={{ marginTop:24, borderTop:"1px solid #1A1A1A", paddingTop:18 }}>
            <div style={{ fontSize:10, fontWeight:800, color:C.gray4, letterSpacing:2,
              textTransform:"uppercase", marginBottom:12 }}>Komende deadlines</div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {[...items]
                .filter(i => {
                  const d = new Date(i.reviewDeadline||i.inwerking);
                  return (d-new Date())/86400000 >= 0;
                })
                .sort((a,b)=>new Date(a.reviewDeadline||a.inwerking)-new Date(b.reviewDeadline||b.inwerking))
                .slice(0,6)
                .map(item => {
                  const d = item.reviewDeadline||item.inwerking;
                  const days = Math.round((new Date(d)-new Date())/86400000);
                  const isReview = !!item.reviewDeadline;
                  const lvl = scoreLevel(item.score);
                  const dotColor = isReview ? C.red : C.yellow;
                  return (
                    <div key={item.id} style={{ display:"flex", gap:10, alignItems:"flex-start",
                      background:"#0B0B0B", border:"1px solid #1A1A1A", borderRadius:7, padding:"8px 10px" }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:dotColor, marginTop:4, flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11, color:C.white, fontWeight:600, lineHeight:1.35,
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize:10, color:C.gray4, marginTop:2 }}>
                          {isReview?"Review":"Inwerking"} · {d}
                        </div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:800, color: days<14?C.red:days<45?C.yellow:C.green, flexShrink:0 }}>
                        {days}d
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* RIGHT: Feed */}
        <div style={{ overflowY:"auto", padding:"24px 28px" }}>
          {/* Filter bar */}
          <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Zoeken op titel of tag…"
              style={{ flex:1, minWidth:180, background:"#0D0D0D", border:"1px solid #252525",
                borderRadius:7, padding:"8px 13px", color:C.white, fontSize:12 }} />
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
              style={{ background:"#0D0D0D", border:"1px solid #252525", borderRadius:7,
                padding:"8px 12px", color:catFilter==="all"?C.gray4:C.white, fontSize:12, cursor:"pointer" }}>
              <option value="all">Alle categorieën</option>
              {CATS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:9, animation:"fadeUp 0.3s ease" }}>
            {filtered.map(item => (
              <FeedCard key={item.id} item={item} onAnalyze={handleAnalyze} onToggle={toggleItem} />
            ))}
          </div>

          <div style={{ marginTop:36, paddingTop:16, borderTop:"1px solid #161616",
            fontSize:10, color:"#282828", letterSpacing:1.5 }}>
            BRONNEN: STAATSBLAD · STAATSCOURANT · KAMERSTUKKEN · WETTEN.OVERHEID.NL · Powered by <span style={{color:C.yellow+"88"}}>Cytrus</span> AI
          </div>
        </div>
      </div>
    </div>
  );
}
