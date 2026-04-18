import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchCapitalGains } from "../api/capitalGains";
import { fetchHoldings } from "../api/holdings";

const Ctx = createContext(null);

export function HarvestingProvider({ children }) {
  const [cg, setCg]             = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loadingCg, setLCg]     = useState(true);
  const [loadingH,  setLH]      = useState(true);
  const [errCg, setErrCg]       = useState(null);
  const [errH,  setErrH]        = useState(null);
  const [showAll, setShowAll]   = useState(false);

  useEffect(() => {
    fetchCapitalGains()
      .then(d => { setCg(d.capitalGains); setLCg(false); })
      .catch(() => { setErrCg("Failed to load capital gains."); setLCg(false); });
    fetchHoldings()
      .then(d => { setHoldings(d); setLH(false); })
      .catch(() => { setErrH("Failed to load holdings."); setLH(false); });
  }, []);

  const afterCg = useMemo(() => {
    if (!cg) return null;
    let sp = cg.stcg.profits, sl = cg.stcg.losses;
    let lp = cg.ltcg.profits, ll = cg.ltcg.losses;
    selected.forEach(i => {
      const h = holdings[i]; if (!h) return;
      if (h.stcg.gain > 0) sp += h.stcg.gain; else sl += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) lp += h.ltcg.gain; else ll += Math.abs(h.ltcg.gain);
    });
    return { stcg:{profits:sp,losses:sl}, ltcg:{profits:lp,losses:ll} };
  }, [cg, selected, holdings]);

  const toggle    = i => setSelected(p => { const n=new Set(p); n.has(i)?n.delete(i):n.add(i); return n; });
  const toggleAll = ()  => setSelected(selected.size===holdings.length ? new Set() : new Set(holdings.map((_,i)=>i)));

  const preNetS  = cg ? cg.stcg.profits - cg.stcg.losses : 0;
  const preNetL  = cg ? cg.ltcg.profits - cg.ltcg.losses : 0;
  const preTotal = preNetS + preNetL;
  const postNetS = afterCg ? afterCg.stcg.profits - afterCg.stcg.losses : 0;
  const postNetL = afterCg ? afterCg.ltcg.profits - afterCg.ltcg.losses : 0;
  const postTotal= postNetS + postNetL;
  const savings  = preTotal - postTotal;
  const showSavings = savings > 0 && selected.size > 0;

  return (
    <Ctx.Provider value={{
      cg,afterCg,holdings,selected,toggle,toggleAll,
      loadingCg,loadingH,errCg,errH,
      preNetS,preNetL,preTotal,
      postNetS,postNetL,postTotal,
      savings,showSavings,showAll,setShowAll,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useHarvesting = () => useContext(Ctx);
