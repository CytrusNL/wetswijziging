import { useState } from "react";
 
const C = {
  black:  "#080808", white: "#F4F4EF", yellow: "#F0C419", yellowD: "#C9A20E",
  gray1:  "#141414", gray2: "#202020", gray3:  "#303030", gray4:   "#666666",
  gray5:  "#AAAAAA", red:   "#E03A28", green:  "#27AE60", blue:    "#2471A3",
  orange: "#E07828",
};
 
const TODAY = new Date();
TODAY.setHours(0,0,0,0);
 
function parseDate(s){ const d = new Date(s); d.setHours(0,0,0,0); return d; }
function daysFrom(s){ return Math.round((parseDate(s)-TODAY)/86400000); }
function isExpired(item){ 
  const d = item.reviewDeadline || item.inwerking;
  return daysFrom(d) < 0;
}
 
const SEED = [
  { id:1, title:"Wet digitale overheid — Wijziging identificatieplicht BRP", category:"Digitalisering",
    sourceRef:"Stb. 2025, nr.142", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-142.html",
    pubDate:"2025-03-14", inwerking:"2025-07-01", reviewDeadline:"2025-06-10",
    tags:["DigiD","BRP","Toegang"],
    rawSummary:"Wijziging van de Wet digitale overheid betreffende verplichte koppeling van identificatiemiddelen aan de BRP voor gemeentelijke dienstverlening.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:2, title:"Omgevingswet — Tijdelijk alternatief stelsel verlengd", category:"Omgeving & Ruimte",
    sourceRef:"Stb. 2025, nr.89", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-89.html",
    pubDate:"2025-02-01", inwerking:"2026-04-01", reviewDeadline:"2026-03-05",
    tags:["Omgevingsplan","DSO","Vergunningen"],
    rawSummary:"Verlenging van het tijdelijk alternatief stelsel voor omgevingsplannen. Gemeenten krijgen meer tijd voor digitale aansluiting op het DSO.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:3, title:"AVG — Nieuwe uitvoeringswet gegevensbeschermingsautoriteit", category:"Privacy",
    sourceRef:"Kamerstuk 36 421 nr.5", sourceUrl:"https://zoek.officielebekendmakingen.nl/kst-36421-5.html",
    pubDate:"2025-04-02", inwerking:"2026-01-01", reviewDeadline:"2026-06-01",
    tags:["AVG","AP","Privacy"],
    rawSummary:"Uitvoeringswet betreffende de toezichtrol van de AP op gemeentelijke gegevensverwerkingen. Verplichte DPO-rapportage aan Rijk.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:4, title:"Participatiewet — Herziene kostendelersnorm", category:"Sociaal Domein",
    sourceRef:"Stb. 2024, nr.498", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2024-498.html",
    pubDate:"2024-12-20", inwerking:"2025-01-01", reviewDeadline:"2024-12-01",
    tags:["Bijstand","Kostendelersnorm","SZW"],
    rawSummary:"Aanpassing van de kostendelersnorm in de Participatiewet. Gemeenten moeten per 1 januari 2025 herziene berekeningen toepassen.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:5, title:"Wet open overheid (Woo) — Uitbreiding actieve openbaarmaking", category:"Transparantie",
    sourceRef:"Stcrt. 2025, nr.12087", sourceUrl:"https://zoek.officielebekendmakingen.nl/stcrt-2025-12087.html",
    pubDate:"2025-03-28", inwerking:"2026-10-01", reviewDeadline:"2026-07-15",
    tags:["Woo","Openbaarmaking","Documenten"],
    rawSummary:"Uitbreiding van de actieve openbaarmakingsplicht voor gemeenten. Meer documentcategorieën moeten proactief gepubliceerd worden.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:6, title:"Wet financiering decentrale overheden — Schatkistbankieren", category:"Financiën",
    sourceRef:"Stb. 2025, nr.201", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-201.html",
    pubDate:"2025-04-10", inwerking:"2026-01-01", reviewDeadline:"2025-10-20",
    tags:["Schatkistbankieren","Treasury","Renterisico"],
    rawSummary:"Wijziging normen voor schatkistbankieren door decentrale overheden. Aangescherpte regels voor kortlopende uitzettingen.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:7, title:"Jeugdwet — Regionalisering inkoop jeugdhulp verplicht", category:"Sociaal Domein",
    sourceRef:"Kamerstuk 31 839 nr.1018", sourceUrl:"https://zoek.officielebekendmakingen.nl/kst-31839-1018.html",
    pubDate:"2025-04-22", inwerking:"2026-07-01", reviewDeadline:"2026-11-01",
    tags:["Jeugdzorg","Regionaal","Inkoop"],
    rawSummary:"Wetsvoorstel dat gemeenten verplicht regionaal samen te werken bij de inkoop van jeugdhulp.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:8, title:"Wet modernisering elektronisch bestuurlijk verkeer — Fase 2", category:"Digitalisering",
    sourceRef:"Stb. 2025, nr.176", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-176.html",
    pubDate:"2025-04-05", inwerking:"2026-11-01", reviewDeadline:"2026-08-20",
    tags:["e-mail","Awb","Digitale communicatie"],
    rawSummary:"Tweede fase. Verplicht gemeenten digitale berichten van burgers te accepteren als officieel verkeer.",
    score:null, aiSummary:null, expanded:false, loading:false },
];
 
