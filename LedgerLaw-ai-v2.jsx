import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

const T={bg:"#F4F6F9",srf:"#FFF",srfAlt:"#F8F9FC",hov:"#EDF0F5",bdr:"#DEE3EB",bdrL:"#EAEFF5",
steel:"#4A6E8B",steelD:"#3B5E7A",steelL:"#6A92B0",steelDim:"rgba(74,110,139,.07)",
sage:"#5B7A6B",gold:"#9A7E3A",tx:"#1B2838",tx2:"#3A4F63",txM:"#6B8093",txD:"#9CAEB9",
green:"#2D8A55",greenDim:"rgba(45,138,85,.07)",grn:"#2D8A55",grnDim:"rgba(45,138,85,.07)",
red:"#C0392B",redDim:"rgba(192,57,43,.06)",warn:"#B8860B",warnDim:"rgba(184,134,11,.10)",
purple:"#6D4C9F",purpleDim:"rgba(109,76,159,.10)",pur:"#6D4C9F",
blue:"#2E7CB8",blueDim:"rgba(46,124,184,.10)",blu:"#2E7CB8",bluDim:"rgba(46,124,184,.10)",
white:"#FFF",
sb:"#1B2838",sbTx:"#B0C4D6",sbAct:"#FFF",sbAc:"#5B9BD5",sbH:"rgba(91,155,213,.12)",sbD:"rgba(255,255,255,.08)"};

