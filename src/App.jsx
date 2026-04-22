import { useState, useRef, useCallback } from "react";

// ─── QUESTION FRAMEWORK ──────────────────────────────────────────────────────
const TRACKS = {
  ideaOwner: {
    label: "Idea Owner",
    icon: "💡",
    color: "#c8a96e",
    role: "The person who originated or owns the idea",
    quick: [
      { id: "io_q1", text: "Describe the problem in your own words. Who suffers from it most?" },
      { id: "io_q2", text: "What is your proposed solution, and how does it work?" },
      { id: "io_q3", text: "What evidence do you have that customers actually want this?" },
      { id: "io_q4", text: "What have you already tested or tried?" },
      { id: "io_q5", text: "What would success look like in 12 months?" },
      { id: "io_q6", text: "What is the single biggest risk or thing that could go wrong?" },
      { id: "io_q7", text: "What do you need to move forward — resources, decisions, support?" },
      { id: "io_q8", text: "What do you know for certain, and what are you still assuming?" },
    ],
    deep: [
      { section: "Customer & Problem", questions: [
        { id: "io_d1", text: "Describe the customer in detail — who they are, what they do, what they care about most." },
        { id: "io_d2", text: "How big is the pain on a scale of 1–10, and what makes it that bad?" },
        { id: "io_d3", text: "How do customers currently solve this? What are the workarounds, and why do they fall short?" },
        { id: "io_d4", text: "How many real customers have you talked to, and what did they tell you?" },
      ]},
      { section: "Solution & Capability", questions: [
        { id: "io_d5", text: "What does the solution require to build — technology, people, process?" },
        { id: "io_d6", text: "What do we already have? What must we build or acquire?" },
        { id: "io_d7", text: "What is the smallest version we could put in front of real customers?" },
      ]},
      { section: "Business Model", questions: [
        { id: "io_d8", text: "How does this generate revenue or reduce cost — what's the core economic logic?" },
        { id: "io_d9", text: "What would a customer pay, how often, and why that amount?" },
        { id: "io_d10", text: "Are there comparable businesses whose numbers we can reference?" },
      ]},
      { section: "Risks & Assumptions", questions: [
        { id: "io_d11", text: "What are the top 3 things that must be true for this to work?" },
        { id: "io_d12", text: "What single assumption, if wrong, would kill the idea immediately?" },
        { id: "io_d13", text: "Who inside the organization could block this, and why?" },
      ]},
    ]
  },
  budgetOwner: {
    label: "Business / Budget Owner",
    icon: "🏢",
    color: "#7eb8c9",
    role: "The leader who would fund, sponsor, and be accountable",
    quick: [
      { id: "bo_q1", text: "In your view, what problem does this solve for the business?" },
      { id: "bo_q2", text: "How does this connect to our current strategy and priorities?" },
      { id: "bo_q3", text: "What would success look like, and how would you measure it?" },
      { id: "bo_q4", text: "What level of investment would you consider reasonable to explore this?" },
      { id: "bo_q5", text: "What would need to be true for you to approve moving forward?" },
      { id: "bo_q6", text: "Who in the organization needs to be on board for this to work?" },
      { id: "bo_q7", text: "What are your biggest concerns or reservations?" },
      { id: "bo_q8", text: "What is your timeline expectation?" },
    ],
    deep: [
      { section: "Strategic Fit", questions: [
        { id: "bo_d1", text: "How does this connect to our 3–5 year strategy — is it core, adjacent, or transformational?" },
        { id: "bo_d2", text: "What strategic risks does this idea mitigate, and what new risks does it create?" },
        { id: "bo_d3", text: "What other initiatives is this competing with for budget and leadership attention?" },
      ]},
      { section: "Investment & Returns", questions: [
        { id: "bo_d4", text: "What budget range are you thinking — both for exploration and for full build?" },
        { id: "bo_d5", text: "What ROI or payback period would make this investment worthwhile?" },
        { id: "bo_d6", text: "Who controls the budget — you alone, or does this need a committee?" },
      ]},
      { section: "Organizational Readiness", questions: [
        { id: "bo_d7", text: "Do we have the people and capabilities to do this — what is missing?" },
        { id: "bo_d8", text: "Who are the key stakeholders — name the supporters and the skeptics?" },
        { id: "bo_d9", text: "What has killed similar initiatives in this organization before?" },
      ]},
      { section: "Decision Criteria", questions: [
        { id: "bo_d10", text: "What does a green light decision require from you specifically?" },
        { id: "bo_d11", text: "What is the single biggest red flag that would make you say no?" },
        { id: "bo_d12", text: "What question must the business case answer for you to act on it?" },
      ]},
    ]
  },
  partner: {
    label: "Partner / Vendor",
    icon: "🤝",
    color: "#9b8fc8",
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
      { section: "Capability & Maturity", questions: [
        { id: "pa_d1", text: "Walk me through exactly how your solution works end-to-end." },
        { id: "pa_d2", text: "What is the maturity level — prototype, pilot, production, or at scale?" },
        { id: "pa_d3", text: "What are the technical integration requirements on our side?" },
        { id: "pa_d4", text: "What are the known limitations, edge cases, or failure modes?" },
      ]},
      { section: "Commercial Terms", questions: [
        { id: "pa_d5", text: "What is your pricing structure — license, usage, revenue share, or other?" },
        { id: "pa_d6", text: "What are the minimum commitment requirements and exit terms?" },
        { id: "pa_d7", text: "Are you working with any of our direct competitors — or can you offer exclusivity?" },
      ]},
      { section: "Risk & Dependency", questions: [
        { id: "pa_d8", text: "What happens to our integration if your company is acquired or changes direction?" },
        { id: "pa_d9", text: "What data do you need access to, and how is it protected and governed?" },
        { id: "pa_d10", text: "What are your SLA and uptime commitments in a production environment?" },
        { id: "pa_d11", text: "What are the top 3 reasons partnerships like this fail — and how do we avoid them?" },
      ]},
    ]
  }
};

