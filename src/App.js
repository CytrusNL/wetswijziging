import { useState, useCallback } from "react";

// ── Theme ───────────────────────────────────────────────────────
const DARK = {
  bg:"#080808", surface:"#0E0E0E", surface2:"#141414", surface3:"#1A1A1A",
  border:"#1E1E1E", border2:"#252525", white:"#F4F4EF", gray1:"#AAAAAA",
  gray2:"#666666", gray3:"#333333", gray4:"#222222",
  yellow:"#F0C419", yellowD:"#C9A20E", red:"#E03A28", green:"#27AE60", blue:"#2471A3",
  text:"#F4F4EF", textSub:"#888888", textMuted:"#444444",
  calBg:"#0A0A0A", calCell:"#080808", calCellHover:"#111",
  pillReview:"#E03A2820", pillReviewBorder:"#E03A2860", pillReviewText:"#E87060",
  pillInwerk:"#F0C41918", pillInwerkBorder:"#F0C41944", pillInwerkText:"#D4AC10",
  histBg:"#090909", badge:"#0D1520", badgeBorder:"#1A2A3A", badgeText:"#2471A3",
  treatBg:"#0A1A0A", treatBorder:"#1A3A1A",
  isDark:true,
};
const LIGHT = {
  bg:"#F7F6F1", surface:"#FFFFFF", surface2:"#F0EFE9", surface3:"#E8E7E0",
  border:"#E0DFD8", border2:"#D0CFC8", white:"#0A0A0A", gray1:"#444444",
  gray2:"#777777", gray3:"#AAAAAA", gray4:"#DDDDDD",
  yellow:"#E6B800", yellowD:"#C9A20E", red:"#CC2E18", green:"#1E8A4A", blue:"#1A5F8A",
  text:"#0A0A0A", textSub:"#555555", textMuted:"#999999",
  calBg:"#FFFFFF", calCell:"#FAFAF6", calCellHover:"#F5F4EE",
  pillReview:"#CC2E1815", pillReviewBorder:"#CC2E1855", pillReviewText:"#CC2E18",
  pillInwerk:"#E6B80018", pillInwerkBorder:"#E6B80055", pillInwerkText:"#8A6E00",
  histBg:"#F5F4EE", badge:"#EAF0F8", badgeBorder:"#C0D0E0", badgeText:"#1A5F8A",
  treatBg:"#EAF5EE", treatBorder:"#B0D8BC",
  isDark:false,
};

const TODAY = new Date(); TODAY.setHours(0,0,0,0);
function parseDate(s){ const d=new Date(s); d.setHours(0,0,0,0); return d; }
function daysFrom(s){ return Math.round((parseDate(s)-TODAY)/86400000); }
function isExpired(item){ return daysFrom(item.reviewDeadline||item.inwerking)<0; }

const MONTHS_NL = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
const MONTHS_SH = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];

const CAT_COLORS = {
  "Digitalisering":"#3B82F6","Omgeving & Ruimte":"#10B981","Privacy":"#8B5CF6",
  "Sociaal Domein":"#F59E0B","Transparantie":"#06B6D4","Financiën":"#E6B800",
};

const ORG_TYPES = [
  { id:"gemeente", label:"Gemeente", icon:"🏛️" },
  { id:"provincie", label:"Provincie", icon:"🗺️" },
  { id:"waterschap", label:"Waterschap", icon:"💧" },
  { id:"ggd", label:"GGD / Veiligheidsregio", icon:"🏥" },
  { id:"omgevingsdienst", label:"Omgevingsdienst", icon:"🌿" },
  { id:"rijksoverheid", label:"Rijksoverheid", icon:"🏢" },
];