const css=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',system-ui,sans-serif;background:${T.bg};color:${T.tx};-webkit-font-smoothing:antialiased}
input,select,textarea{font-family:inherit;font-size:13px;padding:8px 12px;border:1px solid ${T.bdr};border-radius:8px;background:${T.white};color:${T.tx};outline:none;width:100%;transition:border .2s}
input:focus,select:focus,textarea:focus{border-color:${T.steel};box-shadow:0 0 0 3px ${T.steelDim}}
select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B8093' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
label{display:block;font-size:11px;font-weight:600;color:${T.txM};margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em}textarea{resize:vertical;min-height:60px}
@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
::selection{background:${T.steelDim};color:${T.steel}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.bdr};border-radius:3px}`;

const CARRIERS=["Allstate","State Farm","GEICO","Progressive","Farmers","Travelers","USAA","Hartford","Liberty Mutual","Nationwide","MetLife","Erie"];
const CTYPES=["Motor Vehicle Accident","Truck Accident","Motorcycle Accident","Rideshare Accident","Slip & Fall","Premises Liability","Dog Bite","Product Liability","Wrongful Death","Mass Tort"];
const CI={Allstate:{s:"Colossus",a:"Very High",n:"Most wedded to Colossus. Will litigate rather than exceed range."},"State Farm":{s:"ClaimIQ",a:"Medium",n:"Proprietary system. More negotiable."},GEICO:{s:"Internal AI",a:"High",n:"Proprietary. Aggressive on soft tissue."},Progressive:{s:"Colossus",a:"Medium",n:"Adjusters have more latitude."},Farmers:{s:"Colossus",a:"High",n:"Similar approach to Allstate."},Travelers:{s:"Colossus",a:"Low",n:"Most negotiable Colossus user."},USAA:{s:"Colossus",a:"Medium",n:"Generally fairer."},Hartford:{s:"Colossus",a:"Medium",n:"Standard implementation."},"Liberty Mutual":{s:"Colossus",a:"Med-High",n:"Significant reliance."},Nationwide:{s:"Colossus",a:"Medium",n:"Adjusters retain discretion."},MetLife:{s:"Colossus",a:"Medium",n:"Licensed user."},Erie:{s:"Colossus",a:"Low-Med",n:"Less rigid."}};

const CDRIVERS=[
{id:"perm",n:"Permanent Injury",w:"HIGHEST",d:"#1 multiplier. 'Probable permanent' from physician = max severity.",ct:"Injury"},
{id:"sev",n:"Injury Severity Codes",w:"PRIMARY",d:"600+ codes. Demonstrable (MRI verified) scores higher than soft tissue.",ct:"Injury"},
{id:"ama",n:"AMA Impairment Rating",w:"HIGH",d:"#2 factor. Even mild AMA rating dramatically increases range.",ct:"Medical"},
{id:"surg",n:"Surgical Intervention",w:"HIGH",d:"Surgery = major severity increase. Document CPT codes.",ct:"Medical"},
{id:"hosp",n:"Hospital Admission",w:"HIGH",d:"ER + admission weighted heavily vs treat-and-release.",ct:"Medical"},
{id:"demo",n:"Demonstrable Injury",w:"HIGH",d:"Objective evidence (MRI, CT, X-ray) >> soft tissue claims.",ct:"Medical"},
{id:"prog",n:"Prognosis Quality",w:"HIGH",d:"'Probable' not 'possible' — Colossus ignores 'possible'.",ct:"Docs"},
{id:"dur",n:"Treatment Duration",w:"MEDIUM",d:"But DROPS value after ~10 weeks for sprains.",ct:"Treatment"},
{id:"dud",n:"Duties Under Duress",w:"MEDIUM",d:"100s of ADL sub-factors. Specificity = more points.",ct:"Impact"},
{id:"loe",n:"Loss of Enjoyment",w:"MEDIUM",d:"'Stopped coaching soccer' > 'limited activities'.",ct:"Impact"},
{id:"meds",n:"Medications",w:"MEDIUM",d:"Rx narcotics > OTC. Type + duration matters.",ct:"Treatment"},
{id:"pt",n:"Physical Therapy",w:"MEDIUM",d:"Sessions with dates, progress, functional improvements.",ct:"Treatment"},
{id:"anx",n:"Mental Health",w:"CONDITIONAL",d:"ONLY if treated/medicated. Untreated = ignored.",ct:"Impact"},
{id:"gap",n:"Treatment Gaps",w:"NEGATIVE",d:"Gaps >2 weeks significantly reduce value.",ct:"Risk"},
{id:"pre",n:"Pre-Existing",w:"NEGATIVE",d:"Reduces causation. Counter with eggshell plaintiff.",ct:"Risk"},
{id:"venue",n:"Venue",w:"MODIFIER",d:"Geographic location affects benchmark values.",ct:"Modifier"},
{id:"atty",n:"Attorney Record",w:"MODIFIER",d:"Trial record and firm reputation factor in.",ct:"Modifier"},
{id:"agg",n:"Aggravated Liability",w:"MODIFIER",d:"DUI, texting = adjuster offers HIGH end.",ct:"Modifier"},
];

const ICD={
"S13.4":{d:"Cervical sprain (whiplash)",s:"Moderate",p:3},"S16.1":{d:"Cervical muscle strain",s:"Mild-Mod",p:2},
"S33.5":{d:"Lumbar sprain",s:"Moderate",p:3},"M54.5":{d:"Low back pain",s:"Mild",p:2},
"M54.41":{d:"Lumbago with sciatica",s:"Mod-Sev",p:4},"M51.16":{d:"Lumbar disc herniation w/ radiculopathy",s:"Severe",p:6},
"M50.12":{d:"Cervical disc disorder w/ radiculopathy",s:"Severe",p:6},"S06.0":{d:"Concussion",s:"Mod-Sev",p:5},
"S06.309":{d:"Traumatic brain injury",s:"Severe",p:7},"G43.909":{d:"Post-traumatic headache",s:"Moderate",p:3},
"S42.001":{d:"Fracture of clavicle",s:"Mod-Sev",p:5},"S82.001":{d:"Fracture of tibia",s:"Severe",p:6},
"S72.001":{d:"Fracture of femur",s:"V.Severe",p:8},"M75.11":{d:"Rotator cuff tear",s:"Severe",p:6},
"S83.51":{d:"ACL tear",s:"Severe",p:6},"F43.10":{d:"PTSD",s:"Mod-Sev",p:4},
"F32.1":{d:"Major depressive disorder",s:"Moderate",p:3},"G47.00":{d:"Insomnia",s:"Mild-Mod",p:2},
"S32.001":{d:"Lumbar vertebra fracture",s:"V.Severe",p:8},"M47.812":{d:"Cervical spondylosis w/ radiculopathy",s:"Mod-Sev",p:4},
};

const CASES=[
{id:"LL-2026-0041",cl:"Maria Gonzalez",ty:"Motor Vehicle Accident",st:"Draft",dt:"2026-02-10",dm:"—",md:"$42,800",at:"E. Ledger",ca:"Allstate",po:"$100K"},
{id:"LL-2026-0040",cl:"James Watson",ty:"Truck Accident",st:"Sent",dt:"2026-02-08",dm:"$475,000",md:"$112,300",at:"E. Ledger",ca:"State Farm",po:"$500K"},
{id:"LL-2026-0039",cl:"Aisha Patel",ty:"Slip & Fall",st:"In Negotiation",dt:"2026-02-06",dm:"$185,000",md:"$38,700",at:"D. Morales",ca:"GEICO",po:"$250K"},
{id:"LL-2026-0038",cl:"Robert Kim",ty:"Rideshare Accident",st:"Settled",dt:"2026-02-05",dm:"$320,000",md:"$67,200",at:"R. Simmons",ca:"Progressive",po:"$1M"},
{id:"LL-2026-0037",cl:"Emily Parker",ty:"Premises Liability",st:"Review",dt:"2026-02-03",dm:"$210,000",md:"$54,100",at:"R. Simmons",ca:"Travelers",po:"$300K"},
{id:"LL-2026-0036",cl:"Tom Nguyen",ty:"Motorcycle Accident",st:"Sent",dt:"2026-01-28",dm:"$525,000",md:"$134,500",at:"E. Ledger",ca:"Farmers",po:"$500K"},
{id:"LL-2026-0035",cl:"Linda Chavez",ty:"Dog Bite",st:"In Negotiation",dt:"2026-01-22",dm:"$95,000",md:"$22,400",at:"D. Morales",ca:"Hartford",po:"$100K"},
];

const SM={Draft:{c:"#6B8093",bg:"rgba(107,128,147,.1)"},Review:{c:"#B8860B",bg:"rgba(184,134,11,.1)"},Sent:{c:"#2D8A55",bg:"rgba(45,138,85,.1)"},"In Negotiation":{c:"#4A6E8B",bg:"rgba(74,110,139,.12)"},Settled:{c:"#6D4C9F",bg:"rgba(109,76,159,.1)"}};

const sv=(d,s=17)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const I={
dash:sv(<><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>),
folder:sv(<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>),
fp:sv(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></>),
act:sv(<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>),
calc:sv(<><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="8" y1="18" x2="16" y2="18"/></>),
srch:sv(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>),
chat:sv(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>),
gear:sv(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>),
users:sv(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></>),
tgt:sv(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>),
alrt:sv(<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>),
dol:sv(<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>),
brain:sv(<><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></>),
eye:sv(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>),
scale:sv(<><path d="M16 3l5 5-5 5"/><path d="M21 8H9"/><path d="M8 21l-5-5 5-5"/><path d="M3 16h12"/></>),
doc:sv(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>),
zap:sv(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>),
up:sv(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,22),
chk:sv(<polyline points="20 6 9 17 4 12"/>,14),
plus:sv(<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,14),
del:sv(<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,13),
shld:sv(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,14),
clip:sv(<><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>),
clk:sv(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,15),
star:sv(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>),
scl:sv(<><path d="M16 3l5 5-5 5"/><path d="M21 8H9"/><path d="M8 21l-5-5 5-5"/><path d="M3 16h12"/></>),
warn:sv(<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>),
};

const Btn=({children,v="primary",sz="md",icon,onClick,disabled,style:st})=>{
const b={display:"inline-flex",alignItems:"center",gap:6,borderRadius:8,fontWeight:600,cursor:disabled?"not-allowed":"pointer",border:"none",fontSize:sz==="sm"?11:12.5,padding:sz==="sm"?"5px 10px":"8px 16px",opacity:disabled?.5:1,transition:"all .15s",fontFamily:"inherit"};
const vs={primary:{...b,background:T.steel,color:T.white},secondary:{...b,background:T.hov,color:T.tx,border:`1px solid ${T.bdr}`},ghost:{...b,background:"transparent",color:T.txM},danger:{...b,background:T.redDim,color:T.red},success:{...b,background:T.greenDim,color:T.green}};
return <button style={{...vs[v],...st}} onClick={onClick} disabled={disabled}>{icon}{children}</button>;
};
const Card=({children,style:s})=><div style={{background:T.srf,borderRadius:12,border:`1px solid ${T.bdr}`,padding:18,animation:"fadeIn .3s ease",...s}}>{children}</div>;
const Badge=({children,color:c=T.steel})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:20,fontSize:10.5,fontWeight:600,color:c,background:`${c}18`,whiteSpace:"nowrap"}}>{children}</span>;
const Spin=()=><div style={{width:16,height:16,border:`2px solid ${T.bdr}`,borderTopColor:T.steel,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;
const PH=({title,sub,actions})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}><div><h1 style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',serif",lineHeight:1.2}}>{title}</h1>{sub&&<p style={{fontSize:12,color:T.txM,marginTop:2}}>{sub}</p>}</div>{actions&&<div style={{display:"flex",gap:8}}>{actions}</div>}</div>;
const Tabs=({tabs,active:a,onChange:o})=><div style={{display:"flex",gap:2,borderBottom:`1px solid ${T.bdr}`,marginBottom:16}}>{tabs.map(t=><div key={t.k} onClick={()=>o(t.k)} style={{padding:"8px 14px",fontSize:12,fontWeight:a===t.k?600:500,color:a===t.k?T.steel:T.txM,borderBottom:`2px solid ${a===t.k?T.steel:"transparent"}`,cursor:"pointer"}}>{t.l}</div>)}</div>;
const SC=({label,value,sub,icon,color:c=T.steel})=><Card style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:10,background:`${c}11`,display:"flex",alignItems:"center",justifyContent:"center",color:c,flexShrink:0}}>{icon}</div><div><div style={{fontSize:20,fontWeight:700,lineHeight:1.1}}>{value}</div><div style={{fontSize:11,color:T.txM,marginTop:1}}>{label}</div>{sub&&<div style={{fontSize:10,color:c,marginTop:1}}>{sub}</div>}</div></Card>;
const PBar=({pct,color:c=T.steel})=><div style={{height:6,borderRadius:3,background:T.hov,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,borderRadius:3,background:c,transition:"width .5s"}}/></div>;

// ════════════════ SIDEBAR ════════════════
const Sidebar=({pg,go,userSlot})=>{
const nav=[{k:"dash",l:"Dashboard",i:I.dash},{k:"cases",l:"Cases",i:I.folder},{k:"intake",l:"Intake Screening",i:I.clip},{k:"new",l:"New Demand",i:I.fp},"d",{k:"colossus",l:"Reverse Colossus™",i:I.tgt},{k:"objections",l:"Carrier Objections",i:I.alrt},{k:"casevalue",l:"Case Valuation",i:I.dol},"d",{k:"chrono",l:"Med Chronology",i:I.act},{k:"damages",l:"Damages Calc",i:I.calc},{k:"verdicts",l:"Verdict Research",i:I.srch},{k:"icd",l:"ICD Code Engine",i:I.brain},"d",{k:"chat",l:"AI Case Chat",i:I.chat},{k:"ediscovery",l:"eDiscovery",i:I.eye},{k:"contracts",l:"Contract Review",i:I.doc},{k:"drafts",l:"AI Drafts Suite",i:I.scale},"d",{k:"users",l:"Team & Users",i:I.users},{k:"settings",l:"Settings",i:I.gear}];
return(<div style={{width:226,height:"100vh",background:T.sb,display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:200}}>
<div style={{padding:"14px 14px 10px",borderBottom:`1px solid ${T.sbD}`}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect x="2" y="2" width="36" height="36" rx="8" fill={T.sbAc} fillOpacity=".15" stroke={T.sbAc} strokeWidth=".5" strokeOpacity=".3"/><path d="M12 10h2v14h8v2H12V10z" fill={T.sbAc}/><path d="M20 8l8 4v8l-8 4-8-4v-8l8-4z" stroke={T.sbAc} strokeWidth="1.5" fill="none" opacity=".5"/><circle cx="28" cy="12" r="2.5" fill={T.sbAc} opacity=".7"/></svg>
<div><div style={{fontSize:14,fontWeight:700,color:T.sbAct,fontFamily:"'Playfair Display',serif",letterSpacing:".02em"}}>LedgerLaw</div>
<div style={{fontSize:8.5,color:T.sbTx,opacity:.6,letterSpacing:".08em",textTransform:"uppercase"}}>.ai · Intelligence Platform</div></div>
</div></div>
<div style={{flex:1,padding:"6px 6px",overflowY:"auto"}}>{nav.map((it,i)=>it==="d"?<div key={i} style={{height:1,background:T.sbD,margin:"4px 8px"}}/>:(<div key={it.k} onClick={()=>go(it.k)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:7,cursor:"pointer",color:pg===it.k?T.sbAct:T.sbTx,background:pg===it.k?T.sbH:"transparent",fontWeight:pg===it.k?600:500,fontSize:11.5,transition:"all .15s",marginBottom:1}}><span style={{opacity:pg===it.k?1:.5,flexShrink:0}}>{it.i}</span>{it.l}</div>))}</div>
<div style={{padding:"8px 12px",borderTop:`1px solid ${T.sbD}`,display:"flex",alignItems:"center",gap:8}}>{userSlot||<><div style={{width:28,height:28,borderRadius:"50%",background:T.sbH,display:"flex",alignItems:"center",justifyContent:"center",color:T.sbAc,fontSize:11,fontWeight:700}}>EL</div><div><div style={{color:T.sbAct,fontSize:11.5,fontWeight:600}}>E. Ledger</div><div style={{color:T.sbTx,fontSize:9.5,opacity:.7}}>Partner</div></div></>}</div>
</div>);};

// ════════════════ DASHBOARD ════════════════
const Dashboard=({go})=>(<div>
<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",background:`linear-gradient(135deg, ${T.sb} 0%, #1e3a52 50%, ${T.sb} 100%)`,borderRadius:16,marginBottom:20,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 40%, rgba(91,155,213,.08) 0%, transparent 60%)",pointerEvents:"none"}}/>
<svg width="56" height="56" viewBox="0 0 40 40" fill="none" style={{marginBottom:12,position:"relative",zIndex:1}}>
<rect x="2" y="2" width="36" height="36" rx="8" fill={T.sbAc} fillOpacity=".15" stroke={T.sbAc} strokeWidth=".5" strokeOpacity=".3"/>
<path d="M12 10h2v14h8v2H12V10z" fill={T.sbAc}/><path d="M20 8l8 4v8l-8 4-8-4v-8l8-4z" stroke={T.sbAc} strokeWidth="1.5" fill="none" opacity=".5"/>
<circle cx="28" cy="12" r="2.5" fill={T.sbAc} opacity=".7"/></svg>
<div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#fff",letterSpacing:".03em",position:"relative",zIndex:1}}>LedgerLaw<span style={{color:T.sbAc}}>.ai</span></div>
<div style={{fontSize:10,color:T.sbTx,letterSpacing:".15em",textTransform:"uppercase",marginTop:4,position:"relative",zIndex:1}}>AI-Powered Legal Intelligence</div>
<div style={{fontSize:9,color:T.sbTx,opacity:.5,marginTop:6,position:"relative",zIndex:1}}>The Ledger Law Firm · A Professional Law Corporation</div>
</div>
<PH title="Dashboard" sub="Command center — all AI engines active" actions={<Btn icon={I.fp} onClick={()=>go("new")}>New Demand</Btn>}/>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}><SC label="Active Cases" value="42" sub="+3 this week" icon={I.folder} color={T.steel}/><SC label="Demands Generated" value="156" sub="$2.4M demanded" icon={I.fp} color={T.green}/><SC label="Settled This Month" value="8" sub="$1.2M recovered" icon={I.dol} color={T.sage}/><SC label="Avg Generation" value="12 min" sub="vs 3-5 days manual" icon={I.clk} color={T.gold}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Recent Cases</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{borderBottom:`1px solid ${T.bdr}`}}>{["Case","Client","Type","Status","Demand"].map(h=><th key={h} style={{padding:"7px 5px",textAlign:"left",color:T.txM,fontSize:10,fontWeight:600,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
<tbody>{CASES.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bdrL}`,cursor:"pointer"}} onClick={()=>go("cases")}><td style={{padding:"7px 5px",fontWeight:600,color:T.steel,fontSize:11.5}}>{c.id}</td><td style={{padding:"7px 5px"}}>{c.cl}</td><td style={{padding:"7px 5px",color:T.txM,fontSize:11.5}}>{c.ty}</td><td style={{padding:"7px 5px"}}><Badge color={SM[c.st]?.c}>{c.st}</Badge></td><td style={{padding:"7px 5px",fontWeight:600}}>{c.dm}</td></tr>)}</tbody></table></Card>
<div><Card style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:700,marginBottom:8}}>AI Engine Status</div>
{[{n:"Claude API (Sonnet 4)",s:"Connected",c:T.green},{n:"Reverse Colossus™",s:"Active",c:T.green},{n:"Carrier Intel DB",s:"14 carriers",c:T.green},{n:"ICD-10 Database",s:"20+ PI codes",c:T.steel},{n:"Verdict Database",s:"6.5M cases",c:T.green},{n:"Cowork Legal Plugin",s:"Available",c:T.blue}].map(s=><div key={s.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.bdrL}`}}><span style={{fontSize:11.5,color:T.tx2}}>{s.n}</span><Badge color={s.c}>{s.s}</Badge></div>)}</Card>
<Card><div style={{fontSize:13,fontWeight:700,marginBottom:6}}>Monthly Savings</div><div style={{fontSize:26,fontWeight:700,color:T.green}}>$7,450</div><div style={{fontSize:11,color:T.txM,marginTop:2}}>vs. DemandPro/EvenUp pricing</div><div style={{marginTop:8,padding:8,borderRadius:8,background:T.greenDim,fontSize:11,color:T.green}}>LedgerLaw.ai: ~$12/demand × 8 = $96 vs. EvenUp: $500 × 8 = $4,000</div></Card></div>
</div></div>);

