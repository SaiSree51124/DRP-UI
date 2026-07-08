import React from "react";
import { C } from "../../../utils/colors";

export function NetworkDiagram() {
  return (
    <svg viewBox="0 0 340 220" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="ng1" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#007B82" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0A2E52" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="170" cy="110" rx="160" ry="100" fill="url(#ng1)" />
      {[[170,110,70,40],[170,110,270,40],[170,110,50,110],[170,110,290,110],[170,110,90,180],[170,110,250,180],[70,40,50,110],[270,40,290,110],[50,110,90,180],[290,110,250,180],[70,40,170,60],[270,40,170,60],[90,180,170,160],[250,180,170,160]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,123,130,0.35)" strokeWidth="1.4" />
      ))}
      <circle cx="170" cy="110" r="26" fill="#007B82" />
      <text x="170" y="114" textAnchor="middle" fontSize="8.5" fill="#fff" fontWeight="700">Disease</text>
      {[[70,40,"Protein A"],[270,40,"Protein B"],[50,110,["Gene","Mutation"]],[290,110,["Genetic","Disorder"]],[90,180,"Pathway X"],[250,180,"Pathway Y"]].map(([cx,cy,lbl],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="20" fill={i%2===0?"#1E3A5F":"#2D6A4F"} />
          <text textAnchor="middle" fontSize="6.2" fill="#fff">
            {Array.isArray(lbl)?(<><tspan x={cx} y={cy-2}>{lbl[0]}</tspan><tspan x={cx} y={cy+7}>{lbl[1]}</tspan></>):(<tspan x={cx} y={cy+3}>{lbl}</tspan>)}
          </text>
        </g>
      ))}
      {[[170,55,"Targets"],[170,165,"Interactions"]].map(([cx,cy,lbl],i)=>(
        <g key={i}>
          <circle cx={cx} cy={cy} r="18" fill="#0F4C5C" />
          <text x={cx} y={cy+3} textAnchor="middle" fontSize="6.5" fill="#fff">{lbl}</text>
        </g>
      ))}
    </svg>
  );
}