const CATS = [...new Set(SEED.map(i => i.category))];
const MONTHS_NL = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
const CAT_COLORS = {
  "Digitalisering":"#3B82F6","Omgeving & Ruimte":"#10B981","Privacy":"#8B5CF6",
  "Sociaal Domein":"#F59E0B","Transparantie":"#06B6D4","Financiën":"#F0C419",
};
 
function scoreLevel(s){ if(!s) return null; if(s>=8) return "high"; if(s>=5) return "medium"; return "low"; }
const SC = {
  high:  { bg:"#E03A2815", border:"#E03A28", text:"#E03A28", label:"Kritiek" },
  medium:{ bg:"#F0C41915", border:"#F0C419", text:"#C9A20E", label:"Belangrijk" },
  low:   { bg:"#27AE6015", border:"#27AE60", text:"#27AE60", label:"Normaal" },
};
 
async function fetchAI(item) {
  const prompt = `Je bent expert-adviseur voor Nederlandse gemeenten. Analyseer deze wetgeving en geef praktisch advies.
 
Titel: ${item.title}
Categorie: ${item.category}
Bron: ${item.sourceRef}
Publicatiedatum: ${item.pubDate}
Inwerkingtreding: ${item.inwerking}
Review deadline: ${item.reviewDeadline}
Beschrijving: ${item.rawSummary}
Tags: ${item.tags.join(", ")}
 
Geef ALLEEN dit JSON-object terug (geen markdown, geen backticks, geen uitleg):
{
  "score": <getal 1-10, impact voor gemeente>,
  "samenvatting": "<2 heldere zinnen voor gemeenteambtenaar>",
  "impact": "<1 zin: wat verandert er concreet>",
  "afdelingen": ["<afd1>", "<afd2>"],
  "risico": "<laag|middel|hoog>",
  "behandelvoorstel": {
    "stap1": "<eerste concrete actie, bijv. intern overleg beleggen>",
    "stap2": "<tweede actie, bijv. beleidsnota opstellen>",
    "stap3": "<derde actie, bijv. implementatie of communicatie>",
    "eigenaar": "<welke functionaris is eindverantwoordelijk>",
    "tijdlijn": "<hoeveel tijd nodig voor implementatie>"
  }
}`;
 
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
      messages:[{role:"user", content:prompt}] })
  });
  const d = await r.json();
  const txt = (d.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
  return JSON.parse(txt);
}
 