// ─── API HELPER ──────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const callClaude = (body) =>
  fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────
const BUSINESS_CASE_PROMPT = `You are an expert business case writer bridging innovation thinking with corporate decision-making. Transform raw inputs into a structured, professional business case for CEO-level decisions.

RULES:
- Label every key claim and figure as (FACTUAL), (ASSUMED), or (UNKNOWN)
- Never fabricate data — write [NEEDS INPUT: description] for genuine gaps
- Write in corporate language: precise, confident, direct
- Executive summary must be readable in under 2 minutes
- Follow the EXACT structure below, every time

---

# BUSINESS CASE: [Title]
*[One-line description]*
**Version:** v[N] | **Confidence:** [Low/Medium/High] | **Date:** [today's date]

---

## EXECUTIVE SUMMARY

### Why We Do This
[2–3 sentences. Strategic imperative. Why now, why us.]

### Value Proposition
[Specific value created. For whom. Quantified where possible.]

### Recommendation
**[PROCEED / PROCEED WITH CONDITIONS / DO NOT PROCEED YET]**
[2–3 sentences of rationale. What must happen next.]

---

## 1. SCOPE & BOUNDARIES

### In Scope
[What this business case covers]

### Out of Scope
[What this does NOT cover — implementation plan, roles, governance are explicitly out]

### Key Assumptions This Case Rests On
1. [Assumption]
2. [Assumption]
3. [Assumption]

---

## 2. RISK ASSESSMENT

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | [Risk] | High/Med/Low | High/Med/Low | [Action] |
| 2 | [Risk] | High/Med/Low | High/Med/Low | [Action] |
| 3 | [Risk] | High/Med/Low | High/Med/Low | [Action] |
| 4 | [Risk] | High/Med/Low | High/Med/Low | [Action] |
| 5 | [Risk] | High/Med/Low | High/Med/Low | [Action] |

**Critical Risk:** [The one risk that most threatens the case — one sentence why.]

---

## 3. FINANCIAL IMPACT

### Cost Structure
[Key cost drivers — label each FACTUAL/ASSUMED/UNKNOWN]

### Revenue Potential
[Revenue streams, pricing logic, volumes — label each FACTUAL/ASSUMED/UNKNOWN]

### Investment Required
[Upfront and phased investment — label each FACTUAL/ASSUMED/UNKNOWN]

### Return on Investment
[ROI, payback period, break-even — label each FACTUAL/ASSUMED/UNKNOWN]

> **Financial Confidence: [LOW / MEDIUM / HIGH]** — [One sentence why, and what would improve it]

---

## 4. HIGH-LEVEL IMPLEMENTATION PLAN

| Phase | Focus | Key Activities | Timeline | Gate |
|-------|-------|---------------|----------|------|
| 1 — Validate | De-risk | [Activities] | [Duration] | [Go/no-go] |
| 2 — Build | Develop | [Activities] | [Duration] | [Milestone] |
| 3 — Launch | Scale | [Activities] | [Duration] | [Success KPI] |

**Next 30 days:**
1. [Action]
2. [Action]
3. [Action]

---
---

# SUPPORTING ANALYSIS

---

## A. BUSINESS MODEL

### 🟢 Desirability — Do customers want this?
[Evidence and reasoning]
**Confidence:** [FACTUAL ✓ / ASSUMED ⚠ / UNKNOWN ✗] | **Evidence:** [Strong/Moderate/Weak]

### 🔵 Feasibility — Can we build and deliver this?
[Capability assessment]
**Confidence:** [FACTUAL ✓ / ASSUMED ⚠ / UNKNOWN ✗] | **Evidence:** [Strong/Moderate/Weak]

### 🟡 Viability — Can we make money from this?
[Business economics]
**Confidence:** [FACTUAL ✓ / ASSUMED ⚠ / UNKNOWN ✗] | **Evidence:** [Strong/Moderate/Weak]

### 🟣 Adaptability — Does this fit our strategy?
[Strategic alignment and long-term fit]
**Confidence:** [FACTUAL ✓ / ASSUMED ⚠ / UNKNOWN ✗] | **Evidence:** [Strong/Moderate/Weak]

---

## B. ASSUMPTION MAP

| Area | Key Question | Our Answer | Rating | Priority |
|------|-------------|------------|--------|----------|
| Desirability | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |
| Desirability | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |
| Desirability | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |
| Feasibility | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |
| Feasibility | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |
| Viability | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |
| Viability | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |
| Adaptability | [Q] | [A] | FACTUAL/ASSUMED/UNKNOWN | High/Med/Low |

**🔴 Critical Unknowns — resolve before proceeding:**
1. [Unknown + why it matters]
2. [Unknown + why it matters]
3. [Unknown + why it matters]

---

## C. SWOT & TOWS

### SWOT
| | Helpful | Harmful |
|--|---------|---------|
| **Internal** | **Strengths:** [3–5 items] | **Weaknesses:** [3–5 items] |
| **External** | **Opportunities:** [3–5 items] | **Threats:** [3–5 items] |

### TOWS — Strategic Options
**SO:** [Use strengths to capture opportunities]
**ST:** [Use strengths to counter threats]
**WO:** [Overcome weaknesses via opportunities]
**WT:** [Minimize weaknesses, avoid threats]

---

## D. PESTLE

| Factor | Observations | Impact | Rating |
|--------|-------------|--------|--------|
| Political | [obs] | [impact] | Positive/Neutral/Risk |
| Economic | [obs] | [impact] | Positive/Neutral/Risk |
| Social | [obs] | [impact] | Positive/Neutral/Risk |
| Technological | [obs] | [impact] | Positive/Neutral/Risk |
| Legal | [obs] | [impact] | Positive/Neutral/Risk |
| Environmental | [obs] | [impact] | Positive/Neutral/Risk |

**Verdict:** [1–2 sentences on overall external environment — tailwind or headwind?]

---
*Sources used: [list input sources]. For questions contact the innovation lead.*`;