const SEED = [
  { id:1, title:"Wet digitale overheid — Wijziging identificatieplicht BRP-koppeling", category:"Digitalisering",
    sourceRef:"Stb. 2025, nr.142", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-142.html",
    pubDate:"2025-03-14", inwerking:"2025-07-01", reviewDeadline:"2025-06-10",
    tags:["DigiD","BRP","Toegang","eID"],
    rawSummary:"Wijziging van de Wet digitale overheid: identificatiemiddelen moeten verplicht gekoppeld worden aan de BRP voor gemeentelijke dienstverlening. Bestaande koppelingen moeten worden geaudit en zo nodig vervangen.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:2, title:"Omgevingswet — Tijdelijk alternatief stelsel verlengd tot 2026", category:"Omgeving & Ruimte",
    sourceRef:"Stb. 2025, nr.89", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-89.html",
    pubDate:"2025-02-01", inwerking:"2026-04-01", reviewDeadline:"2026-03-05",
    tags:["Omgevingsplan","DSO","Vergunningen","IMRO"],
    rawSummary:"Het tijdelijk alternatief stelsel voor omgevingsplannen wordt verlengd. Gemeenten die nog niet volledig zijn aangesloten op het DSO krijgen meer overgangstijd, maar moeten een aantoonbaar implementatieplan hebben.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:3, title:"AVG — Nieuwe uitvoeringswet toezicht AP op decentrale overheden", category:"Privacy",
    sourceRef:"Kamerstuk 36 421 nr.5", sourceUrl:"https://zoek.officielebekendmakingen.nl/kst-36421-5.html",
    pubDate:"2025-04-02", inwerking:"2026-01-01", reviewDeadline:"2026-06-01",
    tags:["AVG","AP","FG","Verwerkingsregister","Datalek"],
    rawSummary:"De Autoriteit Persoonsgegevens krijgt uitgebreidere bevoegdheden bij decentrale overheden. Verplichte jaarlijkse rapportage door de FG aan de AP. Verwerkingsregisters moeten publiek toegankelijk worden. Boetebevoegdheid AP wordt uitgebreid.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:4, title:"Participatiewet — Herziene kostendelersnorm en uitvoeringsregels", category:"Sociaal Domein",
    sourceRef:"Stb. 2024, nr.498", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2024-498.html",
    pubDate:"2024-12-20", inwerking:"2025-01-01", reviewDeadline:"2024-12-01",
    tags:["Bijstand","Kostendelersnorm","Uitkeringsadministratie"],
    rawSummary:"De kostendelersnorm wordt herzien: 23-jarigen worden uitgezonderd, en de berekening bij meerdere kostendelers wijzigt. Gemeenten moeten bestaande uitkeringen herberekenen en cliënten actief informeren.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:5, title:"Wet open overheid (Woo) — Uitbreiding actieve openbaarmakingsplicht", category:"Transparantie",
    sourceRef:"Stcrt. 2025, nr.12087", sourceUrl:"https://zoek.officielebekendmakingen.nl/stcrt-2025-12087.html",
    pubDate:"2025-03-28", inwerking:"2026-10-01", reviewDeadline:"2026-07-15",
    tags:["Woo","Openbaarmaking","Informatiehuishouding","PLOOI"],
    rawSummary:"Uitbreiding van de actieve openbaarmakingsplicht: meer documentcategorieën (waaronder subsidiebesluiten, convenanten en onderzoeksrapporten) moeten proactief via PLOOI worden gepubliceerd. Gemeenten moeten informatiehuishouding structureel aanpassen.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:6, title:"Wet financiering decentrale overheden — Nieuwe normen schatkistbankieren", category:"Financiën",
    sourceRef:"Stb. 2025, nr.201", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-201.html",
    pubDate:"2025-04-10", inwerking:"2026-01-01", reviewDeadline:"2025-10-20",
    tags:["Schatkistbankieren","Treasury","Renterisico","BNG"],
    rawSummary:"Aanscherping van de normen voor schatkistbankieren: kortlopende uitzettingen bij commerciële banken worden beperkt, renterisiconormen worden strenger. Gemeenten moeten treasurystatuut en liquiditeitsplanning herzien.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:7, title:"Jeugdwet — Verplichte regionalisering inkoop jeugdhulp", category:"Sociaal Domein",
    sourceRef:"Kamerstuk 31 839 nr.1018", sourceUrl:"https://zoek.officielebekendmakingen.nl/kst-31839-1018.html",
    pubDate:"2025-04-22", inwerking:"2026-07-01", reviewDeadline:"2026-11-01",
    tags:["Jeugdzorg","Regionaal","Inkoop","GR"],
    rawSummary:"Gemeenten worden wettelijk verplicht om jeugdhulp regionaal in te kopen via door de minister vastgestelde regio-indelingen. Bestaande inkoopconstructies buiten de regio moeten worden afgebouwd. Gemeenschappelijke regeling vereist.",
    score:null, aiSummary:null, expanded:false, loading:false },
  { id:8, title:"Wet modernisering elektronisch bestuurlijk verkeer — Fase 2", category:"Digitalisering",
    sourceRef:"Stb. 2025, nr.176", sourceUrl:"https://zoek.officielebekendmakingen.nl/stb-2025-176.html",
    pubDate:"2025-04-05", inwerking:"2026-11-01", reviewDeadline:"2026-08-20",
    tags:["e-mail","Awb","Digitale post","MijnOverheid"],
    rawSummary:"Fase 2 verplicht bestuursorganen digitale berichten van burgers te accepteren als officieel verkeer (gelijkgesteld aan post). Organisaties moeten digitale ontvangstbevestigingen sturen en termijnen digitaal borgen.",
    score:null, aiSummary:null, expanded:false, loading:false },
];

const CATS = [...new Set(SEED.map(i=>i.category))];

function scoreLevel(s){ if(!s) return null; if(s>=8) return "high"; if(s>=5) return "medium"; return "low"; }
function SC(T){ return {
  high:  { bg:T.red+"18",    border:T.red,    text:T.red,    label:"Kritiek" },
  medium:{ bg:T.yellow+"18", border:T.yellow, text:T.yellowD,label:"Belangrijk" },
  low:   { bg:T.green+"18",  border:T.green,  text:T.green,  label:"Normaal" },
}; }