export function FlowDiagram() {
  return (
    <svg viewBox="0 0 520 420" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A2E52" /><stop offset="100%" stopColor="#007B82" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {[[260,95,260,150],[260,235,260,290]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#flowGrad)" strokeWidth="5" strokeDasharray="10 8" opacity="0.85">
          <animate attributeName="stroke-dashoffset" values="0;-60" dur="3s" repeatCount="indefinite" />
        </line>
      ))}
      {[{title:"PubMed Retrieval",sub:"Semantic search + MeSH mapping",x:90,y:30,color:"#0A2E52",icon:"📄"},{title:"Context Filtering",sub:"Keyword & concept refinement",x:90,y:170,color:"#007B82",icon:"🧠"},{title:"Evidence Ranking",sub:"Scoring + PDF prioritization",x:90,y:310,color:"#2D6A4F",icon:"📊"}].map((item,i)=>(
        <g key={i}>
          <rect x={item.x-12} y={item.y-12} width="360" height="90" rx="28" fill={item.color} opacity="0.12" filter="url(#glow)"><animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${2+i}s`} repeatCount="indefinite" /></rect>
          <rect x={item.x} y={item.y} width="340" height="70" rx="24" fill={item.color} />
          <circle cx={item.x+45} cy={item.y+35} r="22" fill="rgba(255,255,255,0.14)" />
          <text x={item.x+45} y={item.y+42} textAnchor="middle" fontSize="20">{item.icon}</text>
          <text x={item.x+95} y={item.y+30} fontSize="18" fill="#fff" fontWeight="700">{item.title}</text>
          <text x={item.x+95} y={item.y+52} fontSize="12" fill="rgba(255,255,255,0.82)">{item.sub}</text>
        </g>
      ))}
      {[140,280].map((y,i)=>(
        <circle key={i} cx="260" cy={y} r="7" fill="#5EEAD4">
          <animate attributeName="cy" values={`${y};${y+28};${y}`} dur={`${2+i*0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.8+i*0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="260" y="405" textAnchor="middle" fontSize="15" fill="#007B82" fontWeight="700">Intelligent literature retrieval and evidence prioritization</text>
    </svg>
  );
}

export function GridDiagram() {
  const compounds = [
    { name: "Imatinib",  score: "92%", tag: "High Match",      color: "#007B82" },
    { name: "Metformin", score: "88%", tag: "Validated",        color: "#2D6A4F" },
    { name: "Dasatinib", score: "81%", tag: "Evidence Linked",  color: "#0A2E52" },
  ];
  return (
    <svg viewBox="0 0 1200 900" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#007B82" /><stop offset="100%" stopColor="#0A2E52" /></linearGradient>
        <filter id="softGlow"><feGaussianBlur stdDeviation="14" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M600 120 L600 690" fill="none" stroke="url(#flowLine)" strokeWidth="10" strokeDasharray="24 14" opacity="0.8"><animate attributeName="stroke-dashoffset" values="0;-120" dur="3s" repeatCount="indefinite" /></path>
      {[220,380,540].map((y,i)=>(
        <circle key={i} cx="600" cy={y} r="16" fill="#5EEAD4">
          <animate attributeName="cy" values={`${y};${y+45};${y}`} dur={`${2+i*0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.6+i*0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {compounds.map((c,i)=>{const left=i%2===0;const x=left?80:700;const y=120+i*190;return(
        <g key={i}>
          <line x1={left?x+420:600} y1={y+95} x2={left?600:x} y2={y+95} stroke={c.color} strokeWidth="5" opacity="0.45" strokeDasharray="12 8" />
          <rect x={x-14} y={y-14} width="450" height="190" rx="40" fill={c.color} opacity="0.12" filter="url(#softGlow)"><animate attributeName="opacity" values="0.08;0.18;0.08" dur={`${2+i}s`} repeatCount="indefinite" /></rect>
          <rect x={x} y={y} width="420" height="160" rx="34" fill="#FFFFFF" stroke={c.color} strokeWidth="5" />
          <circle cx={x+80} cy={y+80} r="46" fill={c.color} opacity="0.14" />
          <text x={x+80} y={y+96} textAnchor="middle" fontSize="42">⚗</text>
          <text x={x+155} y={y+58} fontSize="34" fill="#0A2E52" fontWeight="700">{c.name}</text>
          <text x={x+155} y={y+102} fontSize="24" fill="#64748B">Confidence Score</text>
          <text x={x+155} y={y+136} fontSize="30" fill={c.color} fontWeight="700">{c.score}</text>
          <rect x={x+275} y={y+118} width="115" height="34" rx="18" fill={c.color} opacity="0.14" />
          <text x={x+332} y={y+141} textAnchor="middle" fontSize="16" fill={c.color} fontWeight="700">{c.tag}</text>
        </g>
      );})}
      {[["PubMed",220],["Medical Sources",600],["URL Validation",980]].map(([label,cx],i)=>(
        <g key={i}><circle cx={cx} cy={790} r="70" fill="#E6F7F8" stroke="#007B82" strokeWidth="5"><animate attributeName="r" values="70;78;70" dur={`${2+i}s`} repeatCount="indefinite" /></circle><text x={cx} y={798} textAnchor="middle" fontSize="22" fill="#007B82" fontWeight="700">{label}</text></g>
      ))}
      <text x="600" y="885" textAnchor="middle" fontSize="28" fill="#007B82" fontWeight="700">Compound retrieval, evidence validation, and confidence-based prioritization</text>
    </svg>
  );
}

export function ScatterDiagram() {
  return (
    <svg viewBox="0 0 420 280" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="proteinGlow" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#007B82" stopOpacity="0.28" /><stop offset="100%" stopColor="#0A2E52" stopOpacity="0" /></radialGradient>
        <linearGradient id="dockLine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#5EEAD4" /><stop offset="100%" stopColor="#007B82" /></linearGradient>
      </defs>
      <ellipse cx="210" cy="140" rx="180" ry="115" fill="url(#proteinGlow)" />
      <path d="M90 120 C70 70,130 40,190 70 C240 20,320 50,315 120 C360 150,330 220,250 215 C210 255,120 240,95 190 C55 175,55 135,90 120 Z" fill="#0A2E52" opacity="0.92" />
      <ellipse cx="215" cy="138" rx="42" ry="28" fill="#0F766E" opacity="0.85" />
      <circle cx="210" cy="138" r="10" fill="#5EEAD4" /><circle cx="232" cy="124" r="8" fill="#5EEAD4" /><circle cx="248" cy="144" r="8" fill="#5EEAD4" /><circle cx="226" cy="158" r="8" fill="#5EEAD4" />
      <line x1="210" y1="138" x2="232" y2="124" stroke="url(#dockLine)" strokeWidth="3" /><line x1="232" y1="124" x2="248" y2="144" stroke="url(#dockLine)" strokeWidth="3" /><line x1="248" y1="144" x2="226" y2="158" stroke="url(#dockLine)" strokeWidth="3" /><line x1="226" y1="158" x2="210" y2="138" stroke="url(#dockLine)" strokeWidth="3" />
      {[[170,110,210,138],[185,165,226,158],[255,105,232,124],[270,170,248,144]].map(([x1,y1,x2,y2],i)=>(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FACC15" strokeWidth="2" strokeDasharray="5 4" opacity="0.9" />))}
      <text x="110" y="55" textAnchor="middle" fontSize="12" fill="#E2E8F0" fontWeight="700">Protein Target</text>
      <text x="285" y="105" textAnchor="middle" fontSize="11" fill="#5EEAD4" fontWeight="700">Ligand</text>
      {[["Protein Prep",70],["Docking",180],["PLIP Analysis",300]].map(([txt,x],i)=>(<g key={i}><rect x={x} y="250" width="90" height="28" rx="10" fill={i===1?"#007B82":"#16324F"} /><text x={x+45} y="267" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">{txt}</text></g>))}
      <line x1="160" y1="266" x2="180" y2="266" stroke="#94A3B8" strokeWidth="2" /><line x1="270" y1="266" x2="300" y2="266" stroke="#94A3B8" strokeWidth="2" />
      <text x="210" y="24" textAnchor="middle" fontSize="13" fill="#007B82" fontWeight="700">Protein–Ligand Docking &amp; Interaction Profiling</text>
    </svg>
  );
}

export function BubbleDiagram() {
  return (
    <svg viewBox="0 0 420 300" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="patGlow" cx="50%" cy="50%" r="65%"><stop offset="0%" stopColor="#007B82" stopOpacity="0.22" /><stop offset="100%" stopColor="#0A2E52" stopOpacity="0" /></radialGradient>
        <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0A2E52" /><stop offset="100%" stopColor="#007B82" /></linearGradient>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2D6A4F" /><stop offset="100%" stopColor="#007B82" /></linearGradient>
      </defs>
      <ellipse cx="210" cy="150" rx="180" ry="120" fill="url(#patGlow)" />
      {[65,95,125].map((y,i)=>(<g key={i}><rect x="45" y={y} width="95" height="55" rx="10" fill="url(#docGrad)" opacity={0.95-i*0.12} /><line x1="60" y1={y+15} x2="120" y2={y+15} stroke="#D1FAE5" strokeWidth="2" /><line x1="60" y1={y+27} x2="112" y2={y+27} stroke="#D1FAE5" strokeWidth="2" opacity="0.7" /><line x1="60" y1={y+39} x2="100" y2={y+39} stroke="#D1FAE5" strokeWidth="2" opacity="0.5" /></g>))}
      <path d="M150 145 C190 120, 215 120, 250 145" fill="none" stroke="#5EEAD4" strokeWidth="4" strokeDasharray="7 5" opacity="0.9" />
      <g>
        <circle cx="280" cy="145" r="48" fill="url(#brainGrad)" opacity="0.95" />
        <circle cx="280" cy="145" r="34" fill="#0A2E52" opacity="0.45" />
        {[[265,130],[295,130],[280,145],[265,160],[295,160]].map(([cx,cy],i)=>(<circle key={i} cx={cx} cy={cy} r="5" fill="#5EEAD4" />))}
        {[[265,130,280,145],[295,130,280,145],[265,160,280,145],[295,160,280,145]].map(([x1,y1,x2,y2],i)=>(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D1FAE5" strokeWidth="1.8" />))}
        <text x="280" y="198" textAnchor="middle" fontSize="10" fill="#007B82" fontWeight="700">Patent Reasoning</text>
      </g>
      {[[320,70,"Novelty"],[330,135,"Claims"],[320,200,"FTO Risk"]].map(([x,y,label],i)=>(<g key={i}><rect x={x} y={y} width="70" height="38" rx="10" fill="#16324F" /><circle cx={x+14} cy={y+19} r="6" fill="#5EEAD4" /><text x={x+42} y={y+23} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">{label}</text></g>))}
      {[[315,120,330,90],[328,145,330,154],[315,170,330,220]].map(([x1,y1,x2,y2],i)=>(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FACC15" strokeWidth="2" strokeDasharray="5 4" opacity="0.9" />))}
      <text x="210" y="28" textAnchor="middle" fontSize="15" fill="#007B82" fontWeight="700">Patent Intelligence &amp; Novelty Assessment</text>
      <text x="210" y="278" textAnchor="middle" fontSize="10" fill="#64748B">Structured patent analysis for novelty and freedom-to-operate evaluation</text>
    </svg>
  );
}

export const DiagramMap = {
  network: NetworkDiagram,
  flow: FlowDiagram,
  grid: GridDiagram,
  scatter: ScatterDiagram,
  bubble: BubbleDiagram,
};