// ════════════════ CASES ════════════════
const CasesView=({go})=>(<div><PH title="Cases" sub={`${CASES.length} active`} actions={<Btn icon={I.fp} onClick={()=>go("new")}>New Demand</Btn>}/>
<Card><div style={{display:"flex",gap:8,marginBottom:12}}><input placeholder="Search cases..." style={{maxWidth:260}}/><select style={{maxWidth:160}}><option>All Statuses</option>{Object.keys(SM).map(s=><option key={s}>{s}</option>)}</select><select style={{maxWidth:160}}><option>All Carriers</option>{CARRIERS.map(c=><option key={c}>{c}</option>)}</select></div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{borderBottom:`2px solid ${T.bdr}`}}>{["ID","Client","Type","Carrier","Status","Medicals","Demand","Policy","Attorney"].map(h=><th key={h} style={{padding:"8px 5px",textAlign:"left",color:T.txM,fontSize:10,fontWeight:600,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
<tbody>{CASES.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bdrL}`}}><td style={{padding:"8px 5px",fontWeight:600,color:T.steel}}>{c.id}</td><td style={{padding:"8px 5px"}}>{c.cl}</td><td style={{padding:"8px 5px",color:T.txM,fontSize:11.5}}>{c.ty}</td><td style={{padding:"8px 5px"}}><Badge color={T.tx2}>{c.ca}</Badge></td><td style={{padding:"8px 5px"}}><Badge color={SM[c.st]?.c}>{c.st}</Badge></td><td style={{padding:"8px 5px"}}>{c.md}</td><td style={{padding:"8px 5px",fontWeight:600}}>{c.dm}</td><td style={{padding:"8px 5px"}}>{c.po}</td><td style={{padding:"8px 5px",color:T.txM}}>{c.at}</td></tr>)}</tbody></table></Card></div>);

// ════════════════ INTAKE SCREENING ════════════════
const Intake=()=>{const [d,setD]=useState(false);const [g,setG]=useState(false);
const run=()=>{setG(true);setTimeout(()=>{setG(false);setD(true)},2000)};
return(<div><PH title="AI Intake Screening" sub="Assess case viability and estimate value at intake"/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>New Case Intake</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}><div><label>Client Name</label><input placeholder="Full name"/></div><div><label>Phone</label><input placeholder="(xxx) xxx-xxxx"/></div><div><label>Accident Date</label><input type="date"/></div><div><label>Case Type</label><select>{CTYPES.map(c=><option key={c}>{c}</option>)}</select></div><div><label>Insurance Carrier</label><select>{CARRIERS.map(c=><option key={c}>{c}</option>)}</select></div><div><label>Policy Limit</label><input placeholder="$"/></div></div>
<div style={{marginBottom:10}}><label>Injury Description</label><textarea placeholder="Describe injuries, treatment, imaging..."/></div>
<Btn icon={g?<Spin/>:I.zap} onClick={run} disabled={g}>{g?"Analyzing...":"Screen Case"}</Btn></Card>
{d?(<Card style={{background:`linear-gradient(135deg,${T.greenDim},${T.steelDim})`}}>
<div style={{fontSize:13,fontWeight:700,color:T.green,marginBottom:12}}>✓ Screening Complete</div>
{[{l:"Viability",v:"STRONG",c:T.green,d:"Clear liability, documented injuries, active treatment"},{l:"Value Range",v:"$85K — $175K",c:T.steel,d:"Based on injury type, jurisdiction, carrier"},{l:"Colossus Prediction",v:"$62K — $98K initial",c:T.warn,d:"Carrier will likely start here. Demand higher for negotiation room."},{l:"Action",v:"ACCEPT — Fast Track",c:T.green,d:"Strong case. Begin medical records retrieval immediately."},{l:"Red Flags",v:"1 Found",c:T.warn,d:"2-week treatment gap. Document reason before demand."}].map(r=><div key={r.l} style={{padding:10,borderRadius:8,background:T.srf,border:`1px solid ${T.bdr}`,marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10.5,fontWeight:600,color:T.txM,textTransform:"uppercase"}}>{r.l}</span><Badge color={r.c}>{r.v}</Badge></div><div style={{fontSize:11.5,color:T.tx2}}>{r.d}</div></div>)}
</Card>):(<Card style={{display:"flex",alignItems:"center",justifyContent:"center",color:T.txM,fontSize:12,minHeight:200}}><div style={{textAlign:"center"}}><div style={{marginBottom:6,opacity:.4}}>{I.clip}</div>Complete intake form for instant AI analysis</div></Card>)}
</div></div>);};

// ════════════════ NEW DEMAND ════════════════
const NewDemand=()=>{const [step,setStep]=useState(1);const [gen,setGen]=useState(false);const [done,setDone]=useState(false);
const go=()=>{setGen(true);setTimeout(()=>{setGen(false);setDone(true);setStep(4)},2500)};
return(<div><PH title="Generate AI Demand Letter" sub="Multi-step agentic AI — processes 1,000+ page records"/>
<div style={{display:"flex",gap:3,marginBottom:18}}>{[{n:1,l:"Case Info"},{n:2,l:"Medical Records"},{n:3,l:"Customize"},{n:4,l:"Generated"}].map(s=><div key={s.n} style={{flex:1,padding:"8px 10px",borderRadius:8,background:step>=s.n?T.steelDim:T.hov,border:`1px solid ${step>=s.n?T.steel+"33":"transparent"}`,textAlign:"center"}}><div style={{fontSize:10.5,fontWeight:700,color:step>=s.n?T.steel:T.txD}}>{s.l}</div></div>)}</div>
{step===1&&<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Step 1: Case Information</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}><div><label>Client Name</label><input defaultValue="Maria Gonzalez"/></div><div><label>Case Type</label><select defaultValue="Motor Vehicle Accident">{CTYPES.map(c=><option key={c}>{c}</option>)}</select></div><div><label>Accident Date</label><input type="date" defaultValue="2025-10-15"/></div><div><label>Insurance Carrier</label><select defaultValue="Allstate">{CARRIERS.map(c=><option key={c}>{c}</option>)}</select></div><div><label>Policy Limit</label><input defaultValue="$100,000"/></div><div><label>Attorney</label><input defaultValue="Emery Brett Ledger"/></div></div>
<div style={{marginBottom:12}}><label>Accident Summary</label><textarea defaultValue="Rear-ended at red light on I-5 near Mission Viejo. At-fault driver texting."/></div>
<div style={{display:"flex",justifyContent:"flex-end"}}><Btn onClick={()=>setStep(2)}>Continue →</Btn></div></Card>}
{step===2&&<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Step 2: Upload Medical Records</div>
<div style={{border:`2px dashed ${T.bdr}`,borderRadius:12,padding:36,textAlign:"center",marginBottom:12}}><div style={{color:T.txM,marginBottom:6}}>{I.up}</div><div style={{fontSize:12.5,fontWeight:600}}>Drop medical records here</div><div style={{fontSize:11,color:T.txM,marginTop:3}}>PDF, DOCX, images · 1,000+ pages · Auto-extracts ICD codes</div></div>
<Card style={{background:T.steelDim,border:`1px solid ${T.steel}33`,marginBottom:12}}><div style={{fontSize:11.5,fontWeight:600,color:T.steel,marginBottom:3}}>⚡ 8-Step Agentic Pipeline</div><div style={{fontSize:11,color:T.tx2}}>OCR → Medical event ID → ICD extraction → Chronology → Colossus mapping → SSN/DOB redaction → Narrative generation → Exhibit linking</div></Card>
<div style={{display:"flex",justifyContent:"space-between"}}><Btn v="secondary" onClick={()=>setStep(1)}>← Back</Btn><Btn onClick={()=>setStep(3)}>Continue →</Btn></div></Card>}
{step===3&&<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Step 3: Demand Customization</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}><div><label>Tone</label><select><option>Professional & Firm</option><option>Aggressive</option><option>Collaborative</option></select></div><div><label>Colossus Optimization</label><select><option>Maximum (format for claim software)</option><option>Standard</option></select></div><div><label>Include Verdicts</label><select><option>Yes — attach comparable verdicts</option><option>No</option></select></div><div><label>Amount Strategy</label><select><option>Policy Limits</option><option>2x Medicals</option><option>3x Medicals</option></select></div><div><label>Output</label><select><option>.DOCX on Firm Letterhead</option><option>.PDF</option><option>Both</option></select></div><div><label>Exhibit Hyperlinking</label><select><option>Yes — auto-link exhibits</option><option>No</option></select></div></div>
<div style={{display:"flex",justifyContent:"space-between"}}><Btn v="secondary" onClick={()=>setStep(2)}>← Back</Btn><Btn icon={gen?<Spin/>:I.zap} onClick={go} disabled={gen}>{gen?"Generating (8 AI steps)...":"Generate Demand"}</Btn></div></Card>}
{step===4&&done&&<Card style={{background:`linear-gradient(135deg,${T.greenDim},${T.steelDim})`}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{width:34,height:34,borderRadius:"50%",background:T.green,color:T.white,display:"flex",alignItems:"center",justifyContent:"center"}}>{I.chk}</div><div><div style={{fontSize:15,fontWeight:700,color:T.green}}>Demand Generated</div><div style={{fontSize:11.5,color:T.txM}}>12 pages · Colossus-optimized · Exhibits hyperlinked · SSN/DOB redacted</div></div></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>{[{v:"12",l:"Pages"},{v:"8",l:"ICD Codes"},{v:"5",l:"Exhibits"},{v:"3",l:"SSN Redacted"}].map(x=><div key={x.l} style={{padding:8,borderRadius:8,background:T.srf,textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:T.steel}}>{x.v}</div><div style={{fontSize:10,color:T.txM}}>{x.l}</div></div>)}</div>
<div style={{display:"flex",gap:8}}><Btn icon={I.doc}>Download .DOCX</Btn><Btn v="secondary">View</Btn><Btn v="secondary">Send to Carrier</Btn><Btn v="secondary">Colossus Check</Btn></div></Card>}
</div>);};

// ═══ REVERSE COLOSSUS™ ENGINE ═══
const ReverseColossus=()=>{
  const [car,setCar]=useState("Allstate"),[tab,setTab]=useState("opt");
  const ci=CI[car]||{};
  return(<div>
    <PH title="Reverse Colossus™ Engine" sub="Optimize demands for insurance claim evaluation software" actions={<Badge color={T.gold}>⚡ Proprietary</Badge>}/>
    <Card style={{marginBottom:16,background:`linear-gradient(135deg,${T.steelDim},${T.goldDim})`,border:`1px solid ${T.gold}33`}}>
      <div style={{display:"flex",gap:10}}><span style={{color:T.gold,flexShrink:0}}>{I.tgt}</span><div><div style={{fontWeight:700,fontSize:12.5}}>How This Works</div><div style={{fontSize:11.5,color:T.tx2,marginTop:2,lineHeight:1.45}}>Insurance companies use Colossus (Allstate, Farmers, Progressive), ClaimIQ (State Farm), and proprietary AI (GEICO) with 600–750 injury codes and 10,720+ value-driver rules. This engine reverse-engineers their evaluation — formatting your demand to feed adjusters exactly the data they need to trigger maximum settlement authority. Based on 20+ years of research by Dr. Aaron DeShaw, Esq.</div></div></div>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:16}}>
      <div>
        <Card style={{marginBottom:12}}>
          <label>Insurance Carrier</label>
          <select value={car} onChange={e=>setCar(e.target.value)} style={{marginBottom:12}}>{CARRIERS.map(c=><option key={c}>{c}</option>)}</select>
          <div style={{padding:10,borderRadius:7,background:ci.s==="Colossus"?T.steelDim:T.wrnD,marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:T.txM,textTransform:"uppercase",marginBottom:3}}>Claim Software</div>
            <div style={{fontSize:13.5,fontWeight:700}}>{ci.s}</div>
            <div style={{fontSize:10.5,color:T.txM,marginTop:2}}>Adherence: <strong>{ci.a}</strong></div>
          </div>
          <div style={{fontSize:11,color:T.tx2,lineHeight:1.45}}>{ci.n}</div>
        </Card>
        <Card>
          <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Carriers Using Colossus</div>
          {CARRIERS.filter(c=>CI[c]?.s==="Colossus").map(c=><div key={c} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11}}><span>{c}</span><span style={{color:T.txM,fontSize:10}}>{CI[c]?.a}</span></div>)}
        </Card>
      </div>
      <div>
        <Tabs tabs={[{k:"opt",l:"Demand Optimizer"},{k:"drv",l:`Value Drivers (${CDRIVERS.length})`},{k:"chk",l:"Doc Checklist"}]} a={tab} o={setTab}/>
        {tab==="opt"&&<Card>
          <div style={{fontSize:12.5,fontWeight:700,marginBottom:12}}>Colossus-Optimized Structure for {car}</div>
          {[{n:1,t:"Liability + Aggravators",d:"DUI, texting, speed evidence → adjuster can offer HIGH end of range.",c:T.steel},
            {n:2,t:"Injury Codes & Severity",d:"Every ICD-10 code. Demonstrable first. 'Probable' not 'possible'.",c:T.red},
            {n:3,t:"AMA Impairment Rating",d:"#2 factor. Even mild rating dramatically increases range.",c:T.gold},
            {n:4,t:"Surgery & Hospital",d:"ER admission + surgery = major severity increase. Include CPT codes.",c:T.pur},
            {n:5,t:"Treatment Timeline",d:"Continuous. Gaps >2 weeks reduce value. Document reasons.",c:T.sage},
            {n:6,t:"Duties Under Duress",d:"Specific ADLs: can't lift child, drive, sleep. Each adds points.",c:T.steel},
            {n:7,t:"Loss of Enjoyment",d:"'Stopped coaching soccer' >> 'limited activities'. Be specific.",c:T.steelL},
            {n:8,t:"Prognosis & Permanency ★",d:"CRITICAL: #1 multiplier. 'Probable permanent' = maximum severity.",c:T.red},
            {n:9,t:"Economic Damages",d:"Bills, wages, future costs. Influences authority range.",c:T.grn},
            {n:10,t:"Mental Health (if treated)",d:"Only counted if treated/medicated. Untreated = zero in Colossus.",c:T.blu},
          ].map(x=><div key={x.n} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.bdrL}`}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:`${x.c}18`,color:x.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,flexShrink:0}}>{x.n}</div>
            <div><div style={{fontSize:12,fontWeight:600}}>{x.t}</div><div style={{fontSize:11,color:T.tx2,marginTop:1}}>{x.d}</div></div>
          </div>)}
          <div style={{marginTop:14}}><Btn icon={I.zap}>Generate Colossus-Optimized Demand</Btn></div>
        </Card>}
        {tab==="drv"&&<Card>
          <div style={{fontSize:12.5,fontWeight:700,marginBottom:12}}>All Value Drivers</div>
          {CDRIVERS.map(f=><div key={f.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.bdrL}`}}>
            <Badge color={f.w==="HIGHEST"||f.w==="PRIMARY"||f.w==="HIGH"?T.red:f.w==="NEGATIVE"?T.wrn:f.w==="CONDITIONAL"?T.pur:T.steel}>{f.w}</Badge>
            <div style={{flex:1}}><div style={{fontSize:11.5,fontWeight:600}}>{f.n}</div><div style={{fontSize:10.5,color:T.txM}}>{f.d}</div></div>
            <Badge color={T.txM}>{f.c}</Badge>
          </div>)}
        </Card>}
        {tab==="chk"&&<Card>
          <div style={{fontSize:12.5,fontWeight:700,marginBottom:12}}>Documentation Checklist for {car}</div>
          {["All injuries with ICD-10 codes","'Probable' language (never 'possible')","AMA Impairment Rating","Prognosis: permanent vs temporary explicit","All meds with duration/dosage","PT sessions with dates/progress","Anxiety/depression diagnosed AND treated","Sleep disruption diagnosed","All gaps explained with reasons","Objective imaging correlated to symptoms","Work restrictions on letterhead","Specialist referrals documented","ER records (admission vs T&R)","Pain scale at every visit","ADL limitations in physician notes"].map((x,i)=><label key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:`1px solid ${T.bdrL}`,cursor:"pointer",textTransform:"none",fontWeight:400,fontSize:11.5,color:T.tx2}}><input type="checkbox" style={{width:15,height:15,flexShrink:0}}/>{x}</label>)}
        </Card>}
      </div>
    </div>
  </div>);
};

// ═══ CARRIER OBJECTION PREDICTOR ═══
const CarrierObjections=()=>{
  const [on,setOn]=useState(false);
  const objs=[
    {cat:"Treatment Gaps",sev:"HIGH",p:"12-day gap between ER and first chiro indicates injuries weren't severe.",ctr:"Gap due to insurance authorization wait. Pain persisted per ER discharge instructions."},
    {cat:"Pre-Existing Conditions",sev:"MEDIUM",p:"Prior lumbar issues contributed to symptoms, reducing causation.",ctr:"Physician letter: accident aggravated beyond baseline. Eggshell plaintiff doctrine applies."},
    {cat:"Property Damage Mismatch",sev:"HIGH",p:"Low property damage ($3,200) inconsistent with claimed injuries.",ctr:"No correlation between vehicle damage and injury (Brault et al., 1998). Crumple zones transfer force to occupants."},
    {cat:"Delayed Imaging",sev:"MEDIUM",p:"MRI not ordered until 6 weeks post-accident.",ctr:"Conservative treatment first (4-6 weeks) is standard of care before advanced imaging."},
    {cat:"Subjective Pain",sev:"LOW",p:"Self-reported pain lacks radiological correlation.",ctr:"Pain is subjective. Consistent documentation across providers, pain diary, and medication usage support severity."},
  ];
  return(<div>
    <PH title="Carrier Objection Predictor" sub="Anticipate and counter carrier arguments before they're made" actions={<Badge color={T.red}>AI-Powered</Badge>}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,marginBottom:16}}>
      <div><label>Carrier</label><select>{CARRIERS.map(c=><option key={c}>{c}</option>)}</select></div>
      <div><label>Case Type</label><select>{CTYPES.map(c=><option key={c}>{c}</option>)}</select></div>
      <div><label>Policy Limit</label><input defaultValue="$100,000"/></div>
      <div style={{display:"flex",alignItems:"flex-end"}}><Btn icon={I.tgt} onClick={()=>setOn(true)}>Predict</Btn></div>
    </div>
    {on&&<>
      <Card style={{marginBottom:14,background:T.redD,border:`1px solid ${T.red}22`}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>{I.warn}<span style={{fontWeight:700,fontSize:12.5,color:T.red}}>5 Objections Predicted</span></div>
        <div style={{fontSize:11.5,color:T.tx2,marginTop:3}}>Ranked by probability based on carrier history and case patterns.</div>
      </Card>
      {objs.map((o,i)=><Card key={i} style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700,fontSize:12.5}}>{o.cat}</span><Badge color={o.sev==="HIGH"?T.red:o.sev==="MEDIUM"?T.wrn:T.grn}>{o.sev}</Badge></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{padding:9,borderRadius:7,background:T.redD}}><div style={{fontSize:9.5,fontWeight:700,color:T.red,textTransform:"uppercase",marginBottom:3}}>Carrier Argument</div><div style={{fontSize:11.5,color:T.tx2,lineHeight:1.4}}>{o.p}</div></div>
          <div style={{padding:9,borderRadius:7,background:T.grnD}}><div style={{fontSize:9.5,fontWeight:700,color:T.grn,textTransform:"uppercase",marginBottom:3}}>Counter-Argument</div><div style={{fontSize:11.5,color:T.tx2,lineHeight:1.4}}>{o.ctr}</div></div>
        </div>
      </Card>)}
    </>}
  </div>);
};

// ═══ CASE VALUATION ═══
const CaseValuation=()=>{
  const [done,setD]=useState(false);
  return(<div>
    <PH title="AI Case Valuation" sub="Instant value assessment — surface strongest claims"/>
    <Card style={{marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <div><label>Case Type</label><select>{CTYPES.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label>Jurisdiction</label><select><option>CA — Orange County</option><option>CA — Los Angeles</option><option>CA — San Diego</option></select></div>
        <div><label>Carrier</label><select>{CARRIERS.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label>Medical Bills</label><input placeholder="$"/></div>
        <div><label>Lost Wages</label><input placeholder="$"/></div>
        <div><label>Policy Limit</label><input placeholder="$"/></div>
        <div><label>Severity</label><select><option>Mild (soft tissue)</option><option>Moderate (disc/fracture)</option><option>Severe (surgery/TBI)</option><option>Catastrophic</option></select></div>
        <div><label>Surgery?</label><select><option>No</option><option>Minor</option><option>Major</option></select></div>
        <div><label>Permanent?</label><select><option>Unknown</option><option>No</option><option>Probable</option><option>Confirmed</option></select></div>
      </div>
      <Btn icon={I.zap} onClick={()=>setD(true)}>Assess Value</Btn>
    </Card>
    {done&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <SC label="Low Estimate" value="$85,000" sub="Adjuster initial range" icon={I.dol} color={T.txM}/>
      <SC label="Expected" value="$142,000" sub="With strong demand" icon={I.dol} color={T.steel}/>
      <SC label="High Estimate" value="$225,000" sub="Surgery + permanency" icon={I.dol} color={T.grn}/>
    </div>
    <Card>
      <div style={{fontSize:12.5,fontWeight:700,marginBottom:12}}>Strength Indicators</div>
      {[{f:"Liability",p:95,c:T.grn},{f:"Documentation",p:72,c:T.wrn},{f:"Colossus Score",p:68,c:T.wrn},{f:"Venue (OC)",p:85,c:T.grn},{f:"Attorney Record",p:92,c:T.grn},{f:"Treatment Consistency",p:78,c:T.steel}].map(s=><div key={s.f} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11.5,marginBottom:2}}><span>{s.f}</span><span style={{fontWeight:600,color:s.c}}>{s.p}%</span></div><PBar pct={s.p} color={s.c}/></div>)}
    </Card></>}
  </div>);
};

// ═══ MED CHRONOLOGY ═══
const MedChronology=()=>{
  const ev=[
    {dt:"2025-10-15",pr:"Mission Hospital ER",tp:"Emergency",d:"Initial ER visit post-MVA. C-spine cleared. Dx: cervical sprain (S13.4), lumbar sprain (S33.5). Rx: Flexeril, Norco."},
    {dt:"2025-10-22",pr:"Dr. James Park, DC",tp:"Chiropractic",d:"Initial exam. Cervical ROM restricted 40%. Lumbar tenderness L4-L5. Plan: 3x/wk for 8 weeks."},
    {dt:"2025-11-01",pr:"OC Orthopedics",tp:"Ortho",d:"Positive Spurling's test. Recommended cervical MRI."},
    {dt:"2025-11-15",pr:"OC Imaging Center",tp:"Imaging",d:"MRI cervical: disc protrusion C5-C6 with foraminal stenosis. MRI lumbar: disc bulge L4-L5."},
    {dt:"2025-12-01",pr:"Dr. Sarah Wong, MD",tp:"Pain Mgmt",d:"Cervical epidural steroid injection C5-C6 performed. Follow-up 3 weeks."},
    {dt:"2026-01-10",pr:"Dr. Lisa Chen, PsyD",tp:"Psychology",d:"PTSD eval: F43.10 (PTSD), F32.1 (MDD), G47.00 (insomnia). Started CBT + Zoloft 50mg."},
  ];
  return(<div>
    <PH title="Medical Chronology" sub="AI-generated timeline from medical records" actions={<Btn v="secondary" icon={I.up}>Upload Records</Btn>}/>
    <Card>{ev.map((e,i)=><div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bdrL}`}}>
      <div style={{minWidth:82,fontSize:11.5,fontWeight:600,color:T.steel}}>{e.dt}</div>
      <div style={{width:3,borderRadius:2,background:T.steel,flexShrink:0}}/>
      <div><div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2}}><span style={{fontSize:12,fontWeight:600}}>{e.pr}</span><Badge color={T.txM}>{e.tp}</Badge></div><div style={{fontSize:11.5,color:T.tx2,lineHeight:1.4}}>{e.d}</div></div>
    </div>)}</Card>
  </div>);
};