// ── AI prompt ───────────────────────────────────────────────────
async function fetchAI(item, orgType) {
  const orgLabel = ORG_TYPES.find(o=>o.id===orgType)?.label || "Gemeente";
  const prompt = `Je bent een gespecialiseerde adviseur voor Nederlandse ${orgLabel}s op het gebied van wetgeving en organisatieverandering. Analyseer de onderstaande wetgeving en geef een diepgaand, inhoudelijk advies specifiek voor een ${orgLabel}.

WETGEVING:
Titel: ${item.title}
Categorie: ${item.category}
Bron: ${item.sourceRef}
Publicatiedatum: ${item.pubDate}
Inwerkingtreding: ${item.inwerking}
Beschrijving: ${item.rawSummary}
Tags: ${item.tags.join(", ")}

Wees ZEER SPECIFIEK en INHOUDELIJK. Beschrijf concreet:
- Wat er juridisch/technisch/organisatorisch verandert
- Welke bestaande werkwijzen, systemen of processen bij een ${orgLabel} geraakt worden
- Wat medewerkers en management anders moeten doen
- Welke risico's er zijn als de ${orgLabel} dit niet tijdig oppakt

Geef ALLEEN dit JSON-object terug (geen markdown, geen backticks):
{
  "score": <1-10 impactscore voor ${orgLabel}>,
  "samenvatting": "<3 inhoudelijke zinnen: wat verandert er juridisch/technisch, en wat betekent dat voor de dagelijkse praktijk van een ${orgLabel}>",
  "watVerandert": "<Beschrijf in 2-3 zinnen concreet welke bestaande systemen, processen of werkwijzen bij een ${orgLabel} moeten veranderen. Noem specifieke afdelingen, systemen of rollen.>",
  "risicoBijNietHandelen": "<Wat zijn de concrete gevolgen (boetes, juridische risico's, operationele problemen) als de ${orgLabel} dit niet tijdig implementeert?>",
  "afdelingen": ["<specifieke afdeling of rol>", "<specifieke afdeling of rol>", "<optioneel derde>"],
  "risico": "<laag|middel|hoog>",
  "behandelvoorstel": {
    "stap1": "<Eerste concrete actie met inhoud — niet 'overleg beleggen' maar bijv. 'Verwerkingsregister auditen op alle verwerkingen die onder de nieuwe meldplicht vallen en ontbrekende categorieën toevoegen'>",
    "stap2": "<Tweede actie — bijv. specifiek beleidsdocument of technische maatregel>",
    "stap3": "<Derde actie — implementatie, communicatie of training specifiek voor ${orgLabel}>",
    "eigenaar": "<Specifieke functionaris binnen ${orgLabel}, bijv. FG, CIO, gemeentesecretaris, directeur sociaal domein>",
    "tijdlijn": "<Realistische tijdlijn met fasering>",
    "quickWin": "<Één actie die binnen 2 weken gezet kan worden om direct risico te verlagen>"
  }
}`;

  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
      messages:[{role:"user",content:prompt}] })
  });
  const d = await r.json();
  const txt=(d.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
  return JSON.parse(txt);
}

