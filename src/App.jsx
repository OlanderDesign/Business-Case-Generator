import { useState, useRef, useCallback } from "react";

// ─── BUILDING BLOCKS ─────────────────────────────────────────────────────────
const BUILDING_BLOCKS = [
  { id: "desirability", label: "Desirability", desc: "Customer demand & problem validation", icon: "❤️" },
  { id: "feasibility", label: "Feasibility", desc: "Capability to build & deliver", icon: "⚙️" },
  { id: "viability", label: "Viability", desc: "Business model & economics", icon: "📈" },
  { id: "adaptability", label: "Adaptability", desc: "Strategic fit & direction", icon: "🧭" },
  { id: "financials", label: "Financials", desc: "Costs, investment & ROI", icon: "💰" },
  { id: "risk", label: "Risk", desc: "Key risks & mitigations", icon: "⚠️" },
  { id: "implementation", label: "Implementation", desc: "Plan & next steps", icon: "🗺️" },
];

// ─── INTERVIEW TRACKS ────────────────────────────────────────────────────────
const TRACKS = {
  ideaOwner: {
    label: "Idea Owner",
    icon: "💡",
    color: "#163A5F",
    bgColor: "#E8EEF4",
    role: "The person who originated the idea and knows it best",
    quick: [
      { id: "io_q1", text: "Describe the problem in your own words. Who suffers from it most?" },
      { id: "io_q2", text: "What is your proposed solution, and how does it work?" },
      { id: "io_q3", text: "What evidence do you have that customers actually want this?" },
      { id: "io_q4", text: "What have you already tested or tried?" },
      { id: "io_q5", text: "What would success look like in 12 months?" },
      { id: "io_q6", text: "What is the single biggest risk that could derail this?" },
      { id: "io_q7", text: "What do you need to move forward — resources, decisions, support?" },
      { id: "io_q8", text: "What do you know for certain, and what are you still assuming?" },
    ],
    deep: [
      { section: "Customer & Problem", blocks: ["desirability"], questions: [
        { id: "io_d1", text: "Describe the customer in detail — who they are, what they do, what they care about." },
        { id: "io_d2", text: "How big is the pain on a scale of 1–10, and what makes it that bad?" },
        { id: "io_d3", text: "How do customers currently solve this? Why do workarounds fall short?" },
        { id: "io_d4", text: "How many real customers have you spoken to, and what was their reaction?" },
      ]},
      { section: "Solution & Build", blocks: ["feasibility"], questions: [
        { id: "io_d5", text: "What does the solution require to build — technology, people, process?" },
        { id: "io_d6", text: "What do we already have? What must we build or acquire?" },
        { id: "io_d7", text: "What is the smallest version we could put in front of real customers?" },
      ]},
      { section: "Business Model", blocks: ["viability"], questions: [
        { id: "io_d8", text: "How does this generate revenue or reduce cost — what is the core economic logic?" },
        { id: "io_d9", text: "What would a customer pay, how often, and why that amount?" },
        { id: "io_d10", text: "Are there comparable businesses whose numbers we can reference?" },
      ]},
      { section: "Risks & Assumptions", blocks: ["risk"], questions: [
        { id: "io_d11", text: "What are the top 3 things that must be true for this to work?" },
        { id: "io_d12", text: "What single assumption, if wrong, would kill the idea immediately?" },
        { id: "io_d13", text: "Who inside the organisation could block this, and why?" },
      ]},
    ]
  },
  budgetOwner: {
    label: "Budget Owner",
    icon: "🏢",
    color: "#FF5A5F",
    bgColor: "#FFF0F0",
    role: "The leader who funds, sponsors and is accountable for results",
    quick: [
      { id: "bo_q1", text: "In your view, what problem does this solve for the business?" },
      { id: "bo_q2", text: "How does this connect to our current strategy and priorities?" },
      { id: "bo_q3", text: "What would success look like, and how would you measure it?" },
      { id: "bo_q4", text: "What level of investment would you consider reasonable to explore this?" },
      { id: "bo_q5", text: "What would need to be true for you to approve moving forward?" },
      { id: "bo_q6", text: "Who in the organisation needs to be on board for this to work?" },
      { id: "bo_q7", text: "What are your biggest concerns or reservations?" },
      { id: "bo_q8", text: "What is your timeline expectation?" },
    ],
    deep: [
      { section: "Strategic Fit", blocks: ["adaptability"], questions: [
        { id: "bo_d1", text: "How does this connect to our 3–5 year strategy — core, adjacent, or transformational?" },
        { id: "bo_d2", text: "What strategic risks does this mitigate, and what new risks does it create?" },
        { id: "bo_d3", text: "What other initiatives is this competing with for budget and attention?" },
      ]},
      { section: "Investment & Returns", blocks: ["financials"], questions: [
        { id: "bo_d4", text: "What budget range are you thinking — for exploration and for full build?" },
        { id: "bo_d5", text: "What ROI or payback period would make this investment worthwhile?" },
        { id: "bo_d6", text: "Who controls the budget — you alone, or does this need a committee?" },
      ]},
      { section: "Organisation & Decision", blocks: ["implementation", "adaptability"], questions: [
        { id: "bo_d7", text: "Do we have the people and capabilities — what is missing?" },
        { id: "bo_d8", text: "Who are the key stakeholders — name the supporters and the skeptics?" },
        { id: "bo_d9", text: "What has killed similar initiatives in this organisation before?" },
        { id: "bo_d10", text: "What does a green light require from you specifically?" },
        { id: "bo_d11", text: "What is the single biggest red flag that would make you say no?" },
      ]},
    ]
  },
  customer: {
    label: "Customer",
    icon: "👤",
    color: "#B89800",
    bgColor: "#FFFBE6",
    role: "The end customer or user who experiences the problem first-hand",
    quick: [
      { id: "cu_q1", text: "Walk me through how you currently handle this problem today." },
      { id: "cu_q2", text: "What is the most frustrating part of how things work now?" },
      { id: "cu_q3", text: "How much time or money does this problem cost you?" },
      { id: "cu_q4", text: "What have you tried before to solve it? What worked and what didn't?" },
      { id: "cu_q5", text: "If this was solved perfectly, what would that look like for you?" },
      { id: "cu_q6", text: "What would make you switch away from your current solution?" },
      { id: "cu_q7", text: "Would you pay for a solution? What feels like a fair price?" },
      { id: "cu_q8", text: "Who else in your organisation is affected by this problem?" },
    ],
    deep: [
      { section: "Problem & Context", blocks: ["desirability"], questions: [
        { id: "cu_d1", text: "Describe a specific recent moment when this problem caused you real pain." },
        { id: "cu_d2", text: "On a scale of 1–10, how urgent is solving this right now? What drives that?" },
        { id: "cu_d3", text: "How does this problem affect your day-to-day work or life?" },
        { id: "cu_d4", text: "What would happen if this problem was never solved?" },
      ]},
      { section: "Current Behaviour", blocks: ["desirability"], questions: [
        { id: "cu_d5", text: "What tools, services or workarounds do you use today?" },
        { id: "cu_d6", text: "What do you like about your current approach, even if imperfect?" },
        { id: "cu_d7", text: "What would it take to get you to change what you do today?" },
      ]},
      { section: "Value & Willingness to Pay", blocks: ["desirability", "viability"], questions: [
        { id: "cu_d8", text: "If this solution existed, how much value would it create — in time, money or stress?" },
        { id: "cu_d9", text: "What pricing model would feel natural — one-off, subscription, pay-per-use?" },
        { id: "cu_d10", text: "Who in your organisation makes the buying decision for something like this?" },
      ]},
    ]
  },
  partner: {
    label: "Partner / Vendor",
    icon: "🤝",
    color: "#4A6741",
    bgColor: "#EEF4ED",
    role: "External or internal party providing key capability or technology",
    quick: [
      { id: "pa_q1", text: "What exactly do you provide, and what problem does it solve?" },
      { id: "pa_q2", text: "What is proven and live today versus still in development?" },
      { id: "pa_q3", text: "Who else are you working with — can you share reference cases?" },
      { id: "pa_q4", text: "What would a partnership or commercial arrangement look like?" },
      { id: "pa_q5", text: "What is your pricing model and the main cost drivers?" },
      { id: "pa_q6", text: "What do you need from us to make this work?" },
      { id: "pa_q7", text: "What are the biggest risks — technical, commercial, or operational?" },
      { id: "pa_q8", text: "What is your realistic timeline for integration or delivery?" },
    ],
    deep: [
      { section: "Capability & Maturity", blocks: ["feasibility"], questions: [
        { id: "pa_d1", text: "Walk me through exactly how your solution works end-to-end." },
        { id: "pa_d2", text: "What is the maturity level — prototype, pilot, production, or at scale?" },
        { id: "pa_d3", text: "What are the technical integration requirements on our side?" },
        { id: "pa_d4", text: "What are the known limitations, edge cases, or failure modes?" },
      ]},
      { section: "Commercial Terms", blocks: ["viability"], questions: [
        { id: "pa_d5", text: "What is your pricing structure — license, usage, revenue share, or other?" },
        { id: "pa_d6", text: "What are the minimum commitment requirements and exit terms?" },
        { id: "pa_d7", text: "Are you working with our direct competitors — or can you offer exclusivity?" },
      ]},
      { section: "Risk & Dependency", blocks: ["risk"], questions: [
        { id: "pa_d8", text: "What happens to our integration if your company is acquired or changes direction?" },
        { id: "pa_d9", text: "What data do you need access to, and how is it protected?" },
        { id: "pa_d10", text: "What are the top 3 reasons partnerships like this fail — and how do we avoid them?" },
      ]},
    ]
  }
};