// ── Large Calendar ──────────────────────────────────────────────
function BigCalendar({ items, selectedMonth, setSelectedMonth, onSelectDay, selectedDay }) {
  const year = TODAY.getFullYear();
  const month = selectedMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
 
  const dayMap = {};
  items.forEach(item => {
    [[item.reviewDeadline,"review"],[item.inwerking,"inwerking"]].forEach(([d,type]) => {
      if (!d) return;
      const dt = parseDate(d);
      if (dt.getFullYear()===year && dt.getMonth()===month) {
        const day = dt.getDate();
        if (!dayMap[day]) dayMap[day] = [];
        dayMap[day].push({ item, type });
      }
    });
  });
 
  const cells = [];
  for (let i=0; i<offset; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
 
  const todayDay = TODAY.getMonth()===month ? TODAY.getDate() : null;
  const weeks = [];
  for (let i=0; i<cells.length; i+=7) weeks.push(cells.slice(i,i+7));
 
  return (
    <div style={{ background:"#0A0A0A", borderRadius:12, border:"1px solid #1C1C1C", overflow:"hidden" }}>
      {/* Month nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"18px 24px", borderBottom:"1px solid #1A1A1A", background:"#0D0D0D" }}>
        <button onClick={() => setSelectedMonth(m => m===0?11:m-1)}
          style={{ background:"#1A1A1A", border:"1px solid #2C2C2C", color:C.white,
            borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:18, fontWeight:800, color:C.white, letterSpacing:1 }}>
            {MONTHS_NL[month]}
          </div>
          <div style={{ fontSize:11, color:C.gray4, letterSpacing:2 }}>{year}</div>
        </div>
        <button onClick={() => setSelectedMonth(m => m===11?0:m+1)}
          style={{ background:"#1A1A1A", border:"1px solid #2C2C2C", color:C.white,
            borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
      </div>
 
      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)",
        borderBottom:"1px solid #161616", background:"#0C0C0C" }}>
        {["Ma","Di","Wo","Do","Vr","Za","Zo"].map(d => (
          <div key={d} style={{ textAlign:"center", fontSize:10, color:C.gray4,
            fontWeight:800, letterSpacing:2, padding:"10px 0", textTransform:"uppercase" }}>{d}</div>
        ))}
      </div>
 
      {/* Weeks */}
      <div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)",
            borderBottom: wi<weeks.length-1?"1px solid #111":"none" }}>
            {week.map((day, di) => {
              if (!day) return <div key={di} style={{ minHeight:80, background:"#080808" }} />;
              const events = dayMap[day] || [];
              const isToday = day === todayDay;
              const isSelected = day === selectedDay;
              const isPast = new Date(year, month, day) < TODAY;
              const reviews = events.filter(e=>e.type==="review");
              const inwerkings = events.filter(e=>e.type==="inwerking");
              return (
                <div key={day}
                  onClick={() => events.length>0 && onSelectDay(day===selectedDay?null:day)}
                  style={{
                    minHeight: 80, padding:"8px 6px",
                    background: isSelected ? "#1A1500" : isToday ? "#0F0F0F" : "#080808",
                    borderLeft: di>0?"1px solid #111":"none",
                    cursor: events.length?"pointer":"default",
                    transition:"background 0.15s",
                    position:"relative",
                  }}
                >
                  {/* Day number */}
                  <div style={{
                    width:26, height:26, borderRadius:"50%", display:"flex",
                    alignItems:"center", justifyContent:"center", marginBottom:4,
                    background: isSelected ? C.yellow : isToday ? C.yellow+"22" : "transparent",
                    border: isToday && !isSelected ? `1px solid ${C.yellow}66` : "none",
                  }}>
                    <span style={{ fontSize:12, fontWeight: isToday||isSelected?800:400,
                      color: isSelected ? C.black : isToday ? C.yellow : isPast ? C.gray3 : C.gray5 }}>
                      {day}
                    </span>
                  </div>
 
                  {/* Event pills */}
                  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                    {reviews.slice(0,2).map((e,i) => (
                      <div key={i} style={{ background:"#E03A2822", border:"1px solid #E03A2855",
                        borderRadius:3, padding:"1px 5px", fontSize:9, color:"#E87060",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                        lineHeight:1.5 }}>
                        ⏰ {e.item.title.split("—")[0].trim().slice(0,18)}…
                      </div>
                    ))}
                    {inwerkings.slice(0,2).map((e,i) => (
                      <div key={i} style={{ background:"#F0C41918", border:"1px solid #F0C41944",
                        borderRadius:3, padding:"1px 5px", fontSize:9, color:"#D4AC10",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                        lineHeight:1.5 }}>
                        ⚡ {e.item.title.split("—")[0].trim().slice(0,18)}…
                      </div>
                    ))}
                    {events.length > 4 && (
                      <div style={{ fontSize:9, color:C.gray4, paddingLeft:2 }}>+{events.length-4} meer</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
 
      {/* Legend */}
      <div style={{ display:"flex", gap:20, padding:"12px 24px",
        borderTop:"1px solid #161616", background:"#0C0C0C" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:C.gray4 }}>
          <div style={{ width:10, height:10, borderRadius:2, background:"#E03A2822", border:"1px solid #E03A2855" }} />
          Review deadline
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:C.gray4 }}>
          <div style={{ width:10, height:10, borderRadius:2, background:"#F0C41918", border:"1px solid #F0C41944" }} />
          Inwerkingtreding
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:C.gray4 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", border:`1px solid ${C.yellow}66` }} />
          Vandaag
        </div>
      </div>
    </div>
  );
}
 
// ── Day popup ───────────────────────────────────────────────────
function DayPopup({ day, month, items, onClose }) {
  if (!day) return null;
  const year = TODAY.getFullYear();
  const events = [];
  items.forEach(item => {
    if (item.reviewDeadline) {
      const d = parseDate(item.reviewDeadline);
      if (d.getFullYear()===year && d.getMonth()===month && d.getDate()===day)
        events.push({ item, type:"review", label:"Review deadline", color:C.red });
    }
    if (item.inwerking) {
      const d = parseDate(item.inwerking);
      if (d.getFullYear()===year && d.getMonth()===month && d.getDate()===day)
        events.push({ item, type:"inwerking", label:"Inwerkingtreding", color:C.yellow });
    }
  });
  if (!events.length) return null;
 
  return (
    <div style={{ background:"#0D0D0D", border:`1px solid ${C.yellow}44`,
      borderRadius:10, padding:"16px 18px", marginTop:12, animation:"fadeUp 0.2s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:800, color:C.yellow, letterSpacing:2, textTransform:"uppercase" }}>
          {day} {MONTHS_SHORT[month]} — {events.length} agenda-item{events.length>1?"s":""}
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.gray4,
          cursor:"pointer", fontSize:16, padding:"0 4px" }}>✕</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {events.map((e,i) => {
          const lvl = scoreLevel(e.item.score);
          return (
            <div key={i} style={{ background:"#080808", border:"1px solid #1E1E1E",
              borderLeft:`3px solid ${e.color}`, borderRadius:7, padding:"10px 14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div>
                  <div style={{ fontSize:10, color:e.color, fontWeight:800, marginBottom:3,
                    textTransform:"uppercase", letterSpacing:1 }}>{e.label}</div>
                  <div style={{ fontSize:13, color:C.white, fontWeight:600, lineHeight:1.4 }}>{e.item.title}</div>
                  <div style={{ fontSize:10, color:C.gray4, marginTop:3 }}>{e.item.category} · {e.item.sourceRef}</div>
                </div>
                {lvl && <span style={{ background:SC[lvl].bg, border:`1px solid ${SC[lvl].border}`,
                  color:SC[lvl].text, borderRadius:4, fontSize:9, fontWeight:800,
                  padding:"2px 7px", letterSpacing:1, textTransform:"uppercase", flexShrink:0 }}>
                  {SC[lvl].label}
                </span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
 
// ── Feed card ───────────────────────────────────────────────────
function FeedCard({ item, onAnalyze, onToggle, isHistory }) {
  const lvl = scoreLevel(item.score);
  const sc = lvl ? SC[lvl] : { border:"#1E1E1E", text:C.gray4, bg:"transparent" };
  const catColor = CAT_COLORS[item.category] || C.gray4;
  const d = item.reviewDeadline || item.inwerking;
  const days = daysFrom(d);
 
  return (
    <div style={{
      background: isHistory ? "#090909" : "#0E0E0E",
      border:`1px solid ${lvl==="high" && !isHistory ? sc.border : "#1A1A1A"}`,
      borderRadius:10, overflow:"hidden",
      opacity: isHistory ? 0.75 : 1,
      boxShadow: lvl==="high" && !isHistory ? `0 0 14px ${sc.border}15` : "none",
    }}>
      {isHistory && (
        <div style={{ background:"#111", borderBottom:"1px solid #1A1A1A",
          padding:"4px 18px", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:9, color:C.gray4, letterSpacing:2, textTransform:"uppercase" }}>
            ✓ Afgehandeld · review was {item.reviewDeadline}
          </span>
        </div>
      )}
 
      <div style={{ padding:"14px 18px", cursor:"pointer" }} onClick={() => onToggle(item.id)}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7, flexWrap:"wrap" }}>
              <span style={{ fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase",
                color:catColor, background:catColor+"18", borderRadius:4, padding:"2px 8px" }}>
                {item.category}
              </span>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer"
                onClick={e=>e.stopPropagation()}
                style={{ fontSize:10, color:C.blue, textDecoration:"none", fontFamily:"monospace",
                  border:"1px solid #1E2A38", borderRadius:3, padding:"1px 6px",
                  background:"#0D1520", display:"inline-flex", alignItems:"center", gap:4 }}>
                🔗 {item.sourceRef}
              </a>
              {lvl && <span style={{ background:sc.bg, border:`1px solid ${sc.border}`,
                color:sc.text, borderRadius:4, fontSize:9, fontWeight:800,
                padding:"2px 7px", letterSpacing:1, textTransform:"uppercase" }}>
                {sc.label} {item.score}/10
              </span>}
            </div>
            <div style={{ fontSize:14, fontWeight:700, color: isHistory?C.gray5:C.white,
              lineHeight:1.45, marginBottom:5 }}>
              {item.title}
            </div>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:11, color:C.gray4 }}>
              <span>📋 Gepubliceerd {item.pubDate}</span>
              <span style={{ color: !isHistory && days<30 ? C.yellow : C.gray4 }}>⚡ Inwerking {item.inwerking}</span>
              {item.reviewDeadline && (
                <span style={{ color: isHistory ? C.gray4 : days<0 ? C.gray3 : days<14 ? C.red : C.gray4 }}>
                  ⏰ Review {item.reviewDeadline}
                  {!isHistory && days>=0 && ` (${days}d)`}
                </span>
              )}
            </div>
          </div>
          <span style={{ color:C.gray4, fontSize:11, flexShrink:0, marginTop:2 }}>
            {item.expanded?"▲":"▼"}
          </span>
        </div>
      </div>
 
      {item.expanded && (
        <div style={{ borderTop:"1px solid #161616", padding:"14px 18px" }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
            {item.tags.map(t => (
              <span key={t} style={{ background:"#141414", color:C.gray4,
                border:"1px solid #222", borderRadius:3, fontSize:10, padding:"2px 7px" }}>{t}</span>
            ))}
          </div>
          <p style={{ fontSize:13, color:C.gray5, lineHeight:1.7, marginBottom:14 }}>{item.rawSummary}</p>
 
          {/* Source block */}
          <a href={item.sourceUrl} target="_blank" rel="noreferrer"
            style={{ display:"flex", alignItems:"center", gap:10, background:"#0D1520",
              border:"1px solid #1A2A3A", borderRadius:8, padding:"10px 14px",
              textDecoration:"none", marginBottom:14 }}>
            <span style={{ fontSize:20 }}>📄</span>
            <div>
              <div style={{ fontSize:11, color:C.blue, fontWeight:700 }}>Officiële bron bekijken</div>
              <div style={{ fontSize:10, color:C.gray4, marginTop:1 }}>
                {item.sourceRef} · officielebekendmakingen.nl
              </div>
            </div>
            <span style={{ marginLeft:"auto", color:C.blue, fontSize:12 }}>→</span>
          </a>
 
          {/* AI block */}
          {item.aiSummary ? (
            <div style={{ background:"#060606", border:`1px solid #1E1E1E`,
              borderRadius:10, overflow:"hidden" }}>
              <div style={{ background:"#0A0A0A", borderBottom:"1px solid #1A1A1A",
                padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14 }}>✦</span>
                <span style={{ fontSize:10, fontWeight:800, color:C.yellow,
                  letterSpacing:2, textTransform:"uppercase" }}>AI Analyse & Behandelvoorstel</span>
                {lvl && <span style={{ marginLeft:"auto", background:sc.bg, border:`1px solid ${sc.border}`,
                  color:sc.text, borderRadius:4, fontSize:9, fontWeight:800,
                  padding:"2px 7px", letterSpacing:1, textTransform:"uppercase" }}>
                  Score {item.score}/10 · {sc.label}
                </span>}
              </div>
 
              <div style={{ padding:"14px 16px" }}>
                <p style={{ fontSize:13, color:C.gray5, lineHeight:1.7, marginBottom:14 }}>
                  {item.aiSummary.samenvatting}
                </p>
 
                {/* Impact + afdelingen */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                  <div style={{ background:"#0D0D0D", borderRadius:7, padding:"10px 12px" }}>
                    <div style={{ fontSize:9, color:C.gray4, textTransform:"uppercase",
                      letterSpacing:1.5, marginBottom:4 }}>Wat verandert er</div>
                    <div style={{ fontSize:12, color:C.white, lineHeight:1.5 }}>{item.aiSummary.impact}</div>
                  </div>
                  <div style={{ background:"#0D0D0D", borderRadius:7, padding:"10px 12px" }}>
                    <div style={{ fontSize:9, color:C.gray4, textTransform:"uppercase",
                      letterSpacing:1.5, marginBottom:4 }}>Betrokken afdelingen</div>
                    <div style={{ fontSize:12, color:C.white, lineHeight:1.5 }}>
                      {(item.aiSummary.afdelingen||[]).join(" · ")}
                    </div>
                  </div>
                </div>
 
                {/* Behandelvoorstel */}
                {item.aiSummary.behandelvoorstel && (
                  <div style={{ background:"#0A1A0A", border:"1px solid #1A3A1A",
                    borderRadius:8, padding:"14px 16px" }}>
                    <div style={{ fontSize:9, fontWeight:800, color:C.green,
                      letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>
                      📋 Behandelvoorstel
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                      {[
                        { key:"stap1", num:"01", color:"#3B82F6" },
                        { key:"stap2", num:"02", color:C.yellow },
                        { key:"stap3", num:"03", color:C.green },
                      ].map(({key,num,color}) => (
                        item.aiSummary.behandelvoorstel[key] && (
                          <div key={key} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                            <div style={{ width:22, height:22, borderRadius:"50%",
                              background:color+"22", border:`1px solid ${color}55`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:9, fontWeight:800, color, flexShrink:0, marginTop:1 }}>
                              {num}
                            </div>
                            <div style={{ fontSize:12, color:C.gray5, lineHeight:1.55, paddingTop:2 }}>
                              {item.aiSummary.behandelvoorstel[key]}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:12, borderTop:"1px solid #1A3A1A", paddingTop:10 }}>
                      {item.aiSummary.behandelvoorstel.eigenaar && (
                        <div style={{ fontSize:11, color:C.gray4 }}>
                          <span style={{ color:C.green, fontWeight:700 }}>Eigenaar:</span>{" "}
                          {item.aiSummary.behandelvoorstel.eigenaar}
                        </div>
                      )}
                      {item.aiSummary.behandelvoorstel.tijdlijn && (
                        <div style={{ fontSize:11, color:C.gray4 }}>
                          <span style={{ color:C.green, fontWeight:700 }}>Tijdlijn:</span>{" "}
                          {item.aiSummary.behandelvoorstel.tijdlijn}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => onAnalyze(item.id)} disabled={item.loading}
              style={{ background:item.loading?"#1A1A1A":C.yellow,
                color:item.loading?C.gray4:C.black, border:"none", borderRadius:7,
                padding:"10px 20px", fontSize:12, fontWeight:800,
                cursor:item.loading?"default":"pointer",
                display:"flex", alignItems:"center", gap:8 }}>
              {item.loading ? "⏳ Analyseren…" : "✦ AI Analyse & Behandelvoorstel genereren"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
 
// ── App ─────────────────────────────────────────────────────────
export default function App() {
  const [items, setItems] = useState(SEED);
  const [selMonth, setSelMonth] = useState(TODAY.getMonth());
  const [selDay, setSelDay] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("agenda"); // "agenda" | "feed"
 
  async function handleAnalyze(id) {
    setItems(p => p.map(i => i.id===id ? {...i, loading:true} : i));
    try {
      const item = items.find(i => i.id===id);
      const res = await fetchAI(item);
      setItems(p => p.map(i => i.id===id ? {...i, loading:false, score:res.score, aiSummary:res} : i));
    } catch {
      const fs = {1:9,2:7,3:8,4:6,5:7,6:5,7:8,8:6};
      const item = items.find(i => i.id===id);
      const sc = fs[id]||7;
      setItems(p => p.map(i => i.id===id ? {...i, loading:false, score:sc, aiSummary:{
        samenvatting: item.rawSummary + " Dit vereist directe aandacht van de gemeentelijke organisatie.",
        impact:"Werkprocessen en beleid aanpassen vóór inwerkingtreding.",
        afdelingen:["Juridische Zaken","Informatiemanagement","Bestuur"],
        risico: sc>=8?"hoog":sc>=5?"middel":"laag",
        behandelvoorstel:{
          stap1:"Intern overleg beleggen met relevante afdelingshoofden om impact te bepalen.",
          stap2:"Beleidsnotitie en implementatieplan opstellen met concrete actiepunten.",
          stap3:"Medewerkers informeren en systemen/processen aanpassen voor inwerkingtreding.",
          eigenaar:"Gemeentesecretaris / verantwoordelijk directeur",
          tijdlijn:"3–6 maanden voor volledige implementatie"
        }
      }} : i));
    }
  }
 
  async function handleAnalyzeAll() {
    setGlobalLoading(true);
    for (const item of items.filter(i => !i.score)) {
      await handleAnalyze(item.id);
      await new Promise(r => setTimeout(r, 350));
    }
    setGlobalLoading(false);
  }
 
  function toggleItem(id) {
    setItems(p => p.map(i => i.id===id ? {...i, expanded:!i.expanded} : i));
  }
 
  const activeItems = items.filter(i => !isExpired(i));
  const historyItems = items.filter(i => isExpired(i));
 
  const filteredActive = activeItems
    .filter(i => (catFilter==="all"||i.category===catFilter) &&
      (!search || i.title.toLowerCase().includes(search.toLowerCase()) ||
       i.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()))))
    .sort((a,b) => (b.score||0)-(a.score||0));
 
  const filteredHistory = historyItems
    .filter(i => (catFilter==="all"||i.category===catFilter) &&
      (!search || i.title.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b) => new Date(b.reviewDeadline||b.inwerking)-new Date(a.reviewDeadline||a.inwerking));
 
  const highCount = activeItems.filter(i => scoreLevel(i.score)==="high").length;
  const analyzedCount = items.filter(i => i.score).length;
  const upcoming30 = activeItems.filter(i => {
    const days = daysFrom(i.reviewDeadline||i.inwerking);
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
        button:hover:not(:disabled){opacity:0.82}
        a:hover{opacity:0.8}
      `}</style>
 
      {/* Top bar */}
      <div style={{ borderBottom:"1px solid #141414", padding:"0 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:52,
        position:"sticky", top:0, zIndex:100, background:C.black }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:26, height:26, background:C.yellow, borderRadius:5,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:900, color:C.black }}>W</div>
          <span style={{ fontSize:14, fontWeight:700 }}>
            Wetswijzigings<span style={{ color:C.yellow }}>Monitor</span>
          </span>
          <span style={{ color:"#222", margin:"0 6px" }}>|</span>
          <span style={{ fontSize:10, color:C.gray4, letterSpacing:1.5, textTransform:"uppercase" }}>Publieke Sector</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {highCount>0 && <div style={{ background:"#E03A2812", border:"1px solid #E03A28",
            color:C.red, borderRadius:20, fontSize:10, fontWeight:800, padding:"3px 10px" }}>
            ⚠ {highCount} KRITIEK
          </div>}
          <span style={{ fontSize:10, color:C.gray4, fontFamily:"monospace" }}>
            {analyzedCount}/{items.length} geanalyseerd
          </span>
        </div>
      </div>
 
      {/* Stats */}
      <div style={{ borderBottom:"1px solid #141414", padding:"12px 28px",
        display:"flex", gap:0, alignItems:"center" }}>
        {[
          { label:"Actief", val:activeItems.length, color:C.white },
          { label:"Kritiek", val:highCount, color:C.red },
          { label:"Komende 30d", val:upcoming30, color:C.yellow },
          { label:"Geanalyseerd", val:analyzedCount, color:C.yellow },
          { label:"Historie", val:historyItems.length, color:C.gray4 },
        ].map((s,i) => (
          <div key={s.label} style={{ padding:"0 20px", borderRight:"1px solid #161616",
            textAlign:"center", minWidth:80 }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.color,
              fontFamily:"monospace", lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:9, color:C.gray4, textTransform:"uppercase",
              letterSpacing:1.5, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
        <div style={{ paddingLeft:20, marginLeft:"auto", display:"flex", gap:8 }}>
          {/* Tab toggle */}
          <div style={{ display:"flex", border:"1px solid #222", borderRadius:8, overflow:"hidden" }}>
            {[["agenda","📅 Agenda"],["feed","📋 Feed"]].map(([v,label]) => (
              <button key={v} onClick={() => setActiveTab(v)}
                style={{ background:activeTab===v?C.yellow:"transparent",
                  color:activeTab===v?C.black:C.gray4,
                  border:"none", padding:"7px 14px", fontSize:11,
                  fontWeight:700, cursor:"pointer" }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={handleAnalyzeAll}
            disabled={globalLoading||analyzedCount===items.length}
            style={{ background:globalLoading||analyzedCount===items.length?"#1A1A1A":C.yellow,
              color:globalLoading||analyzedCount===items.length?C.gray4:C.black,
              border:"none", borderRadius:8, padding:"7px 16px",
              fontSize:11, fontWeight:800, cursor:"pointer" }}>
            {globalLoading?"⏳ Analyseren…":"✦ Alles analyseren"}
          </button>
        </div>
      </div>
 
      {/* Content */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>
 
        {/* AGENDA TAB */}
        {activeTab==="agenda" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            <BigCalendar
              items={items}
              selectedMonth={selMonth}
              setSelectedMonth={setSelMonth}
              onSelectDay={setSelDay}
              selectedDay={selDay}
            />
            <DayPopup day={selDay} month={selMonth} items={items} onClose={()=>setSelDay(null)} />
 
            {/* Upcoming timeline */}
            <div style={{ marginTop:28 }}>
              <div style={{ fontSize:11, fontWeight:800, color:C.gray4, letterSpacing:2,
                textTransform:"uppercase", marginBottom:16 }}>Komende deadlines</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:10 }}>
                {[...activeItems]
                  .sort((a,b) => new Date(a.reviewDeadline||a.inwerking)-new Date(b.reviewDeadline||b.inwerking))
                  .slice(0,8)
                  .map(item => {
                    const d = item.reviewDeadline||item.inwerking;
                    const days = daysFrom(d);
                    const isReview = !!item.reviewDeadline;
                    const urgColor = days<14?C.red:days<45?C.yellow:C.green;
                    const lvl = scoreLevel(item.score);
                    return (
                      <div key={item.id} style={{ background:"#0C0C0C",
                        border:`1px solid ${days<14?"#E03A2833":"#1A1A1A"}`,
                        borderRadius:9, padding:"12px 14px",
                        display:"flex", gap:12, alignItems:"flex-start" }}>
                        <div style={{ textAlign:"center", minWidth:44,
                          background:"#141414", borderRadius:7, padding:"6px 4px" }}>
                          <div style={{ fontSize:18, fontWeight:900, color:urgColor,
                            lineHeight:1, fontFamily:"monospace" }}>{days}</div>
                          <div style={{ fontSize:8, color:C.gray4, textTransform:"uppercase",
                            letterSpacing:1 }}>dagen</div>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:10, color:isReview?C.red:C.yellow,
                            fontWeight:700, marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>
                            {isReview?"⏰ Review":"⚡ Inwerking"} · {d}
                          </div>
                          <div style={{ fontSize:12, color:C.white, fontWeight:600,
                            lineHeight:1.35, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize:10, color:C.gray4, marginTop:2 }}>
                            {item.category}
                            {lvl && <span style={{ marginLeft:6, color:SC[lvl].text }}>· {SC[lvl].label}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
 
        {/* FEED TAB */}
        {activeTab==="feed" && (
          <div style={{ animation:"fadeUp 0.25s ease" }}>
            {/* Filters */}
            <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Zoeken op titel of tag…"
                style={{ flex:1, minWidth:180, background:"#0D0D0D",
                  border:"1px solid #222", borderRadius:7,
                  padding:"8px 13px", color:C.white, fontSize:12 }} />
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
                style={{ background:"#0D0D0D", border:"1px solid #222", borderRadius:7,
                  padding:"8px 12px", color:catFilter==="all"?C.gray4:C.white,
                  fontSize:12, cursor:"pointer" }}>
                <option value="all">Alle categorieën</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
 
            {/* Active items */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {filteredActive.map(item => (
                <FeedCard key={item.id} item={item} onAnalyze={handleAnalyze}
                  onToggle={toggleItem} isHistory={false} />
              ))}
            </div>
 
            {/* History section */}
            {historyItems.length > 0 && (
              <div style={{ marginTop:28 }}>
                <button onClick={() => setShowHistory(h=>!h)}
                  style={{ display:"flex", alignItems:"center", gap:8, background:"none",
                    border:"1px solid #1E1E1E", borderRadius:7, padding:"9px 16px",
                    color:C.gray4, fontSize:11, fontWeight:700, cursor:"pointer",
                    width:"100%", marginBottom: showHistory?14:0 }}>
                  <span style={{ color:"#333", fontSize:14 }}>{showHistory?"▼":"▶"}</span>
                  <span>Historie — {historyItems.length} afgehandelde item{historyItems.length>1?"s":""}</span>
                  <span style={{ marginLeft:"auto", fontSize:10, color:"#333" }}>
                    Review deadline verstreken
                  </span>
                </button>
                {showHistory && (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {filteredHistory.map(item => (
                      <FeedCard key={item.id} item={item} onAnalyze={handleAnalyze}
                        onToggle={toggleItem} isHistory={true} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
 
        <div style={{ marginTop:40, paddingTop:16, borderTop:"1px solid #141414",
          fontSize:10, color:"#222", letterSpacing:1.5, textAlign:"center" }}>
          BRONNEN: STAATSBLAD · STAATSCOURANT · KAMERSTUKKEN · WETTEN.OVERHEID.NL
          {" "}· Powered by <span style={{color:C.yellow+"66"}}>Cytrus</span> AI
        </div>
      </div>
    </div>
  );
}
