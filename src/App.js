import { useState, useCallback } from "react";

const DARK = {
  bg:"#080808", surface:"#0D0D0D", surface2:"#131313", surface3:"#181818",
  border:"#1C1C1C", border2:"#242424",
  text:"#E8E8E3", textSub:"#777777", textMuted:"#383838",
  yellow:"#F0C419", yellowD:"#C9A20E",
  red:"#C0392B", green:"#27AE60", blue:"#2471A3",
  calBg:"#080808", calCell:"#080808",
  pillReview:"#C0392B18", pillReviewBorder:"#C0392B55", pillReviewText:"#C0392B",
  pillInwerk:"#F0C41914", pillInwerkBorder:"#F0C41940", pillInwerkText:"#C9A20E",
  histBg:"#0A0A0A", badge:"#0D1520", badgeBorder:"#1A2535", badgeText:"#2471A3",
  treatBg:"#0D0D0D", treatBorder:"#1C1C1C",
  isDark:true,
};
const LIGHT = {
  bg:"#F5F4EF", surface:"#FFFFFF", surface2:"#EFEDE7", surface3:"#E6E4DE",
  border:"#DDDBD3", border2:"#CECCС4",
  text:"#111111", textSub:"#555555", textMuted:"#AAAAAA",
  yellow:"#D4A017", yellowD:"#B8880F",
  red:"#B03020", green:"#1E7A40", blue:"#1A5078",
  calBg:"#FFFFFF", calCell:"#FAFAF6",
  pillReview:"#B0302012", pillReviewBorder:"#B0302044", pillReviewText:"#B03020",
  pillInwerk:"#D4A01712", pillInwerkBorder:"#D4A01740", pillInwerkText:"#8A6800",
  histBg:"#F0EEE8", badge:"#EAF0F8", badgeBorder:"#C0D0E0", badgeText:"#1A5078",
  treatBg:"#F8F8F5", treatBorder:"#DDDBD3",
  isDark:false,
};

const TODAY = new Date(); TODAY.setHours(0,0,0,0);
function parseDate(s){ const d=new Date(s); d.setHours(0,0,0,0); return d; }
function daysFrom(s){ return Math.round((parseDate(s)-TODAY)/86400000); }
function isExpired(item){ return daysFrom(item.reviewDeadline||item.inwerking)<0; }

const MONTHS_NL = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
const MONTHS_SH = ["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];

const CAT_DOT = {
  "Digitalisering":"#4A90D9","Omgeving & Ruimte":"#2EAA6E","Privacy":"#7B5EA7",
  "Sociaal Domein":"#C8852A","Transparantie":"#2A9DB5","Financiën":"#C9A20E",
};

const ORG_TYPES = [
  { id:"gemeente", label:"Gemeente" },
  { id:"provincie", label:"Provincie" },
  { id:"waterschap", label:"Waterschap" },
  { id:"ggd", label:"GGD / Veiligheidsregio" },
  { id:"omgevingsdienst", label:"Omgevingsdienst" },
  { id:"rijksoverheid", label:"Rijksoverheid" },
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
    rawSummary:"Uitbreiding van de actieve openbaarmakingsplicht: meer documentcategorieën (waaronder subsidiebesluiten, convenanten en onderzoeksrapporten) moeten proactief via PLOOI worden gepubliceerd.",
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
    rawSummary:"Fase 2 verplicht bestuursorganen digitale berichten van burgers te accepteren als officieel verkeer. Organisaties moeten digitale ontvangstbevestigingen sturen en termijnen digitaal borgen.",
    score:null, aiSummary:null, expanded:false, loading:false },
];

const CATS = [...new Set(SEED.map(i=>i.category))];

function scoreLevel(s){ if(!s) return null; if(s>=8) return "high"; if(s>=5) return "medium"; return "low"; }
function SC(T){ return {
  high:  { border:T.red,    text:T.red,    label:"Kritiek" },
  medium:{ border:T.yellow, text:T.yellowD, label:"Belangrijk" },
  low:   { border:T.green,  text:T.green,  label:"Normaal" },
};}