// ─── API ─────────────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const callClaude = (body) => fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  },
  body: JSON.stringify(body),
});

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
const BC_PROMPT = `You are a senior innovation consultant writing a business case that will be sent as a PDF to a CEO. You write like a trusted advisor — warm, direct, confident, and human. Not a template filler.

WRITING STYLE:
- Flowing prose, not bullet lists. Bullets only in tables and numbered actions (max 3).
- Short sentences. Active voice. Bold claims where evidence supports it.
- Sound like a consultant who deeply understood the idea and distilled it for a busy executive.
- Use [FACTUAL], [ASSUMED], or [UNKNOWN] inline — sparingly, only on key claims.
- Write in English regardless of input language.

OUTPUT — clean markdown that pastes perfectly into Notion:
- Standard pipe tables with separator row
- No HTML. No emoji in headings. No special unicode.
- One blank line between sections.

---

# BUSINESS CASE: [Title]

[One compelling sentence that captures what this is and why it matters.]

**Version:** v[N] | **Confidence:** [Low / Medium / High] | **Date:** [today]

---

## Executive Summary

[Paragraph 1 — The situation: What problem or opportunity exists, why it matters now, what is at stake if we do nothing.]

[Paragraph 2 — The proposal: What we are recommending, who the key parties are, and what the initiative looks like in practice.]

[Paragraph 3 — The ask: What decision is needed, what conditions must be met, what happens next. End with one clear recommendation sentence.]

---

## 1. Scope and Boundaries

### What This Covers

[2-3 sentences. What is included in this business case.]

### What This Does Not Cover

[2-3 sentences. Be explicit. No implementation plan, no governance, no full rollout.]

### The Assumptions This Case Rests On

1. [Most critical assumption]
2. [Second assumption]
3. [Third assumption]

---

## 2. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| [Risk 1] | High / Med / Low | High / Med / Low | [Action] |
| [Risk 2] | High / Med / Low | High / Med / Low | [Action] |
| [Risk 3] | High / Med / Low | High / Med / Low | [Action] |
| [Risk 4] | High / Med / Low | High / Med / Low | [Action] |
| [Risk 5] | High / Med / Low | High / Med / Low | [Action] |

**The critical risk** is [one sentence — name the single most important risk and why].

---

## 3. Financial Picture

[2-3 sentences of honest context. What do we know, what is estimated, what is genuinely unknown.]

| Item | Cost | Basis |
| --- | --- | --- |
| [Cost item 1] | [Amount or range] | [FACTUAL / ASSUMED] |
| [Cost item 2] | [Amount or range] | [FACTUAL / ASSUMED] |
| [Cost item 3] | [Amount or range] | [ASSUMED] |
| Total investment | [Amount or range] | [FACTUAL / ASSUMED] |

**Revenue and return:** [2-3 sentences on revenue potential and ROI logic. If unknown, say so clearly and state what needs to happen to find out.]

> Financial confidence: [LOW / MEDIUM / HIGH] — [One sentence on why and what would improve it.]

---

## 4. Implementation

| Phase | What Happens | When | Success Gate |
| --- | --- | --- | --- |
| 1 — Validate | [Activities] | [Duration] | [Go / no-go criteria] |
| 2 — Build | [Activities] | [Duration] | [Key milestone] |
| 3 — Scale | [Activities] | [Duration] | [KPI or decision point] |

**The three things that must happen in the next 30 days:**

1. [Action — who owns it]
2. [Action — who owns it]
3. [Action — who owns it]

---

## Supporting Analysis

---

### A. Business Model Assessment

**Desirability** — [2-3 sentences on customer demand evidence. Honest about what is known vs assumed.] [FACTUAL / ASSUMED / UNKNOWN]

**Feasibility** — [2-3 sentences on capability and readiness to build.] [FACTUAL / ASSUMED / UNKNOWN]

**Viability** — [2-3 sentences on economics and business model logic.] [FACTUAL / ASSUMED / UNKNOWN]

**Adaptability** — [2-3 sentences on strategic fit and long-term direction.] [FACTUAL / ASSUMED / UNKNOWN]

---

### B. Assumption Map

| Area | The Question | Our Best Answer | Confidence | Priority |
| --- | --- | --- | --- | --- |
| Desirability | [Q] | [A] | [FACTUAL / ASSUMED / UNKNOWN] | High / Med / Low |
| Desirability | [Q] | [A] | [FACTUAL / ASSUMED / UNKNOWN] | High / Med / Low |
| Feasibility | [Q] | [A] | [FACTUAL / ASSUMED / UNKNOWN] | High / Med / Low |
| Feasibility | [Q] | [A] | [FACTUAL / ASSUMED / UNKNOWN] | High / Med / Low |
| Viability | [Q] | [A] | [FACTUAL / ASSUMED / UNKNOWN] | High / Med / Low |
| Viability | [Q] | [A] | [FACTUAL / ASSUMED / UNKNOWN] | High / Med / Low |
| Adaptability | [Q] | [A] | [FACTUAL / ASSUMED / UNKNOWN] | High / Med / Low |

**Before moving forward, we must resolve:** [2-3 critical unknowns in one short sentence each.]

---

### C. SWOT and Strategic Options

| | Helpful | Harmful |
| --- | --- | --- |
| Internal | **Strengths:** [3-4 items] | **Weaknesses:** [3-4 items] |
| External | **Opportunities:** [3-4 items] | **Threats:** [3-4 items] |

[2-3 sentences of TOWS synthesis — what the strategic options are, written as prose.]

---

### D. External Environment (PESTLE)

| Factor | What We See | Effect |
| --- | --- | --- |
| Political | [obs] | Positive / Neutral / Risk |
| Economic | [obs] | Positive / Neutral / Risk |
| Social | [obs] | Positive / Neutral / Risk |
| Technological | [obs] | Positive / Neutral / Risk |
| Legal | [obs] | Positive / Neutral / Risk |
| Environmental | [obs] | Positive / Neutral / Risk |

[One sentence verdict on the external environment overall.]

---

*Prepared by the innovation function. Sources: [list what was provided]. Questions: contact the innovation lead.*`;