// ═══ DAMAGES CALC ═══
const DamagesCalc=()=>{
  const [v,setV]=useState({a:42800,b:15000,c:12500,d:8000,e:5200});
  const tot=Object.values(v).reduce((a,b)=>a+b,0);
  const u=(k,x)=>setV(p=>({...p,[k]:parseFloat(x)||0}));
  return(<div>
    <PH title="Damages Calculator" sub="Economic & non-economic with multiplier analysis"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
      <Card>
        <div style={{fontSize:12.5,fontWeight:700,marginBottom:12}}>Economic Damages</div>
        {[{k:"a",l:"Past Medical"},{k:"b",l:"Future Medical"},{k:"c",l:"Past Lost Wages"},{k:"d",l:"Future Lost Earning"},{k:"e",l:"Property Damage"}].map(f=><div key={f.k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><label style={{minWidth:160,marginBottom:0}}>{f.l}</label><input value={v[f.k]} onChange={e=>u(f.k,e.target.value)} style={{maxWidth:140,textAlign:"right"}}/></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`2px solid ${T.bdr}`,marginTop:6}}><span style={{fontSize:13,fontWeight:700}}>Total Economic</span><span style={{fontSize:17,fontWeight:700,color:T.steel}}>${tot.toLocaleString()}</span></div>
      </Card>
      <div>
        <Card style={{marginBottom:12}}>
          <div style={{fontSize:12.5,fontWeight:700,marginBottom:10}}>P&S Multipliers</div>
          {[1.5,2,3,5].map(m=><div key={m} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.bdrL}`}}><span style={{fontSize:11.5}}>{m}×</span><span style={{fontSize:12.5,fontWeight:700,color:T.steel}}>${(tot*m).toLocaleString()}</span></div>)}
        </Card>
        <Card><div style={{fontSize:12.5,fontWeight:700,marginBottom:6}}>Recommended Demand</div><div style={{fontSize:22,fontWeight:700,color:T.grn}}>${(tot*2).toLocaleString()} — ${(tot*3.5).toLocaleString()}</div><div style={{fontSize:10.5,color:T.txM,marginTop:2}}>Based on case type, jurisdiction, severity</div></Card>
      </div>
    </div>
  </div>);
};

// ═══ VERDICT RESEARCH ═══
const VerdictResearch=()=>{
  const [on,setOn]=useState(false);
  const vd=[
    {c:"Martinez v. State Farm",y:"2025",v:"OC Superior",t:"MVA",a:"$165,000",inj:"C5-C6 disc herniation"},
    {c:"Thompson v. GEICO",y:"2025",v:"LA Superior",t:"MVA",a:"$285,000",inj:"Lumbar herniation, PTSD"},
    {c:"Park v. Allstate",y:"2024",v:"OC Superior",t:"MVA",a:"$142,000",inj:"Cervical sprain, depression"},
    {c:"Williams v. Progressive",y:"2025",v:"SD Superior",t:"MVA",a:"$98,000",inj:"Soft tissue, anxiety"},
    {c:"Nguyen v. Farmers",y:"2024",v:"OC Superior",t:"Motorcycle",a:"$425,000",inj:"Tibial fracture, rotator cuff"},
    {c:"Chen v. Hartford",y:"2025",v:"LA Superior",t:"Slip & Fall",a:"$175,000",inj:"Disc bulge, knee sprain"},
  ];
  return(<div>
    <PH title="Verdict & Settlement Research" sub="6.5M+ case database — comparable verdicts for your demand"/>
    <Card style={{marginBottom:16}}>
      <div style={{display:"flex",gap:8}}><input placeholder="Search by injury, case type, jurisdiction..." style={{flex:1}}/><select style={{maxWidth:140}}><option>All Venues</option><option>Orange County</option><option>Los Angeles</option><option>San Diego</option></select><Btn icon={I.srch} onClick={()=>setOn(true)}>Search</Btn></div>
    </Card>
    {on&&<Card>
      <div style={{fontSize:12.5,fontWeight:700,marginBottom:12}}>6 Comparable Cases</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}><thead><tr style={{borderBottom:`2px solid ${T.bdr}`}}>{["Case","Year","Venue","Type","Injuries","Award"].map(h=><th key={h} style={{padding:"7px 4px",textAlign:"left",color:T.txM,fontSize:10,fontWeight:600,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
      <tbody>{vd.map((v,i)=><tr key={i} style={{borderBottom:`1px solid ${T.bdrL}`}}><td style={{padding:"7px 4px",fontWeight:600,color:T.steel}}>{v.c}</td><td style={{padding:"7px 4px"}}>{v.y}</td><td style={{padding:"7px 4px"}}>{v.v}</td><td style={{padding:"7px 4px"}}>{v.t}</td><td style={{padding:"7px 4px",color:T.tx2}}>{v.inj}</td><td style={{padding:"7px 4px",fontWeight:700,color:T.grn}}>{v.a}</td></tr>)}</tbody></table>
    </Card>}
  </div>);
};

// ═══ ICD-10 CODE ENGINE (EvenUp/Supio killer) ═══
const ICDEngine=()=>{const[q,setQ]=useState("");const[sel,setSel]=useState(["S13.4","M54.5","F43.10"]);
const ICD_DB={"S13.4":{d:"Cervical sprain (whiplash)",s:"Mod",p:3},"S16.1":{d:"Cervical muscle strain",s:"Mild",p:2},"S23.3":{d:"Thoracic sprain",s:"Mod",p:3},"S33.5":{d:"Lumbar sprain",s:"Mod",p:3},"M54.2":{d:"Cervicalgia",s:"Mild",p:2},"M54.5":{d:"Low back pain",s:"Mild",p:2},"M54.41":{d:"Lumbago w/ sciatica",s:"Mod-Sev",p:4},"M51.16":{d:"Lumbar disc herniation w/ radiculopathy",s:"Severe",p:6},"M50.12":{d:"Cervical disc w/ radiculopathy",s:"Severe",p:6},"S06.0":{d:"Concussion",s:"Mod-Sev",p:5},"S06.309":{d:"Traumatic brain injury",s:"Severe",p:7},"G43.909":{d:"Post-traumatic headache",s:"Mod",p:3},"S42.001":{d:"Clavicle fracture",s:"Mod-Sev",p:5},"S82.001":{d:"Tibia fracture",s:"Severe",p:6},"S72.001":{d:"Femur fracture",s:"V.Sev",p:8},"M75.11":{d:"Rotator cuff tear",s:"Severe",p:6},"S83.51":{d:"ACL tear",s:"Severe",p:6},"F43.10":{d:"PTSD",s:"Mod-Sev",p:4},"F32.1":{d:"Major depressive disorder",s:"Mod",p:3},"G47.00":{d:"Insomnia",s:"Mild",p:2},"S32.001":{d:"Lumbar vertebra fracture",s:"V.Sev",p:8},"M47.812":{d:"Cervical spondylosis w/ radiculopathy",s:"Mod-Sev",p:4},"S43.401":{d:"Shoulder sprain",s:"Mod",p:3},"S83.101":{d:"MCL sprain",s:"Mod",p:3}};
const all=Object.entries(ICD_DB);const fil=all.filter(([c,d])=>c.toLowerCase().includes(q.toLowerCase())||d.d.toLowerCase().includes(q.toLowerCase()));
const pts=sel.reduce((s,c)=>s+(ICD_DB[c]?.p||0),0);
return(<div><PH title="ICD-10 Code Engine" sub="Extract, categorize & Colossus-score diagnostic codes" actions={<Badge color={T.pur}>{sel.length} codes · {pts} pts</Badge>}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 250px",gap:16}}>
<Card><div style={{display:"flex",gap:8,marginBottom:12}}><input placeholder="Search codes or descriptions..." value={q} onChange={e=>setQ(e.target.value)}/><Btn v="secondary" icon={I.up} sz="sm">Upload</Btn></div>
<div style={{maxHeight:440,overflowY:"auto"}}>{fil.map(([c,d])=>{const on=sel.includes(c);return(<div key={c} onClick={()=>setSel(p=>on?p.filter(x=>x!==c):[...p,c])} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,cursor:"pointer",background:on?T.steelDim:"transparent",borderBottom:`1px solid ${T.bdrL}`}}>
<div style={{width:15,height:15,borderRadius:3,border:`2px solid ${on?T.steel:T.bdr}`,background:on?T.steel:"transparent",flexShrink:0}}/>
<code style={{fontSize:11,fontWeight:700,color:T.steel,fontFamily:"'JetBrains Mono',monospace",minWidth:52}}>{c}</code>
<div style={{flex:1}}><div style={{fontSize:11}}>{d.d}</div><div style={{fontSize:9.5,color:T.txM}}>{d.s}</div></div>
<div style={{display:"flex",gap:1}}>{Array.from({length:d.p},(_,i)=><div key={i} style={{width:4,height:10,borderRadius:2,background:d.p>=6?T.red:d.p>=4?T.wrn:T.steel}}/>)}</div>
</div>)})}</div></Card>
<div><Card style={{marginBottom:12,textAlign:"center"}}><div style={{fontSize:12,fontWeight:700,marginBottom:6}}>Colossus Score</div><div style={{fontSize:34,fontWeight:700,color:pts>=15?T.red:pts>=10?T.wrn:T.steel,padding:"6px 0"}}>{pts}</div><div style={{fontSize:10.5,color:T.txM}}>{sel.length} codes · {pts>=15?"HIGH VALUE":pts>=10?"MODERATE":"BUILDING"}</div></Card>
<Card><div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Selected</div>{sel.map(c=><div key={c} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${T.bdrL}`}}><div><code style={{fontSize:10,fontWeight:700,color:T.steel,fontFamily:"'JetBrains Mono',monospace"}}>{c}</code><div style={{fontSize:9.5,color:T.txM}}>{ICD_DB[c]?.d}</div></div><span style={{cursor:"pointer",color:T.txD,fontSize:10}} onClick={()=>setSel(p=>p.filter(x=>x!==c))}>✕</span></div>)}<Btn style={{width:"100%",marginTop:8}}>Add to Demand</Btn></Card></div>
</div></div>)};