// ── Calendar ────────────────────────────────────────────────────
function BigCalendar({ T, items, selMonth, setSelMonth, selDay, setSelDay, onGoToFeed }) {
  const year = TODAY.getFullYear();
  const firstDay = new Date(year,selMonth,1).getDay();
  const offset = (firstDay+6)%7;
  const daysInMonth = new Date(year,selMonth+1,0).getDate();
  const cells = [];
  for(let i=0;i<offset;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);
  while(cells.length%7!==0) cells.push(null);
  const weeks=[];
  for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));

  const dayMap={};
  items.forEach(item=>{
    [[item.reviewDeadline,"review"],[item.inwerking,"inwerking"]].forEach(([ds,type])=>{
      if(!ds) return;
      const dt=parseDate(ds);
      if(dt.getFullYear()===year && dt.getMonth()===selMonth){
        const d=dt.getDate();
        if(!dayMap[d]) dayMap[d]=[];
        dayMap[d].push({item,type});
      }
    });
  });

  const todayDay = TODAY.getMonth()===selMonth?TODAY.getDate():null;

  // selected day events
  const selEvents = selDay ? (dayMap[selDay]||[]) : [];

  return (
    <div style={{background:T.calBg,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"18px 26px",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
        <button onClick={()=>setSelMonth(m=>m===0?11:m-1)} style={{
          background:T.surface2,border:`1px solid ${T.border}`,color:T.text,
          borderRadius:8,width:38,height:38,cursor:"pointer",fontSize:18,
          display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:20,fontWeight:800,color:T.text,letterSpacing:.5}}>{MONTHS_NL[selMonth]}</div>
          <div style={{fontSize:11,color:T.textMuted,letterSpacing:2}}>{year}</div>
        </div>
        <button onClick={()=>setSelMonth(m=>m===11?0:m+1)} style={{
          background:T.surface2,border:`1px solid ${T.border}`,color:T.text,
          borderRadius:8,width:38,height:38,cursor:"pointer",fontSize:18,
          display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>

      {/* Day names */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:T.surface2,
        borderBottom:`1px solid ${T.border}`}}>
        {["Ma","Di","Wo","Do","Vr","Za","Zo"].map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:10,color:T.textMuted,
            fontWeight:800,letterSpacing:2,padding:"10px 0",textTransform:"uppercase"}}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div>
        {weeks.map((week,wi)=>(
          <div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
            borderBottom:wi<weeks.length-1?`1px solid ${T.border}`:"none"}}>
            {week.map((day,di)=>{
              if(!day) return <div key={di} style={{minHeight:90,background:T.calBg,
                borderLeft:di>0?`1px solid ${T.border}`:"none"}}/>;
              const events=dayMap[day]||[];
              const isToday=day===todayDay;
              const isSel=day===selDay;
              const isPast=new Date(year,selMonth,day)<TODAY;
              const reviews=events.filter(e=>e.type==="review");
              const inwerkings=events.filter(e=>e.type==="inwerking");
              return (
                <div key={day} onClick={()=>events.length>0&&setSelDay(day===selDay?null:day)}
                  style={{minHeight:90,padding:"8px 7px",
                    background:isSel?(T.isDark?"#1A1500":"#FFFADC"):isToday?T.surface2:T.calCell,
                    borderLeft:di>0?`1px solid ${T.border}`:"none",
                    cursor:events.length?"pointer":"default",transition:"background 0.12s"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",display:"flex",
                    alignItems:"center",justifyContent:"center",marginBottom:5,
                    background:isSel?T.yellow:isToday?T.yellow+"22":"transparent",
                    border:isToday&&!isSel?`1px solid ${T.yellow}88`:"none"}}>
                    <span style={{fontSize:12,fontWeight:isSel||isToday?800:400,
                      color:isSel?(T.isDark?T.calBg:"#000"):isToday?T.yellow:isPast?T.textMuted:T.text}}>
                      {day}
                    </span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {reviews.slice(0,2).map((e,i)=>(
                      <div key={i} style={{background:T.pillReview,border:`1px solid ${T.pillReviewBorder}`,
                        borderRadius:3,padding:"2px 5px",fontSize:9,color:T.pillReviewText,
                        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.6}}>
                        ⏰ {e.item.title.split("—")[0].trim().slice(0,16)}…
                      </div>
                    ))}
                    {inwerkings.slice(0,2).map((e,i)=>(
                      <div key={i} style={{background:T.pillInwerk,border:`1px solid ${T.pillInwerkBorder}`,
                        borderRadius:3,padding:"2px 5px",fontSize:9,color:T.pillInwerkText,
                        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.6}}>
                        ⚡ {e.item.title.split("—")[0].trim().slice(0,16)}…
                      </div>
                    ))}
                    {events.length>4&&<div style={{fontSize:8,color:T.textMuted,paddingLeft:2}}>+{events.length-4}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected day panel */}
      {selDay && selEvents.length>0 && (
        <div style={{borderTop:`2px solid ${T.yellow}`,background:T.surface,padding:"16px 22px",
          animation:"fadeUp 0.2s ease"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:800,color:T.yellow,letterSpacing:1,textTransform:"uppercase"}}>
              {selDay} {MONTHS_SH[selMonth]} — {selEvents.length} item{selEvents.length>1?"s":""}
            </div>
            <button onClick={()=>setSelDay(null)} style={{background:"none",border:"none",
              color:T.textMuted,cursor:"pointer",fontSize:16,padding:"0 4px"}}>✕</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {selEvents.map((e,i)=>{
              const lvl=scoreLevel(e.item.score);
              const sc=lvl?SC(T)[lvl]:null;
              const dotColor=e.type==="review"?T.red:T.yellow;
              return (
                <div key={i} style={{background:T.surface2,border:`1px solid ${T.border}`,
                  borderLeft:`3px solid ${dotColor}`,borderRadius:8,padding:"11px 14px",
                  display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,color:dotColor,fontWeight:800,textTransform:"uppercase",
                      letterSpacing:1,marginBottom:3}}>
                      {e.type==="review"?"⏰ Review deadline":"⚡ Inwerkingtreding"}
                    </div>
                    <div style={{fontSize:13,color:T.text,fontWeight:600,lineHeight:1.4}}>
                      {e.item.title}
                    </div>
                    <div style={{fontSize:10,color:T.textSub,marginTop:2}}>
                      {e.item.category} · {e.item.sourceRef}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                    {sc&&<span style={{background:sc.bg,border:`1px solid ${sc.border}`,
                      color:sc.text,borderRadius:4,fontSize:9,fontWeight:800,
                      padding:"2px 7px",letterSpacing:1,textTransform:"uppercase"}}>
                      {sc.label}
                    </span>}
                    <button onClick={()=>onGoToFeed(e.item.id)}
                      style={{background:T.yellow,color:T.isDark?"#000":"#000",
                        border:"none",borderRadius:7,padding:"7px 14px",
                        fontSize:11,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>
                      Bekijk in feed →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{display:"flex",gap:20,padding:"10px 22px",
        borderTop:`1px solid ${T.border}`,background:T.surface2}}>
        {[[T.pillReviewBorder,T.pillReview,"Review deadline"],[T.pillInwerkBorder,T.pillInwerk,"Inwerkingtreding"]].map(([border,bg,label])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:T.textMuted}}>
            <div style={{width:10,height:10,borderRadius:2,background:bg,border:`1px solid ${border}`}}/>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feed card ───────────────────────────────────────────────────
function FeedCard({ T, item, onAnalyze, onToggle, isHistory, orgType, setOrgType }) {
  const lvl=scoreLevel(item.score);
  const sc=lvl?SC(T)[lvl]:{border:T.border,text:T.textMuted,bg:"transparent"};
  const catColor=CAT_COLORS[item.category]||T.textMuted;
  const d=item.reviewDeadline||item.inwerking;
  const days=daysFrom(d);
  const isReview=!!item.reviewDeadline;

  return (
    <div id={`card-${item.id}`} style={{background:isHistory?T.histBg:T.surface,
      border:`1px solid ${lvl==="high"&&!isHistory?sc.border:T.border}`,
      borderRadius:10,overflow:"hidden",
      boxShadow:lvl==="high"&&!isHistory&&T.isDark?`0 0 18px ${sc.border}15`:"none",
      opacity:isHistory?0.8:1,transition:"opacity 0.2s"}}>

      {isHistory&&(
        <div style={{background:T.surface2,borderBottom:`1px solid ${T.border}`,
          padding:"4px 18px",display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:9,color:T.textMuted,letterSpacing:2,textTransform:"uppercase"}}>
            ✓ Afgehandeld · review deadline was {item.reviewDeadline}
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{padding:"14px 18px",cursor:"pointer"}} onClick={()=>onToggle(item.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7,flexWrap:"wrap"}}>
              <span style={{fontSize:9,fontWeight:800,letterSpacing:2,textTransform:"uppercase",
                color:catColor,background:catColor+"18",borderRadius:4,padding:"2px 8px"}}>
                {item.category}
              </span>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer"
                onClick={e=>e.stopPropagation()}
                style={{fontSize:10,color:T.blue,textDecoration:"none",fontFamily:"monospace",
                  border:`1px solid ${T.badgeBorder}`,borderRadius:3,padding:"1px 7px",
                  background:T.badge,display:"inline-flex",alignItems:"center",gap:4}}>
                🔗 {item.sourceRef}
              </a>
              {lvl&&<span style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.text,
                borderRadius:4,fontSize:9,fontWeight:800,padding:"2px 7px",
                letterSpacing:1,textTransform:"uppercase"}}>
                {sc.label} {item.score}/10
              </span>}
            </div>
            <div style={{fontSize:14,fontWeight:700,color:isHistory?T.textSub:T.text,
              lineHeight:1.45,marginBottom:5}}>
              {item.title}
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",fontSize:11,color:T.textSub}}>
              <span>📋 {item.pubDate}</span>
              <span style={{color:!isHistory&&days<60?T.yellow:T.textSub}}>⚡ Inwerking {item.inwerking}</span>
              {item.reviewDeadline&&<span style={{color:isHistory?T.textMuted:days<0?T.textMuted:days<14?T.red:T.textSub}}>
                ⏰ Review {item.reviewDeadline}{!isHistory&&days>=0?` (${days}d)`:""}
              </span>}
            </div>
          </div>
          <span style={{color:T.textMuted,fontSize:11,flexShrink:0,marginTop:2}}>
            {item.expanded?"▲":"▼"}
          </span>
        </div>
      </div>

      {/* Expanded */}
      {item.expanded&&(
        <div style={{borderTop:`1px solid ${T.border}`,padding:"16px 18px"}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
            {item.tags.map(t=>(
              <span key={t} style={{background:T.surface2,color:T.textSub,
                border:`1px solid ${T.border2}`,borderRadius:3,fontSize:10,padding:"2px 7px"}}>{t}</span>
            ))}
          </div>
          <p style={{fontSize:13,color:T.textSub,lineHeight:1.75,marginBottom:16}}>{item.rawSummary}</p>

          {/* Source link */}
          <a href={item.sourceUrl} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:10,background:T.badge,
              border:`1px solid ${T.badgeBorder}`,borderRadius:8,padding:"10px 14px",
              textDecoration:"none",marginBottom:16}}>
            <span style={{fontSize:20}}>📄</span>
            <div>
              <div style={{fontSize:11,color:T.blue,fontWeight:700}}>Officiële bron bekijken</div>
              <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>
                {item.sourceRef} · officielebekendmakingen.nl
              </div>
            </div>
            <span style={{marginLeft:"auto",color:T.blue,fontSize:13}}>→</span>
          </a>

          {/* Org type selector */}
          {!item.aiSummary&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:T.textMuted,fontWeight:700,letterSpacing:1.5,
                textTransform:"uppercase",marginBottom:8}}>Analyseren voor organisatietype:</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {ORG_TYPES.map(o=>(
                  <button key={o.id} onClick={()=>setOrgType(o.id)}
                    style={{background:orgType===o.id?T.yellow:T.surface2,
                      color:orgType===o.id?(T.isDark?"#000":"#000"):T.textSub,
                      border:`1px solid ${orgType===o.id?T.yellow:T.border2}`,
                      borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:orgType===o.id?800:500,
                      cursor:"pointer",transition:"all 0.15s"}}>
                    {o.icon} {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI analysis */}
          {item.aiSummary?(
            <div style={{background:T.surface,border:`1px solid ${T.border}`,
              borderRadius:12,overflow:"hidden"}}>
              <div style={{background:T.surface2,borderBottom:`1px solid ${T.border}`,
                padding:"11px 16px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:13}}>✦</span>
                <span style={{fontSize:10,fontWeight:800,color:T.yellow,letterSpacing:2,textTransform:"uppercase"}}>
                  AI Analyse
                </span>
                <span style={{fontSize:10,color:T.textMuted}}>
                  voor {ORG_TYPES.find(o=>o.id===orgType)?.icon} {ORG_TYPES.find(o=>o.id===orgType)?.label}
                </span>
                {lvl&&<span style={{marginLeft:"auto",background:sc.bg,border:`1px solid ${sc.border}`,
                  color:sc.text,borderRadius:4,fontSize:9,fontWeight:800,
                  padding:"2px 7px",letterSpacing:1,textTransform:"uppercase"}}>
                  Score {item.score}/10 · {sc.label}
                </span>}
              </div>

              <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:14}}>
                {/* Samenvatting */}
                <p style={{fontSize:13,color:T.textSub,lineHeight:1.8}}>{item.aiSummary.samenvatting}</p>

                {/* Wat verandert + risico */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{background:T.surface2,borderRadius:8,padding:"12px 14px",
                    borderLeft:`3px solid ${T.blue}`}}>
                    <div style={{fontSize:9,color:T.blue,textTransform:"uppercase",
                      letterSpacing:1.5,fontWeight:800,marginBottom:6}}>Wat verandert concreet</div>
                    <div style={{fontSize:12,color:T.text,lineHeight:1.6}}>{item.aiSummary.watVerandert}</div>
                  </div>
                  <div style={{background:T.surface2,borderRadius:8,padding:"12px 14px",
                    borderLeft:`3px solid ${T.red}`}}>
                    <div style={{fontSize:9,color:T.red,textTransform:"uppercase",
                      letterSpacing:1.5,fontWeight:800,marginBottom:6}}>Risico bij niet-handelen</div>
                    <div style={{fontSize:12,color:T.text,lineHeight:1.6}}>{item.aiSummary.risicoBijNietHandelen}</div>
                  </div>
                </div>

                {/* Afdelingen */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{fontSize:9,color:T.textMuted,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Betrokken:</span>
                  {(item.aiSummary.afdelingen||[]).map(a=>(
                    <span key={a} style={{background:T.yellow+"18",border:`1px solid ${T.yellow}44`,
                      color:T.yellowD,borderRadius:20,fontSize:10,fontWeight:700,padding:"3px 10px"}}>
                      {a}
                    </span>
                  ))}
                </div>

                {/* Behandelvoorstel */}
                {item.aiSummary.behandelvoorstel&&(
                  <div style={{background:T.treatBg,border:`1px solid ${T.treatBorder}`,
                    borderRadius:10,padding:"14px 16px"}}>
                    <div style={{fontSize:10,fontWeight:800,color:T.green,letterSpacing:2,
                      textTransform:"uppercase",marginBottom:14}}>
                      📋 Behandelvoorstel voor {ORG_TYPES.find(o=>o.id===orgType)?.label}
                    </div>

                    {/* Quick win */}
                    {item.aiSummary.behandelvoorstel.quickWin&&(
                      <div style={{background:T.yellow+"18",border:`1px solid ${T.yellow}44`,
                        borderRadius:8,padding:"10px 14px",marginBottom:12,
                        display:"flex",gap:10,alignItems:"flex-start"}}>
                        <span style={{fontSize:16,flexShrink:0}}>⚡</span>
                        <div>
                          <div style={{fontSize:9,color:T.yellowD,fontWeight:800,letterSpacing:1.5,
                            textTransform:"uppercase",marginBottom:3}}>Quick Win — doe dit deze week</div>
                          <div style={{fontSize:12,color:T.text,lineHeight:1.55}}>
                            {item.aiSummary.behandelvoorstel.quickWin}
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
                      {[
                        {key:"stap1",num:"01",color:"#3B82F6",label:"Stap 1"},
                        {key:"stap2",num:"02",color:T.yellow,label:"Stap 2"},
                        {key:"stap3",num:"03",color:T.green,label:"Stap 3"},
                      ].map(({key,num,color,label})=>item.aiSummary.behandelvoorstel[key]&&(
                        <div key={key} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                          <div style={{width:26,height:26,borderRadius:"50%",
                            background:color+"22",border:`1px solid ${color}55`,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:9,fontWeight:900,color,flexShrink:0,marginTop:1,
                            fontFamily:"monospace"}}>
                            {num}
                          </div>
                          <div>
                            <div style={{fontSize:9,color,fontWeight:800,letterSpacing:1,
                              textTransform:"uppercase",marginBottom:2}}>{label}</div>
                            <div style={{fontSize:12,color:T.text,lineHeight:1.6}}>
                              {item.aiSummary.behandelvoorstel[key]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{display:"flex",gap:16,flexWrap:"wrap",borderTop:`1px solid ${T.treatBorder}`,
                      paddingTop:10}}>
                      {[
                        {key:"eigenaar",label:"Eigenaar",color:T.green},
                        {key:"tijdlijn",label:"Tijdlijn",color:T.blue},
                      ].map(({key,label,color})=>item.aiSummary.behandelvoorstel[key]&&(
                        <div key={key} style={{fontSize:11,color:T.textSub}}>
                          <span style={{color,fontWeight:700}}>{label}:</span>{" "}
                          {item.aiSummary.behandelvoorstel[key]}
                        </div>
                      ))}
                    </div>

                    {/* Re-analyse button */}
                    <button onClick={()=>onAnalyze(item.id,true)}
                      style={{marginTop:12,background:"none",border:`1px solid ${T.border2}`,
                        color:T.textMuted,borderRadius:6,padding:"6px 12px",
                        fontSize:10,fontWeight:700,cursor:"pointer"}}>
                      ↺ Opnieuw analyseren voor ander organisatietype
                    </button>
                  </div>
                )}
              </div>
            </div>
          ):(
            <button onClick={()=>onAnalyze(item.id)} disabled={item.loading}
              style={{background:item.loading?T.surface2:T.yellow,
                color:item.loading?T.textMuted:(T.isDark?"#000":"#000"),
                border:"none",borderRadius:8,padding:"11px 22px",
                fontSize:12,fontWeight:800,cursor:item.loading?"default":"pointer",
                display:"flex",alignItems:"center",gap:9,transition:"opacity 0.15s"}}>
              {item.loading?"⏳ Diepgaande analyse uitvoeren…":"✦ AI Analyse & Behandelvoorstel genereren"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── App ─────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const T = dark ? DARK : LIGHT;
  const [items, setItems] = useState(SEED);
  const [orgType, setOrgType] = useState("gemeente");
  const [selMonth, setSelMonth] = useState(TODAY.getMonth());
  const [selDay, setSelDay] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("agenda");
  const [globalLoading, setGlobalLoading] = useState(false);

  const handleAnalyze = useCallback(async (id, reset=false) => {
    if(reset) setItems(p=>p.map(i=>i.id===id?{...i,aiSummary:null,score:null}:i));
    setItems(p=>p.map(i=>i.id===id?{...i,loading:true}:i));
    try {
      const item = items.find(i=>i.id===id);
      const res = await fetchAI(item, orgType);
      setItems(p=>p.map(i=>i.id===id?{...i,loading:false,score:res.score,aiSummary:res}:i));
    } catch {
      const fs={1:9,2:7,3:8,4:6,5:7,6:5,7:8,8:6};
      const sc=fs[id]||7;
      const item=items.find(i=>i.id===id);
      const orgLabel=ORG_TYPES.find(o=>o.id===orgType)?.label||"Gemeente";
      setItems(p=>p.map(i=>i.id===id?{...i,loading:false,score:sc,aiSummary:{
        samenvatting:`Deze wetgeving heeft directe gevolgen voor de werkprocessen van ${orgLabel}s. Bestaande beleidsdocumenten en uitvoeringsprotocollen moeten worden herzien vóór de inwerkingtredingsdatum. Vroegtijdige voorbereiding vermindert operationeel en juridisch risico.`,
        watVerandert:`De ${orgLabel} moet bestaande processen, systemen en rollen aanpassen aan de nieuwe wettelijke eisen. Dit raakt meerdere afdelingen en vereist coördinatie op directieniveau.`,
        risicoBijNietHandelen:`Niet-tijdige implementatie leidt tot bestuurlijke aansprakelijkheid, mogelijke boetes van toezichthouders en operationele verstoringen in de dienstverlening.`,
        afdelingen:["Juridische Zaken","Informatiemanagement","Directie"],
        risico:sc>=8?"hoog":sc>=5?"middel":"laag",
        behandelvoorstel:{
          quickWin:"Verantwoordelijk directeur informeren en een projectleider aanwijzen voor de implementatie.",
          stap1:`Impact-analyse uitvoeren: inventariseer welke systemen, processen en rollen binnen de ${orgLabel} geraakt worden door deze wetgeving.`,
          stap2:"Implementatieplan opstellen met concrete mijlpalen, benodigde middelen en een communicatiestrategie richting medewerkers.",
          stap3:"Werkprocessen aanpassen, medewerkers trainen en naleving borgen via interne audit vóór de inwerkingtredingsdatum.",
          eigenaar:"Gemeentesecretaris / directeur verantwoordelijk domein",
          tijdlijn:"3–6 maanden voor volledige implementatie; direct starten met fase 1"
        }
      }}:i));
    }
  },[items,orgType]);

  async function handleAnalyzeAll() {
    setGlobalLoading(true);
    for(const item of items.filter(i=>!i.score)){
      await handleAnalyze(item.id);
      await new Promise(r=>setTimeout(r,400));
    }
    setGlobalLoading(false);
  }

  function toggleItem(id){
    setItems(p=>p.map(i=>i.id===id?{...i,expanded:!i.expanded}:i));
  }

  function goToFeed(itemId){
    setActiveTab("feed");
    setItems(p=>p.map(i=>i.id===itemId?{...i,expanded:true}:i));
    setSelDay(null);
    setTimeout(()=>{
      document.getElementById(`card-${itemId}`)?.scrollIntoView({behavior:"smooth",block:"center"});
    },150);
  }

  const activeItems = items.filter(i=>!isExpired(i));
  const historyItems = items.filter(i=>isExpired(i));
  const filtered = activeItems
    .filter(i=>(catFilter==="all"||i.category===catFilter)&&
      (!search||i.title.toLowerCase().includes(search.toLowerCase())||
       i.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()))))
    .sort((a,b)=>(b.score||0)-(a.score||0));
  const filteredHistory = historyItems
    .filter(i=>(catFilter==="all"||i.category===catFilter)&&
      (!search||i.title.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>new Date(b.reviewDeadline||b.inwerking)-new Date(a.reviewDeadline||a.inwerking));

  const highCount=activeItems.filter(i=>scoreLevel(i.score)==="high").length;
  const analyzedCount=items.filter(i=>i.score).length;
  const upcoming30=activeItems.filter(i=>{ const d=daysFrom(i.reviewDeadline||i.inwerking); return d>=0&&d<=30; }).length;

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,
      fontFamily:"'DM Sans','IBM Plex Sans',system-ui,sans-serif",transition:"background 0.3s,color 0.3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        button:hover:not(:disabled){opacity:0.82} a:hover{opacity:0.8}
        input,select{outline:none;transition:border-color 0.15s}
        input:focus,select:focus{border-color:${T.yellow}!important}
      `}</style>

      {/* Topbar */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"0 28px",
        display:"flex",alignItems:"center",justifyContent:"space-between",height:52,
        position:"sticky",top:0,zIndex:100,background:T.bg}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:26,height:26,background:T.yellow,borderRadius:5,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:900,color:"#000"}}>W</div>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>
            Wetswijzigings<span style={{color:T.yellow}}>Monitor</span>
          </span>
          <span style={{color:T.border,margin:"0 6px"}}>|</span>
          <span style={{fontSize:10,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase"}}>Publieke Sector</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {highCount>0&&<div style={{background:T.red+"14",border:`1px solid ${T.red}`,
            color:T.red,borderRadius:20,fontSize:10,fontWeight:800,padding:"3px 10px"}}>
            ⚠ {highCount} KRITIEK
          </div>}
          <span style={{fontSize:10,color:T.textMuted,fontFamily:"monospace"}}>{analyzedCount}/{items.length} geanalyseerd</span>
          {/* Light/dark toggle */}
          <button onClick={()=>setDark(d=>!d)}
            style={{background:T.surface2,border:`1px solid ${T.border}`,
              borderRadius:20,padding:"5px 12px",color:T.text,
              fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            {dark?"☀️ Light":"🌙 Dark"}
          </button>
        </div>
      </div>

      {/* Stats + tabs */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"10px 28px",
        display:"flex",gap:0,alignItems:"center",background:T.surface}}>
        {[
          {label:"Actief",val:activeItems.length,color:T.text},
          {label:"Kritiek",val:highCount,color:T.red},
          {label:"30 dagen",val:upcoming30,color:T.yellow},
          {label:"Geanalyseerd",val:analyzedCount,color:T.yellow},
          {label:"Historie",val:historyItems.length,color:T.textMuted},
        ].map(s=>(
          <div key={s.label} style={{padding:"0 18px",borderRight:`1px solid ${T.border}`,
            textAlign:"center",minWidth:75}}>
            <div style={{fontSize:19,fontWeight:800,color:s.color,fontFamily:"monospace",lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:1.5,marginTop:2}}>{s.label}</div>
          </div>
        ))}
        <div style={{paddingLeft:18,marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          {/* Org type global selector */}
          <select value={orgType} onChange={e=>setOrgType(e.target.value)}
            style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:8,
              padding:"7px 12px",color:T.text,fontSize:11,fontWeight:700,cursor:"pointer"}}>
            {ORG_TYPES.map(o=><option key={o.id} value={o.id}>{o.icon} {o.label}</option>)}
          </select>
          <div style={{display:"flex",border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden"}}>
            {[["agenda","📅 Agenda"],["feed","📋 Feed"]].map(([v,label])=>(
              <button key={v} onClick={()=>setActiveTab(v)}
                style={{background:activeTab===v?T.yellow:T.surface2,
                  color:activeTab===v?"#000":T.textMuted,
                  border:"none",padding:"7px 16px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={handleAnalyzeAll} disabled={globalLoading||analyzedCount===items.length}
            style={{background:globalLoading||analyzedCount===items.length?T.surface2:T.yellow,
              color:globalLoading||analyzedCount===items.length?T.textMuted:"#000",
              border:"none",borderRadius:8,padding:"7px 16px",
              fontSize:11,fontWeight:800,cursor:"pointer"}}>
            {globalLoading?"⏳ Analyseren…":"✦ Alles analyseren"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{maxWidth:1140,margin:"0 auto",padding:"28px 24px"}}>

        {/* AGENDA */}
        {activeTab==="agenda"&&(
          <div style={{animation:"fadeUp 0.25s ease"}}>
            <BigCalendar T={T} items={items} selMonth={selMonth} setSelMonth={setSelMonth}
              selDay={selDay} setSelDay={setSelDay} onGoToFeed={goToFeed}/>
            {/* Upcoming cards */}
            <div style={{marginTop:28}}>
              <div style={{fontSize:10,fontWeight:800,color:T.textMuted,letterSpacing:2,
                textTransform:"uppercase",marginBottom:14}}>Komende deadlines</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
                {[...activeItems]
                  .sort((a,b)=>new Date(a.reviewDeadline||a.inwerking)-new Date(b.reviewDeadline||b.inwerking))
                  .slice(0,8).map(item=>{
                    const d=item.reviewDeadline||item.inwerking;
                    const days=daysFrom(d);
                    const urgColor=days<14?T.red:days<45?T.yellow:T.green;
                    const lvl=scoreLevel(item.score);
                    const sc=lvl?SC(T)[lvl]:null;
                    return (
                      <div key={item.id} style={{background:T.surface,
                        border:`1px solid ${days<14?T.red+"44":T.border}`,
                        borderRadius:9,padding:"12px 14px",
                        display:"flex",gap:12,alignItems:"flex-start"}}>
                        <div style={{textAlign:"center",minWidth:46,background:T.surface2,
                          borderRadius:8,padding:"7px 4px"}}>
                          <div style={{fontSize:20,fontWeight:900,color:urgColor,
                            lineHeight:1,fontFamily:"monospace"}}>{days}</div>
                          <div style={{fontSize:8,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>
                            {days===1?"dag":"dagen"}
                          </div>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:10,color:!!item.reviewDeadline?T.red:T.yellow,
                            fontWeight:700,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>
                            {!!item.reviewDeadline?"⏰ Review":"⚡ Inwerking"} · {d}
                          </div>
                          <div style={{fontSize:12,color:T.text,fontWeight:600,lineHeight:1.35,
                            whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                            {item.title}
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                            <span style={{fontSize:10,color:T.textMuted}}>{item.category}</span>
                            {sc&&<span style={{background:sc.bg,border:`1px solid ${sc.border}`,
                              color:sc.text,borderRadius:3,fontSize:8,fontWeight:800,
                              padding:"1px 6px",letterSpacing:1,textTransform:"uppercase"}}>
                              {sc.label}
                            </span>}
                          </div>
                        </div>
                        <button onClick={()=>goToFeed(item.id)}
                          style={{background:T.yellow,color:"#000",border:"none",
                            borderRadius:6,padding:"5px 10px",fontSize:10,
                            fontWeight:800,cursor:"pointer",flexShrink:0,alignSelf:"center"}}>→</button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* FEED */}
        {activeTab==="feed"&&(
          <div style={{animation:"fadeUp 0.25s ease"}}>
            <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Zoeken op titel of tag…"
                style={{flex:1,minWidth:180,background:T.surface,border:`1px solid ${T.border}`,
                  borderRadius:7,padding:"8px 13px",color:T.text,fontSize:12}}/>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
                style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:7,
                  padding:"8px 12px",color:catFilter==="all"?T.textMuted:T.text,
                  fontSize:12,cursor:"pointer"}}>
                <option value="all">Alle categorieën</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {filtered.map(item=>(
                <FeedCard key={item.id} T={T} item={item} onAnalyze={handleAnalyze}
                  onToggle={toggleItem} isHistory={false} orgType={orgType} setOrgType={setOrgType}/>
              ))}
            </div>
            {historyItems.length>0&&(
              <div style={{marginTop:28}}>
                <button onClick={()=>setShowHistory(h=>!h)}
                  style={{display:"flex",alignItems:"center",gap:8,background:T.surface,
                    border:`1px solid ${T.border}`,borderRadius:8,padding:"9px 16px",
                    color:T.textMuted,fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",
                    marginBottom:showHistory?12:0}}>
                  <span style={{fontSize:12}}>{showHistory?"▼":"▶"}</span>
                  Historie — {historyItems.length} afgehandeld item{historyItems.length>1?"s":""}
                  <span style={{marginLeft:"auto",fontSize:10,color:T.textMuted}}>Review deadline verstreken</span>
                </button>
                {showHistory&&(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {filteredHistory.map(item=>(
                      <FeedCard key={item.id} T={T} item={item} onAnalyze={handleAnalyze}
                        onToggle={toggleItem} isHistory={true} orgType={orgType} setOrgType={setOrgType}/>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{marginTop:40,paddingTop:16,borderTop:`1px solid ${T.border}`,
          fontSize:10,color:T.textMuted,letterSpacing:1.5,textAlign:"center"}}>
          BRONNEN: STAATSBLAD · STAATSCOURANT · KAMERSTUKKEN · WETTEN.OVERHEID.NL
          {" "}· Powered by <span style={{color:T.yellow}}>Cytrus</span> AI
        </div>
      </div>
    </div>
  );
}