const COV_PROMPT = (text) => `Analyse these innovation inputs and return ONLY this JSON (no explanation, no markdown):

{"coverage":{"[id]":"covered"|"partial"|"missing"},"blocks":{"desirability":"strong"|"partial"|"weak"|"missing","feasibility":"strong"|"partial"|"weak"|"missing","viability":"strong"|"partial"|"weak"|"missing","adaptability":"strong"|"partial"|"weak"|"missing","financials":"strong"|"partial"|"weak"|"missing","risk":"strong"|"partial"|"weak"|"missing","implementation":"strong"|"partial"|"weak"|"missing"}}

Questions to evaluate:
${Object.values(TRACKS).flatMap(t=>[...t.quick.map(q=>`${q.id}: ${q.text}`),...t.deep.flatMap(s=>s.questions.map(q=>`${q.id}: ${q.text}`))]).join('\n')}

INPUTS:
${text}`;

// ─── MARKDOWN RENDERER ───────────────────────────────────────────────────────
function renderMd(text) {
  let h = text
    .replace(/^---$/gm,'<hr/>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code>$1</code>')
    .replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/\[NEEDS INPUT:([^\]]+)\]/g,'<span class="tn">NEEDS INPUT:$1</span>')
    .replace(/\[FACTUAL\]/g,'<span class="tf">FACTUAL</span>')
    .replace(/\[ASSUMED\]/g,'<span class="ta">ASSUMED</span>')
    .replace(/\[UNKNOWN\]/g,'<span class="tu">UNKNOWN</span>');

  h = h.replace(/(\|.+\|\n)+/g,(t)=>{
    const rows=t.trim().split('\n');
    let o='<div class="tw"><table>';
    rows.forEach((r,i)=>{
      if(/^\|[\s\-:|]+\|$/.test(r.replace(/[^|\-:\s]/g,'')))return;
      const cells=r.split('|').slice(1,-1);
      const tag=i===0?'th':'td';
      o+='<tr>'+cells.map(c=>`<${tag}>${c.trim()}</${tag}>`).join('')+'</tr>';
    });
    return o+'</table></div>';
  });

  h=h.split('\n\n').map(b=>{
    if(/^<(h[1-3]|hr|blockquote|div)/.test(b))return b;
    if(!b.trim())return '';
    return `<p>${b.replace(/\n/g,'<br/>')}</p>`;
  }).join('\n');

  return h;
}