// ═══ AI CASE CHAT (ProPlaintiff AI Paralegal killer) ═══
const AICaseChat=()=>{const[msgs,setMsgs]=useState([{r:"ai",t:"I'm your AI Case Assistant. Upload documents or ask about your cases — medical record analysis, case law, discovery responses, strength/weakness analysis, Colossus scoring."}]);const[inp,setInp]=useState("");
const send=()=>{if(!inp.trim())return;const q=inp;setMsgs(p=>[...p,{r:"user",t:q}]);setInp("");
setTimeout(()=>setMsgs(p=>[...p,{r:"ai",t:`Analysis of the Gonzalez case (LL-2026-0041):\n\n• Cervical disc protrusion C5-C6 confirmed by MRI (11/15) — demonstrable injury, Colossus weights heavily\n• PTSD diagnosis (F43.10) with active CBT + Zoloft 50mg — strengthens non-economic claim since it's treated\n• Combined Colossus severity: 9 points (S13.4 + M54.5 + F43.10) — MODERATE\n• 12-day treatment gap (10/15 → 10/22) — biggest vulnerability. Document insurance auth delay\n• Allstate adherence: Very High — demand MUST be Colossus-formatted\n• Comparable: Martinez v. State Farm (2025, OC) — $165,000 for similar cervical disc\n\n→ Run Reverse Colossus™ optimizer before finalizing demand`}]),1200)};
return(<div><PH title="AI Case Chat" sub="Upload & ask — instant case analysis powered by Claude"/>
<Card style={{height:460,display:"flex",flexDirection:"column"}}>
<div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>{msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start",marginBottom:8}}><div style={{maxWidth:"78%",padding:"9px 12px",borderRadius:12,background:m.r==="user"?T.steel:T.srfAlt,color:m.r==="user"?T.wh:T.tx,fontSize:12,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.t}</div></div>)}</div>
<div style={{display:"flex",gap:6,borderTop:`1px solid ${T.bdr}`,paddingTop:8}}><Btn v="secondary" icon={I.up} sz="sm">Files</Btn><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about your case..."/><Btn onClick={send} sz="sm">Send</Btn></div>
</Card></div>)};

// ═══ eDISCOVERY (Tavrn feature — 80% review reduction) ═══
const EDiscovery=()=>{const[on,setOn]=useState(false);
const DOCS=[{n:"ER_Records_Gonzalez.pdf",pg:12,tags:["Medical","Emergency","ICD"],rel:"High"},{n:"Police_Report_2025-1042.pdf",pg:4,tags:["Liability","Accident"],rel:"High"},{n:"Allstate_Denial_Letter.pdf",pg:2,tags:["Carrier","Denial"],rel:"Med"},{n:"Chiro_Notes_Park.pdf",pg:28,tags:["Medical","Chiro"],rel:"High"},{n:"MRI_Report_Cervical.pdf",pg:3,tags:["Imaging","Diagnostic"],rel:"High"},{n:"Employment_Records.pdf",pg:8,tags:["Wages","Employment"],rel:"Med"},{n:"Insurance_Policy.pdf",pg:15,tags:["Policy","Coverage"],rel:"Low"}];
return(<div><PH title="eDiscovery Engine" sub="Auto-tag, sort & extract — 80% review reduction" actions={<Badge color={T.blu}>AI-Powered</Badge>}/>
{!on?<Card style={{textAlign:"center",padding:36}}><div style={{color:T.txD,marginBottom:6}}>{I.up}</div><div style={{fontSize:12.5,fontWeight:600,marginBottom:12}}>Upload case documents for AI analysis</div><Btn icon={I.up} onClick={()=>setOn(true)}>Upload Documents</Btn></Card>:
<Card><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:12.5,fontWeight:700}}>7 Documents Analyzed</span><div style={{display:"flex",gap:4}}><Btn v="secondary" sz="sm">Filter Tags</Btn><Btn v="secondary" sz="sm">Sort</Btn></div></div>
{DOCS.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.bdrL}`}}><span style={{color:T.steel}}>{I.doc}</span><div style={{flex:1}}><div style={{fontSize:11.5,fontWeight:600}}>{d.n}</div><div style={{display:"flex",gap:3,marginTop:2}}>{d.tags.map(t=><Badge key={t} color={T.txM}>{t}</Badge>)}</div></div><span style={{fontSize:10.5,color:T.txM}}>{d.pg}pg</span><Badge color={d.rel==="High"?T.grn:d.rel==="Med"?T.wrn:T.txD}>{d.rel}</Badge></div>)}</Card>}
</div>)};

// ═══ CONTRACT REVIEW (Anthropic Cowork Legal Plugin) ═══
const ContractReview=()=>{const[on,setOn]=useState(false);
return(<div><PH title="Contract Review" sub="Powered by Anthropic Cowork Legal Plugin" actions={<Badge color={T.blu}>Cowork Plugin</Badge>}/>
<Card style={{marginBottom:14,background:T.bluDim,border:`1px solid ${T.blu}33`}}><div style={{display:"flex",gap:10}}><span style={{color:T.blu}}>{I.shld}</span><div><div style={{fontWeight:700,fontSize:12}}>Anthropic Legal Plugin (Released Feb 2, 2026)</div><div style={{fontSize:11,color:T.tx2,marginTop:2,lineHeight:1.5}}>Open-source Cowork plugin providing clause-by-clause review with GREEN/YELLOW/RED flags, redline suggestions, and configurable playbook positions. Used for settlement agreements, vendor contracts, retainer agreements, and insurance policies. Triggered $285B market reaction — Thomson Reuters ↓18%, LexisNexis ↓14%.</div></div></div></Card>
<Card style={{marginBottom:14}}><div style={{display:"grid",gridTemplateColumns:"1fr 200px",gap:10,marginBottom:12}}><div><label>Upload Contract</label><div style={{border:`2px dashed ${T.bdr}`,borderRadius:8,padding:14,textAlign:"center",fontSize:11,color:T.txM}}>Drop PDF/DOCX or paste text</div></div><div><label>Your Side</label><select><option>Plaintiff</option><option>Defendant</option><option>Vendor</option></select><label style={{marginTop:6}}>Type</label><select><option>Settlement Agreement</option><option>Retainer</option><option>Insurance Policy</option><option>NDA</option></select></div></div><Btn icon={I.zap} onClick={()=>setOn(true)}>Review Contract</Btn></Card>
{on&&<Card><div style={{fontSize:12.5,fontWeight:700,marginBottom:12}}>Clause-by-Clause Analysis</div>
{[{cl:"Limitation of Liability",f:"RED",n:"Cap at 3 months — below 12-month standard. Redline to 12 months."},{cl:"Indemnification",f:"YELLOW",n:"Unilateral favoring defendant. Standard: mutual for IP + data breach."},{cl:"Release Language",f:"RED",n:"Overly broad 'all claims known or unknown.' Narrow to accident-specific."},{cl:"Payment Terms",f:"GREEN",n:"Net 30 from execution. Standard and acceptable."},{cl:"Confidentiality",f:"YELLOW",n:"No regulatory reporting carveout. Add standard exceptions."},{cl:"Governing Law",f:"GREEN",n:"California law, OC venue. Favorable for plaintiff."},{cl:"Attorney Fees",f:"GREEN",n:"Prevailing party entitled. Standard provision."},{cl:"Dispute Resolution",f:"YELLOW",n:"Mandatory arbitration. Consider negotiating for judicial forum option."}].map((c,i)=><div key={i} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:`1px solid ${T.bdrL}`}}><Badge color={c.f==="RED"?T.red:c.f==="YELLOW"?T.wrn:T.grn}>{c.f}</Badge><div><div style={{fontSize:11.5,fontWeight:600}}>{c.cl}</div><div style={{fontSize:11,color:T.tx2,marginTop:1}}>{c.n}</div></div></div>)}</Card>}
</div>)};

// ═══ AI DRAFTS SUITE (EvenUp AI Drafts competitor) ═══
const AIDrafts=()=>{const[sel,setSel]=useState(null);const[gen,setGen]=useState(false);const[done,setDone]=useState(false);
const docs=[{k:"complaint",t:"Complaint",d:"Draft initial complaint with cause of action, facts, and prayer for relief",i:I.doc},{k:"interrogatories",t:"Interrogatories",d:"Generate targeted interrogatories based on case type and defense strategy",i:I.doc},{k:"rfa",t:"Requests for Admission",d:"Draft RFAs to establish key facts and narrow disputed issues",i:I.doc},{k:"rfp",t:"Requests for Production",d:"Generate document requests targeting carrier claim files and adjuster notes",i:I.doc},{k:"medsummary",t:"Medical Summary",d:"Comprehensive medical narrative from treatment records",i:I.act},{k:"settlement",t:"Settlement Brief",d:"Mediation/settlement brief with case analysis and comparable verdicts",i:I.star},{k:"motions",t:"Motions",d:"Motion to compel, motion in limine, or summary judgment briefs",i:I.scl},{k:"closing",t:"Closing Letter",d:"Post-settlement closing letter to client with disbursement breakdown",i:I.doc}];
const go=()=>{setGen(true);setTimeout(()=>{setGen(false);setDone(true)},2000)};
return(<div><PH title="AI Drafts Suite" sub="Generate complaints, interrogatories, summaries, motions & more" actions={<Badge color={T.pur}>8 Document Types</Badge>}/>
{!sel?<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>{docs.map(d=><Card key={d.k} style={{cursor:"pointer",textAlign:"center",padding:20}} onClick={()=>setSel(d.k)}><div style={{color:T.steel,marginBottom:8}}>{d.i}</div><div style={{fontSize:12.5,fontWeight:700,marginBottom:3}}>{d.t}</div><div style={{fontSize:10.5,color:T.txM,lineHeight:1.4}}>{d.d}</div></Card>)}</div>:
<div><Btn v="secondary" sz="sm" onClick={()=>{setSel(null);setDone(false)}} style={{marginBottom:12}}>← Back to Documents</Btn>
<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Generate: {docs.find(d=>d.k===sel)?.t}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}><div><label>Case</label><select>{CASES.map(c=><option key={c.id}>{c.id} — {c.cl}</option>)}</select></div><div><label>Attorney</label><select><option>Emery Brett Ledger</option><option>Rachel Simmons</option><option>David Morales</option></select></div></div>
{!done?<Btn icon={gen?<Spin/>:I.zap} onClick={go} disabled={gen}>{gen?"Generating...":"Generate Document"}</Btn>:
<div style={{padding:14,borderRadius:8,background:T.grnDim,border:`1px solid ${T.grn}33`}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{color:T.grn}}>{I.chk}</span><span style={{fontWeight:700,color:T.grn}}>Document Generated</span></div><div style={{display:"flex",gap:8}}><Btn icon={I.doc}>Download .DOCX</Btn><Btn v="secondary">Preview</Btn><Btn v="secondary">Edit</Btn></div></div>}
</Card></div>}
</div>)};

// ═══ TEAM & USERS ═══
const UsersView=()=>{const USERS=[{nm:"Emery Brett Ledger",em:"emery@ledgerlaw.ai",rl:"Partner",st:"Active",cs:42},{nm:"Rachel Simmons",em:"rsimmons@ledgerlaw.ai",rl:"Sr. Associate",st:"Active",cs:28},{nm:"David Morales",em:"dmorales@ledgerlaw.ai",rl:"Associate",st:"Active",cs:19},{nm:"Jessica Tran",em:"jtran@ledgerlaw.ai",rl:"Paralegal",st:"Active",cs:31},{nm:"Michael Chen",em:"mchen@ledgerlaw.ai",rl:"Case Manager",st:"Active",cs:24},{nm:"Sarah Kim",em:"skim@ledgerlaw.ai",rl:"Legal Asst",st:"Invited",cs:0}];
return(<div><PH title="Team & Users" sub="Manage access, roles & permissions" actions={<Btn icon={I.plus}>Invite User</Btn>}/>
<Card><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{borderBottom:`2px solid ${T.bdr}`}}>{["Name","Email","Role","Status","Cases","Actions"].map(h=><th key={h} style={{padding:"8px 5px",textAlign:"left",color:T.txM,fontSize:10,fontWeight:600,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
<tbody>{USERS.map((u,i)=><tr key={i} style={{borderBottom:`1px solid ${T.bdrL}`}}><td style={{padding:"8px 5px",fontWeight:600}}>{u.nm}</td><td style={{padding:"8px 5px",color:T.txM}}>{u.em}</td><td style={{padding:"8px 5px"}}><Badge color={T.steel}>{u.rl}</Badge></td><td style={{padding:"8px 5px"}}><Badge color={u.st==="Active"?T.grn:T.wrn}>{u.st}</Badge></td><td style={{padding:"8px 5px"}}>{u.cs}</td><td style={{padding:"8px 5px"}}><Btn v="ghost" sz="sm">Edit</Btn></td></tr>)}</tbody></table></Card></div>)};

// ═══ SETTINGS ═══
const Settings=()=>(<div><PH title="Settings" sub="Configure integrations, AI, security & firm details"/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Integrations</div>
{[{n:"Anthropic Claude API",s:"Connected",d:"Claude Sonnet 4 · Demand generation, Colossus analysis, document AI",c:T.grn},{n:"Salesforce CRM",s:"Connected",d:"Bi-directional sync · Cases ↔ Opportunities",c:T.grn},{n:"Clerk Auth",s:"Active",d:"SSO, MFA, role-based access · 6 users",c:T.grn},{n:"Supabase DB",s:"Connected",d:"PostgreSQL · Cases, demands, documents, analyses",c:T.grn},{n:"Cowork Legal Plugin",s:"Available",d:"Contract review, NDA triage, compliance workflows",c:T.blu},{n:"CasePeer",s:"Not Connected",d:"Import case data from CasePeer CMS",c:T.txD}].map(s=><div key={s.n} style={{padding:"8px 0",borderBottom:`1px solid ${T.bdrL}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600}}>{s.n}</span><Badge color={s.c}>{s.s}</Badge></div><div style={{fontSize:10.5,color:T.txM}}>{s.d}</div></div>)}</Card>
<div><Card style={{marginBottom:14}}><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Security & Compliance</div>
{["SSN/DOB Auto-Redaction: Active","HIPAA Compliance Mode: Enabled","MFA Required: All Users","API Keys: Server-side only","Session Timeout: 30 min","Audit Log: Enabled","Data Encryption: AES-256 at rest, TLS 1.2 in transit"].map((s,i)=><div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${T.bdrL}`,fontSize:11.5,color:T.tx2,display:"flex",alignItems:"center",gap:6}}><span style={{color:T.grn}}>{I.chk}</span>{s}</div>)}</Card>
<Card><div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Firm Details</div>
<div style={{display:"grid",gap:8}}><div><label>Firm Name</label><input defaultValue="The Ledger Law Firm"/></div><div><label>Phone</label><input defaultValue="949-244-2800"/></div><div><label>Email</label><input defaultValue="emery@ledgerlaw.ai"/></div><div><label>Offices</label><input defaultValue="Rancho Santa Margarita, CA · Los Angeles · San Diego"/></div></div></Card></div>
</div></div>);

// ════════════════════════════════════════════════════════════════
// MAIN APP — 18 pages with React Router
// ════════════════════════════════════════════════════════════════
function AppLayout({userSlot}){
  const navigate=useNavigate();
  const location=useLocation();
  const pg=location.pathname==="/"?"dash":location.pathname.slice(1)||"dash";
  const go=(key)=>navigate(key==="dash"?"/":`/${key}`);
  return(<><style>{css}</style>
  <Sidebar pg={pg} go={go} userSlot={userSlot}/>
  <div style={{marginLeft:226,padding:"20px 24px 50px",minHeight:"100vh"}}>
    <Routes>
      <Route path="/" element={<Dashboard go={go}/>}/>
      <Route path="/cases" element={<CasesView go={go}/>}/>
      <Route path="/intake" element={<Intake/>}/>
      <Route path="/new" element={<NewDemand/>}/>
      <Route path="/colossus" element={<ReverseColossus/>}/>
      <Route path="/objections" element={<CarrierObjections/>}/>
      <Route path="/casevalue" element={<CaseValuation/>}/>
      <Route path="/chrono" element={<MedChronology/>}/>
      <Route path="/damages" element={<DamagesCalc/>}/>
      <Route path="/verdicts" element={<VerdictResearch/>}/>
      <Route path="/icd" element={<ICDEngine/>}/>
      <Route path="/chat" element={<AICaseChat/>}/>
      <Route path="/ediscovery" element={<EDiscovery/>}/>
      <Route path="/contracts" element={<ContractReview/>}/>
      <Route path="/drafts" element={<AIDrafts/>}/>
      <Route path="/users" element={<UsersView/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="*" element={<Dashboard go={go}/>}/>
    </Routes>
  </div>
  <div style={{position:"fixed",bottom:0,left:226,right:0,height:28,background:T.wh,borderTop:`1px solid ${T.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
    <span style={{color:T.txD,fontSize:10,letterSpacing:".02em"}}>{I.shld} Attorney-Client Privileged & Confidential — The Ledger Law Firm — 949-244-2800</span>
  </div></>);
}
export { AppLayout };
export default function App(){
  return <BrowserRouter><AppLayout/></BrowserRouter>;
}