// ── AI prompt — very specific, content-driven ───────────────────
async function fetchAI(item, orgType) {
  const orgLabel = ORG_TYPES.find(o=>o.id===orgType)?.label || "Gemeente";
  const prompt = `Je bent een gespecialiseerde juridisch-organisatorisch adviseur voor Nederlandse ${orgLabel}s. Analyseer onderstaande wetgeving en geef een uitvoerbaar advies.

WETGEVING:
Titel: ${item.title}
Categorie: ${item.category}
Bron: ${item.sourceRef}
Inwerkingtreding: ${item.inwerking}
Review deadline: ${item.reviewDeadline||"n.v.t."}
Inhoud: ${item.rawSummary}
Tags: ${item.tags.join(", ")}

INSTRUCTIES — wees uiterst specifiek op de inhoud van DEZE wetgeving:

1. "watVerandert": Beschrijf exact welke artikelen, verplichtingen of bevoegdheden veranderen. Benoem concrete systemen of processen die geraakt worden bij een ${orgLabel} (bijv. bij AVG: FG-rapportageformat, verwerkingsregister in AVG-tool, bewerkersovereenkomsten). Geen algemeenheden.

2. "risicoBijNietHandelen": Noem de specifieke wettelijke sancties, toezichthouders (AP, ILT, etc.) en juridische aansprakelijkheid die relevant zijn voor DEZE wet bij een ${orgLabel}.

3. "behandelvoorstel.stap1/2/3": Elke stap moet direct voortvloeien uit de inhoud van deze specifieke wet. Bijv. voor Woo: "Stel een inventarisatie op van alle subsidiebesluiten, convenanten en onderzoeksrapporten van de afgelopen 5 jaar die onder de nieuwe openbaarmakingsplicht vallen en nog niet via PLOOI zijn gepubliceerd." Niet generiek zoals "overleg beleggen".

4. "behandelvoorstel.quickWin": Eén actie die deze week gedaan kan worden en direct zichtbaar risico verlaagt, specifiek voor DEZE wet.

5. "afdelingen": Noem de exacte afdelingsnamen of functies binnen een ${orgLabel} die door DEZE wet geraakt worden.

Geef ALLEEN dit JSON terug (geen markdown, geen backticks):
{
  "score": <1-10>,
  "samenvatting": "<2-3 zinnen die uitleggen wat er inhoudelijk verandert en wat dat betekent voor de dagelijkse praktijk van een ${orgLabel}>",
  "watVerandert": "<Specifiek: welke verplichtingen, systemen, rollen of documenten veranderen door DEZE wet bij een ${orgLabel}>",
  "risicoBijNietHandelen": "<Specifiek: welke sancties, boetes of juridische gevolgen volgen uit DEZE wet als een ${orgLabel} niet handelt>",
  "afdelingen": ["<exacte afdeling of rol>", "<exacte afdeling of rol>"],
  "behandelvoorstel": {
    "quickWin": "<Eén concrete actie direct uit de inhoud van deze wet, uitvoerbaar binnen één week>",
    "stap1": "<Eerste stap direct gerelateerd aan de specifieke verplichtingen van DEZE wet>",
    "stap2": "<Tweede stap — een concreet document, systeem of proces dat aangepast moet worden>",
    "stap3": "<Derde stap — implementatie of naleving specifiek voor DEZE wet bij een ${orgLabel}>",
    "eigenaar": "<Specifieke functionaris, bijv. FG, CIO, directeur sociaal domein, gemeentesecretaris>",
    "tijdlijn": "<Realistische fasering in weken/maanden>"
  }
}`;

  const r = await fetch("/api/analyze", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ prompt })
  });
  const d = await r.json();
  if(!r.ok) throw new Error(d.error||"API error");
  return JSON.parse(d.result);
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
  const weeks=[]; for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));

  const dayMap={};
  items.forEach(item=>{
    [[item.reviewDeadline,"review"],[item.inwerking,"inwerking"]].forEach(([ds,type])=>{
      if(!ds) return;
      const dt=parseDate(ds);
      if(dt.getFullYear()===year && dt.getMonth()===selMonth){
        const day=dt.getDate();
        if(!dayMap[day]) dayMap[day]=[];
        dayMap[day].push({item,type});
      }
    });
  });

  const todayDay = TODAY.getMonth()===selMonth?TODAY.getDate():null;
  const selEvents = selDay?(dayMap[selDay]||[]):[];

  return (
    <div style={{background:T.calBg,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px 24px",borderBottom:`1px solid ${T.border}`,background:T.surface}}>
        <button onClick={()=>setSelMonth(m=>m===0?11:m-1)} style={{
          background:"none",border:`1px solid ${T.border}`,color:T.text,
          borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16,
          display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:16,fontWeight:700,color:T.text}}>{MONTHS_NL[selMonth]} {TODAY.getFullYear()}</div>
        </div>
        <button onClick={()=>setSelMonth(m=>m===11?0:m+1)} style={{
          background:"none",border:`1px solid ${T.border}`,color:T.text,
          borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16,
          display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>

      {/* Day names */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
        background:T.surface2,borderBottom:`1px solid ${T.border}`}}>
        {["Ma","Di","Wo","Do","Vr","Za","Zo"].map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:10,color:T.textMuted,
            fontWeight:700,letterSpacing:1.5,padding:"8px 0",textTransform:"uppercase"}}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      {weeks.map((week,wi)=>(
        <div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
          borderBottom:wi<weeks.length-1?`1px solid ${T.border}`:"none"}}>
          {week.map((day,di)=>{
            if(!day) return <div key={di} style={{minHeight:80,background:T.calBg,
              borderLeft:di>0?`1px solid ${T.border}`:"none"}}/>;
            const events=dayMap[day]||[];
            const isToday=day===todayDay;
            const isSel=day===selDay;
            const isPast=new Date(year,selMonth,day)<TODAY;
            const reviews=events.filter(e=>e.type==="review");
            const inwerkings=events.filter(e=>e.type==="inwerking");
            return (
              <div key={day} onClick={()=>events.length>0&&setSelDay(day===selDay?null:day)}
                style={{minHeight:80,padding:"7px 6px",
                  background:isSel?(T.isDark?"#141200":"#FFFCE8"):T.calCell,
                  borderLeft:di>0?`1px solid ${T.border}`:"none",
                  cursor:events.length?"pointer":"default"}}>
                <div style={{width:24,height:24,borderRadius:"50%",display:"flex",
                  alignItems:"center",justifyContent:"center",marginBottom:4,
                  background:isSel?T.yellow:"none",
                  outline:isToday&&!isSel?`1px solid ${T.yellow}`:"none"}}>
                  <span style={{fontSize:12,fontWeight:isSel||isToday?700:400,
                    color:isSel?(T.isDark?"#000":"#000"):isToday?T.yellow:isPast?T.textMuted:T.text}}>
                    {day}
                  </span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {reviews.slice(0,2).map((e,i)=>(
                    <div key={i} style={{background:T.pillReview,border:`1px solid ${T.pillReviewBorder}`,
                      borderRadius:3,padding:"2px 5px",fontSize:9,color:T.pillReviewText,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.6}}>
                      {e.item.title.split("—")[0].trim().slice(0,18)}
                    </div>
                  ))}
                  {inwerkings.slice(0,2).map((e,i)=>(
                    <div key={i} style={{background:T.pillInwerk,border:`1px solid ${T.pillInwerkBorder}`,
                      borderRadius:3,padding:"2px 5px",fontSize:9,color:T.pillInwerkText,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.6}}>
                      {e.item.title.split("—")[0].trim().slice(0,18)}
                    </div>
                  ))}
                  {events.length>4&&<div style={{fontSize:8,color:T.textMuted}}>+{events.length-4}</div>}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Selected day */}
      {selDay&&selEvents.length>0&&(
        <div style={{borderTop:`1px solid ${T.yellow}`,background:T.surface,padding:"14px 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:12,fontWeight:700,color:T.yellow,letterSpacing:1,textTransform:"uppercase"}}>
              {selDay} {MONTHS_SH[selMonth]} — {selEvents.length} item{selEvents.length>1?"s":""}
            </span>
            <button onClick={()=>setSelDay(null)} style={{background:"none",border:"none",
              color:T.textMuted,cursor:"pointer",fontSize:14}}>✕</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {selEvents.map((e,i)=>{
              const isReview=e.type==="review";
              return (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  gap:12,background:T.surface2,borderRadius:7,padding:"10px 14px",
                  borderLeft:`2px solid ${isReview?T.red:T.yellow}`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,color:isReview?T.red:T.yellowD,fontWeight:600,
                      marginBottom:2,textTransform:"uppercase",letterSpacing:0.8}}>
                      {isReview?"Review deadline":"Inwerkingtreding"}
                    </div>
                    <div style={{fontSize:13,color:T.text,fontWeight:600,lineHeight:1.35}}>
                      {e.item.title}
                    </div>
                    <div style={{fontSize:10,color:T.textSub,marginTop:2}}>
                      {e.item.category} · {e.item.sourceRef}
                    </div>
                  </div>
                  <button onClick={()=>onGoToFeed(e.item.id)}
                    style={{background:T.yellow,color:"#000",border:"none",
                      borderRadius:6,padding:"6px 12px",fontSize:11,
                      fontWeight:700,cursor:"pointer",flexShrink:0}}>
                    Bekijk →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{display:"flex",gap:16,padding:"8px 20px",
        borderTop:`1px solid ${T.border}`,background:T.surface2}}>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:T.textMuted}}>
          <div style={{width:8,height:8,borderRadius:1,background:T.pillReview,
            border:`1px solid ${T.pillReviewBorder}`}}/>
          Review deadline
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:T.textMuted}}>
          <div style={{width:8,height:8,borderRadius:1,background:T.pillInwerk,
            border:`1px solid ${T.pillInwerkBorder}`}}/>
          Inwerkingtreding
        </div>
      </div>
    </div>
  );
}

// ── Feed card — calm, editorial style ───────────────────────────
function FeedCard({ T, item, onAnalyze, onToggle, isHistory, orgType, setOrgType }) {
  const lvl=scoreLevel(item.score);
  const sc=lvl?SC(T)[lvl]:null;
  const catDot=CAT_DOT[item.category]||T.textMuted;
  const d=item.reviewDeadline||item.inwerking;
  const days=daysFrom(d);

  return (
    <div id={`card-${item.id}`} style={{
      background:isHistory?T.histBg:T.surface,
      border:`1px solid ${T.border}`,
      borderLeft:`3px solid ${sc?sc.border:T.border2}`,
      borderRadius:8,overflow:"hidden",
      opacity:isHistory?0.72:1,
    }}>
      {isHistory&&(
        <div style={{padding:"3px 16px",borderBottom:`1px solid ${T.border}`}}>
          <span style={{fontSize:9,color:T.textMuted,letterSpacing:1.5,textTransform:"uppercase"}}>
            Afgehandeld · review was {item.reviewDeadline}
          </span>
        </div>
      )}

      {/* Card header */}
      <div style={{padding:"13px 16px",cursor:"pointer"}} onClick={()=>onToggle(item.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            {/* Meta row */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:catDot,flexShrink:0}}/>
                <span style={{fontSize:10,color:T.textSub,fontWeight:500}}>{item.category}</span>
              </div>
              <span style={{color:T.border2}}>·</span>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer"
                onClick={e=>e.stopPropagation()}
                style={{fontSize:10,color:T.blue,textDecoration:"none",fontFamily:"monospace"}}>
                {item.sourceRef}
              </a>
              {sc&&(
                <span style={{fontSize:9,color:sc.text,fontWeight:700,
                  letterSpacing:0.8,textTransform:"uppercase",marginLeft:2}}>
                  {sc.label}{item.score?" "+item.score+"/10":""}
                </span>
              )}
            </div>
            {/* Title */}
            <div style={{fontSize:14,fontWeight:600,color:isHistory?T.textSub:T.text,
              lineHeight:1.45,marginBottom:5}}>
              {item.title}
            </div>
            {/* Dates */}
            <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:11,color:T.textMuted}}>
              <span>Gepubliceerd {item.pubDate}</span>
              <span style={{color:!isHistory&&days<60?T.yellowD:T.textMuted}}>
                Inwerkingtreding {item.inwerking}
              </span>
              {item.reviewDeadline&&(
                <span style={{color:isHistory?T.textMuted:days<0?T.textMuted:days<14?T.red:T.textMuted}}>
                  Review {item.reviewDeadline}{!isHistory&&days>=0?` · ${days}d`:""}
                </span>
              )}
            </div>
          </div>
          <span style={{color:T.textMuted,fontSize:10,flexShrink:0,marginTop:3}}>
            {item.expanded?"▲":"▼"}
          </span>
        </div>
      </div>

      {/* Expanded body */}
      {item.expanded&&(
        <div style={{borderTop:`1px solid ${T.border}`,padding:"14px 16px"}}>
          {/* Tags */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
            {item.tags.map(t=>(
              <span key={t} style={{background:"none",color:T.textMuted,
                border:`1px solid ${T.border}`,borderRadius:3,
                fontSize:10,padding:"1px 6px"}}>{t}</span>
            ))}
          </div>

          <p style={{fontSize:13,color:T.textSub,lineHeight:1.75,marginBottom:14}}>
            {item.rawSummary}
          </p>

          {/* Source */}
          <a href={item.sourceUrl} target="_blank" rel="noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:6,
              fontSize:11,color:T.blue,textDecoration:"none",
              borderBottom:`1px solid ${T.blue}44`,paddingBottom:1,marginBottom:16}}>
            Officiële bron: {item.sourceRef}
          </a>

          {/* Org type selector */}
          {!item.aiSummary&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:T.textMuted,fontWeight:600,
                letterSpacing:1,textTransform:"uppercase",marginBottom:7}}>
                Analyseren voor:
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {ORG_TYPES.map(o=>(
                  <button key={o.id} onClick={()=>setOrgType(o.id)}
                    style={{
                      background:orgType===o.id?T.yellow:"none",
                      color:orgType===o.id?"#000":T.textSub,
                      border:`1px solid ${orgType===o.id?T.yellow:T.border}`,
                      borderRadius:4,padding:"4px 10px",fontSize:11,
                      fontWeight:orgType===o.id?700:400,cursor:"pointer"}}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI analysis */}
          {item.aiSummary?(
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14}}>

              {/* Header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:11,fontWeight:700,color:T.text,letterSpacing:0.5}}>
                  Analyse voor {ORG_TYPES.find(o=>o.id===orgType)?.label}
                  {sc&&<span style={{marginLeft:8,fontSize:10,color:sc.text,fontWeight:600}}>
                    — {sc.label} ({item.score}/10)
                  </span>}
                </div>
                <button onClick={()=>onAnalyze(item.id,true)}
                  style={{background:"none",border:`1px solid ${T.border}`,
                    color:T.textMuted,borderRadius:4,padding:"3px 8px",
                    fontSize:10,cursor:"pointer"}}>
                  Heranalyseer
                </button>
              </div>

              <p style={{fontSize:13,color:T.text,lineHeight:1.75,marginBottom:12}}>
                {item.aiSummary.samenvatting}
              </p>

              {/* Two columns */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <div style={{background:T.surface2,borderRadius:6,padding:"11px 13px"}}>
                  <div style={{fontSize:9,color:T.textMuted,fontWeight:700,
                    letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>
                    Wat verandert
                  </div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.65}}>
                    {item.aiSummary.watVerandert}
                  </div>
                </div>
                <div style={{background:T.surface2,borderRadius:6,padding:"11px 13px"}}>
                  <div style={{fontSize:9,color:T.red,fontWeight:700,
                    letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>
                    Risico bij niet-handelen
                  </div>
                  <div style={{fontSize:12,color:T.text,lineHeight:1.65}}>
                    {item.aiSummary.risicoBijNietHandelen}
                  </div>
                </div>
              </div>

              {/* Afdelingen */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap",
                alignItems:"center",marginBottom:14}}>
                <span style={{fontSize:10,color:T.textMuted,marginRight:2}}>Betrokken:</span>
                {(item.aiSummary.afdelingen||[]).map(a=>(
                  <span key={a} style={{background:T.surface2,color:T.textSub,
                    border:`1px solid ${T.border}`,borderRadius:3,
                    fontSize:10,padding:"2px 8px"}}>{a}</span>
                ))}
              </div>

              {/* Behandelvoorstel */}
              {item.aiSummary.behandelvoorstel&&(
                <div style={{background:T.treatBg,border:`1px solid ${T.border}`,
                  borderRadius:8,padding:"14px 16px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.text,
                    letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>
                    Behandelvoorstel
                  </div>

                  {/* Quick win */}
                  {item.aiSummary.behandelvoorstel.quickWin&&(
                    <div style={{borderLeft:`2px solid ${T.yellow}`,paddingLeft:12,
                      marginBottom:12}}>
                      <div style={{fontSize:9,color:T.yellowD,fontWeight:700,
                        letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>
                        Direct uitvoerbaar
                      </div>
                      <div style={{fontSize:12,color:T.text,lineHeight:1.65}}>
                        {item.aiSummary.behandelvoorstel.quickWin}
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12}}>
                    {[
                      {key:"stap1",num:"1"},
                      {key:"stap2",num:"2"},
                      {key:"stap3",num:"3"},
                    ].filter(s=>item.aiSummary.behandelvoorstel[s.key]).map(({key,num})=>(
                      <div key={key} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                        <span style={{fontSize:10,fontWeight:700,color:T.textMuted,
                          minWidth:14,marginTop:2,fontFamily:"monospace"}}>{num}.</span>
                        <div style={{fontSize:12,color:T.text,lineHeight:1.65}}>
                          {item.aiSummary.behandelvoorstel[key]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{display:"flex",gap:20,borderTop:`1px solid ${T.border}`,
                    paddingTop:10,flexWrap:"wrap"}}>
                    {item.aiSummary.behandelvoorstel.eigenaar&&(
                      <div style={{fontSize:11,color:T.textSub}}>
                        <span style={{color:T.text,fontWeight:600}}>Eigenaar</span>{" "}
                        {item.aiSummary.behandelvoorstel.eigenaar}
                      </div>
                    )}
                    {item.aiSummary.behandelvoorstel.tijdlijn&&(
                      <div style={{fontSize:11,color:T.textSub}}>
                        <span style={{color:T.text,fontWeight:600}}>Tijdlijn</span>{" "}
                        {item.aiSummary.behandelvoorstel.tijdlijn}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ):(
            <button onClick={()=>onAnalyze(item.id)} disabled={item.loading}
              style={{background:item.loading?"none":T.yellow,
                color:item.loading?T.textMuted:"#000",
                border:`1px solid ${item.loading?T.border:T.yellow}`,
                borderRadius:6,padding:"9px 18px",fontSize:12,fontWeight:700,
                cursor:item.loading?"default":"pointer"}}>
              {item.loading?"Analyseren…":"Analyse genereren"}
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
  const T = dark?DARK:LIGHT;
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
      const res = await fetchAI(item,orgType);
      setItems(p=>p.map(i=>i.id===id?{...i,loading:false,score:res.score,aiSummary:res}:i));
    } catch {
      const fs={1:9,2:7,3:8,4:6,5:7,6:5,7:8,8:6};
      setItems(p=>p.map(i=>i.id===id?{...i,loading:false,score:fs[id]||7,aiSummary:{
        samenvatting:"Analyse tijdelijk niet beschikbaar. Probeer het opnieuw.",
        watVerandert:"Zie officiële bron voor details.",
        risicoBijNietHandelen:"Raadpleeg de officiële bekendmaking.",
        afdelingen:["Juridische Zaken"],
        behandelvoorstel:{quickWin:"Officiële bron raadplegen.",stap1:"Impact inventariseren.",
          stap2:"Implementatieplan opstellen.",stap3:"Uitvoeren en borgen.",
          eigenaar:"Verantwoordelijk directeur",tijdlijn:"Nader te bepalen"}
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

  const activeItems=items.filter(i=>!isExpired(i));
  const historyItems=items.filter(i=>isExpired(i));
  const filtered=activeItems
    .filter(i=>(catFilter==="all"||i.category===catFilter)&&
      (!search||i.title.toLowerCase().includes(search.toLowerCase())||
       i.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()))))
    .sort((a,b)=>(b.score||0)-(a.score||0));
  const filteredHistory=historyItems
    .filter(i=>(catFilter==="all"||i.category===catFilter)&&
      (!search||i.title.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>new Date(b.reviewDeadline||b.inwerking)-new Date(a.reviewDeadline||a.inwerking));

  const highCount=activeItems.filter(i=>scoreLevel(i.score)==="high").length;
  const analyzedCount=items.filter(i=>i.score).length;
  const upcoming30=activeItems.filter(i=>{const d=daysFrom(i.reviewDeadline||i.inwerking);return d>=0&&d<=30;}).length;

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,
      fontFamily:"'DM Sans','IBM Plex Sans',system-ui,sans-serif",transition:"background 0.25s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        button:hover:not(:disabled){opacity:0.78} a:hover{opacity:0.75}
        input,select{outline:none}
      `}</style>

      {/* Topbar */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"0 28px",
        display:"flex",alignItems:"center",justifyContent:"space-between",height:50,
        position:"sticky",top:0,zIndex:100,background:T.bg}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src="/cytrus-logo.jpg" alt="Cytrus"
            style={{height:28,width:"auto",borderRadius:3,
              filter:dark?"brightness(10)":"invert(1)"}}/>
          <span style={{color:T.border,margin:"0 2px"}}>|</span>
          <span style={{fontSize:14,fontWeight:700,color:T.text}}>
            Wetswijzigings<span style={{color:T.yellow}}>Monitor</span>
          </span>
          <span style={{color:T.border,margin:"0 2px"}}>|</span>
          <span style={{fontSize:10,color:T.textMuted,letterSpacing:1.2,textTransform:"uppercase"}}>
            Publieke Sector
          </span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {highCount>0&&(
            <span style={{fontSize:10,color:T.red,fontWeight:600}}>
              {highCount} kritiek
            </span>
          )}
          <span style={{fontSize:10,color:T.textMuted,fontFamily:"monospace"}}>
            {analyzedCount}/{items.length}
          </span>
          <button onClick={()=>setDark(d=>!d)}
            style={{background:"none",border:`1px solid ${T.border}`,
              borderRadius:4,padding:"4px 10px",color:T.textSub,
              fontSize:11,cursor:"pointer"}}>
            {dark?"Light":"Dark"}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"8px 28px",
        display:"flex",gap:0,alignItems:"center",background:T.surface}}>
        {[
          {label:"Actief",val:activeItems.length},
          {label:"Kritiek",val:highCount},
          {label:"30 dagen",val:upcoming30},
          {label:"Geanalyseerd",val:analyzedCount},
          {label:"Historie",val:historyItems.length},
        ].map(s=>(
          <div key={s.label} style={{padding:"0 16px",borderRight:`1px solid ${T.border}`,
            textAlign:"center",minWidth:70}}>
            <div style={{fontSize:17,fontWeight:700,color:T.text,fontFamily:"monospace",lineHeight:1}}>
              {s.val}
            </div>
            <div style={{fontSize:9,color:T.textMuted,textTransform:"uppercase",
              letterSpacing:1.2,marginTop:2}}>{s.label}</div>
          </div>
        ))}
        <div style={{paddingLeft:16,marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <select value={orgType} onChange={e=>setOrgType(e.target.value)}
            style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:6,
              padding:"5px 10px",color:T.text,fontSize:11,cursor:"pointer"}}>
            {ORG_TYPES.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <div style={{display:"flex",border:`1px solid ${T.border}`,borderRadius:6,overflow:"hidden"}}>
            {[["agenda","Agenda"],["feed","Feed"]].map(([v,label])=>(
              <button key={v} onClick={()=>setActiveTab(v)}
                style={{background:activeTab===v?T.yellow:T.surface2,
                  color:activeTab===v?"#000":T.textMuted,
                  border:"none",padding:"5px 14px",fontSize:11,fontWeight:activeTab===v?700:400,
                  cursor:"pointer"}}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={handleAnalyzeAll}
            disabled={globalLoading||analyzedCount===items.length}
            style={{background:globalLoading||analyzedCount===items.length?"none":T.yellow,
              color:globalLoading||analyzedCount===items.length?T.textMuted:"#000",
              border:`1px solid ${globalLoading||analyzedCount===items.length?T.border:T.yellow}`,
              borderRadius:6,padding:"5px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
            {globalLoading?"Analyseren…":"Alles analyseren"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 24px"}}>

        {activeTab==="agenda"&&(
          <div style={{animation:"fadeUp 0.2s ease"}}>
            <BigCalendar T={T} items={items} selMonth={selMonth} setSelMonth={setSelMonth}
              selDay={selDay} setSelDay={setSelDay} onGoToFeed={goToFeed}/>
            <div style={{marginTop:24}}>
              <div style={{fontSize:10,fontWeight:700,color:T.textMuted,letterSpacing:1.5,
                textTransform:"uppercase",marginBottom:12}}>Komende deadlines</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
                {[...activeItems]
                  .sort((a,b)=>new Date(a.reviewDeadline||a.inwerking)-new Date(b.reviewDeadline||b.inwerking))
                  .slice(0,8).map(item=>{
                    const d=item.reviewDeadline||item.inwerking;
                    const days=daysFrom(d);
                    const isReview=!!item.reviewDeadline;
                    const urgColor=days<14?T.red:days<45?T.yellowD:T.textMuted;
                    const lvl=scoreLevel(item.score);
                    const sc=lvl?SC(T)[lvl]:null;
                    return (
                      <div key={item.id} style={{background:T.surface,
                        border:`1px solid ${T.border}`,borderRadius:7,
                        padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                        <div style={{minWidth:40,textAlign:"center",background:T.surface2,
                          borderRadius:5,padding:"5px 3px"}}>
                          <div style={{fontSize:18,fontWeight:800,color:urgColor,
                            lineHeight:1,fontFamily:"monospace"}}>{days}</div>
                          <div style={{fontSize:8,color:T.textMuted,textTransform:"uppercase",
                            letterSpacing:1}}>d</div>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:9,color:isReview?T.red:T.yellowD,
                            fontWeight:600,marginBottom:2,textTransform:"uppercase",letterSpacing:0.8}}>
                            {isReview?"Review":"Inwerking"} · {d}
                          </div>
                          <div style={{fontSize:12,color:T.text,fontWeight:500,lineHeight:1.35,
                            whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                            {item.title}
                          </div>
                          {sc&&<div style={{fontSize:9,color:sc.text,marginTop:2,fontWeight:600}}>
                            {sc.label}
                          </div>}
                        </div>
                        <button onClick={()=>goToFeed(item.id)}
                          style={{background:"none",border:`1px solid ${T.border}`,
                            color:T.textSub,borderRadius:4,padding:"3px 7px",
                            fontSize:10,cursor:"pointer",flexShrink:0,alignSelf:"center"}}>→</button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {activeTab==="feed"&&(
          <div style={{animation:"fadeUp 0.2s ease"}}>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Zoeken…"
                style={{flex:1,minWidth:160,background:T.surface,
                  border:`1px solid ${T.border}`,borderRadius:6,
                  padding:"7px 12px",color:T.text,fontSize:12}}/>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
                style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,
                  padding:"7px 10px",color:catFilter==="all"?T.textMuted:T.text,
                  fontSize:12,cursor:"pointer"}}>
                <option value="all">Alle categorieën</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {filtered.map(item=>(
                <FeedCard key={item.id} T={T} item={item} onAnalyze={handleAnalyze}
                  onToggle={toggleItem} isHistory={false} orgType={orgType} setOrgType={setOrgType}/>
              ))}
            </div>
            {historyItems.length>0&&(
              <div style={{marginTop:24}}>
                <button onClick={()=>setShowHistory(h=>!h)}
                  style={{display:"flex",alignItems:"center",gap:8,background:"none",
                    border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 14px",
                    color:T.textMuted,fontSize:11,cursor:"pointer",width:"100%",
                    marginBottom:showHistory?10:0}}>
                  <span>{showHistory?"▼":"▶"}</span>
                  Historie — {historyItems.length} afgehandeld
                  <span style={{marginLeft:"auto",fontSize:10}}>review deadline verstreken</span>
                </button>
                {showHistory&&(
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
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

        <div style={{marginTop:36,paddingTop:20,borderTop:`1px solid ${T.border}`,
          display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <img src="/cytrus-logo.jpg" alt="Cytrus"
            style={{height:22,width:"auto",opacity:0.5,
              filter:dark?"brightness(10)":"invert(1)"}}/>
          <div style={{fontSize:10,color:T.textMuted,textAlign:"center",letterSpacing:1}}>
            Staatsblad · Staatscourant · Kamerstukken · wetten.overheid.nl
          </div>
          <div style={{fontSize:10,color:T.textMuted,letterSpacing:0.5}}>
            © 2026 Cytrus Consultancy v.o.f. — All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
}