const COVERAGE_PROMPT = (allInputText) => `You are analysing innovation inputs to determine which interview questions have already been answered.

Given the inputs below, evaluate each question ID and return a JSON object with this exact shape:
{
  "coverage": {
    "[question_id]": "covered" | "partial" | "missing"
  }
}

Rules:
- "covered" = the inputs contain a clear, substantive answer to this question
- "partial" = the inputs touch on the topic but the answer is incomplete or vague
- "missing" = the inputs contain no useful answer to this question

Return ONLY the JSON object. No preamble, no explanation, no markdown fences.

Question IDs to evaluate:
${Object.values(TRACKS).flatMap(t => [
  ...t.quick.map(q => `${q.id}: ${q.text}`),
  ...t.deep.flatMap(s => s.questions.map(q => `${q.id}: ${q.text}`))
]).join('\n')}

INPUT CONTENT:
${allInputText}`;

// ─── MARKDOWN RENDERER ───────────────────────────────────────────────────────
function renderMarkdown(text) {
  let html = text
    .replace(/^---$/gm, '<hr class="divider" />')
    .replace(/^# (.+)$/gm, '<h1 class="h1">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="h2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="h3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[NEEDS INPUT:([^\]]+)\]/g, '<span class="tag-needs">📋 NEEDS INPUT:$1</span>')
    .replace(/\b(FACTUAL)\b/g, '<span class="tag-f">FACTUAL ✓</span>')
    .replace(/\b(ASSUMED)\b/g, '<span class="tag-a">ASSUMED ⚠</span>')
    .replace(/\b(UNKNOWN)\b/g, '<span class="tag-u">UNKNOWN ✗</span>');

  html = html.replace(/(\|.+\|\n)+/g, (t) => {
    const rows = t.trim().split('\n');
    let out = '<div class="tw"><table>';
    rows.forEach((row, i) => {
      if (/^\|[-| :]+\|$/.test(row)) return;
      const cells = row.split('|').slice(1, -1);
      const tag = i === 0 ? 'th' : 'td';
      out += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
    });
    return out + '</table></div>';
  });

  html = html.split('\n\n').map(block => {
    if (/^<(h[1-3]|hr|blockquote|div)/.test(block)) return block;
    if (!block.trim()) return '';
    return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');

  return html;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [inputs, setInputs] = useState([{ id: 1, label: 'Input 1', content: '', type: 'text', file: null }]);
  const [title, setTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [coverage, setCoverage] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [activeTab, setActiveTab] = useState('input');
  const [activeTrack, setActiveTrack] = useState('ideaOwner');
  const [qMode, setQMode] = useState('quick');
  const [copied, setCopied] = useState(false);
  const fileRefs = useRef({});

  const addInput = () => setInputs(p => [...p, { id: Date.now(), label: `Input ${p.length + 1}`, content: '', type: 'text', file: null }]);
  const removeInput = (id) => setInputs(p => p.filter(i => i.id !== id));
  const updateInput = (id, k, v) => setInputs(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));

  const handleFile = useCallback(async (id, file) => {
    if (!file) return;
    updateInput(id, 'file', file);
    updateInput(id, 'label', file.name);
    if (file.type === 'text/plain') {
      const text = await file.text();
      updateInput(id, 'content', text);
      updateInput(id, 'type', 'text');
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        updateInput(id, 'base64', e.target.result.split(',')[1]);
        updateInput(id, 'mimeType', file.type);
        updateInput(id, 'type', 'file');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const buildUserContent = () => {
    const textParts = [];
    if (title) textParts.push(`INITIATIVE TITLE: ${title}`);
    inputs.forEach(inp => {
      if (inp.type === 'text' && inp.content.trim())
        textParts.push(`--- ${inp.label.toUpperCase()} ---\n${inp.content.trim()}`);
    });
    const content = [];
    if (textParts.length) content.push({ type: 'text', text: textParts.join('\n\n') });
    inputs.forEach(inp => {
      if (inp.base64 && inp.mimeType === 'application/pdf')
        content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: inp.base64 } });
      else if (inp.base64 && inp.mimeType?.startsWith('image/'))
        content.push({ type: 'image', source: { type: 'base64', media_type: inp.mimeType, data: inp.base64 } });
    });
    return content;
  };

  const getAllInputText = () => {
    const parts = [];
    if (title) parts.push(`Title: ${title}`);
    inputs.forEach(inp => { if (inp.content.trim()) parts.push(inp.content.trim()); });
    return parts.join('\n\n');
  };

  const generate = async () => {
    if (!API_KEY) {
      setError('API key not found. Make sure VITE_ANTHROPIC_API_KEY is set in your .env file and restart the dev server.');
      return;
    }
    const hasContent = inputs.some(i => i.content.trim() || i.base64);
    if (!hasContent) { setError('Add at least one input.'); return; }
    setError(''); setGenerating(true); setResult(''); setCoverage(null);

    try {
      setProgress('Generating business case & analysing question coverage...');

      const userContent = buildUserContent();
      const allText = getAllInputText();

      const [bcRes, covRes] = await Promise.all([
        callClaude({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: BUSINESS_CASE_PROMPT,
          messages: [{ role: "user", content: [...userContent, { type: 'text', text: 'Generate the complete business case. Label everything FACTUAL, ASSUMED, or UNKNOWN. Write for a CEO audience.' }] }]
        }),
        callClaude({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: COVERAGE_PROMPT(allText) }]
        })
      ]);

      if (!bcRes.ok) {
        const errData = await bcRes.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error: ${bcRes.status}`);
      }
      if (!covRes.ok) {
        const errData = await covRes.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Coverage API error: ${covRes.status}`);
      }

      const [bcData, covData] = await Promise.all([bcRes.json(), covRes.json()]);

      const bcText = bcData.content.map(b => b.text || '').join('\n');
      setResult(bcText);

      try {
        const covText = covData.content.map(b => b.text || '').join('\n').replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(covText);
        setCoverage(parsed.coverage || {});
      } catch {
        setCoverage({});
      }

      setActiveTab('result');
      setProgress('');
    } catch (err) {
      setError('Error: ' + err.message);
      setProgress('');
    } finally {
      setGenerating(false);
    }
  };

  const coverageIcon = (id) => {
    if (!coverage) return null;
    const s = coverage[id];
    if (s === 'covered') return <span className="cov-covered">✓</span>;
    if (s === 'partial') return <span className="cov-partial">◐</span>;
    return <span className="cov-missing">✗</span>;
  };

  const coverageSummary = (track) => {
    if (!coverage) return null;
    const mode = qMode === 'quick' ? track.quick : track.deep.flatMap(s => s.questions);
    const ids = mode.map(q => q.id);
    const covered = ids.filter(id => coverage[id] === 'covered').length;
    const partial = ids.filter(id => coverage[id] === 'partial').length;
    const missing = ids.filter(id => !coverage[id] || coverage[id] === 'missing').length;
    return { covered, partial, missing, total: ids.length };
  };

  const track = TRACKS[activeTrack];
  const summary = coverageSummary(track);
  const inputCount = inputs.filter(i => i.content.trim() || i.base64).length;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0e', color: '#d8d3c8', fontFamily: 'Georgia, serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}

        .shell{max-width:960px;margin:0 auto;padding:56px 28px}

        .hdr{margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid #1c1c20}
        .eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#c8a96e;margin-bottom:12px}
        .title{font-family:'Spectral',serif;font-size:clamp(30px,4.5vw,50px);font-weight:300;color:#ece8e0;line-height:1.12;margin-bottom:8px}
        .subtitle{font-family:'DM Mono',monospace;font-size:11px;color:#3a3a3a;letter-spacing:.06em}

        .tabs{display:flex;border-bottom:1px solid #1a1a1e;margin-bottom:40px}
        .tab{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;padding:13px 22px;background:none;border:none;color:#2e2e2e;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s,border-color .2s;white-space:nowrap}
        .tab.on{color:#c8a96e;border-bottom-color:#c8a96e}
        .tab:hover:not(.on):not(:disabled){color:#666}
        .tab:disabled{opacity:.25;cursor:not-allowed}
        .tab-badge{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;font-size:9px;margin-left:6px;background:#1a1a1e;color:#555}
        .tab-badge.ready{background:#1a2a0a;color:#4caf50}

        .lbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#444;margin-bottom:8px;display:block}

        .idea-field{width:100%;background:#111113;border:1px solid #1e1e24;color:#ece8e0;padding:14px 18px;font-family:'Spectral',serif;font-size:20px;font-weight:300;outline:none;margin-bottom:32px;transition:border-color .2s}
        .idea-field:focus{border-color:#c8a96e}
        .idea-field::placeholder{color:#222}

        .input-card{background:#0f0f11;border:1px solid #181820;padding:18px;margin-bottom:12px;transition:border-color .2s}
        .input-card:focus-within{border-color:#242430}
        .card-hdr{display:flex;gap:10px;align-items:center;margin-bottom:12px}
        .card-label{font-family:'DM Mono',monospace;font-size:11px;background:#161618;border:1px solid #222228;color:#c8a96e;padding:6px 10px;letter-spacing:.06em;outline:none;flex:1;min-width:0}
        .type-btns{display:flex;gap:0;flex-shrink:0}
        .type-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;padding:6px 12px;background:none;border:1px solid #1e1e24;color:#333;cursor:pointer;transition:all .2s;margin-left:-1px}
        .type-btn.on{background:#1a1508;border-color:#c8a96e;color:#c8a96e;z-index:1}
        .rm{background:none;border:1px solid #1e1e24;color:#2a2a2a;width:28px;height:28px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
        .rm:hover{border-color:#c44;color:#c44}

        .ta{width:100%;min-height:120px;background:transparent;border:none;color:#8a8680;font-family:'DM Mono',monospace;font-size:12px;line-height:1.75;resize:vertical;outline:none}
        .ta::placeholder{color:#1e1e22}

        .drop{border:1px dashed #1e1e24;padding:24px;text-align:center;cursor:pointer;transition:border-color .2s}
        .drop:hover{border-color:#c8a96e}
        .drop-txt{font-family:'DM Mono',monospace;font-size:11px;color:#333;letter-spacing:.06em}
        .drop-ok{font-family:'DM Mono',monospace;font-size:11px;color:#c8a96e}

        .add-btn{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;background:none;border:1px dashed #1e1e24;color:#2e2e2e;padding:14px;width:100%;cursor:pointer;transition:all .2s;margin-bottom:28px}
        .add-btn:hover{border-color:#3a3a3a;color:#666}

        .gen-btn{font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase;background:#c8a96e;border:none;color:#0d0d0e;padding:18px;width:100%;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:12px;font-weight:400}
        .gen-btn:hover:not(:disabled){background:#d4b87a}
        .gen-btn:disabled{opacity:.45;cursor:not-allowed}

        .prog{font-family:'DM Mono',monospace;font-size:11px;color:#c8a96e;letter-spacing:.1em;text-align:center;margin-top:14px;animation:pulse 1.5s ease infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .err{font-family:'DM Mono',monospace;font-size:11px;color:#d44;background:#160808;border:1px solid #2a1010;padding:12px 16px;margin-top:14px}

        .track-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
        .track-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:10px 16px;background:none;border:1px solid #1e1e24;color:#3a3a3a;cursor:pointer;transition:all .2s}
        .track-btn.on{border-color:var(--c);color:var(--c);background:rgba(255,255,255,.02)}

        .mode-row{display:flex;align-items:center;gap:16px;margin-bottom:28px}
        .mode-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:8px 18px;background:none;border:1px solid #1e1e24;color:#333;cursor:pointer;transition:all .2s}
        .mode-btn.on{background:#1a1508;border-color:#c8a96e;color:#c8a96e}

        .cov-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#0f0f11;border:1px solid #181820;margin-bottom:24px}
        .cov-stat{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;display:flex;align-items:center;gap:5px}
        .dot-cov{width:7px;height:7px;border-radius:50%;background:#4caf50}
        .dot-par{width:7px;height:7px;border-radius:50%;background:#ff9800}
        .dot-mis{width:7px;height:7px;border-radius:50%;background:#555}

        .q-section{margin-bottom:4px}
        .q-sec-hdr{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#333;padding:18px 0 8px;border-top:1px solid #141418;margin-top:8px}
        .q-item{display:flex;gap:14px;align-items:flex-start;padding:13px 16px;background:#0f0f11;border:1px solid #141418;margin-bottom:6px}
        .q-item.cov-covered{border-left:3px solid #4caf50}
        .q-item.cov-partial{border-left:3px solid #ff9800}
        .q-item.cov-missing{border-left:3px solid #1e1e24}
        .q-num{font-family:'DM Mono',monospace;font-size:11px;color:#444;flex-shrink:0;margin-top:2px;min-width:24px}
        .q-text{font-family:'Spectral',serif;font-size:14px;color:#9a9490;line-height:1.65;flex:1}
        .cov-covered{color:#4caf50;font-size:14px;flex-shrink:0;margin-top:2px}
        .cov-partial{color:#ff9800;font-size:14px;flex-shrink:0;margin-top:2px}
        .cov-missing{color:#333;font-size:14px;flex-shrink:0;margin-top:2px}

        .legend{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px}
        .leg-item{display:flex;align-items:center;gap:6px;font-family:'DM Mono',monospace;font-size:10px;color:#444;letter-spacing:.06em}
        .leg-line{width:16px;height:3px;border-radius:2px}

        .res-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
        .res-lbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#c8a96e}
        .copy-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;background:none;border:1px solid #1e1e24;color:#444;padding:8px 16px;cursor:pointer;transition:all .2s}
        .copy-btn:hover{border-color:#c8a96e;color:#c8a96e}

        .doc{background:#080809;border:1px solid #161618;padding:52px;line-height:1.8}
        .doc .h1{font-family:'Spectral',serif;font-size:34px;font-weight:300;color:#ece8e0;margin-bottom:4px;line-height:1.15}
        .doc .h2{font-family:'Spectral',serif;font-size:20px;font-weight:400;color:#c8a96e;margin:44px 0 16px;padding-bottom:10px;border-bottom:1px solid #161618}
        .doc .h3{font-family:'DM Mono',monospace;font-size:11px;color:#666;letter-spacing:.18em;text-transform:uppercase;margin:24px 0 10px}
        .doc p{font-family:'Spectral',serif;font-size:15px;color:#8a8680;margin-bottom:14px;line-height:1.9}
        .doc strong{color:#c0bcb2}
        .doc em{color:#555;font-style:italic}
        .doc .divider{border:none;border-top:1px solid #161618;margin:40px 0}
        .doc blockquote{border-left:3px solid #c8a96e;padding:12px 20px;margin:20px 0;background:#0f0f11;font-family:'DM Mono',monospace;font-size:12px;color:#777}
        .doc code{font-family:'DM Mono',monospace;font-size:12px;background:#161618;padding:2px 6px;color:#c8a96e}
        .tw{overflow-x:auto;margin:18px 0}
        .doc table{width:100%;border-collapse:collapse;font-family:'DM Mono',monospace;font-size:12px}
        .doc th{background:#101012;color:#555;padding:10px 14px;text-align:left;font-weight:400;letter-spacing:.1em;font-size:10px;text-transform:uppercase;border-bottom:1px solid #1e1e24}
        .doc td{padding:10px 14px;border-bottom:1px solid #111113;color:#777;line-height:1.5}
        .doc tr:hover td{background:#0f0f11}
        .tag-f{font-family:'DM Mono',monospace;font-size:11px;background:#061406;color:#4caf50;padding:2px 7px;border:1px solid #0f2a0f}
        .tag-a{font-family:'DM Mono',monospace;font-size:11px;background:#160e00;color:#ff9800;padding:2px 7px;border:1px solid #2e1e00}
        .tag-u{font-family:'DM Mono',monospace;font-size:11px;background:#120606;color:#d44;padding:2px 7px;border:1px solid #261010}
        .tag-needs{font-family:'DM Mono',monospace;font-size:11px;background:#060e18;color:#5b9bd5;padding:3px 9px;border:1px solid #0c1e30;display:inline-block;margin:3px 0}

        .empty-state{text-align:center;padding:60px 20px;font-family:'DM Mono',monospace;font-size:11px;color:#2a2a2a;letter-spacing:.1em}
        .api-warn{font-family:'DM Mono',monospace;font-size:11px;color:#ff9800;background:#161000;border:1px solid #2e2000;padding:12px 16px;margin-bottom:24px;letter-spacing:.04em}

        @media(max-width:600px){.doc{padding:24px 16px}.shell{padding:28px 14px}.tabs{overflow-x:auto}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>

      <div className="shell">
        <div className="hdr">
          <div className="eyebrow">Innovation → Corporate Language</div>
          <h1 className="title">Business Case<br/>Generator</h1>
          <div className="subtitle">Transcripts · Documents · Notes → Decision-ready business case</div>
        </div>

        {!API_KEY && (
          <div className="api-warn">
            ⚠ No API key detected. Create a <strong>.env</strong> file in your project root with:<br/>
            <code>VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here</code><br/>
            Then restart the dev server with <code>npm run dev</code>.
          </div>
        )}

        <div className="tabs">
          <button className={`tab ${activeTab === 'input' ? 'on' : ''}`} onClick={() => setActiveTab('input')}>
            ◈ Input
            {inputCount > 0 && <span className="tab-badge ready">{inputCount}</span>}
          </button>
          <button className={`tab ${activeTab === 'questions' ? 'on' : ''}`} onClick={() => setActiveTab('questions')}>
            ? Interview Guide
          </button>
          <button className={`tab ${activeTab === 'result' ? 'on' : ''}`} onClick={() => setActiveTab('result')} disabled={!result}>
            ⊕ Business Case
            {result && <span className="tab-badge ready">✓</span>}
          </button>
        </div>

        {activeTab === 'input' && (
          <div>
            <label className="lbl">Initiative / Idea Title</label>
            <input className="idea-field" placeholder="e.g. AI-powered customer onboarding platform"
              value={title} onChange={e => setTitle(e.target.value)} />

            <label className="lbl" style={{ marginBottom: 14 }}>Your Inputs</label>

            {inputs.map((inp, idx) => (
              <div key={inp.id} className="input-card">
                <div className="card-hdr">
                  <input className="card-label" value={inp.label}
                    onChange={e => updateInput(inp.id, 'label', e.target.value)}
                    placeholder="Label this input (e.g. Idea Owner Interview)" />
                  <div className="type-btns">
                    <button className={`type-btn ${inp.type === 'text' ? 'on' : ''}`} onClick={() => updateInput(inp.id, 'type', 'text')}>Text</button>
                    <button className={`type-btn ${inp.type === 'file' ? 'on' : ''}`} onClick={() => updateInput(inp.id, 'type', 'file')}>File</button>
                  </div>
                  {inputs.length > 1 && <button className="rm" onClick={() => removeInput(inp.id)}>×</button>}
                </div>
                {inp.type === 'text' ? (
                  <textarea className="ta" value={inp.content}
                    onChange={e => updateInput(inp.id, 'content', e.target.value)}
                    placeholder={idx === 0 ? "Paste anything — transcript, interview notes, idea card, workshop output, brain dump...\nNo need to clean it up." : "Paste input..."} />
                ) : (
                  <div className="drop" onClick={() => fileRefs.current[inp.id]?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(inp.id, f); }}>
                    <input type="file" style={{ display: 'none' }} ref={el => fileRefs.current[inp.id] = el}
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={e => e.target.files[0] && handleFile(inp.id, e.target.files[0])} />
                    {inp.file ? <div className="drop-ok">✓ {inp.file.name}</div>
                      : <div className="drop-txt">Drop PDF or text file here, or click to browse</div>}
                  </div>
                )}
              </div>
            ))}

            <button className="add-btn" onClick={addInput}>+ Add another input</button>

            <button className="gen-btn" onClick={generate} disabled={generating || !API_KEY}>
              {generating
                ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>◎</span>Generating...</>
                : '◈ Generate Business Case + Analyse Coverage'}
            </button>
            {progress && <div className="prog">{progress}</div>}
            {error && <div className="err">{error}</div>}
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            <div className="track-tabs">
              {Object.entries(TRACKS).map(([key, t]) => {
                const sum = coverageSummary(t);
                return (
                  <button key={key} className={`track-btn ${activeTrack === key ? 'on' : ''}`}
                    style={{ '--c': t.color }} onClick={() => setActiveTrack(key)}>
                    {t.icon} {t.label}
                    {sum && <span style={{ marginLeft: 8, fontFamily: 'DM Mono,monospace', fontSize: 9, opacity: .7 }}>{sum.covered}/{sum.total}</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ padding: '10px 14px', background: '#0f0f11', border: '1px solid #161618', marginBottom: 20 }}>
              <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, color: '#444', letterSpacing: '.04em' }}>{track.role}</span>
            </div>

            <div className="mode-row">
              <button className={`mode-btn ${qMode === 'quick' ? 'on' : ''}`} onClick={() => setQMode('quick')}>⚡ Quick — 8 questions</button>
              <button className={`mode-btn ${qMode === 'deep' ? 'on' : ''}`} onClick={() => setQMode('deep')}>◎ Deep — ~25 min</button>
            </div>

            {coverage && summary && (
              <div className="cov-bar">
                <div className="cov-stat"><div className="dot-cov" />{summary.covered} covered</div>
                <div className="cov-stat"><div className="dot-par" />{summary.partial} partial</div>
                <div className="cov-stat"><div className="dot-mis" />{summary.missing} missing</div>
                <div style={{ flex: 1, marginLeft: 12, height: 4, background: '#161618', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(summary.covered / summary.total) * 100}%`, background: '#4caf50', borderRadius: 2, transition: 'width .4s' }} />
                </div>
              </div>
            )}

            {coverage && (
              <div className="legend">
                <div className="leg-item"><div className="leg-line" style={{ background: '#4caf50' }} />Covered</div>
                <div className="leg-item"><div className="leg-line" style={{ background: '#ff9800' }} />Partial</div>
                <div className="leg-item"><div className="leg-line" style={{ background: '#2a2a2a' }} />Missing</div>
              </div>
            )}

            {qMode === 'quick' ? (
              <div>
                {track.quick.map((q, i) => {
                  const status = coverage ? (coverage[q.id] || 'missing') : null;
                  return (
                    <div key={q.id} className={`q-item ${status ? 'cov-' + status : ''}`}>
                      <div className="q-num">Q{i + 1}</div>
                      <div className="q-text">{q.text}</div>
                      {coverageIcon(q.id)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                {track.deep.map((section, si) => (
                  <div key={si} className="q-section">
                    <div className="q-sec-hdr">{section.section}</div>
                    {section.questions.map((q, qi) => {
                      const status = coverage ? (coverage[q.id] || 'missing') : null;
                      return (
                        <div key={q.id} className={`q-item ${status ? 'cov-' + status : ''}`}>
                          <div className="q-num">Q{qi + 1}</div>
                          <div className="q-text">{q.text}</div>
                          {coverageIcon(q.id)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {!coverage && (
              <div style={{ marginTop: 24, padding: '12px 16px', background: '#0f0f11', border: '1px solid #161618' }}>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, color: '#333', letterSpacing: '.06em' }}>
                  Generate a business case first to see which questions are covered by your inputs.
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'result' && (
          <div>
            {result ? (
              <>
                <div className="res-bar">
                  <div className="res-lbl">◈ Business Case</div>
                  <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                    {copied ? '✓ Copied' : 'Copy Markdown'}
                  </button>
                </div>
                <div className="doc" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
              </>
            ) : (
              <div className="empty-state">No business case generated yet.<br />Add inputs and generate.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}