// ─── BLOCK COLOURS ───────────────────────────────────────────────────────────
const bc=(s)=>{
  if(s==='strong')return{bg:'#DCFCE7',text:'#15803D',bar:'#22C55E'};
  if(s==='partial')return{bg:'#FEF9C3',text:'#A16207',bar:'#EAB308'};
  if(s==='weak')return{bg:'#FEE2E2',text:'#B91C1C',bar:'#EF4444'};
  return{bg:'#F1F5F9',text:'#94A3B8',bar:'#CBD5E1'};
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [inputs,setInputs]=useState([{id:1,label:'Input 1',content:'',type:'text',file:null}]);
  const [title,setTitle]=useState('');
  const [generating,setGenerating]=useState(false);
  const [result,setResult]=useState('');
  const [coverage,setCoverage]=useState(null);
  const [blocks,setBlocks]=useState(null);
  const [error,setError]=useState('');
  const [progress,setProgress]=useState('');
  const [activeTab,setActiveTab]=useState('input');
  const [activeTrack,setActiveTrack]=useState('ideaOwner');
  const [qMode,setQMode]=useState('quick');
  const [copied,setCopied]=useState(false);
  const [note,setNote]=useState('');
  const fileRefs=useRef({});

  const addInput=()=>setInputs(p=>[...p,{id:Date.now(),label:`Input ${p.length+1}`,content:'',type:'text',file:null}]);
  const removeInput=(id)=>setInputs(p=>p.filter(i=>i.id!==id));
  const updateInput=(id,k,v)=>setInputs(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handleFile=useCallback(async(id,file)=>{
    if(!file)return;
    updateInput(id,'file',file);
    updateInput(id,'label',file.name);
    if(file.type==='text/plain'){
      const text=await file.text();
      updateInput(id,'content',text);updateInput(id,'type','text');
    } else if(file.type==='text/html'||file.name.endsWith('.html')){
      const html=await file.text();
      const tmp=document.createElement('div');tmp.innerHTML=html;
      tmp.querySelectorAll('style,script').forEach(el=>el.remove());
      const text=(tmp.innerText||tmp.textContent||'').replace(/\s+/g,' ').trim();
      updateInput(id,'content',text);updateInput(id,'type','text');
      updateInput(id,'label',file.name.replace('.html','')+'(Notion export)');
    } else if(file.type==='application/pdf'){
      const reader=new FileReader();
      reader.onload=e=>{updateInput(id,'base64',e.target.result.split(',')[1]);updateInput(id,'mimeType',file.type);updateInput(id,'type','file');};
      reader.readAsDataURL(file);
    } else {
      const text=await file.text().catch(()=>'');
      updateInput(id,'content',text);updateInput(id,'type','text');
    }
  },[]);

  const buildContent=()=>{
    const parts=[];
    if(title)parts.push(`INITIATIVE: ${title}`);
    inputs.forEach(inp=>{if(inp.type==='text'&&inp.content.trim())parts.push(`--- ${inp.label.toUpperCase()} ---\n${inp.content.trim()}`);});
    const content=[];
    if(parts.length)content.push({type:'text',text:parts.join('\n\n')});
    inputs.forEach(inp=>{if(inp.base64&&inp.mimeType==='application/pdf')content.push({type:'document',source:{type:'base64',media_type:'application/pdf',data:inp.base64}});});
    return content;
  };

  const getAllText=()=>{
    const p=[];if(title)p.push(title);
    inputs.forEach(inp=>{if(inp.content.trim())p.push(inp.content.trim());});
    return p.join('\n\n');
  };

  const useAsInput=()=>{
    if(!result)return;
    const vMatch=result.match(/\*\*Version:\*\* v(\d+)/);
    const nextV=vMatch?parseInt(vMatch[1])+1:2;
    setInputs(p=>[...p,{id:Date.now(),label:'Previous Business Case — for revision',content:result,type:'text',file:null}]);
    setNote(`Previous case loaded as input. Add new notes and regenerate for v${nextV}.`);
    setActiveTab('input');
    setTimeout(()=>setNote(''),5000);
  };

  const generate=async()=>{
    if(!API_KEY){setError('API key missing — check your .env file.');return;}
    if(!inputs.some(i=>i.content.trim()||i.base64)){setError('Add at least one input first.');return;}
    setError('');setGenerating(true);setResult('');setCoverage(null);setBlocks(null);
    try{
      setProgress('Reading your inputs and building the business case...');
      const content=buildContent();const allText=getAllText();
      const [bcRes,covRes]=await Promise.all([
        callClaude({model:"claude-sonnet-4-5",max_tokens:8000,system:BC_PROMPT,messages:[{role:"user",content:[...content,{type:'text',text:'Write the complete business case. Warm consultant tone. Prose over bullets. [FACTUAL]/[ASSUMED]/[UNKNOWN] inline on key claims only. Clean markdown for Notion.'}]}]}),
        callClaude({model:"claude-sonnet-4-5",max_tokens:2000,messages:[{role:"user",content:COV_PROMPT(allText)}]})
      ]);
      if(!bcRes.ok){const e=await bcRes.json().catch(()=>({}));throw new Error(e?.error?.message||`Error ${bcRes.status}`);}
      if(!covRes.ok){const e=await covRes.json().catch(()=>({}));throw new Error(e?.error?.message||`Error ${covRes.status}`);}
      const [bcData,covData]=await Promise.all([bcRes.json(),covRes.json()]);
      setResult(bcData.content.map(b=>b.text||'').join('\n'));
      try{
        const raw=covData.content.map(b=>b.text||'').join('\n').replace(/```json|```/g,'').trim();
        const parsed=JSON.parse(raw);
        setCoverage(parsed.coverage||{});setBlocks(parsed.blocks||{});
      }catch{setCoverage({});setBlocks({});}
      setActiveTab('result');setProgress('');
    }catch(err){setError('Error: '+err.message);setProgress('');}
    finally{setGenerating(false);}
  };

  const covIcon=(id)=>{
    if(!coverage)return null;
    const s=coverage[id];
    if(s==='covered')return<span style={{color:'#22C55E',fontSize:13}}>✓</span>;
    if(s==='partial')return<span style={{color:'#EAB308',fontSize:13}}>◐</span>;
    return<span style={{color:'#CBD5E1',fontSize:13}}>○</span>;
  };

  const tSum=(track)=>{
    if(!coverage)return null;
    const qs=qMode==='quick'?track.quick:track.deep.flatMap(s=>s.questions);
    const ids=qs.map(q=>q.id);
    return{covered:ids.filter(id=>coverage[id]==='covered').length,partial:ids.filter(id=>coverage[id]==='partial').length,missing:ids.filter(id=>!coverage[id]||coverage[id]==='missing').length,total:ids.length};
  };

  const track=TRACKS[activeTrack];
  const trackSum=tSum(track);
  const inputCount=inputs.filter(i=>i.content.trim()||i.base64).length;

  return(
    <div className="app">
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --blue:#163A5F;--blue-l:#E8EEF4;--blue-m:#C8D6E3;
          --red:#FF5A5F;--yellow:#FFDD33;
          --navy:#163A5F;--txt:#2E3135;--txt2:#4A4E54;--txt3:#9CA3AF;
          --bdr:#E5E3DC;--bdr2:#D1CFC8;--bg:#FBFAF8;--wh:#FFFFFF;
          --r:16px;--rs:10px;
          --sh:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
          --shm:0 4px 16px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);
          --font:-apple-system,BlinkMacSystemFont,'Segoe UI','Apple Color Emoji',Helvetica,Arial,sans-serif;
        }
        .app{min-height:100vh;background:var(--bg);color:var(--txt);font-family:var(--font);font-size:14px;line-height:1.6;}
        .shell{max-width:900px;margin:0 auto;padding:48px 24px 96px;}
        .hdr{margin-bottom:44px;}
        .hdr-pill{display:inline-flex;align-items:center;gap:6px;background:var(--blue-l);color:var(--blue);font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:12px;border:1px solid var(--blue-m);}
        .hdr-title{font-family:var(--font);font-size:clamp(28px,4vw,40px);font-weight:700;color:var(--navy);line-height:1.1;margin-bottom:6px;}
        .hdr-sub{font-size:13px;color:var(--txt3);}
        .api-warn{background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:var(--rs);padding:14px 18px;font-size:12px;color:#92400E;margin-bottom:28px;line-height:1.7;}
        .api-warn code{background:#FEF3C7;padding:1px 6px;border-radius:5px;font-size:11px;font-family:monospace;}
        .tabs{display:flex;gap:2px;background:#E5E3DC;border-radius:14px;padding:3px;margin-bottom:36px;width:fit-content;}
        .tab{font-family:var(--font);font-size:12px;font-weight:600;padding:9px 20px;background:none;border:none;border-radius:12px;color:var(--txt3);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:7px;white-space:nowrap;}
        .tab.on{background:var(--wh);color:var(--txt);box-shadow:var(--sh);}
        .tab:hover:not(.on):not(:disabled){color:var(--txt2);}
        .tab:disabled{opacity:.3;cursor:not-allowed;}
        .badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:100px;font-size:10px;font-weight:700;background:var(--blue);color:#fff;}
        .lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--txt3);margin-bottom:8px;display:block;}
        .title-input{width:100%;background:var(--wh);border:1.5px solid var(--bdr);border-radius:var(--r);color:var(--txt);padding:16px 20px;font-family:var(--font);font-size:20px;font-weight:600;outline:none;margin-bottom:28px;transition:border-color .2s,box-shadow .2s;box-shadow:var(--sh);}
        .title-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(22,58,95,.1);}
        .title-input::placeholder{color:#C8C6BF;}
        .input-card{background:var(--wh);border:1.5px solid var(--bdr);border-radius:var(--r);padding:18px 20px;margin-bottom:10px;box-shadow:var(--sh);transition:border-color .2s;}
        .input-card:focus-within{border-color:var(--blue-m);}
        .card-hdr{display:flex;gap:8px;align-items:center;margin-bottom:14px;}
        .card-lbl{font-family:var(--font);font-size:12px;font-weight:600;background:var(--bg);border:1.5px solid var(--bdr);border-radius:8px;color:var(--blue);padding:7px 12px;outline:none;flex:1;min-width:0;transition:border-color .2s;}
        .card-lbl:focus{border-color:var(--blue);}
        .type-btns{display:flex;border-radius:8px;overflow:hidden;border:1.5px solid var(--bdr);flex-shrink:0;}
        .type-btn{font-family:var(--font);font-size:11px;font-weight:600;padding:6px 12px;background:none;border:none;color:var(--txt3);cursor:pointer;transition:all .15s;}
        .type-btn.on{background:var(--blue);color:#fff;}
        .rm{background:none;border:1.5px solid var(--bdr);border-radius:8px;color:var(--txt3);width:32px;height:32px;cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
        .rm:hover{border-color:#FCA5A5;color:#EF4444;}
        .ta{width:100%;min-height:120px;background:transparent;border:none;color:var(--txt2);font-family:var(--font);font-size:13px;line-height:1.75;resize:vertical;outline:none;}
        .ta::placeholder{color:#C8C6BF;}
        .drop{border:1.5px dashed var(--bdr2);border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:var(--bg);}
        .drop:hover{border-color:var(--blue);background:var(--blue-l);}
        .drop-txt{font-size:12px;color:var(--txt3);}
        .drop-txt span{display:block;font-size:11px;color:#9CA3AF;margin-top:4px;}
        .drop-ok{font-size:12px;color:#22C55E;font-weight:600;}
        .add-btn{font-family:var(--font);font-size:12px;font-weight:600;background:none;border:1.5px dashed var(--bdr2);border-radius:var(--r);color:var(--txt3);padding:14px;width:100%;cursor:pointer;transition:all .2s;margin-bottom:24px;}
        .add-btn:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-l);}
        .gen-btn{font-family:var(--font);font-size:13px;font-weight:700;background:var(--blue);border:none;border-radius:var(--r);color:#fff;padding:17px;width:100%;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 4px 12px rgba(22,58,95,.25);}
        .gen-btn:hover:not(:disabled){background:#0F2A45;box-shadow:0 6px 16px rgba(22,58,95,.35);transform:translateY(-1px);}
        .gen-btn:disabled{opacity:.45;cursor:not-allowed;transform:none;}
        .prog{font-size:12px;color:var(--blue);text-align:center;margin-top:14px;animation:pulse 1.5s ease infinite;font-weight:500;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .err{font-size:12px;color:#DC2626;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:12px 16px;margin-top:12px;}
        .ok{font-size:12px;color:#15803D;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:12px 16px;margin-top:10px;font-weight:500;}
        .tracker{background:var(--wh);border:1.5px solid var(--bdr);border-radius:var(--r);padding:24px;margin-bottom:28px;box-shadow:var(--sh);}
        .tracker-ttl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--txt3);margin-bottom:18px;}
        .tgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(108px,1fr));gap:10px;}
        .tblock{border-radius:12px;padding:12px 14px;text-align:center;transition:transform .15s;cursor:default;}
        .tblock:hover{transform:translateY(-2px);}
        .tblock-icon{font-size:18px;margin-bottom:5px;}
        .tblock-lbl{font-size:11px;font-weight:700;margin-bottom:3px;}
        .tblock-status{font-size:10px;font-weight:500;opacity:.75;}
        .tbar{height:3px;border-radius:2px;margin-top:8px;background:rgba(0,0,0,.08);overflow:hidden;}
        .tbar-fill{height:100%;border-radius:2px;}
        .track-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
        .track-pill{font-family:var(--font);font-size:12px;font-weight:600;padding:8px 16px;background:var(--wh);border:1.5px solid var(--bdr);border-radius:100px;color:var(--txt3);cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:7px;box-shadow:var(--sh);}
        .track-pill.on{border-color:var(--tc);color:var(--tc);background:var(--tbg);box-shadow:none;}
        .track-pill:hover:not(.on){border-color:var(--bdr2);color:var(--txt2);}
        .role-chip{background:var(--blue-l);border:1px solid var(--blue-m);border-radius:var(--rs);padding:10px 16px;font-size:12px;color:var(--blue);font-weight:500;margin-bottom:20px;}
        .mode-row{display:flex;gap:8px;margin-bottom:24px;}
        .mode-btn{font-family:var(--font);font-size:12px;font-weight:600;padding:9px 20px;background:var(--wh);border:1.5px solid var(--bdr);border-radius:100px;color:var(--txt3);cursor:pointer;transition:all .18s;box-shadow:var(--sh);}
        .mode-btn.on{background:var(--navy);border-color:var(--navy);color:#fff;box-shadow:0 2px 8px rgba(22,58,95,.2);}
        .cov-row{display:flex;align-items:center;gap:14px;background:var(--wh);border:1.5px solid var(--bdr);border-radius:var(--rs);padding:12px 18px;margin-bottom:20px;box-shadow:var(--sh);}
        .cov-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
        .cov-stat{font-size:12px;color:var(--txt2);display:flex;align-items:center;gap:5px;font-weight:500;}
        .cov-prog{flex:1;height:5px;background:var(--bdr);border-radius:3px;overflow:hidden;}
        .cov-fill{height:100%;background:#22C55E;border-radius:3px;transition:width .4s;}
        .q-sec{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--txt3);padding:18px 0 10px;border-top:1.5px solid var(--bdr);margin-top:8px;}
        .q-card{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:var(--wh);border:1.5px solid var(--bdr);border-radius:var(--rs);margin-bottom:7px;border-left-width:4px;box-shadow:var(--sh);}
        .q-card.cov-covered{border-left-color:#22C55E;}
        .q-card.cov-partial{border-left-color:#EAB308;}
        .q-card.cov-missing{border-left-color:var(--bdr);}
        .q-num{font-size:11px;font-weight:700;color:var(--txt3);flex-shrink:0;margin-top:1px;min-width:24px;}
        .q-txt{font-size:13px;color:var(--txt2);line-height:1.6;flex:1;}
        .q-block{font-size:10px;font-weight:600;padding:2px 7px;border-radius:5px;background:var(--blue-l);color:var(--blue);flex-shrink:0;align-self:flex-start;margin-top:2px;}
        .leg{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px;}
        .leg-i{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--txt3);font-weight:500;}
        .no-cov{background:var(--wh);border:1.5px solid var(--bdr);border-radius:var(--rs);padding:20px;font-size:13px;color:var(--txt3);text-align:center;margin-top:20px;}
        .res-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:10px;}
        .res-lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--txt3);}
        .res-acts{display:flex;gap:8px;flex-wrap:wrap;}
        .act{font-family:var(--font);font-size:12px;font-weight:600;background:var(--wh);border:1.5px solid var(--bdr);border-radius:10px;color:var(--txt2);padding:9px 16px;cursor:pointer;transition:all .18s;box-shadow:var(--sh);}
        .act:hover{border-color:var(--blue);color:var(--blue);}
        .act.p{background:var(--blue);border-color:var(--blue);color:#fff;box-shadow:0 4px 12px rgba(22,58,95,.2);}
        .act.p:hover{background:#0F2A45;}
        .doc{background:var(--wh);border:1.5px solid var(--bdr);border-radius:var(--r);padding:52px 56px;box-shadow:var(--shm);}
        .doc h1{font-family:var(--font);font-size:30px;font-weight:700;color:var(--navy);margin-bottom:8px;line-height:1.15;}
        .doc h2{font-family:var(--font);font-size:18px;font-weight:700;color:var(--navy);margin:40px 0 14px;padding-bottom:10px;border-bottom:2px solid var(--blue-m);}
        .doc h3{font-family:var(--font);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--txt3);margin:22px 0 8px;}
        .doc p{font-size:15px;color:var(--txt2);margin-bottom:14px;line-height:1.9;}
        .doc strong{color:var(--txt);font-weight:700;}
        .doc em{color:var(--txt3);font-style:italic;}
        .doc hr{border:none;border-top:2px solid var(--bdr);margin:36px 0;}
        .doc blockquote{border-left:4px solid var(--blue);padding:12px 20px;margin:18px 0;background:var(--blue-l);border-radius:0 10px 10px 0;font-size:13px;color:var(--txt2);font-weight:500;}
        .doc code{font-family:monospace;font-size:12px;background:var(--bg);padding:2px 7px;border-radius:5px;color:var(--blue);border:1px solid var(--bdr);}
        .tw{overflow-x:auto;margin:18px 0;border-radius:12px;border:1.5px solid var(--bdr);box-shadow:var(--sh);}
        .doc table{width:100%;border-collapse:collapse;font-size:13px;}
        .doc th{background:var(--bg);color:var(--txt3);padding:10px 16px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;border-bottom:1.5px solid var(--bdr);}
        .doc td{padding:11px 16px;border-bottom:1px solid #F0EEE8;color:var(--txt2);line-height:1.5;}
        .doc tr:last-child td{border-bottom:none;}
        .doc tr:hover td{background:#FAFAF8;}
        .tf{display:inline-block;font-size:10px;font-weight:700;background:#DCFCE7;color:#15803D;padding:2px 7px;border-radius:5px;border:1px solid #BBF7D0;letter-spacing:.04em;}
        .ta{display:inline-block;font-size:10px;font-weight:700;background:#FEF9C3;color:#A16207;padding:2px 7px;border-radius:5px;border:1px solid #FDE68A;letter-spacing:.04em;}
        .tu{display:inline-block;font-size:10px;font-weight:700;background:#FEE2E2;color:#B91C1C;padding:2px 7px;border-radius:5px;border:1px solid #FECACA;letter-spacing:.04em;}
        .tn{display:inline-block;font-size:10px;font-weight:700;background:#EFF6FF;color:#2563EB;padding:3px 9px;border-radius:5px;border:1px solid #BFDBFE;margin:2px 0;}
        .empty{text-align:center;padding:64px 20px;font-size:13px;color:var(--txt3);}
        @media(max-width:640px){.doc{padding:28px 20px;}.shell{padding:28px 14px;}.tabs{width:100%;}.tab{flex:1;justify-content:center;padding:9px 8px;font-size:11px;}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>

      <div className="shell">

        <div className="hdr">
          <div className="hdr-pill">🚀 Innovation Tool</div>
          <h1 className="hdr-title">Business Case Generator</h1>
          <p className="hdr-sub">Transcripts · Documents · Notes → Decision-ready business case</p>
        </div>

        {!API_KEY&&<div className="api-warn">⚠ No API key found. Create a <code>.env</code> file: <code>VITE_ANTHROPIC_API_KEY=sk-ant-...</code> then restart with <code>npm run dev</code></div>}

        <div className="tabs">
          <button className={`tab ${activeTab==='input'?'on':''}`} onClick={()=>setActiveTab('input')}>
            Input {inputCount>0&&<span className="badge">{inputCount}</span>}
          </button>
          <button className={`tab ${activeTab==='guide'?'on':''}`} onClick={()=>setActiveTab('guide')}>
            Interview Guide
          </button>
          <button className={`tab ${activeTab==='result'?'on':''}`} onClick={()=>setActiveTab('result')} disabled={!result}>
            Business Case {result&&<span className="badge">✓</span>}
          </button>
        </div>

        {/* INPUT */}
        {activeTab==='input'&&(
          <div>
            <label className="lbl">Initiative Title</label>
            <input className="title-input" placeholder="e.g. AI-powered corrosion management pilot"
              value={title} onChange={e=>setTitle(e.target.value)}/>

            <label className="lbl" style={{marginBottom:12}}>Your Inputs</label>

            {inputs.map((inp,idx)=>(
              <div key={inp.id} className="input-card">
                <div className="card-hdr">
                  <input className="card-lbl" value={inp.label} onChange={e=>updateInput(inp.id,'label',e.target.value)} placeholder="Label this input"/>
                  <div className="type-btns">
                    <button className={`type-btn ${inp.type==='text'?'on':''}`} onClick={()=>updateInput(inp.id,'type','text')}>Text</button>
                    <button className={`type-btn ${inp.type==='file'?'on':''}`} onClick={()=>updateInput(inp.id,'type','file')}>File</button>
                  </div>
                  {inputs.length>1&&<button className="rm" onClick={()=>removeInput(inp.id)}>×</button>}
                </div>
                {inp.type==='text'?(
                  <textarea className="ta" value={inp.content} onChange={e=>updateInput(inp.id,'content',e.target.value)}
                    placeholder={idx===0?"Paste anything — transcript, interview notes, idea card, workshop output, previous business case...\nNo need to tidy it up. Just paste.":"Paste input..."}/>
                ):(
                  <div className="drop" onClick={()=>fileRefs.current[inp.id]?.click()}
                    onDragOver={e=>e.preventDefault()}
                    onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(inp.id,f);}}>
                    <input type="file" style={{display:'none'}} ref={el=>fileRefs.current[inp.id]=el}
                      accept=".pdf,.txt,.html,.doc,.docx"
                      onChange={e=>e.target.files[0]&&handleFile(inp.id,e.target.files[0])}/>
                    {inp.file?<div className="drop-ok">✓ {inp.file.name}</div>
                      :<div className="drop-txt">Drop file here or click to browse<span>PDF · TXT · HTML (Notion export) · DOC</span></div>}
                  </div>
                )}
              </div>
            ))}

            <button className="add-btn" onClick={addInput}>+ Add another input</button>
            <button className="gen-btn" onClick={generate} disabled={generating||!API_KEY}>
              {generating?<><span style={{display:'inline-block',animation:'spin 1s linear infinite'}}>↻</span>Generating...</>:'✦ Generate Business Case'}
            </button>
            {progress&&<div className="prog">{progress}</div>}
            {error&&<div className="err">{error}</div>}
            {note&&<div className="ok">✓ {note}</div>}
          </div>
        )}

        {/* INTERVIEW GUIDE */}
        {activeTab==='guide'&&(
          <div>
            {/* HEALTH TRACKER */}
            <div className="tracker">
              <div className="tracker-ttl">Business Case Health</div>
              <div className="tgrid">
                {BUILDING_BLOCKS.map(b=>{
                  const s=blocks?(blocks[b.id]||'missing'):'missing';
                  const c=bc(s);
                  const pct=s==='strong'?100:s==='partial'?60:s==='weak'?25:0;
                  return(
                    <div key={b.id} className="tblock" style={{background:c.bg}}>
                      <div className="tblock-icon">{b.icon}</div>
                      <div className="tblock-lbl" style={{color:c.text}}>{b.label}</div>
                      <div className="tblock-status" style={{color:c.text}}>{s}</div>
                      <div className="tbar"><div className="tbar-fill" style={{width:pct+'%',background:c.bar}}/></div>
                    </div>
                  );
                })}
              </div>
              {!blocks&&<div style={{textAlign:'center',fontSize:12,color:'var(--txt3)',marginTop:14}}>Generate a business case to see health scores</div>}
            </div>

            <div className="track-tabs">
              {Object.entries(TRACKS).map(([key,t])=>{
                const sum=tSum(t);
                return(
                  <button key={key} className={`track-pill ${activeTrack===key?'on':''}`}
                    style={{'--tc':t.color,'--tbg':t.bgColor}} onClick={()=>setActiveTrack(key)}>
                    {t.icon} {t.label}
                    {sum&&<span style={{fontSize:11,opacity:.7,fontWeight:700}}>{sum.covered}/{sum.total}</span>}
                  </button>
                );
              })}
            </div>

            <div className="role-chip">{track.icon} {track.role}</div>

            <div className="mode-row">
              <button className={`mode-btn ${qMode==='quick'?'on':''}`} onClick={()=>setQMode('quick')}>⚡ Quick — 8 questions</button>
              <button className={`mode-btn ${qMode==='deep'?'on':''}`} onClick={()=>setQMode('deep')}>◎ Deep — ~25 min</button>
            </div>

            {coverage&&trackSum&&(
              <div className="cov-row">
                <div className="cov-stat"><div className="cov-dot" style={{background:'#22C55E'}}/>{trackSum.covered} covered</div>
                <div className="cov-stat"><div className="cov-dot" style={{background:'#EAB308'}}/>{trackSum.partial} partial</div>
                <div className="cov-stat"><div className="cov-dot" style={{background:'#D1D5DB'}}/>{trackSum.missing} missing</div>
                <div className="cov-prog"><div className="cov-fill" style={{width:`${(trackSum.covered/trackSum.total)*100}%`}}/></div>
              </div>
            )}

            {coverage&&(
              <div className="leg">
                <div className="leg-i"><div style={{width:16,height:3,background:'#22C55E',borderRadius:2}}/>Covered</div>
                <div className="leg-i"><div style={{width:16,height:3,background:'#EAB308',borderRadius:2}}/>Partial</div>
                <div className="leg-i"><div style={{width:16,height:3,background:'#D1D5DB',borderRadius:2}}/>Missing</div>
              </div>
            )}

            {qMode==='quick'?(
              <div>
                {track.quick.map((q,i)=>{
                  const status=coverage?(coverage[q.id]||'missing'):null;
                  return(
                    <div key={q.id} className={`q-card ${status?'cov-'+status:''}`}>
                      <div className="q-num">Q{i+1}</div>
                      <div className="q-txt">{q.text}</div>
                      {covIcon(q.id)}
                    </div>
                  );
                })}
              </div>
            ):(
              <div>
                {track.deep.map((section,si)=>(
                  <div key={si}>
                    <div className="q-sec">{section.section}</div>
                    {section.questions.map((q,qi)=>{
                      const status=coverage?(coverage[q.id]||'missing'):null;
                      return(
                        <div key={q.id} className={`q-card ${status?'cov-'+status:''}`}>
                          <div className="q-num">Q{qi+1}</div>
                          <div className="q-txt">{q.text}</div>
                          {section.blocks&&<div className="q-block">{section.blocks[0]}</div>}
                          {covIcon(q.id)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {!coverage&&<div className="no-cov">Generate a business case first to see question coverage and health scores.</div>}
          </div>
        )}

        {/* RESULT */}
        {activeTab==='result'&&(
          <div>
            {result?(
              <>
                <div className="res-bar">
                  <div className="res-lbl">Business Case</div>
                  <div className="res-acts">
                    <button className="act" onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
                      {copied?'✓ Copied':'⎘ Copy for Notion'}
                    </button>
                    <button className="act p" onClick={useAsInput}>↺ Use as Input for Next Version</button>
                  </div>
                </div>
                <div className="doc" dangerouslySetInnerHTML={{__html:renderMd(result)}}/>
              </>
            ):(
              <div className="empty">No business case yet.<br/>Add inputs and generate.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}