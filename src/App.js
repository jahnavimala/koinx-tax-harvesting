import React, { useState } from "react";
import { HarvestingProvider, useHarvesting } from "./context/HarvestingContext";
import { fmt, fmtNum } from "./utils/format";
import "./App.css";

/* ─────────────────────────────────────────
   HEADER  (logo only, no nav links)
───────────────────────────────────────── */
function Header() {
  return (
    <header className="hdr">
      <div className="hdr-inner">
        <a href="/" className="brand">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="brand-name">KoinX</span>
        </a>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   HOW IT WORKS SECTION
───────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Review Your Portfolio",
      desc: "We analyse your crypto holdings and identify assets currently trading below your purchase price.",
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Select Loss-Making Assets",
      desc: "Choose which holdings to harvest. Selling them realises the loss, which offsets your capital gains.",
    },
    {
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Save on Taxes",
      desc: "Your taxable gains are reduced in real-time. See exactly how much you'll save before making any move.",
    },
  ];

  return (
    <div className="hiw-section">
      <div className="hiw-header">
        <div className="hiw-icon-wrap">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h2 className="hiw-title">How does Tax Loss Harvesting work?</h2>
          <p className="hiw-sub">
            Tax loss harvesting is a strategy to reduce your tax bill by selling assets at a loss
            to offset capital gains. KoinX uses the <strong>FIFO method</strong> to calculate your gains.
          </p>
        </div>
      </div>
      <div className="hiw-steps">
        {steps.map((s, i) => (
          <div className="hiw-step" key={i}>
            <div className="hiw-step-icon">{s.icon}</div>
            <div>
              <div className="hiw-step-num">Step {i + 1}</div>
              <div className="hiw-step-title">{s.title}</div>
              <div className="hiw-step-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   GAIN ROW (inside card)
───────────────────────────────────────── */
function GainSection({ label, profits, losses, net, dark }) {
  const pos = dark ? "vd-pos" : "vl-pos";
  const neg = dark ? "vd-neg" : "vl-neg";
  return (
    <div className="gs">
      <div className="gs-lbl">{label}</div>
      <div className="gs-grid">
        <div className="gs-cell">
          <span className="gs-key">Profits</span>
          <span className={`gs-val ${pos}`}>{fmt(profits)}</span>
        </div>
        <div className="gs-cell">
          <span className="gs-key">Losses</span>
          <span className={`gs-val ${neg}`}>{fmt(losses)}</span>
        </div>
        <div className="gs-cell">
          <span className="gs-key">Net Capital Gains</span>
          <span className={`gs-val ${net >= 0 ? pos : neg}`}>{fmt(net)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CARD SKELETON
───────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="cards-row">
      {[0,1].map(i => (
        <div key={i} className={`card ${i===0?"card-dark":"card-blue"}`}>
          <div className="sk sk-h"/><div className="sk sk-b"/>
          <div className="sk-div"/><div className="sk sk-b"/><div className="sk sk-f"/>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   CAPITAL GAINS CARDS
───────────────────────────────────────── */
function CapGainsCards() {
  const { cg,afterCg,loadingCg,errCg,
          preNetS,preNetL,preTotal,
          postNetS,postNetL,postTotal,
          savings,showSavings } = useHarvesting();

  if (loadingCg) return <CardSkeleton/>;
  if (errCg)     return <div className="err">{errCg}</div>;

  return (
    <div className="cards-row">
      {/* PRE HARVESTING */}
      <div className="card card-dark">
        <h2 className="card-title">Pre Harvesting</h2>
        <GainSection dark label="Short-Term" profits={cg.stcg.profits} losses={cg.stcg.losses} net={preNetS}/>
        <div className="card-sep"/>
        <GainSection dark label="Long-Term"  profits={cg.ltcg.profits} losses={cg.ltcg.losses} net={preNetL}/>
        <div className="card-foot dark-foot">
          <span className="foot-lbl">Realised Capital Gains</span>
          <span className={`foot-val ${preTotal>=0?"vd-pos":"vd-neg"}`}>{fmt(preTotal)}</span>
        </div>
      </div>

      {/* AFTER HARVESTING */}
      <div className="card card-blue">
        <h2 className="card-title">After Harvesting</h2>
        <GainSection
          label="Short-Term"
          profits={afterCg?.stcg.profits ?? cg.stcg.profits}
          losses={afterCg?.stcg.losses ?? cg.stcg.losses}
          net={postNetS}
        />
        <div className="card-sep card-sep-b"/>
        <GainSection
          label="Long-Term"
          profits={afterCg?.ltcg.profits ?? cg.ltcg.profits}
          losses={afterCg?.ltcg.losses ?? cg.ltcg.losses}
          net={postNetL}
        />
        <div className="card-foot blue-foot">
          <span className="foot-lbl">Realised Capital Gains</span>
          <span className={`foot-val ${postTotal>=0?"vl-pos":"vl-neg"}`}>{fmt(postTotal)}</span>
        </div>
        {showSavings && (
          <div className="savings-pill">
            <span className="savings-emoji">🎉</span>
            <span>You're going to save <strong>{fmt(savings)}</strong> in taxes!</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COIN LOGO with fallback
───────────────────────────────────────── */
function CoinLogo({ logo, coin }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="logo-fb">{(coin||"?")[0]}</div>;
  return <img src={logo} alt={coin} className="logo-img" onError={()=>setErr(true)}/>;
}

/* ─────────────────────────────────────────
   EXPANDED ROW DETAIL
───────────────────────────────────────── */
function ExpandedRow({ h, colSpan }) {
  return (
    <tr className="exp-row">
      <td colSpan={colSpan}>
        <div className="exp-body">
          <div className="exp-grid">
            <div className="exp-item">
              <span className="exp-lbl">Full Name</span>
              <span className="exp-val">{h.coinName}</span>
            </div>
            <div className="exp-item">
              <span className="exp-lbl">Current Price</span>
              <span className="exp-val">{fmt(h.currentPrice)}</span>
            </div>
            <div className="exp-item">
              <span className="exp-lbl">Total Holdings</span>
              <span className="exp-val">{fmtNum(h.totalHolding)} {h.coin}</span>
            </div>
            <div className="exp-item">
              <span className="exp-lbl">Avg Buy Price</span>
              <span className="exp-val">{fmt(h.averageBuyPrice)}</span>
            </div>
            <div className="exp-item">
              <span className="exp-lbl">ST Gain</span>
              <span className={`exp-val ${h.stcg.gain>=0?"t-pos":"t-neg"}`}>{fmt(h.stcg.gain)}</span>
            </div>
            <div className="exp-item">
              <span className="exp-lbl">ST Balance</span>
              <span className="exp-val">{fmtNum(h.stcg.balance)} {h.coin}</span>
            </div>
            <div className="exp-item">
              <span className="exp-lbl">LT Gain</span>
              <span className={`exp-val ${h.ltcg.gain>=0?"t-pos":"t-neg"}`}>{fmt(h.ltcg.gain)}</span>
            </div>
            <div className="exp-item">
              <span className="exp-lbl">LT Balance</span>
              <span className="exp-val">{fmtNum(h.ltcg.balance)} {h.coin}</span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────
   TABLE SKELETON
───────────────────────────────────────── */
function TableSkeleton() {
  return (
    <div className="tbl-card">
      <div className="tbl-top"><h2 className="tbl-title">Holdings</h2></div>
      <div className="sk-rows">
        {Array.from({length:5}).map((_,i)=>(
          <div key={i} className="sk sk-row" style={{animationDelay:`${i*0.07}s`}}/>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HOLDINGS TABLE
───────────────────────────────────────── */
const PAGE = 5;

function HoldingsTable() {
  const { holdings,selected,toggle,toggleAll,loadingH,errH,showAll,setShowAll } = useHarvesting();
  const [expanded, setExpanded] = useState(new Set());

  const allChecked = holdings.length>0 && selected.size===holdings.length;
  const partial    = selected.size>0 && selected.size<holdings.length;
  const visible    = showAll ? holdings : holdings.slice(0, PAGE);

  const toggleExp = (i, e) => {
    e.stopPropagation();
    setExpanded(p => { const n=new Set(p); n.has(i)?n.delete(i):n.add(i); return n; });
  };

  if (loadingH) return <TableSkeleton/>;
  if (errH)     return <div className="tbl-card err">{errH}</div>;

  return (
    <div className="tbl-card">
      <div className="tbl-top">
        <div className="tbl-top-l">
          <h2 className="tbl-title">Holdings</h2>
          {selected.size>0 && <span className="sel-chip">{selected.size} selected</span>}
        </div>
      </div>

      <div className="tbl-scroll">
        <table className="tbl">
          <thead>
            <tr className="tbl-hrow">
              <th className="th th-cb">
                <input type="checkbox" className="cb"
                  checked={allChecked}
                  ref={el=>{ if(el) el.indeterminate=partial; }}
                  onChange={toggleAll}/>
              </th>
              <th className="th th-l">Asset</th>
              <th className="th th-r">Holdings<br/><span className="th-sub">Avg Buy Price</span></th>
              <th className="th th-r">Current Price</th>
              <th className="th th-r">Short-Term Gain<br/><span className="th-sub">Balance</span></th>
              <th className="th th-r">Long-Term Gain<br/><span className="th-sub">Balance</span></th>
              <th className="th th-r">Amount to Sell</th>
              <th className="th th-c"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((h, i) => {
              const sel = selected.has(i);
              const exp = expanded.has(i);
              const sg  = h.stcg.gain, lg = h.ltcg.gain;
              return (
                <React.Fragment key={`${h.coin}-${i}`}>
                  <tr className={`trow ${sel?"trow-sel":""} ${exp?"trow-exp":""}`}
                      onClick={()=>toggle(i)}>
                    <td className="td td-cb">
                      <input type="checkbox" className="cb" checked={sel}
                        onChange={()=>toggle(i)} onClick={e=>e.stopPropagation()}/>
                    </td>
                    <td className="td td-asset">
                      <div className="asset-wrap">
                        <CoinLogo logo={h.logo} coin={h.coin}/>
                        <div className="asset-info">
                          <span className="asset-sym">{h.coin}</span>
                          <span className="asset-name">{h.coinName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="td td-r">
                      <div className="td2">
                        <span className="td-main">{fmtNum(h.totalHolding)}</span>
                        <span className="td-sub">{fmt(h.averageBuyPrice)}</span>
                      </div>
                    </td>
                    <td className="td td-r">
                      <span className="td-main">{fmt(h.currentPrice)}</span>
                    </td>
                    <td className="td td-r">
                      <div className="td2">
                        <span className={`td-main ${sg>=0?"t-pos":"t-neg"}`}>{fmt(sg)}</span>
                        <span className="td-sub">{fmtNum(h.stcg.balance)}</span>
                      </div>
                    </td>
                    <td className="td td-r">
                      <div className="td2">
                        <span className={`td-main ${lg>=0?"t-pos":"t-neg"}`}>{fmt(lg)}</span>
                        <span className="td-sub">{fmtNum(h.ltcg.balance)}</span>
                      </div>
                    </td>
                    <td className="td td-r">
                      {sel
                        ? <span className="sell-v">{fmtNum(h.totalHolding)}</span>
                        : <span className="sell-d">—</span>
                      }
                    </td>
                    <td className="td td-c">
                      <button
                        className={`exp-btn ${exp?"exp-btn-open":""}`}
                        onClick={e=>toggleExp(i,e)}
                        title={exp?"Collapse":"Expand"}
                        aria-label={exp?"collapse row":"expand row"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {exp && <ExpandedRow h={h} colSpan={8}/>}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > PAGE && (
        <button className="view-all-btn" onClick={()=>setShowAll(!showAll)}>
          {showAll
            ? "Show Less ▲"
            : `View All ${holdings.length} Holdings ▼`}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  return (
    <HarvestingProvider>
      <div className="app">
        <Header/>
        <main className="main">
          <div className="container">
            <div className="page-top">
              <h1 className="page-title">Tax Loss Harvesting</h1>
              <p className="page-sub">
                Optimise your tax liability by strategically harvesting losses from your crypto portfolio.
              </p>
            </div>
            <HowItWorks/>
            <CapGainsCards/>
            <HoldingsTable/>
          </div>
        </main>
      </div>
    </HarvestingProvider>
  );
}
