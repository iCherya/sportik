import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  bg:"#0D0D0F", surface:"#141416", card:"#1C1C1F", cardHi:"#222226",
  border:"#2A2A2E", borderSub:"#1E1E22",
  text:"#F0F0EE", textMid:"#9090A0", textDim:"#505060",
  swim:"#3B9EFF", swimBg:"#0F2540",
  bike:"#FF8B3B", bikeBg:"#2A1800",
  run:"#3BCC7A",  runBg:"#0A2018",
  tri:"#B57BFF",  triBg:"#1A0D2E",
  heart:"#FF4F6A", accent:"#E8FF47",
};
const SP = {
  all:  {color:T.accent, bg:"#1a1a0a", icon:"⚡", label:"All"},
  swim: {color:T.swim,   bg:T.swimBg,  icon:"🏊", label:"Swim"},
  bike: {color:T.bike,   bg:T.bikeBg,  icon:"🚴", label:"Bike"},
  run:  {color:T.run,    bg:T.runBg,   icon:"🏃", label:"Run"},
  tri:  {color:T.tri,    bg:T.triBg,   icon:"🔱", label:"Tri"},
};

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════ */
const QUOTES = [
  {text:"The body achieves what the mind believes.", author:"— Unknown"},
  {text:"Pain is temporary. Quitting lasts forever.", author:"— Lance Armstrong"},
  {text:"Swim. Bike. Run. Suffer. Repeat.", author:"— Every Triathlete"},
  {text:"Your only limit is you.", author:"— Unknown"},
  {text:"Champions aren't made in gyms.", author:"— Muhammad Ali"},
];

const PLAN_WEEKS = [
  {week:1, sessions:[
    {id:"s1",sport:"swim",title:"Endurance Swim",detail:"2,000m — Aerobic base sets",duration:"45 min",type:"Endurance",done:true},
    {id:"s2",sport:"bike",title:"Long Ride",detail:"80km — Zone 2 steady",duration:"2h 30m",type:"Endurance",done:true},
    {id:"s3",sport:"run", title:"Brick Run",detail:"5km off the bike — easy pace",duration:"28 min",type:"Brick",done:false},
    {id:"s4",sport:"swim",title:"Speed Work",detail:"1,500m — Intervals 4×200m",duration:"35 min",type:"Intervals",done:false},
    {id:"s5",sport:"run", title:"Tempo Run",detail:"8km at threshold pace",duration:"38 min",type:"Tempo",done:false},
    {id:"s6",sport:"bike",title:"Recovery Spin",detail:"40km — Easy Zone 1",duration:"1h 10m",type:"Recovery",done:false},
  ]},
];

const TODAY_SESSIONS = [
  {id:"s3",sport:"swim",title:"Morning Swim",detail:"2,000m — Endurance sets",duration:"45 min",type:"Endurance",done:false},
  {id:"s4",sport:"run", title:"Brick Run",detail:"5km off the bike — easy pace",duration:"28 min",type:"Brick",done:false},
];

const EVENTS_DATA = [
  {id:1,name:"Ironman 70.3 Kyiv",     sport:"tri", dist:"70.3 mi",location:"Kyiv",    date:"2025-06-15",days:80, fav:true, global:true},
  {id:2,name:"Kyiv Half Marathon",     sport:"run", dist:"21.1 km",location:"Kyiv",    date:"2025-04-13",days:17, fav:false,global:true},
  {id:3,name:"Lviv Gran Fondo",        sport:"bike",dist:"120 km", location:"Lviv",    date:"2025-05-04",days:38, fav:false,global:true},
  {id:4,name:"Open Water Swim Dnipro", sport:"swim",dist:"5 km",   location:"Dnipro",  date:"2025-07-19",days:114,fav:false,global:true},
  {id:5,name:"Odesa Sprint Tri",       sport:"tri", dist:"Sprint", location:"Odesa",   date:"2025-08-10",days:136,fav:false,global:true},
  {id:6,name:"Kharkiv Night Run 10K",  sport:"run", dist:"10 km",  location:"Kharkiv", date:"2025-05-24",days:58, fav:false,global:true},
  {id:7,name:"My Training Duathlon",   sport:"tri", dist:"Custom", location:"Kyiv",    date:"2025-04-20",days:24, fav:false,global:false},
];

const TOOLS = [
  {id:"pace",      name:"Pace Calculator",        desc:"Time · Distance · Pace",          sport:"run",  icon:"⏱", tag:"Run"},
  {id:"predict",   name:"Race Time Predictor",     desc:"Predict from shorter race",       sport:"run",  icon:"📈", tag:"Run"},
  {id:"cadence",   name:"Cadence Beeper",          desc:"Metronome for run & bike",        sport:"bike", icon:"🎵", tag:"Bike"},
  {id:"power",     name:"Power Zone Calculator",   desc:"FTP-based cycling zones",         sport:"bike", icon:"⚡", tag:"Bike"},
  {id:"speed",     name:"Speed ↔ Pace",           desc:"km/h ↔ min/km converter",         sport:"bike", icon:"🚴", tag:"Bike"},
  {id:"hr",        name:"HR Zone Calculator",      desc:"5 zones from max HR or HRR",     sport:"all",  icon:"❤️",tag:"All"},
  {id:"calorie",   name:"Calorie Burn Estimator",  desc:"Weight + duration → kcal",       sport:"all",  icon:"🔥", tag:"All"},
  {id:"swolf",     name:"SWOLF Calculator",        desc:"Swim efficiency score",           sport:"swim", icon:"🏊", tag:"Swim"},
  {id:"pool",      name:"Pool Lap Counter",        desc:"Multi-swimmer, lap timers",       sport:"swim", icon:"🏁", tag:"Swim"},
  {id:"wetsuit",   name:"Wetsuit Temp Guide",      desc:"Water temp → wetsuit rules",     sport:"swim", icon:"🌡️",tag:"Swim"},
  {id:"split",     name:"Race Split Planner",      desc:"Target time → leg splits",       sport:"tri",  icon:"🔱", tag:"Tri"},
  {id:"nutrition", name:"Nutrition Calculator",    desc:"Carbs & fluid by duration",      sport:"tri",  icon:"🍌", tag:"Tri"},
  {id:"transition",name:"Transition Estimator",    desc:"T1 + T2 race day planning",      sport:"tri",  icon:"🔄", tag:"Tri"},
  {id:"checklist", name:"Race Day Checklist",      desc:"Gear checklist by race type",    sport:"tri",  icon:"✅", tag:"Tri"},
  {id:"taper",     name:"Taper Calculator",        desc:"Volume reduction before race",   sport:"tri",  icon:"📉", tag:"Tri"},
];

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#060608;font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased}

.outer{min-height:100vh;display:flex;flex-direction:column;align-items:center;
  padding:28px 16px 48px;gap:20px;
  background:radial-gradient(ellipse at 30% 0%,#141428 0%,#060608 55%)}
.wm{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:30px;
  letter-spacing:5px;text-transform:uppercase;color:${T.text}}
.wm span{color:${T.accent}}
.wmsub{font-size:12px;color:#404050;margin-top:2px;text-align:center}

/* PHONE SHELL */
.phone{width:390px;height:844px;border-radius:50px;overflow:hidden;position:relative;
  background:${T.bg};display:flex;flex-direction:column;
  box-shadow:0 0 0 10px #1a1a1c,0 0 0 12px #252528,0 60px 100px rgba(0,0,0,.8)}
.notch{position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:120px;height:34px;background:#18181a;border-radius:0 0 22px 22px;z-index:100}
.sbar{flex-shrink:0;padding:14px 24px 0;display:flex;justify-content:space-between;
  align-items:center;z-index:10}
.st{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:16px;color:${T.text}}
.sdots{display:flex;gap:5px}
.sdot{width:6px;height:6px;border-radius:50%;background:${T.text}}

.scroll{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;padding-bottom:90px}
.scroll::-webkit-scrollbar{display:none}

/* BOTTOM NAV */
.bnav{position:absolute;bottom:0;left:0;right:0;height:84px;
  background:${T.surface};border-top:1px solid ${T.border};
  display:flex;align-items:center;justify-content:space-around;
  padding:0 4px 16px;z-index:50}
.bni{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;
  padding:8px 16px;border-radius:14px;position:relative;transition:all .15s}
.bni.on::before{content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);
  width:28px;height:2px;background:${T.accent};border-radius:2px}
.bni-ic{font-size:20px;line-height:1}
.bni-lb{font-size:10px;font-weight:600;color:${T.textDim};font-family:'Barlow',sans-serif;
  letter-spacing:.5px;text-transform:uppercase}
.bni.on .bni-lb{color:${T.accent}}

/* PAGE HEADER */
.phd{padding:20px 20px 0}
.ptitle{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:34px;
  letter-spacing:1px;text-transform:uppercase;color:${T.text};line-height:1}
.psub{font-size:13px;color:${T.textMid};margin-top:3px}
.seclbl{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;
  letter-spacing:2px;text-transform:uppercase;color:${T.textDim};margin:20px 20px 10px;display:block}

/* CARDS */
.card{background:${T.card};border:1px solid ${T.border};border-radius:20px;padding:18px}
.card-hi{background:${T.cardHi};border:1px solid ${T.border};border-radius:20px;padding:18px}

/* SPORT IDENTITY */
.sport-stripe{width:4px;border-radius:4px;align-self:stretch;flex-shrink:0}
.sport-chip{font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;
  letter-spacing:.5px;text-transform:uppercase}

/* BUTTONS */
.btn{width:100%;padding:16px;border-radius:16px;border:none;
  font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;
  letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .15s}
.btn-accent{background:${T.accent};color:#000}
.btn-danger{background:${T.heart};color:#fff}
.btn-ghost{background:transparent;border:1px dashed ${T.border};color:${T.textMid}}
.btn-surface{background:${T.card};border:1px solid ${T.border};color:${T.textMid}}

/* TOOL DETAIL OVERLAY */
.overlay{display:flex;flex-direction:column;height:100%;border-radius:50px;overflow:hidden;background:${T.bg}}
.ov-head{padding:52px 20px 18px;border-bottom:1px solid ${T.border};flex-shrink:0}
.ov-back{display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:14px}
.ov-back-arr{font-size:18px;color:${T.textMid}}
.ov-back-lbl{font-size:13px;color:${T.textMid};font-weight:500}
.ov-sport-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.ov-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:26px;
  color:${T.text};letter-spacing:.5px}
.ov-body{flex:1;overflow-y:auto;scrollbar-width:none;padding:20px}
.ov-body::-webkit-scrollbar{display:none}

/* SHARED CALC */
.cf{margin-bottom:16px}
.cl{display:block;font-size:11px;font-weight:700;color:${T.textDim};
  letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.ci-row{display:flex;gap:8px}
.ci{flex:1;background:${T.card};border:1px solid ${T.border};border-radius:12px;
  padding:12px 14px;font-family:'Barlow Condensed',sans-serif;font-weight:700;
  font-size:22px;color:${T.text};text-align:center;outline:none;width:100%;transition:border-color .15s}
.ci:focus{border-color:${T.accent}}
.cu{display:flex;align-items:center;justify-content:center;background:${T.surface};
  border:1px solid ${T.border};border-radius:12px;padding:0 12px;
  font-size:12px;font-weight:700;color:${T.textMid};min-width:52px;flex-shrink:0}
.rb{border-radius:16px;padding:20px;text-align:center;margin-top:4px}
.rb-lbl{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.rb-val{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:48px;line-height:1}
.rb-unit{font-size:14px;color:${T.textMid};margin-top:4px}
.ib{margin-top:12px;background:${T.surface};border:1px solid ${T.border};border-radius:12px;padding:14px}
.ir{display:flex;justify-content:space-between;align-items:center;padding:4px 0}
.il{font-size:12px;color:${T.textMid}}
.iv{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:14px;color:${T.text}}
.sg{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.sb{padding:8px 14px;border-radius:10px;border:1px solid ${T.border};
  background:${T.surface};color:${T.textMid};font-family:'Barlow',sans-serif;
  font-weight:600;font-size:12px;cursor:pointer;transition:all .15s}
.sb.on{border-color:${T.accent};background:${T.accent}22;color:${T.accent}}
.rc{background:${T.card};border:1px solid ${T.border};border-radius:16px;overflow:hidden}
.rr{display:flex;align-items:center;gap:12px;padding:13px 16px;
  border-bottom:1px solid ${T.borderSub}}
.rr:last-child{border-bottom:none}
.fn{font-size:11px;color:${T.textDim};margin-top:12px;line-height:1.5}
.big-val{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:76px;
  color:${T.text};line-height:1;text-align:center}
.big-sub{font-size:12px;color:${T.textMid};margin-top:4px;letter-spacing:2px;
  text-transform:uppercase;text-align:center}
.rng{width:100%;-webkit-appearance:none;height:6px;border-radius:3px;
  background:${T.border};outline:none;margin:16px 0}
.rng::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;
  border-radius:50%;background:${T.accent};cursor:pointer;box-shadow:0 0 12px ${T.accent}66}
.beat{width:14px;height:14px;border-radius:50%;background:${T.accent};
  margin:0 auto 16px;transition:transform .06s,box-shadow .06s}
.beat.p{transform:scale(1.8);box-shadow:0 0 16px ${T.accent}}
.beat.i{opacity:.2}
.prs{display:flex;gap:6px;margin-top:12px}
.prb{flex:1;padding:8px 4px;border-radius:10px;border:1px solid ${T.border};
  background:${T.surface};color:${T.textMid};font-family:'Barlow Condensed',sans-serif;
  font-weight:700;font-size:13px;cursor:pointer;transition:all .15s;text-align:center}
.prb.on{border-color:${T.accent};background:${T.accent}22;color:${T.accent}}
.ci-h{flex:1;background:${T.card};border:1px solid ${T.border};border-radius:12px;
  padding:10px 12px;font-family:'Barlow Condensed',sans-serif;font-weight:700;
  font-size:18px;color:${T.text};text-align:center;outline:none;transition:border-color .15s}
.ci-h:focus{border-color:${T.accent}}

/* TOGGLE */
.tog{width:44px;height:26px;border-radius:13px;position:relative;cursor:pointer;transition:background .2s}
.tog.on{background:${T.accent}}
.tog.off{background:${T.border}}
.togdot{position:absolute;top:3px;width:20px;height:20px;border-radius:50%;
  background:#fff;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.tog.on .togdot{left:21px}
.tog.off .togdot{left:3px}

/* SPORT TABS */
.stabs{display:flex;padding:16px 20px 0;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid ${T.border};touch-action:pan-x;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;flex-shrink:0}
.stabs::-webkit-scrollbar{display:none}
.stab{flex-shrink:0;display:flex;align-items:center;gap:6px;padding:9px 14px;
  border:none;background:transparent;cursor:pointer;transition:all .15s;
  border-bottom:2px solid transparent;margin-bottom:-1px;
  font-family:'Barlow',sans-serif;font-weight:600;font-size:13px;color:${T.textDim}}
.stab.on{border-bottom-color:var(--tc);color:var(--tc)}
.stab-cnt{font-size:10px;font-weight:800;padding:1px 6px;border-radius:6px}

/* EVENT TABS */
.etabs{display:flex;margin:16px 20px 0;background:${T.surface};
  border:1px solid ${T.border};border-radius:14px;padding:4px}
.etab{flex:1;padding:9px;border-radius:10px;border:none;background:transparent;
  font-family:'Barlow',sans-serif;font-weight:700;font-size:13px;
  color:${T.textMid};cursor:pointer;transition:all .15s}
.etab.on{background:${T.card};color:${T.text}}

/* FILTER CHIPS */
.fchips{display:flex;gap:8px;padding:14px 20px 0;overflow-x:auto;scrollbar-width:none}
.fchips::-webkit-scrollbar{display:none}
.fchip{flex-shrink:0;padding:7px 14px;border-radius:20px;border:1px solid ${T.border};
  background:transparent;font-size:12px;font-weight:600;color:${T.textMid};
  cursor:pointer;transition:all .15s;font-family:'Barlow',sans-serif}

/* CHECKLIST */
.chi{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;
  border-bottom:1px solid ${T.borderSub};cursor:pointer}
.chi:last-child{border-bottom:none}
.chb{width:22px;height:22px;border-radius:7px;border:2px solid ${T.border};
  display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:all .15s}
.chb.done{background:${T.accent};border-color:${T.accent}}
.cht{flex:1;font-size:14px;font-weight:500;line-height:1.4;transition:all .15s}
.cht.done{color:${T.textDim};text-decoration:line-through}

/* TAPER */
.tw{background:${T.card};border:1px solid ${T.border};border-radius:14px;padding:14px 16px;margin-bottom:8px}
.tw-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.tw-l{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;color:${T.text}}
.tw-v{font-size:13px;font-weight:600}
.tw-bars{display:flex;gap:6px}
.tw-bc{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.tw-bt{width:100%;height:48px;background:${T.surface};border-radius:6px;position:relative;overflow:hidden}
.tw-bf{position:absolute;bottom:0;left:0;right:0;border-radius:6px}
.tw-sl{font-size:9px;color:${T.textDim};text-transform:uppercase;letter-spacing:.5px}

/* POOL COUNTER */
.sw-tab-outer{display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
.sw-tab-outer::-webkit-scrollbar{display:none}
.swt{flex-shrink:0;display:flex;align-items:center;gap:6px;padding:8px 12px;
  border-radius:12px;border:1px solid ${T.border};background:${T.surface};
  cursor:pointer;transition:all .15s;position:relative}
.swt.on{border-color:${T.swim};background:${T.swimBg}}
.swt-rm{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;
  background:${T.heart};color:#fff;font-size:10px;font-weight:800;
  display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid ${T.bg}}
.pool-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:88px;
  color:${T.text};line-height:1;text-align:center}
.pool-dist{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:26px;
  color:${T.swim};text-align:center;margin-top:2px}
.pool-clock{font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:20px;
  color:${T.textMid};text-align:center;margin-top:4px;letter-spacing:2px}
.pool-hint{font-size:12px;color:${T.textDim};text-align:center;margin-top:4px}
.tap-btn{width:100%;height:88px;border-radius:20px;border:2px solid ${T.swim}44;
  background:${T.swimBg};font-family:'Barlow Condensed',sans-serif;font-weight:800;
  font-size:24px;letter-spacing:3px;color:${T.swim};cursor:pointer;transition:all .1s;user-select:none}
.tap-btn:active{background:${T.swim}33;transform:scale(.97)}
.lth{display:grid;grid-template-columns:40px 1fr 1fr 1fr;padding:8px 14px;
  border-bottom:1px solid ${T.borderSub}}
.lt{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${T.textDim}}
.lt:not(:first-child){text-align:right}
.lr{display:grid;grid-template-columns:40px 1fr 1fr 1fr;padding:10px 14px;
  border-bottom:1px solid ${T.borderSub};align-items:center}
.lr:last-child{border-bottom:none}
.lr.best-row{background:${T.swim}0f}
.ln{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;color:${T.textDim}}
.ltm{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;color:${T.text};text-align:right}
.ltm.bv{color:${T.accent}}
.lsp{font-size:12px;color:${T.textMid};text-align:right}
.ld{font-size:12px;text-align:right;font-weight:600}
.ld.f{color:${T.run}}.ld.s{color:${T.heart}}.ld.e{color:${T.textDim}}
.badge{display:inline-block;font-size:9px;font-weight:800;padding:2px 5px;
  border-radius:4px;letter-spacing:.5px;vertical-align:middle;margin-left:4px}
.modal-ov{position:absolute;inset:0;background:rgba(0,0,0,.7);z-index:90;
  display:flex;align-items:flex-end;border-radius:50px;overflow:hidden}
.modal-sh{background:${T.surface};border-radius:28px 28px 0 0;padding:24px 20px 32px;width:100%}
.modal-hnd{width:36px;height:4px;background:${T.border};border-radius:2px;margin:0 auto 20px}
.modal-t{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;
  color:${T.text};margin-bottom:16px}
.modal-in{width:100%;background:${T.card};border:1px solid ${T.border};border-radius:14px;
  padding:14px 16px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;
  color:${T.text};outline:none;margin-bottom:14px}
.modal-in:focus{border-color:${T.swim}}
.modal-btns{display:flex;gap:10px}
.modal-btn{flex:1;padding:14px;border-radius:14px;border:none;
  font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;letter-spacing:1px;cursor:pointer}
.modal-btn.c{background:${T.swim};color:#fff}
.modal-btn.x{background:${T.card};color:${T.textMid};border:1px solid ${T.border}}

/* ── HOME SPECIFIC ── */
.home-greeting{padding:20px 20px 0}
.hg-date{font-size:12px;color:${T.textMid};font-weight:500;letter-spacing:1px;text-transform:uppercase}
.hg-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:32px;
  color:${T.text};letter-spacing:.5px;line-height:1.1;margin-top:4px}
.hg-name span{color:${T.accent}}

.quote-card{margin:16px 20px 0;background:${T.card};border:1px solid ${T.border};
  border-radius:24px;padding:22px;position:relative;overflow:hidden}
.qc-blob{position:absolute;width:180px;height:180px;border-radius:50%;
  background:${T.accent};opacity:.03;top:-60px;right:-60px;filter:blur(40px);pointer-events:none}
.qc-mark{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:56px;
  color:${T.accent};opacity:.5;line-height:.7;display:block;margin-bottom:10px}
.qc-text{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:19px;
  color:${T.text};line-height:1.35;letter-spacing:.2px}
.qc-author{font-size:12px;color:${T.textMid};margin-top:10px;font-weight:500}
.qc-dots{display:flex;gap:6px;margin-top:14px}
.qc-dot{width:6px;height:6px;border-radius:50%;background:${T.border};transition:background .2s;cursor:pointer}
.qc-dot.on{background:${T.accent}}

.race-cd{margin:14px 20px 0;border-radius:22px;padding:18px;display:flex;
  align-items:center;gap:14px;
  background:linear-gradient(135deg,#1c1030,#110a20);
  border:1px solid ${T.tri}44}
.rcd-icon{width:50px;height:50px;border-radius:15px;background:${T.triBg};
  border:1px solid ${T.tri}33;display:flex;align-items:center;justify-content:center;
  font-size:22px;flex-shrink:0}
.rcd-info{flex:1;min-width:0}
.rcd-name{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;
  color:${T.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rcd-loc{font-size:12px;color:${T.textMid};margin-top:2px}
.rcd-right{text-align:right;flex-shrink:0}
.rcd-days{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:38px;
  color:${T.tri};line-height:1}
.rcd-lbl{font-size:9px;color:${T.textMid};font-weight:700;letter-spacing:1px;text-transform:uppercase}

.week-load{margin:14px 20px 0;background:${T.card};border:1px solid ${T.border};
  border-radius:20px;padding:18px}
.wl-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.wl-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;
  letter-spacing:1.5px;text-transform:uppercase;color:${T.textMid}}
.wl-total{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;color:${T.accent}}
.wl-bars{display:flex;gap:10px}
.wl-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
.wl-track{width:100%;height:72px;background:${T.surface};border-radius:8px;position:relative;overflow:hidden}
.wl-fill{position:absolute;bottom:0;left:0;right:0;border-radius:8px;transition:height .6s ease}
.wl-icon{font-size:16px}
.wl-val{font-size:11px;font-weight:600}

.today-plan{margin:0 20px;background:${T.card};border:1px solid ${T.border};border-radius:20px;overflow:hidden}
.tp-header{display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;border-bottom:1px solid ${T.border}}
.tp-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;
  color:${T.text};letter-spacing:.3px}
.tp-count{font-size:12px;color:${T.textMid};font-weight:500}
.tp-session{display:flex;align-items:center;gap:12px;padding:13px 16px;
  border-bottom:1px solid ${T.borderSub};cursor:pointer;transition:background .15s}
.tp-session:last-child{border-bottom:none}
.tp-session.done{opacity:.5}
.tp-sport-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.tp-info{flex:1}
.tp-name{font-size:14px;font-weight:600;color:${T.text}}
.tp-session.done .tp-name{text-decoration:line-through}
.tp-detail{font-size:12px;color:${T.textMid};margin-top:2px}
.tp-right{display:flex;align-items:center;gap:8px}
.tp-dur{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;color:${T.textMid}}
.tp-type{font-size:10px;font-weight:700;padding:3px 7px;border-radius:6px;
  letter-spacing:.5px;text-transform:uppercase}
.tp-check{font-size:18px;cursor:pointer}

.plan-template{margin:0 20px;background:${T.card};border:1px solid ${T.border};
  border-radius:20px;overflow:hidden}
.pt-row{display:flex;align-items:center;gap:12px;padding:14px 16px;
  border-bottom:1px solid ${T.borderSub};cursor:pointer}
.pt-row:last-child{border-bottom:none}
.pt-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;
  justify-content:center;font-size:18px;flex-shrink:0}
.pt-info{flex:1}
.pt-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;color:${T.text}}
.pt-meta{font-size:12px;color:${T.textMid};margin-top:2px}
.pt-active{font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;
  background:${T.accent}22;color:${T.accent};letter-spacing:.5px}

.qs-row{display:flex;gap:10px;margin:0 20px}
.qs-btn{flex:1;background:${T.card};border:1px solid ${T.border};border-radius:16px;
  padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;
  transition:border-color .15s}
.qs-btn:active{border-color:#444}
.qs-icon{font-size:22px}
.qs-lbl{font-size:11px;font-weight:600;color:${T.textMid};text-align:center;line-height:1.3}

/* ── ACCOUNT SPECIFIC ── */
.acct-hero{background:${T.card};border-bottom:1px solid ${T.border};padding:20px 20px 24px}
.ah-top{display:flex;align-items:center;gap:14px}
.avatar{width:66px;height:66px;border-radius:20px;
  background:linear-gradient(135deg,${T.swim},${T.tri});
  display:flex;align-items:center;justify-content:center;font-size:28px;position:relative}
.av-badge{position:absolute;bottom:-6px;right:-6px;background:${T.accent};color:#000;
  font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:10px;
  padding:2px 6px;border-radius:6px;border:2px solid ${T.card};letter-spacing:.5px}
.ah-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:24px;
  color:${T.text};letter-spacing:.3px}
.ah-sub{font-size:12px;color:${T.textMid};margin-top:2px}
.ah-plan{font-size:11px;color:${T.accent};font-weight:600;margin-top:3px}
.pr-row{display:flex;gap:8px;margin-top:18px}
.pr-box{flex:1;background:${T.surface};border-radius:12px;padding:10px 8px;
  text-align:center;border:1px solid ${T.borderSub};cursor:pointer;transition:border-color .15s}
.pr-box:active{border-color:var(--sc)}
.pr-sport{font-size:16px;margin-bottom:4px}
.pr-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:${T.text}}
.pr-lbl{font-size:10px;color:${T.textDim};margin-top:2px}
.sg-grp{margin:0 20px 16px}
.sg-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  color:${T.textDim};margin-bottom:8px;padding-left:4px}
.sg-items{background:${T.card};border:1px solid ${T.border};border-radius:18px;overflow:hidden}
.sg-row{display:flex;align-items:center;gap:12px;padding:14px 16px;
  border-bottom:1px solid ${T.borderSub};cursor:pointer}
.sg-row:last-child{border-bottom:none}
.sg-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;
  justify-content:center;font-size:16px;flex-shrink:0}
.sg-lt{flex:1;font-size:14px;font-weight:500;color:${T.text}}
.sg-rv{display:flex;align-items:center;gap:8px}
.sg-v{font-size:13px;color:${T.textMid}}
.sg-chev{color:${T.textDim};font-size:14px}
.logout{margin:4px 20px 0;background:transparent;border:1px solid ${T.heart}33;
  border-radius:16px;padding:15px 16px;display:flex;align-items:center;gap:12px;cursor:pointer}

/* PR DETAIL */
.pr-hero{border-radius:20px;padding:24px;text-align:center;margin-bottom:16px}
.prh-lbl{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.prh-val{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:52px;line-height:1}
.prh-event{font-size:13px;color:${T.textMid};margin-top:8px}
.pr-hist-row{display:flex;align-items:center;gap:12px;padding:12px 16px;
  border-bottom:1px solid ${T.borderSub}}
.pr-hist-row:last-child{border-bottom:none}
.pr-hist-row.best{background:${T.accent}08}

/* ── LIGHT THEME OVERRIDES ──────────────────────────────────
   Applied when .phone has class "light".
   Overrides every color that was baked in from T (dark values).
   Sport colors and accent stay identical in both themes.
─────────────────────────────────────────────────────────── */
.phone.light{background:#F2F2F0}
.phone.light .scroll{background:#F2F2F0}
.phone.light .sbar{background:#F2F2F0}
.phone.light .st{color:#0F0F10}
.phone.light .sdot{background:#0F0F10}
.phone.light .bnav{background:#FFFFFF;border-top-color:#E0E0DC}
.phone.light .bni-lb{color:#ADADB8}
.phone.light .bni.on .bni-lb{color:${T.accent}}
.phone.light .notch{background:#e0e0dc}

/* text */
.phone.light .ptitle,.phone.light .page-title,.phone.light .ptitle{color:#0F0F10}
.phone.light .psub,.phone.light .page-sub{color:#6E6E7A}
.phone.light .seclbl{color:#ADADB8}
.phone.light .hg-name{color:#0F0F10}
.phone.light .hg-date{color:#6E6E7A}

/* cards */
.phone.light .card,.phone.light .quote-card,.phone.light .week-load,
.phone.light .today-plan,.phone.light .plan-template,.phone.light .acct-hero{
  background:#FFFFFF;border-color:#E0E0DC}
.phone.light .qc-text{color:#0F0F10}
.phone.light .qc-author{color:#6E6E7A}
.phone.light .qc-dot{background:#E0E0DC}
.phone.light .qc-dot.on{background:${T.accent}}

/* tool rows */
.phone.light .tool-row,.phone.light .sg-items,.phone.light .rc,.phone.light .ref-card{
  background:#FFFFFF;border-color:#E0E0DC}
.phone.light .tool-name,.phone.light .td-title,.phone.light .ov-title{color:#0F0F10}
.phone.light .tool-desc,.phone.light .td-back span:last-child{color:#6E6E7A}

/* settings rows */
.phone.light .sg-row{border-bottom-color:#EBEBEA}
.phone.light .sg-lt{color:#0F0F10}
.phone.light .sg-v{color:#6E6E7A}
.phone.light .sg-chev{color:#ADADB8}
.phone.light .sg-lbl{color:#ADADB8}
.phone.light .sg-grp .sg-items{background:#FFFFFF;border-color:#E0E0DC}

/* inputs */
.phone.light .ci,.phone.light .modal-in,.phone.light .modal-sh{
  background:#FFFFFF;border-color:#E0E0DC;color:#0F0F10}
.phone.light .cu{background:#F2F2F0;border-color:#E0E0DC;color:#6E6E7A}
.phone.light .ib,.phone.light .info-block{background:#F2F2F0;border-color:#E0E0DC}
.phone.light .il,.phone.light .info-lbl{color:#6E6E7A}
.phone.light .iv,.phone.light .info-val{color:#0F0F10}

/* toggles */
.phone.light .tog.off{background:#D0D0D0}

/* bottom sheets */
.phone.light .modal-ov .modal-sh{background:#FFFFFF}
.phone.light .modal-hnd{background:#E0E0DC}
.phone.light .modal-t{color:#0F0F10}
.phone.light .modal-btn.x{background:#F2F2F0;color:#6E6E7A;border-color:#E0E0DC}

/* tabs */
.phone.light .etabs,.phone.light .sport-tabs,.phone.light .stabs{
  background:#FFFFFF;border-color:#E0E0DC}
.phone.light .etab,.phone.light .stab{color:#6E6E7A}
.phone.light .etab.on{background:#F2F2F0;color:#0F0F10}

/* event cards */
.phone.light .event-card{background:#FFFFFF;border-color:#E0E0DC}
.phone.light .fchip{border-color:#E0E0DC;color:#6E6E7A;background:#FFFFFF}

/* account */
.phone.light .acct-hero{background:#FFFFFF;border-bottom-color:#E0E0DC}
.phone.light .ah-name{color:#0F0F10}
.phone.light .ah-sub,.phone.light .ah-plan{color:#6E6E7A}
.phone.light .pr-box{background:#F2F2F0;border-color:#E0E0DC}
.phone.light .pr-val{color:#0F0F10}
.phone.light .pr-lbl{color:#ADADB8}
.phone.light .logout{border-color:#FFD5D5}

/* bottom nav active */
.phone.light .bni.on::before{background:${T.accent}}

/* overlay screens */
.phone.light .overlay,.phone.light .tool-detail{background:#F2F2F0}
.phone.light .ov-head,.phone.light .td-head{background:#FFFFFF;border-bottom-color:#E0E0DC}
.phone.light .ov-back-arr,.phone.light .ov-back-lbl,.phone.light .td-back-arr{color:#6E6E7A}
.phone.light .ov-sport-lbl{color:#6E6E7A}

/* misc */
.phone.light .wl-title{color:#6E6E7A}
.phone.light .wl-total{color:${T.accent}}
.phone.light .tp-name{color:#0F0F10}
.phone.light .tp-detail{color:#6E6E7A}
.phone.light .tp-dur{color:#6E6E7A}
.phone.light .rcd-name{color:#0F0F10}
.phone.light .rcd-loc{color:#6E6E7A}
.phone.light .pt-name{color:#0F0F10}
.phone.light .pt-meta{color:#6E6E7A}
.phone.light .ref-lbl,.phone.light .rr .ref-lbl{color:#0F0F10}
.phone.light .rr{border-bottom-color:#EBEBEA}
.phone.light .fn,.phone.light .foot-note{color:#ADADB8}
.phone.light .tw,.phone.light .taper-week{background:#FFFFFF;border-color:#E0E0DC}
.phone.light .tw-l,.phone.light .tw-lbl{color:#0F0F10}
.phone.light .tw-bt,.phone.light .tw-bar-track{background:#F2F2F0}
.phone.light .sb,.phone.light .sel-btn{background:#F2F2F0;border-color:#E0E0DC;color:#6E6E7A}
.phone.light .sb.on,.phone.light .sel-btn.on{border-color:${T.accent};background:${T.accent}22;color:${T.accent}}
.phone.light .stab-cnt{background:#F2F2F0;color:#ADADB8}
.phone.light .stab.on .stab-cnt{background:var(--tc,${T.accent})22}
.phone.light .lap-table,.phone.light .lt{background:#FFFFFF;border-color:#E0E0DC}
.phone.light .lr{border-bottom-color:#EBEBEA}
.phone.light .ln{color:#ADADB8}
.phone.light .ltm{color:#0F0F10}
.phone.light .lsp{color:#6E6E7A}
.phone.light .swt{background:#F2F2F0;border-color:#E0E0DC}
.phone.light .pool-num{color:#0F0F10}
.phone.light .pool-dist{color:${T.swim}}
.phone.light .pool-clock{color:#6E6E7A}
.phone.light .pool-hint{color:#ADADB8}
.phone.light .pool-ctrl-btn{background:#FFFFFF;border-color:#E0E0DC;color:#6E6E7A}
.phone.light .tap-btn{background:#ddeeff;border-color:${T.swim}44;color:${T.swim}}
.phone.light .check-box{border-color:#E0E0DC}
.phone.light .check-text{color:#0F0F10}
.phone.light .check-text.done{color:#ADADB8}
.phone.light .pr-hero{background:#F2F2F0}
.phone.light .prh-event{color:#6E6E7A}
.phone.light .pr-hist-row{border-bottom-color:#EBEBEA}
.phone.light .ln{color:#ADADB8}

/* wl bars */
.phone.light .wl-track{background:#F2F2F0}
.phone.light .wl-val{color:#6E6E7A}

/* race countdown light */
.phone.light .race-cd{background:linear-gradient(135deg,#f0eeff,#ece8f8);border-color:${T.tri}33}
.phone.light .rcd-icon{background:#f0e8ff;border-color:${T.tri}22}

/* sheet light */
.phone.light .modal-ov{background:rgba(0,0,0,.25)}
.phone.light .modal-sh{background:#FFFFFF}
`;

const ThemeCtx = createContext(true);
const useDark = () => useContext(ThemeCtx);

/* ═══════════════════════════════════════════════════════════
   i18n — Language Context + Translations
═══════════════════════════════════════════════════════════ */
const LangCtx = createContext("en");
const useLang = () => useContext(LangCtx);
const useT = () => {
  const lang = useContext(LangCtx);
  return (key) => (TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key);
};

const TRANSLATIONS = {
  en: {
    /* nav */
    nav_home:"Home", nav_tools:"Tools", nav_events:"Events", nav_account:"Account",
    /* home */
    home_greeting_morning:"Morning", home_greeting_afternoon:"Afternoon", home_greeting_evening:"Evening",
    home_this_week:"This Week", home_total:"total",
    home_today:"Today's Training", home_see_plan:"See plan →",
    home_no_sessions:"No sessions today", home_no_sessions_sub:"Rest day, or no active training plan yet.",
    home_choose_plan:"Choose a Plan →", home_done:"done",
    home_quick_tools:"Quick Tools", home_plans:"Training Plans",
    home_no_race:"No goal race saved yet", home_no_race_sub:"Star an event in Events tab to see your countdown here",
    home_days_to_go:"days to go",
    home_active:"ACTIVE", home_ai_plan:"AI Plan", home_ai_soon:"Personalised · Coming soon", home_soon:"SOON",
    /* tools */
    tools_title:"Tools", tools_sub:"tools for endurance athletes",
    tools_tab_all:"All", tools_tab_swim:"Swim", tools_tab_bike:"Bike", tools_tab_run:"Run", tools_tab_tri:"Tri",
    /* tool names */
    tool_pace:"Pace Calculator", tool_pace_desc:"Time · Distance · Pace — live recalc",
    tool_predict:"Race Time Predictor", tool_predict_desc:"Predict from shorter race",
    tool_cadence:"Cadence Beeper", tool_cadence_desc:"Metronome for run & bike",
    tool_power:"Power Zone Calculator", tool_power_desc:"FTP-based cycling zones",
    tool_speed:"Speed ↔ Pace", tool_speed_desc:"km/h ↔ min/km converter",
    tool_hr:"HR Zone Calculator", tool_hr_desc:"5 zones from max HR or HRR",
    tool_calorie:"Calorie Burn Estimator", tool_calorie_desc:"Weight + duration → kcal",
    tool_swolf:"SWOLF Calculator", tool_swolf_desc:"Swim efficiency score",
    tool_pool:"Pool Lap Counter", tool_pool_desc:"Multi-swimmer, lap timers",
    tool_wetsuit:"Wetsuit Temp Guide", tool_wetsuit_desc:"Water temp → wetsuit rules",
    tool_split:"Race Split Planner", tool_split_desc:"Target time → leg splits",
    tool_nutrition:"Nutrition Calculator", tool_nutrition_desc:"Carbs & fluid by duration",
    tool_transition:"Transition Estimator", tool_transition_desc:"T1 + T2 race day planning",
    tool_checklist:"Race Day Checklist", tool_checklist_desc:"Gear checklist by race type",
    tool_taper:"Taper Calculator", tool_taper_desc:"Volume reduction before race",
    /* events */
    events_title:"Events", events_locked:"locked",
    events_discover:"Discover", events_my:"My Events",
    events_upcoming:"Upcoming", events_archived:"Archived",
    events_show_archived:"past events", events_hide:"Hide", events_show:"Show",
    events_no_events:"No saved events yet",
    events_no_events_sub:"Star events from Discover to save them here, or add your own personal events.",
    events_browse:"Browse Events →",
    events_add_personal:"Add Personal Event",
    events_suggest:"Suggest a Missing Event",
    events_days:"DAYS", events_past:"PAST", events_my_event:"MY EVENT",
    events_suggest_title:"Suggest an Event",
    events_suggest_sub:"Know a race in Ukraine we're missing? Submit it for review.",
    events_suggest_sent:"Suggestion Sent!",
    events_suggest_sent_sub:"Thanks! Our team will review your submission and add it to the calendar if approved.",
    events_submit:"Submit for Review",
    events_add_title:"Add Personal Event",
    events_name:"Event Name", events_sport:"Sport", events_dist:"Distance",
    events_date:"Date", events_location:"Location", events_notes:"Notes (optional)",
    events_notes_ph:"Any notes about the event...",
    /* account */
    account_title:"Account", account_edit:"Edit",
    account_training:"Training Profile", account_prefs:"Preferences", account_app:"App",
    account_prs:"Personal Bests",
    account_goal_label:"Goal", account_active_plan:"Active Plan",
    account_logged_out:"You've been logged out",
    account_logged_out_sub:"See you on the course.",
    account_log_back:"Log Back In",
    ob_age:"age",
    home_week_plan:"Week 1 — Ironman 70.3 Plan",
    plan_active:"ACTIVE",
    account_ftp:"FTP (Cycling)", account_maxhr:"HR Zones", account_goal:"Season Goal",
    account_notif:"Notifications", account_dark:"Dark Mode",
    account_units:"Units", account_hr_method:"HR Zone Method",
    account_suggest:"Suggest a Feature", account_rate:"Rate Sportik",
    account_about:"About", account_logout:"Log Out",
    account_no_plan:"No active plan — choose one from Home",
    account_pr_best:"Personal Best", account_pr_history:"History",
    account_pr_only_one:"Only one result so far",
    account_pr_only_one_sub:"Log your next result after a race or training session to start tracking your progress.",
    account_log_result:"+ Log New Result", account_save_result:"Save Result",
    account_log_time:"Time", account_log_event:"Event / Note",
    account_log_ph:"e.g. Kyiv Half Marathon",
    account_logout_confirm:"You'll need to log back in to access your profile, training plan, and saved events.",
    account_cancel:"Cancel",
    account_logged_out:"You've been logged out",
    account_logged_out_sub:"See you on the course.",
    account_log_back:"Log Back In",
    /* hr zones overlay */
    hr_title:"HR Zones", hr_save:"Save HR Settings",
    hr_method:"Method", hr_max:"Max Heart Rate", hr_resting:"Resting HR",
    hr_estimate:"Estimate: 220 − age",
    hr_z1:"Recovery", hr_z2:"Aerobic", hr_z3:"Tempo", hr_z4:"Threshold", hr_z5:"VO₂ Max",
    hr_z1_note:"Easy aerobic, fat burning", hr_z2_note:"Base endurance building",
    hr_z3_note:"Aerobic threshold pace", hr_z4_note:"Lactate threshold, race pace",
    hr_z5_note:"Max effort, short intervals",
    /* settings sheets */
    ftp_title:"FTP — Cycling Power", ftp_hint:"Functional Threshold Power — max power sustainable for ~60 min. Test: 20-min all-out × 0.95.",
    maxhr_title:"Max Heart Rate", maxhr_hint:"Common estimate: 220 − age. Best accuracy: lab test or hard 20-min effort.",
    goal_title:"Season Goal",
    units_title:"Units", units_sub:"Choose your preferred measurement system.",
    units_metric:"Metric", units_metric_sub:"km, kg, °C — default for Ukraine",
    units_imperial:"Imperial", units_imperial_sub:"miles, lb, °F",
    hrmethod_title:"HR Zone Method", hrmethod_sub:"How your 5 heart rate zones are calculated.",
    hrmethod_maxhr:"Max HR %", hrmethod_maxhr_sub:"Simple — zones as % of max HR. Best for beginners.",
    hrmethod_hrr:"HR Reserve", hrmethod_hrr_sub:"Karvonen method — accounts for resting HR. More accurate.",
    hrmethod_lt:"Lactate Threshold", hrmethod_lt_sub:"Most precise — requires a lab or field test.",
    suggest_title:"Suggest a Feature", suggest_ph:"e.g. Add swim interval timer, export training data...",
    suggest_sub:"What would make Sportik more useful for you? All suggestions go directly to the team.",
    suggest_send:"Send Suggestion",
    suggest_sent:"Feature Submitted!",
    suggest_sent_sub:"Thanks for helping make Sportik better. We'll review your suggestion soon.",
    rate_title:"Rate Sportik", rate_sub:"How would you rate your Sportik experience so far?",
    rate_submit:"Submit Rating",
    rate_sent:"Thank you!",
    rate_sent_sub_pre:"Your", rate_sent_sub_suf:"-star rating means a lot. Reviews help other athletes discover Sportik.",
    rate_labels:["","Needs work","Getting there","Good","Great!","Outstanding! 🏆"],
    logout_title:"Log Out",
    save:"Save", done:"Done", cancel:"Cancel", reset:"Reset", back:"Back", skip:"Skip",
    required:"Required",
    /* onboarding */
    ob_tagline:"THE TRIATHLETE'S\nCOMPANION",
    ob_get_started:"Get Started →", ob_skip:"Skip →", ob_skip_all:"Skip onboarding entirely",
    ob_takes:"Takes about 60 seconds · All settings editable later",
    ob_sport_q:"What do you train for?", ob_sport_sub:"Select all that apply. This shapes your tools, plans and event feed.",
    ob_continue:"Continue →", ob_sport_tri:"Triathlete", ob_sport_run:"Runner",
    ob_sport_bike:"Cyclist", ob_sport_swim:"Swimmer", ob_sport_tbd:"Not decided yet",
    ob_sport_tri_sub:"Swim · Bike · Run", ob_sport_run_sub:"Road · Trail · Track",
    ob_sport_bike_sub:"Road · MTB · Gran Fondo", ob_sport_swim_sub:"Pool · Open water",
    ob_sport_tbd_sub:"Explore and decide later",
    ob_race_q:"Got a goal race?", ob_race_sub:"We'll count down to it and shape your plan around it.",
    ob_race_yes:"Yes, I do! 🎯", ob_race_no:"Not yet",
    ob_race_type:"Race Type", ob_race_date:"Race Date",
    ob_race_none:"No problem", ob_race_none_sub:"You can add a goal race later from the Events tab at any time.",
    ob_baseline_q:"Your baseline", ob_baseline_sub:"Optional — but makes your HR zones and power zones accurate from day one.",
    ob_hours_q:"Weekly training time", ob_hours_sub:"How many hours per week can you realistically train?",
    ob_hours_unit:"hours / week",
    ob_level_base:"Base Builder", ob_level_base_sub:"Perfect for getting started or returning to sport",
    ob_level_inter:"Intermediate", ob_level_inter_sub:"Solid mix of volume and quality sessions",
    ob_level_adv:"Advanced", ob_level_adv_sub:"Structured training with high weekly load",
    ob_level_elite:"Elite Amateur", ob_level_elite_sub:"Near full-time training commitment",
    ob_ready_q:"You're all set!", ob_ready_q_skipped:"Almost there!",
    ob_ready_sub:"One last thing — what should we call you?",
    ob_ready_sub_skipped:"Just tell us your name — you can fill in the rest later.",
    ob_ready_set:"What you've set", ob_ready_profile:"Your Profile",
    ob_ready_later:"Set up later in Account",
    ob_ready_promise:"All settings are editable anytime from the Account tab. Nothing is locked in.",
    ob_lets_go:"Let's Go",
    ob_sport_focus:"Sport Focus", ob_goal_race:"Goal Race",
    ob_weekly_hours:"Weekly Hours",
    /* edit profile */
    ep_title:"Edit Profile", ep_avatar:"Avatar", ep_name:"Full Name", ep_city:"City",
    ep_focus:"Sport Focus", ep_save:"Save Changes",
    /* about */
    about_title:"About Sportik", about_beta:"BETA",
    about_platform:"Platform", about_target:"Target", about_country:"Country",
    about_units_row:"Units", about_data:"Data",
    about_made:"Made with ❤️ for endurance athletes",
    about_privacy:"Privacy Policy", about_terms:"Terms of Use", about_oss:"Open Source Licences",
    /* plan */
    plan_duration:"Duration", plan_level:"Level", plan_race:"Race",
    plan_ai_title:"AI-Personalised Plans",
    plan_ai_sub:"Enter your fitness level, available hours, and race date — Claude generates a plan just for you.",
    plan_ai_badge:"COMING IN V2",
    /* settings Language */
    lang_title:"Language", lang_en:"English", lang_ua:"Українська",
  },
  uk: {
    /* nav */
    nav_home:"Головна", nav_tools:"Інструменти", nav_events:"Події", nav_account:"Профіль",
    /* home */
    home_greeting_morning:"Доброго ранку", home_greeting_afternoon:"Добрий день", home_greeting_evening:"Добрий вечір",
    home_this_week:"Цей тиждень", home_total:"загалом",
    home_today:"Тренування сьогодні", home_see_plan:"Переглянути план →",
    home_no_sessions:"Сьогодні немає занять", home_no_sessions_sub:"День відпочинку або немає активного плану.",
    home_choose_plan:"Обрати план →", home_done:"виконано",
    home_quick_tools:"Швидкі інструменти", home_plans:"Плани тренувань",
    home_no_race:"Змагання не обрано", home_no_race_sub:"Позначте подію зіркою на вкладці «Події», щоб побачити зворотний відлік",
    home_days_to_go:"днів до старту",
    home_active:"АКТИВНИЙ", home_ai_plan:"AI-план", home_ai_soon:"Персоналізований · Скоро", home_soon:"СКОРО",
    /* tools */
    tools_title:"Інструменти", tools_sub:"інструментів для атлетів",
    tools_tab_all:"Всі", tools_tab_swim:"Плавання", tools_tab_bike:"Велосипед", tools_tab_run:"Біг", tools_tab_tri:"Тріатлон",
    /* tool names */
    tool_pace:"Калькулятор темпу", tool_pace_desc:"Час · Дистанція · Темп — розрахунок в реальному часі",
    tool_predict:"Прогноз часу на змаганнях", tool_predict_desc:"Прогноз на основі коротшої дистанції",
    tool_cadence:"Метроном каденсу", tool_cadence_desc:"Метроном для бігу та велосипеду",
    tool_power:"Калькулятор зон потужності", tool_power_desc:"Зони на основі FTP",
    tool_speed:"Швидкість ↔ Темп", tool_speed_desc:"км/год ↔ хв/км",
    tool_hr:"Калькулятор зон ЧСС", tool_hr_desc:"5 зон на основі макс. ЧСС або ЧСС-резерву",
    tool_calorie:"Калькулятор калорій", tool_calorie_desc:"Вага + тривалість → ккал",
    tool_swolf:"Калькулятор SWOLF", tool_swolf_desc:"Оцінка ефективності плавання",
    tool_pool:"Лічильник кіл у басейні", tool_pool_desc:"Декілька плавців, таймер кіл",
    tool_wetsuit:"Гідрокостюм по температурі", tool_wetsuit_desc:"Температура води → правила гідрокостюма",
    tool_split:"Планування сплітів", tool_split_desc:"Цільовий час → сплітий по відрізках",
    tool_nutrition:"Калькулятор харчування", tool_nutrition_desc:"Вуглеводи та рідина за тривалістю",
    tool_transition:"Оцінка транзиту", tool_transition_desc:"Планування T1 та T2",
    tool_checklist:"Чек-лист дня змагань", tool_checklist_desc:"Спорядження за типом гонки",
    tool_taper:"Калькулятор зниження навантаження", tool_taper_desc:"Зменшення обсягу перед стартом",
    /* events */
    events_title:"Події", events_locked:"фіксовано",
    events_discover:"Знайти", events_my:"Мої події",
    events_upcoming:"Майбутні", events_archived:"Архів",
    events_show_archived:"минулих подій", events_hide:"Сховати", events_show:"Показати",
    events_no_events:"Поки немає збережених подій",
    events_no_events_sub:"Позначте події зіркою або додайте власні.",
    events_browse:"Переглянути події →",
    events_add_personal:"Додати особисту подію",
    events_suggest:"Запропонувати подію",
    events_days:"ДНІВ", events_past:"МИНУЛО", events_my_event:"МОЯ ПОДІЯ",
    events_suggest_title:"Запропонувати подію",
    events_suggest_sub:"Знаєте змагання в Україні, яких немає в списку? Надішліть на розгляд.",
    events_suggest_sent:"Пропозицію надіслано!",
    events_suggest_sent_sub:"Дякуємо! Ми розглянемо вашу пропозицію та додамо до календаря.",
    events_submit:"Надіслати на розгляд",
    events_add_title:"Додати особисту подію",
    events_name:"Назва події", events_sport:"Вид спорту", events_dist:"Дистанція",
    events_date:"Дата", events_location:"Місце", events_notes:"Нотатки (необов'язково)",
    events_notes_ph:"Будь-яка інформація про подію...",
    /* account */
    account_title:"Профіль", account_edit:"Редагувати",
    account_training:"Тренувальний профіль", account_prefs:"Налаштування", account_app:"Програма",
    account_prs:"Особисті рекорди",
    account_goal_label:"Ціль", account_active_plan:"Активний план",
    account_logged_out:"Ви вийшли з профілю",
    account_logged_out_sub:"До зустрічі на трасі.",
    account_log_back:"Увійти знову",
    ob_age:"вік",
    home_week_plan:"Тиждень 1 — план Ironman 70.3",
    plan_active:"АКТИВНИЙ",
    account_ftp:"FTP (Велосипед)", account_maxhr:"Зони ЧСС", account_goal:"Ціль сезону",
    account_notif:"Сповіщення", account_dark:"Темна тема",
    account_units:"Одиниці", account_hr_method:"Метод зон ЧСС",
    account_suggest:"Запропонувати функцію", account_rate:"Оцінити Sportik",
    account_about:"Про програму", account_logout:"Вийти",
    account_no_plan:"Немає активного плану — обрати на Головній",
    account_pr_best:"Особистий рекорд", account_pr_history:"Історія",
    account_pr_only_one:"Поки лише один результат",
    account_pr_only_one_sub:"Запишіть наступний результат після змагань або тренування.",
    account_log_result:"+ Записати результат", account_save_result:"Зберегти результат",
    account_log_time:"Час", account_log_event:"Подія / Нотатка",
    account_log_ph:"напр. Київський напівмарафон",
    account_logout_confirm:"Щоб отримати доступ до профілю та плану, потрібно буде увійти знову.",
    account_cancel:"Скасувати",
    account_logged_out:"Ви вийшли з профілю",
    account_logged_out_sub:"До зустрічі на трасі.",
    account_log_back:"Увійти знову",
    /* hr zones overlay */
    hr_title:"Зони ЧСС", hr_save:"Зберегти налаштування ЧСС",
    hr_method:"Метод", hr_max:"Максимальний ЧСС", hr_resting:"ЧСС у спокої",
    hr_estimate:"Орієнтовно: 220 − вік",
    hr_z1:"Відновлення", hr_z2:"Аеробна", hr_z3:"Темпова", hr_z4:"Порогова", hr_z5:"VO₂ Макс",
    hr_z1_note:"Легка аеробна, спалювання жиру", hr_z2_note:"Базова витривалість",
    hr_z3_note:"Аеробний поріг", hr_z4_note:"Лактатний поріг, гоновий темп",
    hr_z5_note:"Максимальні зусилля, короткі інтервали",
    /* settings sheets */
    ftp_title:"FTP — Потужність на велосипеді", ftp_hint:"Функціональна порогова потужність — макс. потужність протягом ~60 хв. Тест: 20-хв. зусилля × 0,95.",
    maxhr_title:"Максимальний ЧСС", maxhr_hint:"Орієнтовно: 220 − вік. Точніше — лабораторний тест або 20-хв. зусилля.",
    goal_title:"Ціль сезону",
    units_title:"Одиниці", units_sub:"Оберіть зручну систему вимірювання.",
    units_metric:"Метрична", units_metric_sub:"км, кг, °C — за замовчуванням для України",
    units_imperial:"Імперська", units_imperial_sub:"милі, фунти, °F",
    hrmethod_title:"Метод зон ЧСС", hrmethod_sub:"Як розраховуються 5 зон частоти серцевих скорочень.",
    hrmethod_maxhr:"% від макс. ЧСС", hrmethod_maxhr_sub:"Простий метод. Найкращий для початківців.",
    hrmethod_hrr:"ЧСС-резерв", hrmethod_hrr_sub:"Метод Карвонена — враховує ЧСС у спокої. Точніший.",
    hrmethod_lt:"Лактатний поріг", hrmethod_lt_sub:"Найточніший — потребує лабораторного або польового тесту.",
    suggest_title:"Запропонувати функцію", suggest_ph:"напр. Таймер інтервалів плавання...",
    suggest_sub:"Що зробить Sportik кориснішим? Всі пропозиції надходять безпосередньо до команди.",
    suggest_send:"Надіслати пропозицію",
    suggest_sent:"Функцію запропоновано!",
    suggest_sent_sub:"Дякуємо за допомогу! Ми розглянемо вашу пропозицію найближчим часом.",
    rate_title:"Оцінити Sportik", rate_sub:"Як би ви оцінили свій досвід роботи зі Sportik?",
    rate_submit:"Надіслати оцінку",
    rate_sent:"Дякуємо!",
    rate_sent_sub_pre:"Ваша оцінка", rate_sent_sub_suf:"зірок дуже важлива для нас.",
    rate_labels:["","Потребує роботи","Непогано","Добре","Відмінно!","Неперевершено! 🏆"],
    logout_title:"Вийти",
    save:"Зберегти", done:"Готово", cancel:"Скасувати", reset:"Скинути", back:"Назад", skip:"Пропустити",
    required:"Обов'язково",
    /* onboarding */
    ob_tagline:"СУПУТНИК\nТРІАТЛЕТА",
    ob_get_started:"Почати →", ob_skip:"Пропустити →", ob_skip_all:"Пропустити налаштування",
    ob_takes:"Займе близько 60 секунд · Всі дані можна змінити пізніше",
    ob_sport_q:"Що ви тренуєте?", ob_sport_sub:"Оберіть все, що підходить. Це налаштує інструменти, плани та стрічку подій.",
    ob_continue:"Продовжити →", ob_sport_tri:"Тріатлоніст", ob_sport_run:"Бігун",
    ob_sport_bike:"Велосипедист", ob_sport_swim:"Плавець", ob_sport_tbd:"Ще не вирішив(ла)",
    ob_sport_tri_sub:"Плавання · Велосипед · Біг", ob_sport_run_sub:"Шосе · Трейл · Трек",
    ob_sport_bike_sub:"Шосе · MTB · Гран-фондо", ob_sport_swim_sub:"Басейн · Відкрита вода",
    ob_sport_tbd_sub:"Досліджуйте та вирішуйте пізніше",
    ob_race_q:"Є цільові змагання?", ob_race_sub:"Ми будемо відраховувати дні та підлаштовуємо план під вас.",
    ob_race_yes:"Так, є! 🎯", ob_race_no:"Ще немає",
    ob_race_type:"Тип змагань", ob_race_date:"Дата старту",
    ob_race_none:"Без проблем", ob_race_none_sub:"Змагання можна додати пізніше на вкладці «Події».",
    ob_baseline_q:"Ваші показники", ob_baseline_sub:"Необов'язково — але робить зони ЧСС і потужності точними з першого дня.",
    ob_hours_q:"Час тренувань на тиждень", ob_hours_sub:"Скільки годин на тиждень ви реально можете тренуватися?",
    ob_hours_unit:"год / тиждень",
    ob_level_base:"База", ob_level_base_sub:"Ідеально для початківців або повернення до спорту",
    ob_level_inter:"Середній рівень", ob_level_inter_sub:"Збалансоване поєднання обсягу та якості",
    ob_level_adv:"Просунутий", ob_level_adv_sub:"Структуровані тренування з великим навантаженням",
    ob_level_elite:"Аматор-еліт", ob_level_elite_sub:"Тренування майже на повний робочий день",
    ob_ready_q:"Все готово!", ob_ready_q_skipped:"Майже готово!",
    ob_ready_sub:"Останнє — як вас називати?",
    ob_ready_sub_skipped:"Вкажіть ім'я — решту можна заповнити пізніше.",
    ob_ready_set:"Що ви налаштували", ob_ready_profile:"Ваш профіль",
    ob_ready_later:"Налаштувати пізніше в Профілі",
    ob_ready_promise:"Всі налаштування можна змінити будь-коли у вкладці «Профіль».",
    ob_lets_go:"Почнемо",
    ob_sport_focus:"Вид спорту", ob_goal_race:"Цільові змагання",
    ob_weekly_hours:"Годин на тиждень",
    /* edit profile */
    ep_title:"Редагувати профіль", ep_avatar:"Аватар", ep_name:"Повне ім'я", ep_city:"Місто",
    ep_focus:"Вид спорту", ep_save:"Зберегти зміни",
    /* about */
    about_title:"Про Sportik", about_beta:"БЕТА",
    about_platform:"Платформа", about_target:"Цільова аудиторія", about_country:"Країна",
    about_units_row:"Одиниці", about_data:"Дані",
    about_made:"Зроблено з ❤️ для атлетів на витривалість",
    about_privacy:"Політика конфіденційності", about_terms:"Умови використання", about_oss:"Ліцензії з відкритим кодом",
    /* plan */
    plan_duration:"Тривалість", plan_level:"Рівень", plan_race:"Старт",
    plan_ai_title:"AI-персоналізовані плани",
    plan_ai_sub:"Введіть рівень фізичної підготовки, доступний час та дату старту — Claude створить план саме для вас.",
    plan_ai_badge:"У V2",
    /* language */
    lang_title:"Мова", lang_en:"English", lang_ua:"Українська",
  },
};

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */
const Toggle = ({on, onToggle}) => (
  <div className={`tog ${on?"on":"off"}`} onClick={onToggle}>
    <div className="togdot"/>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   ANIMATION KEYFRAMES — injected once at app level
═══════════════════════════════════════════════════════════ */
const ANIM_CSS = `
/* screen tab transitions */
@keyframes scr-in-r  { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes scr-in-l  { from{transform:translateX(-40px);opacity:0} to{transform:translateX(0);opacity:1} }
.scr-enter { animation: scr-in-r .22s cubic-bezier(.4,0,.2,1) both; }
.scr-enter-back { animation: scr-in-l .22s cubic-bezier(.4,0,.2,1) both; }

/* overlay slide-up */
@keyframes ov-up   { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes ov-down { from{transform:translateY(0)} to{transform:translateY(100%)} }
.ov-slide-up   { animation: ov-up   .28s cubic-bezier(.4,0,.2,1) both; }
.ov-slide-down { animation: ov-down .24s cubic-bezier(.4,0,.2,1) both; }

/* sheet slide-up */
@keyframes sh-up   { from{transform:translateY(110%)} to{transform:translateY(0)} }
@keyframes sh-down { from{transform:translateY(0)} to{transform:translateY(110%)} }
.sh-slide-up   { animation: sh-up   .26s cubic-bezier(.4,0,.2,1) both; }
.sh-slide-down { animation: sh-down .22s cubic-bezier(.4,0,.2,1) both; }

/* nav indicator */
.bnav-indicator {
  position:absolute;
  top:-1px; height:2px;
  background:${T.accent};
  border-radius:2px;
  transition: left .22s cubic-bezier(.4,0,.2,1), width .22s cubic-bezier(.4,0,.2,1);
}
`;

/* ── NAV_ORDER for direction detection ── */
const NAV_ORDER = ["home","tools","events","account"];

const BottomNav = ({screen, setScreen, setOverlay}) => {
  const t = useT();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({left:0, width:0});

  useEffect(() => {
    if (!navRef.current) return;
    const items = navRef.current.querySelectorAll(".bni");
    const idx = NAV_ORDER.indexOf(screen);
    if (idx < 0 || !items[idx]) return;
    const item = items[idx];
    const nav  = navRef.current;
    const navRect  = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setIndicatorStyle({
      left:  itemRect.left - navRect.left + itemRect.width * .25,
      width: itemRect.width * .5,
    });
  }, [screen]);

  const navItems = [
    {id:"home",   icon:"🏠", label:t("nav_home")},
    {id:"tools",  icon:"🛠",  label:t("nav_tools")},
    {id:"events", icon:"📅", label:t("nav_events")},
    {id:"account",icon:"👤", label:t("nav_account")},
  ];

  return (
    <div className="bnav" ref={navRef} style={{position:"absolute"}}>
      <div className="bnav-indicator" style={indicatorStyle}/>
      {navItems.map(n => (
        <div key={n.id}
          className={`bni ${screen===n.id?"on":""}`}
          onClick={()=>{setScreen(n.id);setOverlay(null);}}>
          <span className="bni-ic">{n.icon}</span>
          <span className="bni-lb">{n.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════════════════════════ */
/* ── Quote Card — fixed height slide carousel ── */
const QUOTE_SLIDE_CSS = `
@keyframes qs-in-l  { from{transform:translateX(100%)} to{transform:translateX(0)} }
@keyframes qs-in-r  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
@keyframes qs-out-l { from{transform:translateX(0)} to{transform:translateX(-100%)} }
@keyframes qs-out-r { from{transform:translateX(0)} to{transform:translateX(100%)} }
`;

/* pre-measure: find the tallest quote so card never jumps */
const QUOTE_HEIGHT = 130; /* px — enough for the longest quote at 19px font */

const QuoteCard = ({qi, setQi}) => {
  const [cur,      setCur]      = useState(qi);
  const [incoming, setIncoming] = useState(null);
  const [dir,      setDir]      = useState("l");
  const busy     = useRef(false);
  const touchX   = useRef(null);
  const mouseX   = useRef(null);
  const mouseMoved = useRef(false);

  const goTo = (idx, d = "l") => {
    if (busy.current || idx === cur) return;
    busy.current = true;
    setDir(d);
    setIncoming(idx);
    setTimeout(() => {
      setCur(idx);
      setQi(idx);
      setIncoming(null);
      busy.current = false;
    }, 340);
  };

  const goPrev = () => goTo((cur - 1 + QUOTES.length) % QUOTES.length, "r");
  const goNext = () => goTo((cur + 1) % QUOTES.length, "l");

  /* touch */
  const onTouchStart = e => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 32) dx < 0 ? goNext() : goPrev();
  };

  /* mouse drag — only trigger if moved significantly, so dot clicks still work */
  const onMouseDown = e => { mouseX.current = e.clientX; mouseMoved.current = false; };
  const onMouseMove = e => {
    if (mouseX.current !== null && Math.abs(e.clientX - mouseX.current) > 8)
      mouseMoved.current = true;
  };
  const onMouseUp = e => {
    if (mouseX.current === null) return;
    const dx = e.clientX - mouseX.current;
    mouseX.current = null;
    if (mouseMoved.current && Math.abs(dx) > 32) dx < 0 ? goNext() : goPrev();
    mouseMoved.current = false;
  };

  const Slide = ({idx, anim}) => (
    <div style={{
      position:"absolute", inset:0,
      animation: anim ? `${anim} .34s cubic-bezier(.4,0,.2,1) both` : "none",
    }}>
      <span className="qc-mark">"</span>
      <div className="qc-text">{QUOTES[idx].text}</div>
      <div className="qc-author">{QUOTES[idx].author}</div>
    </div>
  );

  return (
    <div className="quote-card"
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
      style={{userSelect:"none", cursor:"ew-resize", position:"relative"}}>
      <style>{QUOTE_SLIDE_CSS}</style>
      <div className="qc-blob"/>

      {/* fixed-height slide track — no layout shift ever */}
      <div style={{position:"relative", height:QUOTE_HEIGHT, overflow:"hidden"}}>
        {/* current — sits still, or slides out */}
        <Slide idx={cur}
          anim={incoming !== null ? (dir==="l" ? "qs-out-l" : "qs-out-r") : null}/>
        {/* incoming — slides in */}
        {incoming !== null && (
          <Slide idx={incoming}
            anim={dir==="l" ? "qs-in-l" : "qs-in-r"}/>
        )}
      </div>

      {/* dots + swipe hint — below the track, never overlapped by tap zones */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        marginTop:12, position:"relative", zIndex:4}}>
        {/* prev tap */}
        <div onClick={goPrev}
          style={{padding:"4px 8px",cursor:"pointer",color:T.textDim,fontSize:14,
            lineHeight:1,borderRadius:6,userSelect:"none"}}>‹</div>

        {/* dots */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {QUOTES.map((_,i) => (
            <div key={i}
              onClick={e=>{ e.stopPropagation(); goTo(i, i>cur?"l":"r"); }}
              style={{
                width: i===cur ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i===cur ? T.accent : T.border,
                transition:"width .25s ease, background .25s ease",
                cursor:"pointer",
              }}/>
          ))}
        </div>

        {/* next tap */}
        <div onClick={goNext}
          style={{padding:"4px 8px",cursor:"pointer",color:T.textDim,fontSize:14,
            lineHeight:1,borderRadius:6,userSelect:"none"}}>›</div>
      </div>
    </div>
  );
};

const HomeScreen = ({onOpenTool, onOpenPlan, profile, nextRace, dateStr, greeting, doneSessions, setDoneSessions, qi, setQi}) => {
  const t = useT();
  const name = profile?.name || "Athlete";
  const firstName = name.split(" ")[0];

  const toggleSession = (id) => setDoneSessions(d => ({...d, [id]: !d[id]}));

  const wlData = [
    {sport:"swim", icon:"🏊", color:T.swim, val:"3.2h", pct:65},
    {sport:"bike", icon:"🚴", color:T.bike, val:"5.8h", pct:88},
    {sport:"run",  icon:"🏃", color:T.run,  val:"2.4h", pct:45},
  ];

  const quickTools = [
    {id:"pace",    icon:"⏱",  label:"Pace Calc"},
    {id:"cadence", icon:"🎵",  label:"Cadence"},
    {id:"hr",      icon:"❤️", label:"HR Zones"},
    {id:"split",   icon:"🔱",  label:"Splits"},
  ];

  /* race countdown sport icon */
  const raceIcon = nextRace ? SP[nextRace.sport]?.icon : "🏁";

  return (
    <div className="scroll">
      {/* Greeting */}
      <div className="home-greeting">
        <div className="hg-date">{dateStr}</div>
        <div className="hg-name">{greeting},<br/><span>{firstName} 👋</span></div>
      </div>

      {/* Motivational quote — swipe left/right or tap dots */}
      <QuoteCard qi={qi} setQi={setQi}/>

      {/* Race countdown — live from Events favourites */}
      {nextRace ? (
        <div className="race-cd">
          <div className="rcd-icon">{raceIcon}</div>
          <div className="rcd-info">
            <div className="rcd-name">{nextRace.name}</div>
            <div className="rcd-loc">📍 {nextRace.location} · {nextRace.date}</div>
          </div>
          <div className="rcd-right">
            <div className="rcd-days">{nextRace.days}</div>
            <div className="rcd-lbl">{t("home_days_to_go")}</div>
          </div>
        </div>
      ) : (
        /* No race saved — nudge to Events */
        <div style={{margin:"14px 20px 0",background:T.card,border:`1px dashed ${T.border}`,
          borderRadius:22,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,
          cursor:"pointer"}} onClick={()=>{}}>
          <div style={{width:48,height:48,borderRadius:14,background:T.surface,
            border:`1px solid ${T.border}`,display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:22,flexShrink:0}}>📅</div>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
              fontSize:15,color:T.textMid}}>{t("home_no_race")}</div>
            <div style={{fontSize:12,color:T.textDim,marginTop:2}}>
              {t("home_no_race_sub")}
            </div>
          </div>
        </div>
      )}

      {/* Weekly load */}
      <div className="week-load">
        <div className="wl-top">
          <span className="wl-title">{t("home_this_week")}</span>
          <span className="wl-total">11.4h {t("home_total")}</span>
        </div>
        <div className="wl-bars">
          {wlData.map(w => (
            <div key={w.sport} className="wl-col">
              <div className="wl-track">
                <div className="wl-fill" style={{
                  height:`${w.pct}%`,
                  background:`${w.color}44`,
                  borderTop:`2px solid ${w.color}`,
                }}/>
              </div>
              <span className="wl-icon">{w.icon}</span>
              <span className="wl-val" style={{color:w.color}}>{w.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's plan — checkboxes persist across tab switches */}
      <span className="seclbl">{t("home_today")}</span>
      <div className="today-plan">
        <div className="tp-header">
          <span className="tp-title">{t("home_week_plan")}</span>
          <span className="tp-count"
            style={{cursor:"pointer",color:T.accent,fontWeight:700,fontSize:12}}
            onClick={onOpenPlan}>
            {t("home_see_plan")}
          </span>
        </div>
        {TODAY_SESSIONS.length === 0 ? (
          /* Empty state — no active plan */
          <div style={{padding:"28px 20px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:10}}>🗓</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:16,color:T.textMid,marginBottom:6}}>{t("home_no_sessions")}</div>
            <div style={{fontSize:12,color:T.textDim,lineHeight:1.5,marginBottom:16}}>
              {t("home_no_sessions_sub")}
            </div>
            <div onClick={onOpenPlan}
              style={{display:"inline-block",padding:"8px 18px",borderRadius:10,
                background:`${T.accent}22`,color:T.accent,cursor:"pointer",
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:.5}}>
              {t("home_choose_plan")}
            </div>
          </div>
        ) : (<>
          {/* Done progress bar */}
          {(() => {
            const doneCount = TODAY_SESSIONS.filter(s => doneSessions[s.id]).length;
            return doneCount > 0 ? (
              <div style={{padding:"6px 16px",borderBottom:`1px solid ${T.borderSub}`,
                display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1,height:3,background:T.surface,borderRadius:2,overflow:"hidden"}}>
                  <div style={{width:`${(doneCount/TODAY_SESSIONS.length)*100}%`,
                    height:"100%",background:T.accent,borderRadius:2,transition:"width .3s"}}/>
                </div>
                <span style={{fontSize:11,color:T.textMid,fontWeight:600,whiteSpace:"nowrap"}}>
                  {doneCount}/{TODAY_SESSIONS.length} done
                </span>
              </div>
            ) : null;
          })()}
          {TODAY_SESSIONS.map(s => {
            const done = !!doneSessions[s.id];
            const sport = SP[s.sport];
            return (
              <div key={s.id} className={`tp-session ${done?"done":""}`}>
                <div className="tp-sport-dot" style={{background:sport.color}}/>
                <div className="tp-info">
                  <div className="tp-name">{s.title}</div>
                  <div className="tp-detail">{s.detail}</div>
                </div>
                <div className="tp-right">
                  <span className="tp-dur">{s.duration}</span>
                  <span className="tp-type" style={{background:`${sport.color}22`,color:sport.color}}>{s.type}</span>
                  <span className="tp-check" onClick={()=>toggleSession(s.id)}>
                    {done ? "✅" : "⬜"}
                  </span>
                </div>
              </div>
            );
          })}
        </>)}
      </div>

      {/* Quick tools */}
      <span className="seclbl">{t("home_quick_tools")}</span>
      <div className="qs-row">
        {quickTools.map(t => (
          <div key={t.id} className="qs-btn" onClick={()=>onOpenTool(t)}>
            <span className="qs-icon">{t.icon}</span>
            <span className="qs-lbl">{t.label}</span>
          </div>
        ))}
      </div>

      {/* Training plan selector */}
      <span className="seclbl">{t("home_plans")}</span>
      <div className="plan-template">
        {[
          {icon:"🔱",name:"Ironman 70.3",meta:"16 weeks · Intermediate",active:true,sport:"tri"},
          {icon:"🏃",name:"Marathon",    meta:"18 weeks · Beginner",    active:false,sport:"run"},
          {icon:"🚴",name:"Gran Fondo",  meta:"12 weeks · Advanced",    active:false,sport:"bike"},
        ].map(p => (
          <div key={p.name} className="pt-row" onClick={onOpenPlan}>
            <div className="pt-icon" style={{background:SP[p.sport].bg}}>{p.icon}</div>
            <div className="pt-info">
              <div className="pt-name">{p.name}</div>
              <div className="pt-meta">{p.meta}</div>
            </div>
            {p.active && <span className="pt-active">{t("plan_active")}</span>}
            <span style={{color:T.textDim,fontSize:14}}>›</span>
          </div>
        ))}
        <div className="pt-row" style={{cursor:"pointer"}}>
          <div className="pt-icon" style={{background:T.surface,border:`1px dashed ${T.border}`,fontSize:20}}>✨</div>
          <div className="pt-info">
            <div className="pt-name" style={{color:T.textMid}}>AI Plan</div>
            <div className="pt-meta">Personalised · Coming soon</div>
          </div>
          <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,
            background:"#1a1a0a",color:T.textDim,letterSpacing:.5}}>SOON</span>
        </div>
      </div>
      <div style={{height:8}}/>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   TRAINING PLAN OVERLAY
═══════════════════════════════════════════════════════════ */
const PlanOverlay = ({onBack}) => {
  const t = useT();
  const [checked, setChecked] = useState({});
  const toggle = id => setChecked(c => ({...c,[id]:!c[id]}));
  const week = PLAN_WEEKS[0];
  return (
    <div className="overlay">
      <div className="ov-head">
        <div className="ov-back" onClick={onBack}><span className="ov-back-arr">←</span><span className="ov-back-lbl">{t("nav_home")}</span></div>
        <div className="ov-sport-row">
          <span style={{fontSize:16}}>🔱</span>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:T.tri}}>{t("tools_tab_tri")}</span>
        </div>
        <div className="ov-title">Ironman 70.3 Plan</div>
      </div>
      <div className="ov-body">
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {[{l:t("plan_duration"),v:"16 weeks"},{l:t("plan_level"),v:"Intermediate"},{l:t("plan_race"),v:"June 15"}].map(m=>(
            <div key={m.l} style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:10,fontWeight:700,color:T.textDim,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>{m.l}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,color:T.text}}>{m.v}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:T.text}}>Week 1 of 16</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{height:4,width:120,background:T.surface,borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${(1/16)*100}%`,height:"100%",background:T.tri,borderRadius:2}}/>
            </div>
            <span style={{fontSize:11,color:T.textDim}}>1/16</span>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {week.sessions.map(s => {
            const done = !!checked[s.id] || s.done;
            const sport = SP[s.sport];
            return (
              <div key={s.id} style={{background:T.card,border:`1px solid ${done?T.accent+"33":T.border}`,
                borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12,
                opacity:done?.7:1,cursor:"pointer",transition:"all .15s"}} onClick={()=>toggle(s.id)}>
                <div style={{width:4,borderRadius:4,alignSelf:"stretch",flexShrink:0,background:sport.color}}/>
                <div style={{width:38,height:38,borderRadius:11,background:sport.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{sport.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,
                    color:T.text,textDecoration:done?"line-through":"none"}}>{s.title}</div>
                  <div style={{fontSize:12,color:T.textMid,marginTop:2}}>{s.detail}</div>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,
                      background:`${sport.color}22`,color:sport.color}}>{s.type}</span>
                    <span style={{fontSize:11,color:T.textDim,fontWeight:600}}>{s.duration}</span>
                  </div>
                </div>
                <span style={{fontSize:20,flexShrink:0}}>{done?"✅":"⬜"}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:20,background:"#0f0f0a",border:`1px solid ${T.accent}22`,
          borderRadius:18,padding:18,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:8}}>✨</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:T.text,marginBottom:6}}>
            {t("plan_ai_title")}
          </div>
          <div style={{fontSize:12,color:T.textMid,lineHeight:1.5}}>{t("plan_ai_sub")}</div>
          <div style={{marginTop:12,display:"inline-block",background:`${T.accent}22`,color:T.accent,
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,
            padding:"5px 14px",borderRadius:8,letterSpacing:1}}>{t("plan_ai_badge")}</div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   TOOLS SCREEN + ALL TOOL COMPONENTS
═══════════════════════════════════════════════════════════ */
const PaceCalc = () => {
  const [h,setH]=useState("0");const [m,setM]=useState("45");const [s,setS]=useState("00");
  const [dist,setDist]=useState("10");const [sport,setSport]=useState("run");
  const totalS=(parseInt(h)||0)*3600+(parseInt(m)||0)*60+(parseInt(s)||0);
  const d=parseFloat(dist)||0;const dk=sport==="swim"?d/10:d;
  const pS=dk>0?totalS/dk:0;const pM=Math.floor(pS/60);const pSec=Math.round(pS%60);
  const pace=dk>0?`${pM}:${String(pSec).padStart(2,"0")}`:"--:--";const sp2=SP[sport];
  return(<div>
    <div className="sg" style={{marginBottom:16}}>{["run","bike","swim"].map(s2=>(<button key={s2} className={`sb ${sport===s2?"on":""}`} onClick={()=>setSport(s2)}>{SP[s2].icon} {SP[s2].label}</button>))}</div>
    <div className="cf"><span className="cl">Target Time</span>
      <div className="ci-row"><input className="ci" value={h} onChange={e=>setH(e.target.value)} placeholder="0" style={{flex:1}}/><div className="cu">h</div><input className="ci" value={m} onChange={e=>setM(e.target.value)} placeholder="45" style={{flex:1}}/><div className="cu">m</div><input className="ci" value={s} onChange={e=>setS(e.target.value)} placeholder="00" style={{flex:1}}/><div className="cu">s</div></div>
    </div>
    <div className="cf"><span className="cl">Distance</span><div className="ci-row"><input className="ci" value={dist} onChange={e=>setDist(e.target.value)} placeholder="10"/><div className="cu">{sport==="swim"?"×100m":"km"}</div></div></div>
    <div className="rb" style={{background:`linear-gradient(135deg,${sp2.bg},#0a0a0c)`,border:`1px solid ${sp2.color}33`}}>
      <div className="rb-lbl" style={{color:sp2.color}}>Your Pace</div>
      <div className="rb-val" style={{color:sp2.color}}>{pace}</div>
      <div className="rb-unit">min / {sport==="swim"?"100m":"km"}</div>
    </div>
    <div className="ib">{[["Speed",dk>0&&totalS>0?`${(dk/(totalS/3600)).toFixed(1)} km/h`:"--"],["Marathon equiv",dk>0&&totalS>0?(()=>{const s2=Math.round(pS*42.2);return`${Math.floor(s2/3600)}h ${Math.floor((s2%3600)/60)}m`})():"--"]].map(([l,v])=>(<div className="ir" key={l}><span className="il">{l}</span><span className="iv">{v}</span></div>))}</div>
  </div>);
};

const CadenceBeeper = () => {
  const [bpm,setBpm]=useState(85);const [playing,setPlaying]=useState(false);
  const [beat,setBeat]=useState(false);const [sport,setSport]=useState("run");
  const iRef=useRef(null);const aRef=useRef(null);
  const click=()=>{try{if(!aRef.current)aRef.current=new(window.AudioContext||window.webkitAudioContext)();const c=aRef.current,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=sport==="run"?1046:880;g.gain.setValueAtTime(.35,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.05);o.start(c.currentTime);o.stop(c.currentTime+.06);}catch(e){}setBeat(true);setTimeout(()=>setBeat(false),80);};
  useEffect(()=>{if(playing){click();iRef.current=setInterval(click,(60/bpm)*1000);}else clearInterval(iRef.current);return()=>clearInterval(iRef.current);},[playing,bpm,sport]);
  const presets=sport==="run"?[160,170,175,180,185,190]:[75,80,85,90,95,100];
  return(<div>
    <div className="sg" style={{marginBottom:8}}>{["run","bike"].map(s=>(<button key={s} className={`sb ${sport===s?"on":""}`} onClick={()=>{setSport(s);setPlaying(false);}}>{SP[s].icon} {SP[s].label}</button>))}</div>
    <div style={{textAlign:"center",margin:"8px 0 20px"}}><div className="big-val">{bpm}</div><div className="big-sub">BPM</div></div>
    <div className={`beat ${playing?(beat?"p":"i"):"i"}`}/>
    <input type="range" min={sport==="run"?120:50} max={sport==="run"?220:130} value={bpm} onChange={e=>setBpm(Number(e.target.value))} className="rng"/>
    <button className={`btn ${playing?"btn-danger":"btn-accent"}`} onClick={()=>setPlaying(!playing)}>{playing?"⏹  Stop Beeper":"▶  Start Beeper"}</button>
    <div className="prs" style={{marginTop:14}}>{presets.map(v=>(<button key={v} className={`prb ${bpm===v?"on":""}`} onClick={()=>setBpm(v)}>{v}</button>))}</div>
  </div>);
};

const HRZones = () => {
  const [maxHR,setMaxHR]=useState("185");const [method,setMethod]=useState("maxhr");const [rhr,setRhr]=useState("52");
  const zones=[{z:1,name:"Recovery",pct:[50,60],color:"#4BEBA4"},{z:2,name:"Aerobic",pct:[60,70],color:"#3B9EFF"},{z:3,name:"Tempo",pct:[70,80],color:T.accent},{z:4,name:"Threshold",pct:[80,90],color:"#FF8B3B"},{z:5,name:"VO₂ Max",pct:[90,100],color:"#FF4F6A"}];
  const hr=parseInt(maxHR)||0;const rh=parseInt(rhr)||0;
  const calc=pct=>method==="hrr"?Math.round(rh+(hr-rh)*(pct/100)):Math.round(hr*(pct/100));
  return(<div>
    <div className="sg" style={{marginBottom:16}}>{[{id:"maxhr",l:"Max HR %"},{id:"hrr",l:"HR Reserve"}].map(m=>(<button key={m.id} className={`sb ${method===m.id?"on":""}`} onClick={()=>setMethod(m.id)}>{m.l}</button>))}</div>
    <div className="cf"><span className="cl">Max HR</span><div className="ci-row"><input className="ci" value={maxHR} onChange={e=>setMaxHR(e.target.value)} placeholder="185"/><div className="cu">bpm</div></div></div>
    {method==="hrr"&&<div className="cf"><span className="cl">Resting HR</span><div className="ci-row"><input className="ci" value={rhr} onChange={e=>setRhr(e.target.value)} placeholder="52"/><div className="cu">bpm</div></div></div>}
    <div className="rc">{zones.map(z=>{const lo=calc(z.pct[0]);const hi=calc(z.pct[1]);return(<div key={z.z} className="rr" style={{flexDirection:"column",alignItems:"flex-start",gap:6}}><div style={{display:"flex",alignItems:"center",gap:10,width:"100%"}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:z.color,width:24}}>Z{z.z}</span><span style={{flex:1,fontSize:13,fontWeight:600,color:T.text}}>{z.name}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:z.color}}>{hr>0?`${lo}–${hi}`:"--"} bpm</span></div><div style={{marginLeft:34,width:"calc(100% - 34px)",height:6,background:T.surface,borderRadius:3,overflow:"hidden"}}><div style={{width:`${z.pct[1]}%`,height:"100%",background:z.color+"66",borderRadius:3}}/></div></div>);})}</div>
  </div>);
};

const PowerZones = () => {
  const [ftp,setFtp]=useState("245");
  const zones=[{z:1,name:"Active Recovery",pct:[0,55],color:"#4BEBA4"},{z:2,name:"Endurance",pct:[55,75],color:"#3B9EFF"},{z:3,name:"Tempo",pct:[75,90],color:T.accent},{z:4,name:"Threshold",pct:[90,105],color:"#FF8B3B"},{z:5,name:"VO₂ Max",pct:[105,120],color:"#FF4F6A"},{z:6,name:"Anaerobic",pct:[120,150],color:"#B57BFF"},{z:7,name:"Neuromuscular",pct:[150,999],color:"#FF2255"}];
  const f=parseInt(ftp)||0;
  return(<div><div className="cf"><span className="cl">FTP</span><div className="ci-row"><input className="ci" value={ftp} onChange={e=>setFtp(e.target.value)} placeholder="245"/><div className="cu">W</div></div></div><div className="rc">{zones.map(z=>{const lo=z.pct[0]===0?0:Math.round(f*z.pct[0]/100);const hi=z.pct[1]===999?"Max":Math.round(f*z.pct[1]/100);return(<div key={z.z} className="rr"><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:z.color,width:24}}>Z{z.z}</span><span style={{flex:1,fontSize:13,fontWeight:600,color:T.text}}>{z.name}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:z.color}}>{f>0?`${lo}–${hi}`:"--"} W</span></div>);})}</div><div className="fn">FTP = power sustainable for ~60 min. Test: 20-min all-out × 0.95.</div></div>);
};

const SpeedPace = () => {
  const [speed,setSpeed]=useState("35");const [pace,setPace]=useState("1:42");
  const fromSpeed=v=>{const s=parseFloat(v)||0;if(!s){setPace("");return;}const sp=3600/s;setPace(`${Math.floor(sp/60)}:${String(Math.round(sp%60)).padStart(2,"0")}`);};
  const fromPace=v=>{setPace(v);const p=v.split(":");if(p.length===2){const s=(parseInt(p[0])||0)*60+(parseInt(p[1])||0);if(s>0)setSpeed((3600/s).toFixed(1));}};
  return(<div><div className="cf"><span className="cl">Speed</span><div className="ci-row"><input className="ci" value={speed} onChange={e=>{setSpeed(e.target.value);fromSpeed(e.target.value);}}/><div className="cu">km/h</div></div></div><div style={{textAlign:"center",fontSize:20,color:T.textDim,margin:"8px 0"}}>⇅</div><div className="cf"><span className="cl">Pace</span><div className="ci-row"><input className="ci" value={pace} onChange={e=>fromPace(e.target.value)} placeholder="1:42"/><div className="cu">min/km</div></div></div><div className="ib">{[["40km bike",speed?`${(40/parseFloat(speed)).toFixed(2)}h`:"--"],["90km bike",speed?`${(90/parseFloat(speed)).toFixed(2)}h`:"--"]].map(([l,v])=>(<div className="ir" key={l}><span className="il">{l}</span><span className="iv">{v}</span></div>))}</div></div>);
};

const RacePredictor = () => {
  const [kd,setKd]=useState("10");const [kt,setKt]=useState("42");const [td2,setTd2]=useState("42.2");
  const t1=(parseFloat(kt)||0)*60;const d1=parseFloat(kd)||0;const d2=parseFloat(td2)||0;
  const t2=d1>0&&t1>0?t1*Math.pow(d2/d1,1.06):0;
  const fmt=s=>s>0?`${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m ${Math.round(s%60)}s`:"--";
  const pace=(s,d)=>d>0&&s>0?`${Math.floor(s/d/60)}:${String(Math.round(s/d%60)).padStart(2,"0")}/km`:"--";
  return(<div><div className="cf"><span className="cl">Known Result</span><div className="ci-row"><input className="ci" value={kd} onChange={e=>setKd(e.target.value)} placeholder="10" style={{flex:1}}/><div className="cu">km</div><input className="ci" value={kt} onChange={e=>setKt(e.target.value)} placeholder="42" style={{flex:1}}/><div className="cu">min</div></div></div><div className="cf"><span className="cl">Target Distance</span><div className="ci-row"><input className="ci" value={td2} onChange={e=>setTd2(e.target.value)} placeholder="42.2"/><div className="cu">km</div></div><div className="prs" style={{marginTop:8}}>{[{l:"5K",v:"5"},{l:"10K",v:"10"},{l:"HM",v:"21.1"},{l:"Mar",v:"42.2"}].map(p=>(<button key={p.l} className={`prb ${td2===p.v?"on":""}`} onClick={()=>setTd2(p.v)}>{p.l}</button>))}</div></div><div className="rb" style={{background:`linear-gradient(135deg,${T.runBg},#0a0a0c)`,border:`1px solid ${T.run}33`}}><div className="rb-lbl" style={{color:T.run}}>Predicted</div><div className="rb-val" style={{color:T.run,fontSize:32}}>{fmt(t2)}</div><div className="rb-unit">{pace(t2,d2)}</div></div><div className="fn">Riegel formula (1977)</div></div>);
};

const NutritionCalc = () => {
  const [hours,setHours]=useState("4");const [mins2,setMins2]=useState("30");const [intensity,setInt]=useState("moderate");
  const dur=(parseFloat(hours)||0)+(parseFloat(mins2)||0)/60;
  const cr={low:40,moderate:60,high:90}[intensity];const fr={low:500,moderate:700,high:900}[intensity];
  const tc=Math.round(cr*dur);const tf=Math.round(fr*dur/1000*10)/10;
  return(<div><div className="cf"><span className="cl">Race Duration</span><div className="ci-row"><input className="ci" value={hours} onChange={e=>setHours(e.target.value)} placeholder="4" style={{flex:1}}/><div className="cu">h</div><input className="ci" value={mins2} onChange={e=>setMins2(e.target.value)} placeholder="30" style={{flex:1}}/><div className="cu">m</div></div></div><div className="cf"><span className="cl">Intensity</span><div className="sg">{[{id:"low",l:"Low"},{id:"moderate",l:"Moderate"},{id:"high",l:"High"}].map(i=>(<button key={i.id} className={`sb ${intensity===i.id?"on":""}`} onClick={()=>setInt(i.id)}>{i.l}</button>))}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[{label:"Carbs",val:`${tc}g`,color:T.accent,sub:`${cr}g/hr`},{label:"Fluid",val:`${tf}L`,color:T.swim,sub:`${fr}ml/hr`},{label:"Sodium",val:`${Math.round(500*dur)}mg`,color:T.bike,sub:"500mg/hr"},{label:"Gels",val:`${Math.ceil(tc/25)}`,color:T.run,sub:"×25g"}].map(c=>(<div key={c.label} className="rb" style={{background:`${c.color}11`,border:`1px solid ${c.color}33`,margin:0}}><div className="rb-lbl" style={{color:c.color,fontSize:10}}>{c.label}</div><div className="rb-val" style={{color:c.color,fontSize:32}}>{c.val}</div><div className="rb-unit">{c.sub}</div></div>))}</div></div>);
};

const SwolfCalc = () => {
  const [strokes,setStrokes]=useState("18");const [secs,setSecs]=useState("45");const [pool,setPool]=useState("50");
  const sw2=(parseInt(strokes)||0)+(parseInt(secs)||0);const rc2=sw2===0?T.textDim:sw2<30?T.accent:sw2<35?T.run:sw2<40?T.bike:T.heart;
  const rating=sw2===0?null:sw2<30?"Elite":sw2<35?"Advanced":sw2<40?"Intermediate":"Developing";
  return(<div><div className="sg" style={{marginBottom:16}}>{[{v:"25",l:"25m"},{v:"50",l:"50m"}].map(p=>(<button key={p.v} className={`sb ${pool===p.v?"on":""}`} onClick={()=>setPool(p.v)}>{p.l}</button>))}</div><div className="cf"><span className="cl">Strokes / Length</span><div className="ci-row"><input className="ci" value={strokes} onChange={e=>setStrokes(e.target.value)} placeholder="18"/><div className="cu">strokes</div></div></div><div className="cf"><span className="cl">Time / Length</span><div className="ci-row"><input className="ci" value={secs} onChange={e=>setSecs(e.target.value)} placeholder="45"/><div className="cu">sec</div></div></div><div className="rb" style={{background:T.swimBg,border:`1px solid ${T.swim}33`}}><div className="rb-lbl" style={{color:T.swim}}>SWOLF Score</div><div className="rb-val" style={{color:rc2}}>{sw2||"--"}</div><div className="rb-unit">{rating||"enter values"}</div></div></div>);
};

const WetsuitGuide = () => {
  const [temp,setTemp]=useState("18");const t=parseFloat(temp)||0;
  const rules=[{min:0,max:14,icon:"🧊",label:"Below 14°C",status:"Cold — extra thermal gear needed",badge:"DANGER",bc:"#3B9EFF"},{min:14,max:16,icon:"🌊",label:"14–16°C",status:"Wetsuit mandatory",badge:"REQUIRED",bc:T.swim},{min:16,max:22,icon:"✅",label:"16–22°C",status:"Wetsuit allowed",badge:"ALLOWED",bc:T.run},{min:22,max:24,icon:"⚠️",label:"22–24°C",status:"Wetsuit optional",badge:"OPTIONAL",bc:T.accent},{min:24,max:26,icon:"🚫",label:"24–26°C",status:"Wetsuit banned",badge:"BANNED",bc:T.bike},{min:26,max:99,icon:"🔥",label:"Above 26°C",status:"No wetsuit — heat risk",badge:"TOO HOT",bc:T.heart}];
  const cur=rules.find(r=>t>=r.min&&t<r.max)||rules[5];
  return(<div><div className="cf"><span className="cl">Water Temp</span><div className="ci-row"><input className="ci" value={temp} onChange={e=>setTemp(e.target.value)} placeholder="18"/><div className="cu">°C</div></div></div>{t>0&&<div className="rb" style={{background:`${cur.bc}11`,border:`1px solid ${cur.bc}44`,marginBottom:14}}><div style={{fontSize:32,marginBottom:8}}>{cur.icon}</div><div className="rb-lbl" style={{color:cur.bc}}>{cur.badge}</div><div style={{fontSize:14,color:T.text,marginTop:6,fontWeight:500}}>{cur.status}</div></div>}<div className="rc">{rules.map(r=>(<div key={r.label} className="rr" style={{background:t>=r.min&&t<r.max?r.bc+"11":"transparent"}}><span style={{fontSize:18,width:24}}>{r.icon}</span><span style={{flex:1,fontSize:13,color:T.text}}>{r.label}</span><span style={{fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:6,background:r.bc+"22",color:r.bc}}>{r.badge}</span></div>))}</div></div>);
};

const CalorieBurn = () => {
  const [weight,setWeight]=useState("72");const [hours,setHours]=useState("1");const [mins2,setMins2]=useState("30");
  const [sport,setSport]=useState("run");const [intensity,setInt]=useState("moderate");
  const mets={swim:{low:5.8,moderate:8.3,high:10},bike:{low:5.5,moderate:8,high:12},run:{low:7,moderate:9.8,high:14.5},tri:{low:8,moderate:10.5,high:13}};
  const w=parseFloat(weight)||0;const dur=(parseFloat(hours)||0)+(parseFloat(mins2)||0)/60;
  const met=mets[sport][intensity];const kcal=Math.round(met*w*dur);const sp2=SP[sport];
  return(<div><div className="sg" style={{marginBottom:12}}>{["swim","bike","run","tri"].map(s=>(<button key={s} className={`sb ${sport===s?"on":""}`} onClick={()=>setSport(s)}>{SP[s].icon} {SP[s].label}</button>))}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div className="cf" style={{margin:0}}><span className="cl">Weight</span><div className="ci-row"><input className="ci" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="72"/><div className="cu">kg</div></div></div><div className="cf" style={{margin:0}}><span className="cl">Duration</span><div className="ci-row"><input className="ci" value={hours} onChange={e=>setHours(e.target.value)} placeholder="1" style={{flex:1}}/><div className="cu">h</div><input className="ci" value={mins2} onChange={e=>setMins2(e.target.value)} placeholder="30" style={{flex:1}}/><div className="cu">m</div></div></div></div><div className="cf" style={{marginTop:12}}><span className="cl">Intensity</span><div className="sg">{[{id:"low",l:"Easy"},{id:"moderate",l:"Moderate"},{id:"high",l:"Hard"}].map(i=>(<button key={i.id} className={`sb ${intensity===i.id?"on":""}`} onClick={()=>setInt(i.id)}>{i.l}</button>))}</div></div><div className="rb" style={{background:`linear-gradient(135deg,${sp2.bg},#0a0a0c)`,border:`1px solid ${sp2.color}33`}}><div className="rb-lbl" style={{color:sp2.color}}>Calories Burned</div><div className="rb-val" style={{color:sp2.color}}>{w>0&&dur>0?kcal:"--"}</div><div className="rb-unit">kcal · MET {met}</div></div></div>);
};

const SplitPlanner = () => {
  const [total,setTotal]=useState("4");const [totM,setTotM]=useState("38");const [dist,setDist]=useState("olympic");
  const dists={sprint:{swim:.75,bike:20,run:5,label:"Sprint"},olympic:{swim:1.5,bike:40,run:10,label:"Olympic"},"70.3":{swim:1.9,bike:90,run:21.1,label:"70.3"},ironman:{swim:3.8,bike:180,run:42.2,label:"Ironman"}};
  const d=dists[dist];const totalSec=(parseInt(total)||0)*3600+(parseInt(totM)||0)*60;
  const splits=[{leg:"Swim",icon:"🏊",color:T.swim,pct:.13,dist:`${d.swim}km`},{leg:"T1",icon:"🔄",color:T.textMid,pct:.02,dist:"T1"},{leg:"Bike",icon:"🚴",color:T.bike,pct:.51,dist:`${d.bike}km`},{leg:"T2",icon:"🔄",color:T.textMid,pct:.015,dist:"T2"},{leg:"Run",icon:"🏃",color:T.run,pct:.335,dist:`${d.run}km`}];
  const fmt=s=>s<3600?`${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,"0")}`:`${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m`;
  return(<div><div className="sg" style={{marginBottom:16}}>{Object.entries(dists).map(([k,v])=>(<button key={k} className={`sb ${dist===k?"on":""}`} onClick={()=>setDist(k)}>{v.label}</button>))}</div><div className="cf"><span className="cl">Target Time</span><div className="ci-row"><input className="ci" value={total} onChange={e=>setTotal(e.target.value)} placeholder="4" style={{flex:1}}/><div className="cu">h</div><input className="ci" value={totM} onChange={e=>setTotM(e.target.value)} placeholder="38" style={{flex:1}}/><div className="cu">m</div></div></div><div className="rc">{splits.map(sp2=>{const ls=totalSec*sp2.pct;return(<div key={sp2.leg} className="rr"><div style={{fontSize:18,width:24}}>{sp2.icon}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{sp2.leg}</div><div style={{fontSize:11,color:T.textDim}}>{sp2.dist}</div></div><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:sp2.color}}>{totalSec>0?fmt(ls):"--"}</span></div>);})}</div></div>);
};

const TransitionEstimator = () => {
  const [exp,setExp]=useState("intermediate");const [t1e,setT1e]=useState("0");const [t2e,setT2e]=useState("0");
  const base={beginner:{t1:300,t2:240},intermediate:{t1:180,t2:150},advanced:{t1:90,t2:75},elite:{t1:60,t2:50}};
  const b=base[exp];const t1=b.t1+(parseInt(t1e)||0)*60;const t2=b.t2+(parseInt(t2e)||0)*60;
  const fmt=s=>`${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,"0")}`;
  return(<div><div className="cf"><span className="cl">Experience</span><div className="sg">{[{id:"beginner",l:"Beginner"},{id:"intermediate",l:"Intermediate"},{id:"advanced",l:"Advanced"},{id:"elite",l:"Elite"}].map(e=>(<button key={e.id} className={`sb ${exp===e.id?"on":""}`} onClick={()=>setExp(e.id)}>{e.l}</button>))}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>{[{l:"T1",v:fmt(t1),c:T.tri},{l:"T2",v:fmt(t2),c:T.tri},{l:"Total",v:fmt(t1+t2),c:T.accent}].map(c=>(<div key={c.l} className="rb" style={{background:T.triBg,border:`1px solid ${T.tri}33`,margin:0}}><div className="rb-lbl" style={{color:c.c,fontSize:10}}>{c.l}</div><div className="rb-val" style={{color:c.c,fontSize:28}}>{c.v}</div></div>))}</div><div className="rc">{["Remove wetsuit","Helmet buckled","Shoes on bike","Rack bike","Switch shoes","Race belt"].map((item,i)=>(<div key={item} className="rr"><div style={{fontSize:16,width:24}}>{i<3?"🔵":"🟢"}</div><div style={{flex:1,fontSize:13,fontWeight:500,color:T.text}}>{item}</div><div style={{fontSize:11,color:T.textDim}}>{i<3?"T1":"T2"}</div></div>))}</div></div>);
};

const RaceChecklist = () => {
  const [raceType,setRaceType]=useState("tri");const [checked,setChecked]=useState({});
  const toggle=id=>setChecked(c=>({...c,[id]:!c[id]}));
  const allItems={tri:[{id:"wetsuit",cat:"Swim",text:"Wetsuit"},{id:"goggles",cat:"Swim",text:"Goggles + spare"},{id:"cap",cat:"Swim",text:"Swim cap"},{id:"helmet",cat:"Bike",text:"Helmet — buckled"},{id:"bike",cat:"Bike",text:"Bike race-ready"},{id:"bottles",cat:"Bike",text:"Bottles filled"},{id:"shoes-r",cat:"Run",text:"Running shoes"},{id:"belt",cat:"Run",text:"Number belt"},{id:"gels",cat:"Nutrition",text:"Gels / chews"},{id:"timing",cat:"General",text:"Timing chip"}],run:[{id:"shoes",cat:"Gear",text:"Running shoes"},{id:"bib",cat:"Gear",text:"Race bib"},{id:"watch",cat:"Gear",text:"GPS watch charged"},{id:"gels-r",cat:"Nutrition",text:"Gels"}],bike:[{id:"helmet-b",cat:"Safety",text:"Helmet buckled"},{id:"tires",cat:"Gear",text:"Tires pumped"},{id:"bottles-b",cat:"Nutrition",text:"Bottles filled"}]};
  const items=allItems[raceType]||[];const doneCount=items.filter(i=>checked[i.id]).length;
  let lastCat="";
  return(<div><div className="sg" style={{marginBottom:12}}>{[{id:"tri",l:"🔱 Tri"},{id:"run",l:"🏃 Run"},{id:"bike",l:"🚴 Bike"}].map(r=>(<button key={r.id} className={`sb ${raceType===r.id?"on":""}`} onClick={()=>{setRaceType(r.id);setChecked({});}}>{r.l}</button>))}</div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,fontWeight:600,color:T.textMid}}>{doneCount}/{items.length}</span><div style={{flex:1,height:4,background:T.surface,borderRadius:2,margin:"0 12px",overflow:"hidden"}}><div style={{width:`${(doneCount/items.length)*100}%`,height:"100%",background:T.accent,borderRadius:2,transition:"width .3s"}}/></div><button onClick={()=>setChecked({})} style={{fontSize:11,color:T.textDim,background:"none",border:"none",cursor:"pointer"}}>Reset</button></div><div className="rc">{items.map(item=>{const showCat=item.cat!==lastCat;lastCat=item.cat;return(<div key={item.id}>{showCat&&<div style={{padding:"10px 16px 4px",fontSize:10,fontWeight:700,color:T.textDim,letterSpacing:1.5,textTransform:"uppercase"}}>{item.cat}</div>}<div className="chi" onClick={()=>toggle(item.id)}><div className={`chb ${checked[item.id]?"done":""}`}>{checked[item.id]&&<span style={{fontSize:13,color:"#000"}}>✓</span>}</div><span className={`cht ${checked[item.id]?"done":""}`}>{item.text}</span></div></div>);})}</div></div>);
};

const TaperCalc = () => {
  const [raceType,setRaceType]=useState("olympic");const [weeksOut,setWeeksOut]=useState("8");
  const td={sprint:{weeks:2,base:[{s:100,b:100,r:100},{s:70,b:70,r:70},{s:100,b:100,r:100}]},olympic:{weeks:3,base:[{s:100,b:100,r:100},{s:80,b:80,r:80},{s:60,b:60,r:60},{s:100,b:100,r:100}]},"70.3":{weeks:3,base:[{s:100,b:100,r:100},{s:85,b:85,r:85},{s:65,b:65,r:65},{s:40,b:40,r:40},{s:100,b:100,r:100}]},ironman:{weeks:4,base:[{s:100,b:100,r:100},{s:90,b:90,r:90},{s:70,b:70,r:70},{s:50,b:50,r:50},{s:30,b:30,r:30},{s:100,b:100,r:100}]}};
  const d=td[raceType];const phases=d.base.map((p,i)=>({...p,label:i===d.base.length-1?"🏁 Race Week":`Week ${(parseInt(weeksOut)||8)-(d.base.length-1-i)}`,isTaper:i>=d.base.length-d.weeks-1&&i<d.base.length-1,isRace:i===d.base.length-1})).filter((p,i)=>(parseInt(weeksOut)||8)-(d.base.length-1-i)>0||p.isRace);
  return(<div><div className="sg" style={{marginBottom:12}}>{[{id:"sprint",l:"Sprint"},{id:"olympic",l:"Olympic"},{id:"70.3",l:"70.3"},{id:"ironman",l:"Ironman"}].map(r=>(<button key={r.id} className={`sb ${raceType===r.id?"on":""}`} onClick={()=>setRaceType(r.id)}>{r.l}</button>))}</div><div className="cf"><span className="cl">Weeks to Race</span><div className="ci-row"><input className="ci" value={weeksOut} onChange={e=>setWeeksOut(e.target.value)} placeholder="8"/><div className="cu">weeks</div></div></div>{phases.map((p,i)=>(<div key={i} className="tw" style={p.isRace?{borderColor:`${T.accent}66`,background:`${T.accent}08`}:p.isTaper?{borderColor:`${T.tri}44`}:{}}><div className="tw-h"><span className="tw-l" style={p.isRace?{color:T.accent}:{}}>{p.label}</span><span className="tw-v" style={{color:p.isRace?T.accent:p.isTaper?T.tri:T.textMid}}>{p.isRace?"🏁 Race Day":`${p.s}% volume`}</span></div>{!p.isRace&&<div className="tw-bars">{[{k:"s",c:T.swim,l:"Swim"},{k:"b",c:T.bike,l:"Bike"},{k:"r",c:T.run,l:"Run"}].map(bar=>(<div key={bar.k} className="tw-bc"><div className="tw-bt"><div className="tw-bf" style={{height:`${p[bar.k]}%`,background:bar.c+(p.isTaper?"88":"44"),borderTop:`2px solid ${bar.c}`}}/></div><div className="tw-sl" style={{color:bar.c}}>{bar.l}</div></div>))}</div>}</div>))}<div className="fn">Reduce volume, not intensity.</div></div>);
};

const PoolCounter = () => {
  const [poolLen,setPoolLen]=useState("50");const [targetLaps,setTargetLaps]=useState("40");
  const [activeSw,setActiveSw]=useState(0);const [showModal,setShowModal]=useState(false);
  const [newName,setNewName]=useState("");
  const [swimmers,setSwimmers]=useState([{id:1,name:"Lane 1",laps:[],running:false,startTime:null,elapsed:0,lapStart:null}]);
  const [tick,setTick]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>setTick(t=>t+1),100);return()=>clearInterval(iv);},[]);
  const fmt=ms=>{if(ms===null||ms===undefined)return"--:--.--";const s=Math.floor(ms/1000);const mn=Math.floor(s/60);const sc=s%60;const cs=Math.floor((ms%1000)/10);return`${String(mn).padStart(2,"0")}:${String(sc).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;};
  const fmtShort=ms=>{if(!ms)return"--";const s=ms/1000;const mn=Math.floor(s/60);return mn>0?`${mn}:${String(Math.floor(s%60)).padStart(2,"0")}`:`${(s).toFixed(1)}s`;};
  const updSw=(idx,fn)=>setSwimmers(prev=>prev.map((s,i)=>i===idx?fn(s):s));
  const getLiveElapsed=sw=>sw.running?sw.elapsed+(Date.now()-sw.startTime):sw.elapsed;
  const getLiveLap=sw=>sw.running&&sw.lapStart!==null?Date.now()-sw.lapStart:null;
  const handleTap=()=>{const now=Date.now();updSw(activeSw,sw=>{if(!sw.running)return{...sw,running:true,startTime:now,lapStart:now};const lt=now-sw.lapStart;const te=sw.elapsed+(now-sw.startTime);return{...sw,laps:[...sw.laps,{time:lt,total:te}],lapStart:now};});};
  const sw=swimmers[activeSw];const le=getLiveElapsed(sw);const ll=getLiveLap(sw);
  const lc=sw.laps.length;const dist=(lc*parseInt(poolLen)/1000).toFixed(2);
  const tgt=parseInt(targetLaps)||0;const pct=tgt>0?Math.min((lc/tgt)*100,100):0;
  const bestLap=sw.laps.length>0?Math.min(...sw.laps.map(l=>l.time)):null;
  const addSw=()=>{if(!newName.trim())return;setSwimmers(prev=>[...prev,{id:Date.now(),name:newName.trim(),laps:[],running:false,startTime:null,elapsed:0,lapStart:null}]);setActiveSw(swimmers.length);setNewName("");setShowModal(false);};
  const remSw=idx=>{if(swimmers.length===1)return;setSwimmers(prev=>prev.filter((_,i)=>i!==idx));setActiveSw(Math.max(0,activeSw-(idx<=activeSw?1:0)));};
  return(<div>
    <div style={{display:"flex",gap:10,marginBottom:14}}>
      <div style={{flex:1}}><span className="cl">Pool</span><div className="sg" style={{marginTop:4}}>{["25","50"].map(v=>(<button key={v} className={`sb ${poolLen===v?"on":""}`} onClick={()=>setPoolLen(v)} style={{flex:1}}>{v}m</button>))}</div></div>
      <div style={{flex:1}}><span className="cl">Target (laps)</span><div className="ci-row"><input className="ci" value={targetLaps} onChange={e=>setTargetLaps(e.target.value)} placeholder="40" style={{fontSize:18,padding:"10px"}}/></div></div>
    </div>
    <span className="cl">Swimmers</span>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
      <div className="sw-tab-outer" style={{flex:1}}>
        {swimmers.map((s,i)=>(<div key={s.id} className={`swt ${activeSw===i?"on":""}`} onClick={()=>setActiveSw(i)}>
          {swimmers.length>1&&<div className="swt-rm" onClick={e=>{e.stopPropagation();remSw(i);}}>×</div>}
          <div><div style={{fontSize:13,fontWeight:600,color:activeSw===i?T.swim:T.textMid}}>{s.name}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:T.swim}}>{s.laps.length} laps</div></div>
        </div>))}
      </div>
      <button onClick={()=>setShowModal(true)} style={{flexShrink:0,width:36,height:36,borderRadius:10,border:`1px dashed ${T.border}`,background:"transparent",color:T.textDim,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>＋</button>
    </div>
    <div style={{textAlign:"center",padding:"8px 0 4px"}}><div className="pool-num">{lc}</div><div className="pool-dist">{dist} km</div><div className="pool-clock">{fmt(le)}</div><div style={{fontSize:12,color:T.textDim,marginTop:4}}>{sw.running&&ll!==null?`Current lap: ${fmt(ll)}`:lc>0?`Last: ${fmt(sw.laps[lc-1].time)}`:"Tap to start"}</div></div>
    {tgt>0&&<div style={{height:5,background:T.surface,borderRadius:3,overflow:"hidden",margin:"8px 0"}}><div style={{width:`${pct}%`,height:"100%",background:lc>=tgt?T.accent:T.swim,borderRadius:3,transition:"width .2s"}}/></div>}
    <button className="tap-btn" onClick={handleTap}>{!sw.running&&lc===0?"▶  TAP TO START":sw.running?`LAP ${lc+1}  ▸  TAP`:"▶  RESUME"}</button>
    <div style={{display:"flex",gap:8,marginTop:6}}>
      {sw.running?<button style={{flex:1,padding:"12px",borderRadius:14,border:`1px solid ${T.border}`,background:T.card,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,letterSpacing:1,color:T.textMid,cursor:"pointer"}} onClick={()=>{const now=Date.now();updSw(activeSw,s=>({...s,running:false,elapsed:s.elapsed+(now-s.startTime),startTime:null}));}}>⏸ Pause</button>:sw.laps.length>0&&<button style={{flex:1,padding:"12px",borderRadius:14,border:`1px solid ${T.border}`,background:T.card,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:T.textMid,cursor:"pointer"}} onClick={()=>{const now=Date.now();updSw(activeSw,s=>({...s,running:true,startTime:now,lapStart:now}));}}>▶ Resume</button>}
      {lc>0&&<button style={{flex:1,padding:"12px",borderRadius:14,border:`1px solid ${T.border}`,background:T.card,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:T.textMid,cursor:"pointer"}} onClick={()=>updSw(activeSw,s=>({...s,laps:s.laps.slice(0,-1)}))}>↩ Undo</button>}
      {lc>0&&<button style={{flex:1,padding:"12px",borderRadius:14,border:`1px solid ${T.heart}33`,background:T.card,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:T.heart,cursor:"pointer"}} onClick={()=>updSw(activeSw,s=>({...s,laps:[],running:false,startTime:null,elapsed:0,lapStart:null}))}>✕ Reset</button>}
    </div>
    {sw.laps.length>0&&<div style={{marginTop:16}}><div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:T.textDim,marginBottom:8}}>Lap History</div><div className="rc"><div className="lth"><span className="lt">LAP</span><span className="lt">TIME</span><span className="lt">TOTAL</span><span className="lt">Δ AVG</span></div>{[...sw.laps].reverse().map((lap,ri)=>{const i=sw.laps.length-1-ri;const isBest=lap.time===bestLap;const avg=sw.laps.reduce((a,l)=>a+l.time,0)/sw.laps.length;const delta=lap.time-avg;const ds=Math.abs(delta)<500?"±0":(delta<0?"-":"+")+fmtShort(Math.abs(delta));const dc=Math.abs(delta)<500?"e":delta<0?"f":"s";return(<div key={i} className={`lr ${isBest?"best-row":""}`}><span className="ln">{i+1}{isBest&&<span className="badge" style={{background:`${T.accent}22`,color:T.accent}}>★</span>}</span><span className={`ltm ${isBest?"bv":""}`}>{fmt(lap.time)}</span><span className="lsp">{fmt(lap.total)}</span><span className={`ld ${dc}`}>{ds}</span></div>);})}</div>{bestLap&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 2px"}}><span style={{fontSize:11,color:T.textDim}}>Best: <span style={{color:T.accent,fontWeight:700}}>{fmt(bestLap)}</span></span><span style={{fontSize:11,color:T.textDim}}>Avg: {fmt(sw.laps.reduce((a,l)=>a+l.time,0)/sw.laps.length)}</span></div>}</div>}
    {showModal&&<div className="modal-ov" onClick={()=>setShowModal(false)}><div className="modal-sh" onClick={e=>e.stopPropagation()}><div className="modal-hnd"/><div className="modal-t">Add Swimmer</div><input className="modal-in" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Lane 2 / Name" autoFocus onKeyDown={e=>e.key==="Enter"&&addSw()}/><div className="modal-btns"><button className="modal-btn x" onClick={()=>setShowModal(false)}>Cancel</button><button className="modal-btn c" onClick={addSw}>Add Swimmer</button></div></div></div>}
  </div>);
};

/* TOOL DETAIL */
const ToolDetail = ({tool, onBack}) => {
  const t = useT();
  const sp2 = SP[tool.sport];
  const bodies = {pace:<PaceCalc/>,cadence:<CadenceBeeper/>,hr:<HRZones/>,power:<PowerZones/>,split:<SplitPlanner/>,predict:<RacePredictor/>,nutrition:<NutritionCalc/>,swolf:<SwolfCalc/>,speed:<SpeedPace/>,transition:<TransitionEstimator/>,wetsuit:<WetsuitGuide/>,calorie:<CalorieBurn/>,checklist:<RaceChecklist/>,pool:<PoolCounter/>,taper:<TaperCalc/>};
  return(<div className="overlay"><div className="ov-head"><div className="ov-back" onClick={onBack}><span className="ov-back-arr">←</span><span className="ov-back-lbl">{t("nav_tools")}</span></div><div className="ov-sport-row"><span style={{fontSize:16}}>{sp2.icon}</span><span style={{fontSize:11,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:sp2.color}}>{sp2.label}</span></div><div className="ov-title">{t(`tool_${tool.id}`) || tool.name}</div></div><div className="ov-body">{bodies[tool.id]}</div></div>);
};

/* TOOLS SCREEN */
const ToolsScreen = ({onSelect}) => {
  const [activeTab, setActiveTab] = useState("all");
  const t = useT();
  const tabs = [
    {id:"all",  label:t("tools_tab_all")},
    {id:"swim", label:t("tools_tab_swim")},
    {id:"bike", label:t("tools_tab_bike")},
    {id:"run",  label:t("tools_tab_run")},
    {id:"tri",  label:t("tools_tab_tri")},
  ];
  const filtered = activeTab === "all" ? TOOLS : TOOLS.filter(t2 => t2.sport === activeTab);

  return (
    <div style={{display:"flex", flexDirection:"column", flex:1, minHeight:0, overflow:"hidden"}}>
      {/* sticky header + tabs — never scrolls */}
      <div style={{flexShrink:0}}>
        <div className="phd">
          <div className="ptitle">{t("tools_title")}</div>
          <div className="psub">{TOOLS.length} {t("tools_sub")}</div>
        </div>
        {/* tabs — horizontally scrollable, vertically pinned */}
        <div className="stabs"
          onTouchMove={e => {
            // Only block if horizontal movement dominates — prevents vertical scroll steal
            const t2 = e.touches[0];
            if (!e.currentTarget._ts) return;
            const dx = Math.abs(t2.clientX - e.currentTarget._ts.x);
            const dy = Math.abs(t2.clientY - e.currentTarget._ts.y);
            if (dx > dy) e.stopPropagation();
          }}
          onTouchStart={e => {
            e.currentTarget._ts = {x: e.touches[0].clientX, y: e.touches[0].clientY};
          }}>
          {tabs.map(tab => {
            const sp2 = SP[tab.id];
            const cnt = tab.id==="all" ? TOOLS.length : TOOLS.filter(t2=>t2.sport===tab.id).length;
            return (
              <button key={tab.id}
                className={`stab ${activeTab===tab.id?"on":""}`}
                style={{"--tc": sp2.color}}
                onClick={()=>setActiveTab(tab.id)}>
                <span style={{fontSize:15}}>{sp2.icon}</span>
                {tab.label}
                <span className="stab-cnt" style={{
                  background: activeTab===tab.id ? `${sp2.color}22` : T.surface,
                  color: activeTab===tab.id ? sp2.color : T.textDim,
                }}>{cnt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* scrollable tool list only */}
      <div style={{flex:1, overflowY:"auto", scrollbarWidth:"none", paddingBottom:8}}>
        <div style={{display:"flex", flexDirection:"column", gap:8, padding:"14px 20px 0"}}>
          {filtered.map(tool => {
            const sp2 = SP[tool.sport];
            return (
              <div key={tool.id}
                style={{background:T.card, border:`1px solid ${T.border}`, borderRadius:18,
                  padding:"14px 16px", display:"flex", alignItems:"center", gap:12,
                  cursor:"pointer", transition:"border-color .15s"}}
                onClick={()=>onSelect(tool)}>
                <div style={{width:4, borderRadius:4, alignSelf:"stretch", flexShrink:0, background:sp2.color}}/>
                <div style={{width:42, height:42, borderRadius:12, background:sp2.bg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, flexShrink:0}}>{tool.icon}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700,
                    fontSize:16, color:T.text}}>{t(`tool_${tool.id}`) || tool.name}</div>
                  <div style={{fontSize:12, color:T.textMid, marginTop:2}}>
                    {t(`tool_${tool.id}_desc`) || tool.desc}
                  </div>
                </div>
                <span style={{fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:6,
                  background:sp2.bg, color:sp2.color, letterSpacing:.5,
                  textTransform:"uppercase", flexShrink:0}}>{tool.tag}</span>
                <span style={{color:T.textDim, fontSize:16}}>›</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   EVENTS SCREEN
═══════════════════════════════════════════════════════════ */
/* ── Event Detail Overlay ── */
const EventDetail = ({ev, isFav, onToggleFav, onBack}) => {
  const t = useT();
  const sp2 = SP[ev.sport];
  const isPast = ev.days < 0;
  const infoRows = [
    {icon:"📅", label:t("events_date"),     val: ev.date},
    {icon:"📍", label:t("events_location"), val: ev.location},
    {icon:"🏅", label:t("events_dist"),     val: ev.dist},
    {icon:"🏷",  label:t("events_sport"),    val: sp2.label},
    {icon:"🌐", label:"Type",               val: ev.global ? "Public Event" : "Personal Event"},
  ];
  if (ev.notes) infoRows.push({icon:"📝", label:t("events_notes"), val: ev.notes});

  const countdownMsg = ev.days > 60 ? "Plenty of time to prepare"
    : ev.days > 14 ? "Final build phase — stay focused"
    : ev.days > 3  ? "Race week — taper and rest"
    : "Almost race day! 🔥";

  return (
    <div className="overlay">
      <div style={{background:`linear-gradient(160deg,${sp2.bg} 0%,${T.bg} 100%)`,
        borderBottom:`1px solid ${sp2.color}33`,padding:"52px 20px 24px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div className="ov-back" onClick={onBack} style={{margin:0}}>
            <span className="ov-back-arr">←</span>
            <span className="ov-back-lbl">{t("nav_events")}</span>
          </div>
          <button onClick={onToggleFav}
            style={{background:isFav?`${T.accent}22`:"transparent",
              border:`1px solid ${isFav?T.accent:T.border}`,
              borderRadius:12,padding:"8px 14px",cursor:"pointer",
              fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:13,
              color:isFav?T.accent:T.textMid,display:"flex",alignItems:"center",gap:6}}>
            {isFav?`⭐ ${t("done")}`:`☆ ${t("save")}`}
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:`${sp2.color}22`,
            border:`1px solid ${sp2.color}44`,display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:18}}>{sp2.icon}</div>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:1.5,
            textTransform:"uppercase",color:sp2.color}}>{sp2.label}</span>
          <span style={{fontSize:11,fontWeight:600,background:T.surface,
            color:T.textMid,padding:"3px 8px",borderRadius:6}}>{ev.dist}</span>
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:26,color:T.text,letterSpacing:.3,lineHeight:1.2,marginBottom:4}}>
          {ev.name}
        </div>
        <div style={{fontSize:13,color:T.textMid}}>📍 {ev.location}</div>
      </div>
      <div className="ov-body">
        {!isPast ? (
          <div style={{background:`${sp2.color}0f`,border:`1px solid ${sp2.color}33`,
            borderRadius:20,padding:"20px",textAlign:"center",marginBottom:20}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:72,color:sp2.color,lineHeight:1}}>{ev.days}</div>
            <div style={{fontSize:12,fontWeight:700,color:T.textMid,letterSpacing:2,
              textTransform:"uppercase",marginTop:4}}>{t("home_days_to_go")}</div>
            <div style={{height:4,background:T.surface,borderRadius:2,overflow:"hidden",marginTop:16}}>
              <div style={{height:"100%",borderRadius:2,background:sp2.color,
                width:`${Math.min(100,Math.max(2,(1-(ev.days/365))*100))}%`}}/>
            </div>
            <div style={{fontSize:11,color:T.textDim,marginTop:6}}>{countdownMsg}</div>
          </div>
        ) : (
          <div style={{background:`${T.textDim}18`,border:`1px solid ${T.border}`,
            borderRadius:20,padding:"16px 20px",textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:13,color:T.textMid,fontWeight:600}}>🏁 This event has passed</div>
          </div>
        )}
        <div style={{background:T.card,border:`1px solid ${T.border}`,
          borderRadius:20,overflow:"hidden",marginBottom:16}}>
          {infoRows.map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,
              padding:"13px 16px",borderBottom:i<infoRows.length-1?`1px solid ${T.borderSub}`:"none"}}>
              <span style={{fontSize:16,width:22,textAlign:"center",flexShrink:0}}>{r.icon}</span>
              <span style={{flex:1,fontSize:13,color:T.textMid,fontWeight:500}}>{r.label}</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:14,color:T.text}}>{r.val}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{flex:1,padding:"14px",borderRadius:14,border:`1px solid ${T.border}`,
            background:T.card,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:15,letterSpacing:1,color:T.textMid,cursor:"pointer"}}>🗺 View on Map</button>
          <button style={{flex:1,padding:"14px",borderRadius:14,border:`1px solid ${T.border}`,
            background:T.card,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:15,letterSpacing:1,color:T.textMid,cursor:"pointer"}}>↑ Share</button>
        </div>
        {ev.global && (
          <div style={{marginTop:14,padding:"12px 14px",background:`${T.accent}0a`,
            border:`1px solid ${T.accent}22`,borderRadius:14}}>
            <div style={{fontSize:12,color:T.textDim,lineHeight:1.5}}>
              🇺🇦 This is a community-submitted event. Always verify details on the official race website.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Add Personal Event Sheet ── */
const AddEventSheet = ({onClose, onAdd}) => {
  const t = useT();
  const [form, setForm] = useState({name:"",sport:"run",dist:"",location:"",date:"",notes:""});
  const [errors, setErrors] = useState({});
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:undefined})); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = t("required");
    if (!form.date)            e.date     = t("required");
    if (!form.location.trim()) e.location = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onAdd({
      id: Date.now(), name: form.name.trim(), sport: form.sport,
      dist: form.dist || "Custom", location: form.location.trim(),
      date: form.date, notes: form.notes.trim(),
      days: Math.ceil((new Date(form.date)-new Date())/(1000*60*60*24)),
      fav: false, global: false,
    });
    onClose();
  };

  const Field = ({label, error, children}) => (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:error?T.heart:T.textDim,
        letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{label}</div>
      {children}
      {error && <div style={{fontSize:11,color:T.heart,marginTop:4}}>{error}</div>}
    </div>
  );

  const inp = (k, placeholder, type="text") => (
    <input type={type} value={form[k]} onChange={e=>set(k,e.target.value)}
      placeholder={placeholder}
      style={{width:"100%",background:T.bg,border:`1px solid ${errors[k]?T.heart:T.border}`,
        borderRadius:12,padding:"12px 14px",fontFamily:"'Barlow',sans-serif",
        fontWeight:500,fontSize:14,color:T.text,outline:"none",colorScheme:"dark"}}/>
  );

  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",zIndex:90,
      display:"flex",alignItems:"flex-end",borderRadius:50,overflow:"hidden"}} onClick={onClose}>
      <div style={{background:T.surface,borderRadius:"28px 28px 0 0",
        padding:"20px 20px 32px",width:"100%",maxHeight:"88%",
        overflowY:"auto",scrollbarWidth:"none"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:T.border,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:T.text,marginBottom:20}}>{t("events_add_title")}</div>
        <Field label={t("events_name")} error={errors.name}>{inp("name","e.g. Local Sprint Tri")}</Field>
        <Field label={t("events_sport")}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["tri","run","bike","swim"].map(s=>{
              const sp2=SP[s]; const sel=form.sport===s;
              return(
                <button key={s} onClick={()=>set("sport",s)}
                  style={{padding:"8px 14px",borderRadius:10,cursor:"pointer",
                    border:`1.5px solid ${sel?sp2.color:T.border}`,
                    background:sel?`${sp2.color}22`:T.bg,
                    color:sel?sp2.color:T.textMid,
                    fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13}}>
                  {sp2.icon} {sp2.label}
                </button>
              );
            })}
          </div>
        </Field>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Field label={t("events_dist")}>{inp("dist","e.g. 21.1 km")}</Field>
          <Field label={t("events_date")} error={errors.date}>{inp("date","","date")}</Field>
        </div>
        <Field label={t("events_location")} error={errors.location}>{inp("location","City or venue")}</Field>
        <Field label={t("events_notes")}>
          <textarea value={form.notes} onChange={e=>set("notes",e.target.value)}
            placeholder={t("events_notes_ph")}
            style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,
              borderRadius:12,padding:"12px 14px",fontFamily:"'Barlow',sans-serif",
              fontWeight:500,fontSize:14,color:T.text,outline:"none",
              resize:"none",height:72}}/>
        </Field>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={onClose}
            style={{flex:1,padding:14,borderRadius:14,border:`1px solid ${T.border}`,
              background:T.card,fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800,fontSize:16,color:T.textMid,cursor:"pointer"}}>
            {t("cancel")}
          </button>
          <button onClick={submit}
            style={{flex:2,padding:14,borderRadius:14,border:"none",
              background:T.accent,fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800,fontSize:16,color:"#000",cursor:"pointer"}}>
            {t("events_add_personal")}
          </button>
        </div>
      </div>
    </div>
  );
};

const SuggestSheet = ({onClose}) => {
  const t = useT();
  const [form,setForm]=useState({name:"",sport:"tri",dist:"",location:"",date:"",desc:""});
  const [errors,setErrors]=useState({});
  const [sent,setSent]=useState(false);
  const set=(k,v)=>{setForm(f=>({...f,[k]:v}));setErrors(e=>({...e,[k]:undefined}));};

  const validate=()=>{
    const e={};
    if(!form.name.trim())     e.name=t("required");
    if(!form.location.trim()) e.location=t("required");
    if(!form.date)            e.date=t("required");
    setErrors(e);
    return !Object.keys(e).length;
  };

  const inp=(k,ph,type="text")=>(
    <input type={type} value={form[k]} onChange={e=>set(k,e.target.value)}
      placeholder={ph}
      style={{width:"100%",background:T.bg,border:`1px solid ${errors[k]?T.heart:T.border}`,
        borderRadius:12,padding:"11px 13px",fontFamily:"'Barlow',sans-serif",
        fontWeight:500,fontSize:14,color:T.text,outline:"none",colorScheme:"dark",marginBottom:errors[k]?4:12}}/>
  );

  return(
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",zIndex:90,
      display:"flex",alignItems:"flex-end",borderRadius:50,overflow:"hidden"}} onClick={onClose}>
      <div style={{background:T.surface,borderRadius:"28px 28px 0 0",padding:"20px 20px 32px",
        width:"100%",maxHeight:"85%",overflowY:"auto",scrollbarWidth:"none"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:T.border,borderRadius:2,margin:"0 auto 18px"}}/>
        {sent ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:44,marginBottom:12}}>🙌</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:22,color:T.text,marginBottom:8}}>{t("events_suggest_sent")}</div>
            <div style={{fontSize:13,color:T.textMid,lineHeight:1.5,marginBottom:24}}>
              {t("events_suggest_sent_sub")}
            </div>
            <button onClick={onClose} style={{width:"100%",padding:14,borderRadius:14,border:"none",
              background:T.accent,fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:800,fontSize:16,color:"#000",cursor:"pointer"}}>{t("done")}</button>
          </div>
        ) : (
          <>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              fontSize:22,color:T.text,marginBottom:4}}>{t("events_suggest_title")}</div>
            <div style={{fontSize:12,color:T.textMid,marginBottom:18,lineHeight:1.5}}>
              {t("events_suggest_sub")}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("events_name")} *</div>
            {inp("name","e.g. Kyiv Night Run")}
            {errors.name&&<div style={{fontSize:11,color:T.heart,marginTop:-10,marginBottom:10}}>{errors.name}</div>}
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("events_sport")}</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {["tri","run","bike","swim"].map(s=>{
                const sp2=SP[s];const sel=form.sport===s;
                return(<button key={s} onClick={()=>set("sport",s)}
                  style={{flex:1,padding:"8px 4px",borderRadius:10,cursor:"pointer",
                    border:`1.5px solid ${sel?sp2.color:T.border}`,
                    background:sel?`${sp2.color}22`:T.bg,
                    color:sel?sp2.color:T.textMid,
                    fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:12,textAlign:"center"}}>
                  {sp2.icon}<br/>{sp2.label}
                </button>);
              })}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("events_location")} *</div>
                {inp("location","City")}
                {errors.location&&<div style={{fontSize:11,color:T.heart,marginTop:-10,marginBottom:10}}>{errors.location}</div>}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("events_date")} *</div>
                {inp("date","","date")}
                {errors.date&&<div style={{fontSize:11,color:T.heart,marginTop:-10,marginBottom:10}}>{errors.date}</div>}
              </div>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("events_dist")}</div>
            {inp("dist","e.g. 70.3 mi, 10 km...")}
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("events_notes")}</div>
            <textarea value={form.desc} onChange={e=>set("desc",e.target.value)}
              placeholder={t("events_notes_ph")}
              style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,
                borderRadius:12,padding:"11px 13px",fontFamily:"'Barlow',sans-serif",
                fontWeight:500,fontSize:14,color:T.text,outline:"none",
                resize:"none",height:68,marginBottom:16}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={onClose}
                style={{flex:1,padding:14,borderRadius:14,border:`1px solid ${T.border}`,
                  background:T.card,fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800,fontSize:16,color:T.textMid,cursor:"pointer"}}>{t("cancel")}</button>
              <button onClick={()=>{if(validate())setSent(true);}}
                style={{flex:2,padding:14,borderRadius:14,border:"none",
                  background:T.accent,fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800,fontSize:16,color:"#000",cursor:"pointer"}}>
                {t("events_submit")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ev, isFav, onToggleFav, onPress, archived}) => {
  const t = useT();
  const sp2 = SP[ev.sport];
  return (
    <div onClick={onPress}
      style={{background:T.card,border:`1px solid ${archived?T.borderSub:T.border}`,
        borderRadius:18,padding:16,display:"flex",gap:12,cursor:"pointer",
        opacity:archived?.6:1,transition:"opacity .2s"}}>
      {/* sport stripe */}
      <div style={{width:4,borderRadius:4,alignSelf:"stretch",flexShrink:0,
        background:archived?T.textDim:sp2.color}}/>
      {/* sport icon box */}
      <div style={{width:44,height:44,borderRadius:13,flexShrink:0,
        background:archived?T.surface:sp2.bg,
        border:`1px solid ${archived?T.border:sp2.color}33`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
        {sp2.icon}
      </div>
      {/* info */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
          <span style={{fontSize:10,fontWeight:800,letterSpacing:1.5,
            textTransform:"uppercase",color:archived?T.textDim:sp2.color}}>{sp2.label}</span>
          <span style={{fontSize:10,fontWeight:600,background:T.surface,
            color:T.textMid,padding:"2px 7px",borderRadius:5}}>{ev.dist}</span>
          {!ev.global&&<span style={{fontSize:10,fontWeight:700,
            background:`${T.accent}22`,color:T.accent,padding:"2px 7px",borderRadius:5}}>
            {t("events_my_event")}
          </span>}
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
          fontSize:17,color:archived?T.textMid:T.text,
          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
          textDecoration:archived?"line-through":"none"}}>
          {ev.name}
        </div>
        <div style={{fontSize:12,color:T.textDim,marginTop:3}}>
          📍 {ev.location} · {ev.date}
        </div>
      </div>
      {/* right col */}
      <div style={{display:"flex",flexDirection:"column",
        alignItems:"flex-end",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontSize:18,cursor:"pointer",padding:"2px 4px"}}
          onClick={e=>{e.stopPropagation();onToggleFav();}}>
          {isFav?"⭐":"☆"}
        </span>
        <div style={{textAlign:"right"}}>
          {archived ? (
            <div style={{fontSize:10,fontWeight:700,color:T.textDim,
              letterSpacing:.5,textTransform:"uppercase"}}>{t("events_past")}</div>
          ) : (
            <>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                fontSize:22,color:sp2.color,lineHeight:1}}>{ev.days}</div>
              <div style={{fontSize:9,color:T.textMid,fontWeight:700,letterSpacing:.5}}>{t("events_days")}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Events Screen ── */
const EventsScreen = ({favs, setFavs, personalEvents, setPersonalEvents}) => {
  const t = useT();
  const [tab,          setTab]          = useState("discover");
  const [filter,       setFilter]       = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSuggest,  setShowSuggest]  = useState(false);
  const [detailEvent,  setDetailEvent]  = useState(null);

  const TODAY = new Date();
  const isArchived = ev => ev.days < 0;

  const toggleFav = id => setFavs(f => f.includes(id) ? f.filter(x=>x!==id) : [...f,id]);

  const addPersonalEvent = ev => {
    setPersonalEvents(p => [...p, ev]);
    setFavs(f => [...f, ev.id]);  // auto-save to My Events
  };

  /* Discover: global events only, filter by sport, sort by date */
  const globalEvents = EVENTS_DATA.filter(e => e.global);
  const discoverVisible = globalEvents
    .filter(e => filter === "all" || e.sport === filter)
    .sort((a,b) => a.days - b.days);

  /* My Events: favourited globals + all personal, sorted by date asc */
  const myUpcoming = [
    ...globalEvents.filter(e => favs.includes(e.id) && !isArchived(e)),
    ...personalEvents.filter(e => !isArchived(e)),
  ].sort((a,b) => a.days - b.days);

  const myArchived = [
    ...globalEvents.filter(e => favs.includes(e.id) && isArchived(e)),
    ...personalEvents.filter(e => isArchived(e)),
  ].sort((a,b) => b.days - a.days); // most recent past first

  /* filter chip counts */
  const sportCounts = {all: globalEvents.length};
  ["tri","run","bike","swim"].forEach(s => {
    sportCounts[s] = globalEvents.filter(e=>e.sport===s).length;
  });

  /* total my events badge */
  const myTotal = myUpcoming.length + myArchived.length;

  if (detailEvent) {
    const isFav = favs.includes(detailEvent.id);
    return (
      <EventDetail
        ev={detailEvent}
        isFav={isFav}
        onToggleFav={()=>toggleFav(detailEvent.id)}
        onBack={()=>setDetailEvent(null)}
      />
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* ── Header ── */}
      <div style={{padding:"20px 20px 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <div className="ptitle">{t("events_title")}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:4,
              background:T.card,border:`1px solid ${T.border}`,
              borderRadius:8,padding:"4px 10px"}}>
              <span style={{fontSize:14}}>🇺🇦</span>
              <span style={{fontSize:12,fontWeight:700,color:T.textMid}}>Ukraine</span>
              <div style={{width:6,height:6,borderRadius:"50%",background:T.accent}}/>
              <span style={{fontSize:11,color:T.textDim}}>{t("events_locked")}</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:22,color:T.accent}}>{globalEvents.length}</div>
            <div style={{fontSize:10,color:T.textDim,fontWeight:600,letterSpacing:.5}}>EVENTS</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="etabs">
        <button className={`etab ${tab==="discover"?"on":""}`} onClick={()=>setTab("discover")}>
          {t("events_discover")}
        </button>
        <button className={`etab ${tab==="my"?"on":""}`} onClick={()=>setTab("my")}>
          {t("events_my")}
          {myTotal > 0 && (
            <span style={{background:T.accent,color:"#000",borderRadius:5,
              padding:"1px 6px",fontSize:10,fontWeight:800,marginLeft:5}}>
              {myTotal}
            </span>
          )}
        </button>
      </div>

      {/* ── Discover tab ── */}
      {tab === "discover" && (<>
        <div className="fchips">
          {[
            {id:"all",  l:t("tools_tab_all")},
            {id:"tri",  l:`🔱 ${t("tools_tab_tri")}`},
            {id:"run",  l:`🏃 ${t("tools_tab_run")}`},
            {id:"bike", l:`🚴 ${t("tools_tab_bike")}`},
            {id:"swim", l:`🏊 ${t("tools_tab_swim")}`},
          ].map(f => {
            const active = filter === f.id;
            const sp2 = f.id !== "all" ? SP[f.id] : null;
            return (
              <button key={f.id} className="fchip"
                style={active ? {background:sp2?sp2.color:T.accent,color:"#000",border:"none",fontWeight:800} : {}}
                onClick={()=>setFilter(f.id)}>
                {f.l}
                <span style={{marginLeft:5,fontSize:10,fontWeight:700,opacity:.7}}>
                  {sportCounts[f.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="scroll" style={{paddingBottom:0}}>
          <div style={{display:"flex",flexDirection:"column",gap:10,padding:"12px 20px 0"}}>
            {discoverVisible.length === 0 ? (
              <div style={{textAlign:"center",padding:"48px 20px"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:20,color:T.text,marginBottom:6}}>
                  {filter !== "all" ? SP[filter].label+" " : ""}{t("events_no_events")}
                </div>
                <div style={{fontSize:13,color:T.textMid,lineHeight:1.5}}>
                  {t("events_no_events_sub")}
                </div>
              </div>
            ) : discoverVisible.map(ev => (
              <EventCard key={ev.id} ev={ev}
                isFav={favs.includes(ev.id)}
                onToggleFav={()=>toggleFav(ev.id)}
                onPress={()=>setDetailEvent(ev)}
                archived={false}/>
            ))}
          </div>
          <button onClick={()=>setShowSuggest(true)}
            style={{margin:"14px 20px 8px",background:"transparent",
              border:`1px dashed ${T.border}`,borderRadius:16,padding:14,
              width:"calc(100% - 40px)",display:"flex",alignItems:"center",
              justifyContent:"center",gap:8,cursor:"pointer",
              fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13,color:T.textMid}}>
            ＋ {t("events_suggest")}
          </button>
        </div>
      </>)}

      {/* ── My Events tab ── */}
      {tab === "my" && (
        <div className="scroll" style={{paddingBottom:0}}>
          {myUpcoming.length === 0 && myArchived.length === 0 ? (
            <div style={{textAlign:"center",padding:"48px 24px"}}>
              <div style={{fontSize:44,marginBottom:14}}>⭐</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:T.text,marginBottom:8}}>{t("events_no_events")}</div>
              <div style={{fontSize:13,color:T.textMid,lineHeight:1.5,marginBottom:24}}>
                {t("events_no_events_sub")}
              </div>
              <button onClick={()=>setTab("discover")}
                style={{padding:"12px 24px",borderRadius:14,border:"none",
                  background:T.accent,fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800,fontSize:15,letterSpacing:1,color:"#000",cursor:"pointer"}}>
                {t("events_browse")}
              </button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:10,padding:"16px 20px 0"}}>
              {myUpcoming.length > 0 && (<>
                <div style={{fontSize:11,fontWeight:700,color:T.textDim,
                  letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>
                  {t("events_upcoming")} · {myUpcoming.length}
                </div>
                {myUpcoming.map(ev=>(
                  <EventCard key={ev.id} ev={ev}
                    isFav={favs.includes(ev.id)}
                    onToggleFav={()=>toggleFav(ev.id)}
                    onPress={()=>setDetailEvent(ev)}
                    archived={false}/>
                ))}
              </>)}
              {myArchived.length > 0 && (
                <button onClick={()=>setShowArchived(a=>!a)}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"12px 16px",borderRadius:14,border:`1px solid ${T.border}`,
                    background:"transparent",cursor:"pointer",marginTop:4,width:"100%"}}>
                  <span style={{fontSize:13,fontWeight:600,color:T.textMid}}>
                    🗄 {t("events_archived")} · {myArchived.length} {t("events_show_archived")}
                  </span>
                  <span style={{fontSize:13,color:T.textDim}}>
                    {showArchived ? `▲ ${t("events_hide")}` : `▼ ${t("events_show")}`}
                  </span>
                </button>
              )}
              {showArchived && myArchived.map(ev=>(
                <EventCard key={ev.id} ev={ev}
                  isFav={favs.includes(ev.id)}
                  onToggleFav={()=>toggleFav(ev.id)}
                  onPress={()=>setDetailEvent(ev)}
                  archived/>
              ))}
            </div>
          )}

          {/* Add personal event */}
          <button onClick={()=>setShowAddEvent(true)}
            style={{margin:"14px 20px 8px",background:"transparent",
              border:`1px dashed ${T.border}`,borderRadius:16,padding:14,
              width:"calc(100% - 40px)",display:"flex",alignItems:"center",
              justifyContent:"center",gap:8,cursor:"pointer",
              fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13,color:T.textMid}}>
            ＋ {t("events_add_personal")}
          </button>
        </div>
      )}

      {/* ── Sheets ── */}
      {showAddEvent  && <AddEventSheet  onClose={()=>setShowAddEvent(false)}  onAdd={addPersonalEvent}/>}
      {showSuggest   && <SuggestSheet   onClose={()=>setShowSuggest(false)}/>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ACCOUNT SCREEN + PR DETAIL
═══════════════════════════════════════════════════════════ */

/* ── HR Zones Account Overlay ── */
const HRZonesOverlay = ({maxHR:initHR, hrMethod:initMethod, onSave, onBack}) => {
  const t = useT();
  const [maxHR,    setMaxHR]    = useState(initHR  || "185");
  const [method,   setMethod]   = useState(initMethod || "Max HR %");
  const [rhr,      setRhr]      = useState("52");
  const [overrides,setOverrides]= useState({}); // {z: {lo, hi}} — manual overrides per zone
  const [expanded, setExpanded] = useState(null); // which zone is open for editing

  const ZONES = [
    {z:1, nameKey:"hr_z1", noteKey:"hr_z1_note", pct:[50,60],  color:"#4BEBA4"},
    {z:2, nameKey:"hr_z2", noteKey:"hr_z2_note", pct:[60,70],  color:"#3B9EFF"},
    {z:3, nameKey:"hr_z3", noteKey:"hr_z3_note", pct:[70,80],  color:T.accent},
    {z:4, nameKey:"hr_z4", noteKey:"hr_z4_note", pct:[80,90],  color:"#FF8B3B"},
    {z:5, nameKey:"hr_z5", noteKey:"hr_z5_note", pct:[90,100], color:"#FF4F6A"},
  ];

  const hr = parseInt(maxHR) || 0;
  const rh = parseInt(rhr)   || 0;
  const calcAuto = pct => method === "HR Reserve"
    ? Math.round(rh + (hr - rh) * (pct / 100))
    : Math.round(hr * (pct / 100));

  const getZone = z => {
    const ov = overrides[z.z];
    return {
      lo: ov?.lo ?? (hr > 0 ? calcAuto(z.pct[0]) : null),
      hi: ov?.hi ?? (hr > 0 ? calcAuto(z.pct[1]) : null),
      isManual: !!ov,
    };
  };

  const setOverride = (zNum, field, val) => {
    setOverrides(o => ({...o, [zNum]: {...(o[zNum]||{}), [field]: val}}));
  };

  const resetZone = (zNum) => {
    setOverrides(o => {const n={...o}; delete n[zNum]; return n;});
  };

  const hasAnyOverride = Object.keys(overrides).length > 0;

  return (
    <div className="overlay">
      <div className="ov-head">
        <div className="ov-back" onClick={onBack}>
          <span className="ov-back-arr">←</span>
          <span className="ov-back-lbl">{t("nav_account")}</span>
        </div>
        <div className="ov-sport-row">
          <span style={{fontSize:16}}>❤️</span>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:1.5,
            textTransform:"uppercase",color:T.heart}}>{t("hr_title")}</span>
        </div>
        <div className="ov-title">{t("hr_title")}</div>
      </div>
      <div className="ov-body">

        {/* Method */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,
            textTransform:"uppercase",marginBottom:8}}>{t("hr_method")}</div>
          <div style={{display:"flex",gap:8}}>
            {[{id:"Max HR %",label:t("hrmethod_maxhr")},{id:"HR Reserve",label:t("hrmethod_hrr")}].map(m=>(
              <button key={m.id} onClick={()=>{setMethod(m.id);setOverrides({});}}
                style={{flex:1,padding:"10px 8px",borderRadius:12,cursor:"pointer",
                  border:`1.5px solid ${method===m.id?T.heart:T.border}`,
                  background:method===m.id?`${T.heart}18`:T.card,
                  fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13,
                  color:method===m.id?T.heart:T.textMid,textAlign:"center"}}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Max HR */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,
            textTransform:"uppercase",marginBottom:6}}>{t("hr_max")}</div>
          <div style={{display:"flex",gap:8,marginBottom:6}}>
            <input value={maxHR} onChange={e=>{setMaxHR(e.target.value.replace(/\D/,""));setOverrides({});}}
              inputMode="numeric" placeholder="185"
              style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,
                padding:"12px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:28,color:T.text,textAlign:"center",outline:"none"}}/>
            <div style={{display:"flex",alignItems:"center",padding:"0 14px",
              background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,
              fontWeight:700,fontSize:13,color:T.textMid}}>bpm</div>
          </div>
          <div style={{fontSize:11,color:T.textDim,marginBottom:8}}>{t("hr_estimate")}</div>
          <div style={{display:"flex",gap:6}}>
            {[{l:"25",v:"195"},{l:"30",v:"190"},{l:"35",v:"185"},{l:"40",v:"180"},{l:"45",v:"175"}].map(p=>(
              <button key={p.l} onClick={()=>{setMaxHR(p.v);setOverrides({});}}
                style={{flex:1,padding:"6px 2px",borderRadius:8,cursor:"pointer",
                  border:`1px solid ${maxHR===p.v?T.heart:T.border}`,
                  background:maxHR===p.v?`${T.heart}22`:T.surface,
                  color:maxHR===p.v?T.heart:T.textDim,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:11,textAlign:"center",lineHeight:1.3}}>
                {p.l}<br/><span style={{fontSize:14}}>{p.v}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resting HR */}
        {method === "HR Reserve" && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,
              textTransform:"uppercase",marginBottom:6}}>{t("hr_resting")}</div>
            <div style={{display:"flex",gap:8}}>
              <input value={rhr} onChange={e=>{setRhr(e.target.value.replace(/\D/,""));setOverrides({});}}
                inputMode="numeric" placeholder="52"
                style={{flex:1,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,
                  padding:"12px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:28,color:T.text,textAlign:"center",outline:"none"}}/>
              <div style={{display:"flex",alignItems:"center",padding:"0 14px",
                background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,
                fontWeight:700,fontSize:13,color:T.textMid}}>bpm</div>
            </div>
          </div>
        )}

        {/* Zone header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase"}}>
            Zones
          </div>
          {hasAnyOverride && (
            <button onClick={()=>setOverrides({})}
              style={{fontSize:11,fontWeight:700,color:T.textDim,background:"none",border:"none",
                cursor:"pointer",padding:"2px 6px",borderRadius:6,
                textDecoration:"underline"}}>
              Reset all
            </button>
          )}
        </div>

        {/* Zones list */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,
          borderRadius:18,overflow:"hidden",marginBottom:16}}>
          {ZONES.map(z => {
            const {lo, hi, isManual} = getZone(z);
            const isOpen = expanded === z.z;
            const loStr = lo !== null ? String(lo) : "--";
            const hiStr = hi !== null ? String(hi) : "--";

            return (
              <div key={z.z} style={{borderBottom:z.z<5?`1px solid ${T.borderSub}`:"none"}}>
                {/* Zone row — tap to expand */}
                <div onClick={()=>setExpanded(isOpen ? null : z.z)}
                  style={{padding:"12px 16px",cursor:"pointer",
                    background:isOpen?`${z.color}08`:"transparent",
                    transition:"background .15s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                      fontSize:18,color:z.color,width:24,flexShrink:0}}>Z{z.z}</span>
                    <span style={{flex:1,fontSize:13,fontWeight:600,color:T.text}}>{t(z.nameKey)}</span>
                    {/* BPM range — tappable, shows manual indicator */}
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      {isManual && (
                        <span style={{fontSize:9,fontWeight:800,padding:"2px 5px",
                          borderRadius:4,background:`${z.color}22`,color:z.color,
                          letterSpacing:.5}}>CUSTOM</span>
                      )}
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                        fontSize:14,color:isManual?z.color:T.text}}>
                        {lo !== null ? `${lo}–${hi}` : "--"} bpm
                      </span>
                      <span style={{color:T.textDim,fontSize:12,
                        transform:isOpen?"rotate(180deg)":"rotate(0)",
                        transition:"transform .2s",display:"inline-block"}}>▼</span>
                    </div>
                  </div>
                  {/* Mini bar */}
                  <div style={{marginLeft:34,height:4,background:T.surface,
                    borderRadius:2,overflow:"hidden",marginTop:6}}>
                    <div style={{width:`${z.pct[1]}%`,height:"100%",
                      background:z.color+"55",borderRadius:2}}/>
                  </div>
                </div>

                {/* Expanded edit panel */}
                {isOpen && (
                  <div style={{padding:"0 16px 14px",background:`${z.color}06`}}>
                    <div style={{fontSize:11,color:T.textDim,lineHeight:1.5,marginBottom:10}}>
                      {t(z.noteKey)}
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {/* Lo input */}
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,fontWeight:700,color:T.textDim,
                          letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>From</div>
                        <input
                          value={overrides[z.z]?.lo ?? loStr}
                          onChange={e=>setOverride(z.z,"lo",e.target.value.replace(/\D/,""))}
                          inputMode="numeric"
                          style={{width:"100%",background:T.surface,
                            border:`1.5px solid ${isManual?z.color:T.border}`,
                            borderRadius:10,padding:"10px 8px",
                            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                            fontSize:20,color:T.text,textAlign:"center",outline:"none"}}/>
                      </div>
                      <div style={{color:T.textDim,fontSize:18,marginTop:14}}>–</div>
                      {/* Hi input */}
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,fontWeight:700,color:T.textDim,
                          letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>To</div>
                        <input
                          value={overrides[z.z]?.hi ?? hiStr}
                          onChange={e=>setOverride(z.z,"hi",e.target.value.replace(/\D/,""))}
                          inputMode="numeric"
                          style={{width:"100%",background:T.surface,
                            border:`1.5px solid ${isManual?z.color:T.border}`,
                            borderRadius:10,padding:"10px 8px",
                            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                            fontSize:20,color:T.text,textAlign:"center",outline:"none"}}/>
                      </div>
                      <div style={{color:T.textDim,fontSize:13,marginTop:14,flexShrink:0}}>bpm</div>
                    </div>
                    {/* Reset this zone */}
                    {isManual && (
                      <button onClick={()=>resetZone(z.z)}
                        style={{marginTop:8,fontSize:11,fontWeight:600,color:T.textDim,
                          background:"none",border:"none",cursor:"pointer",padding:0,
                          textDecoration:"underline"}}>
                        Reset to auto
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="btn btn-accent"
          onClick={()=>onSave({maxHR, hrMethod:method, zoneOverrides:overrides})}>
          {t("hr_save")}
        </button>
      </div>
    </div>
  );
};

const PRDetail = ({pr, onBack}) => {
  const t = useT();
  const sp2 = SP[pr.sport];
  const [showLog, setShowLog] = useState(false);
  const [logTime, setLogTime] = useState("");
  const [logEvent, setLogEvent] = useState("");
  const [history, setHistory] = useState([
    {date:"2025-02-10", event:"Training", time:pr.val, best:true},
  ]);

  const handleLog = () => {
    if (!logTime.trim()) return;
    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      event: logEvent.trim() || "Training",
      time: logTime.trim(),
      best: false,
    };
    setHistory(h => [newEntry, ...h]);
    setLogTime(""); setLogEvent(""); setShowLog(false);
  };

  return (
    <div className="overlay">
      <div className="ov-head">
        <div className="ov-back" onClick={onBack}>
          <span className="ov-back-arr">←</span>
          <span className="ov-back-lbl">{t("nav_account")}</span>
        </div>
        <div className="ov-sport-row">
          <span style={{fontSize:16}}>{sp2.icon}</span>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",color:sp2.color}}>{sp2.label}</span>
        </div>
        <div className="ov-title">{pr.label} PR</div>
      </div>
      <div className="ov-body">
        <div className="pr-hero" style={{background:`linear-gradient(135deg,${sp2.bg},#0a0a0c)`,border:`1px solid ${sp2.color}33`}}>
          <div className="prh-lbl" style={{color:sp2.color}}>{t("account_pr_best")}</div>
          <div className="prh-val" style={{color:sp2.color}}>{pr.val}</div>
          <div className="prh-event">Set on Feb 10, 2025 · Training</div>
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
          fontSize:13,letterSpacing:2,textTransform:"uppercase",color:T.textDim,marginBottom:10}}>
          {t("account_pr_history")}
        </div>
        {history.length === 1 ? (
          <div style={{background:T.card,border:`1px solid ${T.border}`,
            borderRadius:16,padding:"24px 20px",textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:28,marginBottom:8}}>📊</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
              fontSize:16,color:T.textMid,marginBottom:6}}>{t("account_pr_only_one")}</div>
            <div style={{fontSize:12,color:T.textDim,lineHeight:1.5}}>{t("account_pr_only_one_sub")}</div>
          </div>
        ) : (
          <div className="rc" style={{marginBottom:16}}>
            {history.map((h,i) => (
              <div key={i} className="rr" style={{background:h.best?`${sp2.color}08`:"transparent"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:T.text}}>{h.event}</div>
                  <div style={{fontSize:12,color:T.textMid,marginTop:2}}>{h.date}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:h.best?sp2.color:T.text}}>{h.time}</span>
                  {h.best && <span style={{fontSize:10,fontWeight:800,padding:"2px 6px",borderRadius:5,background:`${sp2.color}22`,color:sp2.color}}>BEST</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        {showLog ? (
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:18,marginBottom:16}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:16,color:T.text,marginBottom:14}}>
              {t("account_log_result")}
            </div>
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("account_log_time")}</div>
            <input value={logTime} onChange={e=>setLogTime(e.target.value)}
              placeholder={pr.val}
              style={{width:"100%",background:T.surface,border:`1px solid ${logTime?sp2.color:T.border}`,
                borderRadius:12,padding:"12px",fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:700,fontSize:22,color:T.text,outline:"none",textAlign:"center",marginBottom:12}}/>
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("account_log_event")}</div>
            <input value={logEvent} onChange={e=>setLogEvent(e.target.value)}
              placeholder={t("account_log_ph")}
              style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,
                borderRadius:12,padding:"12px",fontFamily:"'Barlow',sans-serif",
                fontWeight:500,fontSize:14,color:T.text,outline:"none",marginBottom:14}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowLog(false)}
                style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${T.border}`,
                  background:"transparent",fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:700,fontSize:14,color:T.textMid,cursor:"pointer"}}>{t("cancel")}</button>
              <button onClick={handleLog}
                style={{flex:2,padding:"12px",borderRadius:12,border:"none",
                  background:logTime?T.accent:"#333",fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800,fontSize:14,color:logTime?"#000":T.textDim,cursor:"pointer"}}>
                {t("account_save_result")}
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-accent" onClick={()=>setShowLog(true)}>
            {t("account_log_result")}
          </button>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   BOTTOM SHEET — reusable wrapper
═══════════════════════════════════════════════════════════ */
const Sheet = ({onClose, title, children}) => {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 220);
  };

  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",zIndex:90,
      display:"flex",alignItems:"flex-end",borderRadius:50,overflow:"hidden"}}
      onClick={handleClose}>
      <div
        className={closing ? "sh-slide-down" : "sh-slide-up"}
        style={{background:T.surface,borderRadius:"28px 28px 0 0",
          padding:"20px 20px 32px",width:"100%",maxHeight:"80%",
          overflowY:"auto",scrollbarWidth:"none"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:T.border,borderRadius:2,margin:"0 auto 18px"}}/>
        {title && <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:22,color:T.text,marginBottom:18}}>{title}</div>}
        {children}
      </div>
    </div>
  );
};

/* ── picker row inside a Sheet ── */
const PickerRow = ({label, selected, onSelect}) => (
  <div onClick={onSelect} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
    padding:"14px 4px",borderBottom:`1px solid ${T.borderSub}`,cursor:"pointer"}}>
    <span style={{fontSize:14,fontWeight:500,color:selected?T.text:T.textMid}}>{label}</span>
    {selected && <span style={{fontSize:18,color:T.accent}}>✓</span>}
  </div>
);

/* ── number input inside a Sheet ── */
const NumberInput = ({value, onChange, unit, hint, min, max, errorMsg}) => {
  const num = parseFloat(value);
  const hasValue = value !== "" && value !== null;
  const outOfRange = hasValue && !isNaN(num) && ((min !== undefined && num < min) || (max !== undefined && num > max));
  const notANumber = hasValue && isNaN(num);
  const error = notANumber ? "Please enter a valid number"
    : outOfRange ? (errorMsg || `Enter a value between ${min} and ${max}`)
    : null;

  const handleChange = (v) => {
    // allow empty, digits, and one decimal
    if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
  };

  return (
    <div style={{marginBottom: error ? 8 : 12}}>
      <div style={{display:"flex",gap:8,marginBottom:6}}>
        <input value={value} onChange={e=>handleChange(e.target.value)}
          inputMode="decimal"
          style={{flex:1,background:T.card,
            border:`1px solid ${error ? T.heart : T.border}`,
            borderRadius:14,padding:"16px",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
            fontSize:32,color:error ? T.heart : T.text,
            textAlign:"center",outline:"none",transition:"border-color .15s"}}/>
        <div style={{display:"flex",alignItems:"center",background:T.surface,
          border:`1px solid ${T.border}`,borderRadius:14,padding:"0 16px",
          fontWeight:700,fontSize:14,color:T.textMid,whiteSpace:"nowrap"}}>{unit}</div>
      </div>
      {error && (
        <div style={{fontSize:12,color:T.heart,marginBottom:8,paddingLeft:2}}>{error}</div>
      )}
      {hint && !error && (
        <div style={{fontSize:12,color:T.textDim,lineHeight:1.5,marginBottom:16}}>{hint}</div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ACCOUNT SUB-SCREENS (overlays)
═══════════════════════════════════════════════════════════ */

/* ── 1. Edit Profile ── */
const EditProfileOverlay = ({profile, onSave, onBack}) => {
  const t = useT();
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [focus, setFocus] = useState(profile.focus);
  const emojis = ["🧑","👩","🏊","🚴","🏃","🔱","💪","🦾","🏅","⚡"];
  const [avatar, setAvatar] = useState(profile.avatar);
  const focusOptions = [t("ob_sport_tri"),t("ob_sport_run"),t("ob_sport_bike"),t("ob_sport_swim"),t("ob_sport_tbd")];
  return (
    <div className="overlay">
      <div className="ov-head">
        <div className="ov-back" onClick={onBack}><span className="ov-back-arr">←</span><span className="ov-back-lbl">{t("nav_account")}</span></div>
        <div className="ov-title">{t("ep_title")}</div>
      </div>
      <div className="ov-body">
        <div style={{marginBottom:20}}>
          <span style={{display:"block",fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{t("ep_avatar")}</span>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {emojis.map(e=>(
              <div key={e} onClick={()=>setAvatar(e)}
                style={{width:48,height:48,borderRadius:14,background:avatar===e?`${T.accent}22`:T.card,
                  border:`2px solid ${avatar===e?T.accent:T.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:24,cursor:"pointer",transition:"all .15s"}}>
                {e}
              </div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <span style={{display:"block",fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("ep_name")}</span>
          <input value={name} onChange={e=>setName(e.target.value)}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,
              padding:"12px 14px",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:16,color:T.text,outline:"none"}}/>
        </div>
        <div style={{marginBottom:16}}>
          <span style={{display:"block",fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{t("ep_city")}</span>
          <input value={city} onChange={e=>setCity(e.target.value)}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,borderRadius:12,
              padding:"12px 14px",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:16,color:T.text,outline:"none"}}/>
        </div>
        <div style={{marginBottom:24}}>
          <span style={{display:"block",fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{t("ep_focus")}</span>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {focusOptions.map(f=>(
              <button key={f} onClick={()=>setFocus(f)}
                style={{padding:"9px 16px",borderRadius:10,border:`1px solid ${focus===f?T.accent:T.border}`,
                  background:focus===f?`${T.accent}22`:T.surface,
                  color:focus===f?T.accent:T.textMid,
                  fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-accent" onClick={()=>onSave({name,city,focus,avatar})}>
          {t("ep_save")}
        </button>
      </div>
    </div>
  );
};

/* ── 2. About ── */
const AboutOverlay = ({onBack}) => {
  const t = useT();
  return (
  <div className="overlay">
    <div className="ov-head">
      <div className="ov-back" onClick={onBack}><span className="ov-back-arr">←</span><span className="ov-back-lbl">{t("nav_account")}</span></div>
      <div className="ov-title">{t("about_title")}</div>
    </div>
    <div className="ov-body">
      <div style={{textAlign:"center",padding:"24px 0 32px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:48,
          letterSpacing:6,color:T.text}}>SPORT<span style={{color:T.accent}}>IK</span></div>
        <div style={{fontSize:13,color:T.textMid,marginTop:6}}>Version 1.0.0 · Build 2025.03</div>
        <div style={{marginTop:16,display:"inline-block",background:`${T.accent}22`,
          color:T.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
          fontSize:12,padding:"5px 14px",borderRadius:8,letterSpacing:1}}>{t("about_beta")}</div>
      </div>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,overflow:"hidden",marginBottom:16}}>
        {[
          {label:t("about_platform"), val:"React Native"},
          {label:t("about_target"),   val:"iOS & Android"},
          {label:t("about_country"),  val:"🇺🇦 Ukraine (v1)"},
          {label:t("about_units_row"),val:"Metric (km, kg, °C)"},
          {label:t("about_data"),     val:"Stored locally, no sync"},
        ].map(r=>(
          <div key={r.label} style={{display:"flex",justifyContent:"space-between",
            alignItems:"center",padding:"13px 16px",borderBottom:`1px solid ${T.borderSub}`}}>
            <span style={{fontSize:13,color:T.textMid,fontWeight:500}}>{r.label}</span>
            <span style={{fontSize:13,fontWeight:700,color:T.text}}>{r.val}</span>
          </div>
        ))}
        <div style={{padding:"13px 16px"}}>
          <span style={{fontSize:13,color:T.textMid}}>{t("about_made")}</span>
        </div>
      </div>
      {[t("about_privacy"),t("about_terms"),t("about_oss")].map(l=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"14px 4px",borderBottom:`1px solid ${T.borderSub}`,cursor:"pointer"}}>
          <span style={{fontSize:14,fontWeight:500,color:T.text}}>{l}</span>
          <span style={{color:T.textDim,fontSize:14}}>›</span>
        </div>
      ))}
    </div>
  </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ACCOUNT SCREEN — fully wired
═══════════════════════════════════════════════════════════ */
const AccountScreen = ({setOverlay, isDark, setIsDark, profile, setProfile, lang, setLang}) => {
  const t = useT();
  const [notif,    setNotif]    = useState(true);
  const dark = isDark;
  const setDark = setIsDark;
  const [ftp,      setFtp]      = useState("245");
  const [maxHR,    setMaxHR]    = useState("185");
  const [hrMethod, setHrMethod] = useState("Max HR %");
  const [goal,     setGoal]     = useState("Ironman 70.3");
  const [units,    setUnits]    = useState("km");

  /* ── sheet state — which sheet is open ── */
  const [sheet, setSheet] = useState(null);
  // sheet = null | "ftp" | "maxhr" | "goal" | "units" | "hrmethod" | "suggest" | "rate" | "logout"

  /* ── PR data ── */
  const prs = [
    {sport:"swim",icon:"🏊",val:"28:42",prev1:"29:15",prev2:"30:01",label:"1.5km Swim"},
    {sport:"bike",icon:"🚴",val:"1:02h",prev1:"1:05h",prev2:"1:08h",label:"40km Bike"},
    {sport:"run", icon:"🏃",val:"42:10",prev1:"43:30",prev2:"45:00",label:"10km Run"},
    {sport:"tri", icon:"🔱",val:"4:38h",prev1:"4:52h",prev2:"5:10h",label:"Olympic Tri"},
  ];

  /* ── suggest feature state ── */
  const [suggestText, setSuggestText] = useState("");
  const [suggestSent, setSuggestSent] = useState(false);

  /* ── star rating state ── */
  const [stars, setStars] = useState(0);
  const [rated, setRated] = useState(false);

  /* ── logout state ── */
  const [loggedOut, setLoggedOut] = useState(false);

  const closeSheet = () => setSheet(null);

  /* helper row */
  const Row = ({icon, iconBg, label, right, onPress, danger}) => (
    <div className="sg-row" onClick={onPress} style={{cursor:"pointer"}}>
      <div className="sg-ic" style={{background:iconBg}}>{icon}</div>
      <div className="sg-lt" style={{color:danger?T.heart:T.text}}>{label}</div>
      <div className="sg-rv">{right}</div>
    </div>
  );

  if (loggedOut) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",gap:16,padding:40}}>
      <div style={{fontSize:48}}>👋</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,
        color:T.text,textAlign:"center"}}>{t("account_logged_out")}</div>
      <div style={{fontSize:13,color:T.textMid,textAlign:"center"}}>{t("account_logged_out_sub")}</div>
      <button className="btn btn-accent" style={{marginTop:8}} onClick={()=>setLoggedOut(false)}>{t("account_log_back")}</button>
    </div>
  );

  return (
    <div className="scroll">

      {/* ── Hero ── */}
      <div className="acct-hero">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,
            color:T.text,letterSpacing:1,textTransform:"uppercase"}}>{t("account_title")}</div>
          <button onClick={()=>setOverlay({type:"editProfile",profile,onSave:(p)=>{setProfile(p);setOverlay(null);}})}
            style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,
              padding:"6px 14px",color:T.accent,fontSize:12,fontWeight:700,
              cursor:"pointer",fontFamily:"'Barlow',sans-serif",letterSpacing:.5}}>
            {t("account_edit")}
          </button>
        </div>
        <div className="ah-top">
          <div className="avatar">
            {profile.avatar}
            <div className="av-badge">PRO</div>
          </div>
          <div>
            <div className="ah-name">{profile.name}</div>
            <div className="ah-sub">{profile.focus} · {profile.city} 🇺🇦</div>
            <div className="ah-plan">
              {profile?.raceType
                ? `${t("account_goal_label")}: ${profile.raceType} · ${t("account_active_plan")}`
                : t("account_no_plan")}
            </div>
          </div>
        </div>
        {/* PR boxes */}
        <div className="pr-row">
          {prs.map(p=>(
            <div key={p.label} className="pr-box" onClick={()=>setOverlay({type:"pr",pr:p})}>
              <div className="pr-sport">{p.icon}</div>
              <div className="pr-val">{p.val}</div>
              <div className="pr-lbl">{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{height:20}}/>

      {/* ── Training Profile ── */}
      <div className="sg-grp">
        <div className="sg-lbl">{t("account_training")}</div>
        <div className="sg-items">
          <Row icon="⚡" iconBg="#1a1400" label={t("account_ftp")}
            right={<><span className="sg-v">{ftp} W</span><span className="sg-chev">›</span></>}
            onPress={()=>setSheet("ftp")}/>
          <Row icon="❤️" iconBg="#200010" label={t("account_maxhr")}
            right={<><span className="sg-v">{maxHR} bpm</span><span className="sg-chev">›</span></>}
            onPress={()=>setOverlay({type:"hrZones", maxHR, hrMethod,
              onSave:({maxHR:m,hrMethod:h})=>{setMaxHR(m);setHrMethod(h);setOverlay(null);}})}/>
          <Row icon="🎯" iconBg="#001a08" label={t("account_goal")}
            right={<><span className="sg-v">{goal}</span><span className="sg-chev">›</span></>}
            onPress={()=>setSheet("goal")}/>
        </div>
      </div>

      {/* ── Preferences ── */}
      <div className="sg-grp">
        <div className="sg-lbl">{t("account_prefs")}</div>
        <div className="sg-items">
          {/* Notifications — toggle */}
          <div className="sg-row">
            <div className="sg-ic" style={{background:"#001020"}}>🔔</div>
            <div className="sg-lt">{t("account_notif")}</div>
            <Toggle on={notif} onToggle={()=>setNotif(!notif)}/>
          </div>
          {/* Dark mode — toggle */}
          <div className="sg-row">
            <div className="sg-ic" style={{background:"#141414"}}>🌙</div>
            <div className="sg-lt">{t("account_dark")}</div>
            <Toggle on={dark} onToggle={()=>setDark(!dark)}/>
          </div>
          {/* Units */}
          <Row icon="📏" iconBg="#001a08" label={t("account_units")}
            right={<><span className="sg-v">{units==="km"?"km · kg · °C":"mi · lb · °F"}</span><span className="sg-chev">›</span></>}
            onPress={()=>setSheet("units")}/>
          {/* HR Method */}
          <Row
            icon={<span style={{fontSize:11,fontWeight:800,color:T.textMid}}>HR</span>}
            iconBg="#0a0a1a" label={t("account_hr_method")}
            right={<><span className="sg-v">{hrMethod}</span><span className="sg-chev">›</span></>}
            onPress={()=>setSheet("hrmethod")}/>
        </div>
      </div>

      {/* ── App ── */}
      <div className="sg-grp">
        <div className="sg-lbl">{t("account_app")}</div>
        <div className="sg-items">
          <Row icon="💡" iconBg="#1a1200" label={t("account_suggest")}
            right={<span className="sg-chev">›</span>}
            onPress={()=>{ setSuggestSent(false); setSuggestText(""); setSheet("suggest"); }}/>
          <Row icon="⭐" iconBg="#1a1500" label={t("account_rate")}
            right={<span className="sg-chev">›</span>}
            onPress={()=>{ setRated(false); setStars(0); setSheet("rate"); }}/>
          <Row icon="🌐" iconBg="#0a1020" label={t("lang_title")}
            right={<><span className="sg-v">{lang==="uk"?"🇺🇦 UA":"🇬🇧 EN"}</span><span className="sg-chev">›</span></>}
            onPress={()=>setSheet("lang")}/>
          <Row icon="ℹ️" iconBg="#0a0a14" label={t("account_about")}
            right={<><span className="sg-v">v1.0.0</span><span className="sg-chev">›</span></>}
            onPress={()=>setOverlay({type:"about"})}/>
        </div>
      </div>

      {/* ── Log Out ── */}
      <div className="logout" onClick={()=>setSheet("logout")}>
        <span style={{fontSize:18}}>🚪</span>
        <span style={{fontSize:14,fontWeight:600,color:T.heart}}>{t("account_logout")}</span>
      </div>
      <div style={{height:8}}/>

      {/* ══ BOTTOM SHEETS ══════════════════════════════════════ */}

      {/* FTP */}
      {sheet==="ftp" && (
        <Sheet onClose={closeSheet} title={t("ftp_title")}>
          <NumberInput value={ftp} onChange={setFtp} unit="Watts"
            min={50} max={500}
            errorMsg="FTP is typically between 50W and 500W"
            hint={t("ftp_hint")}/>
          <button className="btn btn-accent"
            onClick={closeSheet}
            style={{opacity:(ftp===""||( parseFloat(ftp)>=50&&parseFloat(ftp)<=500))?1:.4,
              pointerEvents:(ftp!==""&&(parseFloat(ftp)<50||parseFloat(ftp)>500))?"none":"auto"}}>
            {t("save")}
          </button>
        </Sheet>
      )}

      {/* Language */}
      {sheet==="lang" && (
        <Sheet onClose={closeSheet} title={t("lang_title")}>
          {[
            {id:"en", flag:"🇬🇧", label:"English"},
            {id:"uk", flag:"🇺🇦", label:"Українська"},
          ].map(l=>(
            <div key={l.id}
              onClick={()=>{
                setLang(l.id);
                setTimeout(closeSheet, 50);
              }}
              style={{display:"flex",alignItems:"center",gap:14,padding:"18px 4px",
                borderBottom:`1px solid ${T.borderSub}`,cursor:"pointer",
                background: lang===l.id ? `${T.accent}0a` : "transparent"}}>
              <span style={{fontSize:26}}>{l.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,
                  color:lang===l.id?T.text:T.textMid}}>{l.label}</div>
                {lang===l.id && (
                  <div style={{fontSize:11,color:T.accent,fontWeight:600,marginTop:2}}>
                    ✓ Active
                  </div>
                )}
              </div>
              <div style={{
                width:22,height:22,borderRadius:"50%",
                background:lang===l.id?T.accent:"transparent",
                border:`2px solid ${lang===l.id?T.accent:T.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                flexShrink:0,
              }}>
                {lang===l.id && <span style={{fontSize:12,color:"#000",fontWeight:800}}>✓</span>}
              </div>
            </div>
          ))}
          <div style={{fontSize:12,color:T.textDim,marginTop:14,lineHeight:1.6,
            padding:"12px 4px 0",borderTop:`1px solid ${T.borderSub}`}}>
            🌐 Changing language updates all screens, tools, and onboarding text instantly.
          </div>
        </Sheet>
      )}

      {/* Season Goal */}
      {sheet==="goal" && (
        <Sheet onClose={closeSheet} title={t("goal_title")}>
          {["Sprint Triathlon","Olympic Triathlon","Ironman 70.3","Ironman","Marathon","Half Marathon","Gran Fondo","Custom"].map(g=>(
            <PickerRow key={g} label={g} selected={goal===g} onSelect={()=>{ setGoal(g); closeSheet(); }}/>
          ))}
        </Sheet>
      )}

      {/* Units */}
      {sheet==="units" && (
        <Sheet onClose={closeSheet} title={t("units_title")}>
          <div style={{fontSize:13,color:T.textMid,marginBottom:16,lineHeight:1.5}}>
            {t("units_sub")}
          </div>
          {[
            {id:"km", label:t("units_metric"),  sub:t("units_metric_sub")},
            {id:"mi", label:t("units_imperial"), sub:t("units_imperial_sub")},
          ].map(u=>(
            <div key={u.id} onClick={()=>{ setUnits(u.id); closeSheet(); }}
              style={{display:"flex",alignItems:"center",gap:14,padding:"16px 4px",
                borderBottom:`1px solid ${T.borderSub}`,cursor:"pointer"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:600,color:units===u.id?T.text:T.textMid}}>{u.label}</div>
                <div style={{fontSize:12,color:T.textDim,marginTop:2}}>{u.sub}</div>
              </div>
              {units===u.id && <span style={{fontSize:18,color:T.accent}}>✓</span>}
            </div>
          ))}
        </Sheet>
      )}

      {/* HR Method */}
      {sheet==="hrmethod" && (
        <Sheet onClose={closeSheet} title={t("hrmethod_title")}>
          <div style={{fontSize:13,color:T.textMid,marginBottom:16,lineHeight:1.5}}>
            {t("hrmethod_sub")}
          </div>
          {[
            {id:"Max HR %",         label:t("hrmethod_maxhr"), sub:t("hrmethod_maxhr_sub")},
            {id:"HR Reserve",       label:t("hrmethod_hrr"),   sub:t("hrmethod_hrr_sub")},
            {id:"Lactate Threshold",label:t("hrmethod_lt"),    sub:t("hrmethod_lt_sub")},
          ].map(m=>(
            <div key={m.id} onClick={()=>{ setHrMethod(m.id); closeSheet(); }}
              style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 4px",
                borderBottom:`1px solid ${T.borderSub}`,cursor:"pointer"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:hrMethod===m.id?T.text:T.textMid}}>{m.label}</div>
                <div style={{fontSize:12,color:T.textDim,marginTop:3,lineHeight:1.4}}>{m.sub}</div>
              </div>
              {hrMethod===m.id && <span style={{fontSize:18,color:T.accent,marginTop:2}}>✓</span>}
            </div>
          ))}
        </Sheet>
      )}

      {/* Suggest a Feature */}
      {sheet==="suggest" && (
        <Sheet onClose={closeSheet} title={t("suggest_title")}>
          {suggestSent ? (
            <div style={{textAlign:"center",padding:"20px 0 8px"}}>
              <div style={{fontSize:48,marginBottom:12}}>🚀</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:T.text,marginBottom:8}}>{t("suggest_sent")}</div>
              <div style={{fontSize:13,color:T.textMid,lineHeight:1.5,marginBottom:24}}>
                {t("suggest_sent_sub")}
              </div>
              <button className="btn btn-accent" onClick={closeSheet}>{t("done")}</button>
            </div>
          ) : (
            <div>
              <div style={{fontSize:13,color:T.textMid,marginBottom:14,lineHeight:1.5}}>
                {t("suggest_sub")}
              </div>
              <textarea value={suggestText} onChange={e=>setSuggestText(e.target.value)}
                placeholder={t("suggest_ph")}
                style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,
                  borderRadius:14,padding:"14px",fontFamily:"'Barlow',sans-serif",
                  fontWeight:500,fontSize:14,color:T.text,outline:"none",
                  resize:"none",height:120,marginBottom:14}}/>
              <button className="btn btn-accent"
                onClick={()=>{ if(suggestText.trim()) setSuggestSent(true); }}
                style={{opacity:suggestText.trim()?1:.4}}>
                {t("suggest_send")}
              </button>
            </div>
          )}
        </Sheet>
      )}

      {/* Rate Sportik */}
      {sheet==="rate" && (
        <Sheet onClose={closeSheet} title={t("rate_title")}>
          {rated ? (
            <div style={{textAlign:"center",padding:"16px 0 8px"}}>
              <div style={{fontSize:48,marginBottom:12}}>🏅</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
                fontSize:22,color:T.text,marginBottom:8}}>{t("rate_sent")}</div>
              <div style={{fontSize:13,color:T.textMid,lineHeight:1.5,marginBottom:24}}>
                {t("rate_sent_sub_pre")} {stars}-⭐ {t("rate_sent_sub_suf")}
              </div>
              <button className="btn btn-accent" onClick={closeSheet}>{t("done")}</button>
            </div>
          ) : (
            <div>
              <div style={{fontSize:13,color:T.textMid,marginBottom:24,lineHeight:1.5}}>
                {t("rate_sub")}
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:28}}>
                {[1,2,3,4,5].map(s=>(
                  <span key={s} onClick={()=>setStars(s)}
                    style={{fontSize:40,cursor:"pointer",
                      filter:s<=stars?"none":"grayscale(1) opacity(.35)",
                      transition:"all .15s"}}>⭐</span>
                ))}
              </div>
              {stars > 0 && (
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,color:T.text}}>
                    {t("rate_labels")[stars]}
                  </div>
                </div>
              )}
              <button className="btn btn-accent"
                onClick={()=>{ if(stars>0) setRated(true); }}
                style={{opacity:stars>0?1:.4}}>
                {t("rate_submit")}
              </button>
            </div>
          )}
        </Sheet>
      )}

      {/* Log Out confirmation */}
      {sheet==="logout" && (
        <Sheet onClose={closeSheet} title={t("logout_title")}>
          <div style={{fontSize:14,color:T.textMid,lineHeight:1.6,marginBottom:24}}>
            {t("account_logout_confirm")}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={closeSheet}
              style={{flex:1,padding:16,borderRadius:16,border:`1px solid ${T.border}`,
                background:T.card,fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:800,fontSize:16,letterSpacing:1,color:T.textMid,cursor:"pointer"}}>
              {t("cancel")}
            </button>
            <button onClick={()=>{ closeSheet(); setLoggedOut(true); }}
              style={{flex:1,padding:16,borderRadius:16,border:"none",
                background:T.heart,fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:800,fontSize:16,letterSpacing:1,color:"#fff",cursor:"pointer"}}>
              {t("account_logout")}
            </button>
          </div>
        </Sheet>
      )}

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════════ */

/* Slide transition wrapper */
const Slide = ({children, dir}) => {
  const anim = dir === "fwd"
    ? "ob-slide-in-r .32s cubic-bezier(.4,0,.2,1) forwards"
    : "ob-slide-in-l .32s cubic-bezier(.4,0,.2,1) forwards";
  return (
    <div style={{position:"absolute",inset:0,animation:anim,willChange:"transform"}}>
      {children}
    </div>
  );
};

const OB_KEYFRAMES = `
@keyframes ob-slide-in-r{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes ob-slide-in-l{from{transform:translateX(-100%)}to{transform:translateX(0)}}
`;

/* Progress bar */
const OBProgress = ({step, total, onBack, onSkip, showBack, showSkip}) => {
  const t = useT();
  return (
  <div style={{padding:"52px 20px 0",flexShrink:0}}>
    <div style={{height:3,background:"#222226",borderRadius:3,overflow:"hidden",marginBottom:20}}>
      <div style={{height:"100%",borderRadius:3,background:T.accent,
        width:`${(step/total)*100}%`,transition:"width .4s ease"}}/>
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      {showBack
        ? <div onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"4px 0"}}>
            <span style={{fontSize:18,color:T.textMid}}>←</span>
            <span style={{fontSize:13,color:T.textMid,fontWeight:500}}>{t("back")}</span>
          </div>
        : <div style={{width:60}}/>
      }
      <span style={{fontSize:12,color:T.textDim,fontWeight:600,letterSpacing:1}}>{step} / {total}</span>
      {showSkip
        ? <div onClick={onSkip} style={{fontSize:13,color:T.textDim,fontWeight:600,
            cursor:"pointer",padding:"4px 0",textAlign:"right",width:60}}>{t("skip")}</div>
        : <div style={{width:60}}/>
      }
    </div>
  </div>
  );
};

/* Big CTA button */
const OBBtn = ({label, onClick, disabled, style={}}) => (
  <button onClick={disabled ? undefined : onClick}
    style={{width:"100%",padding:18,borderRadius:18,border:"none",
      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:20,
      letterSpacing:2,textTransform:"uppercase",cursor:disabled?"default":"pointer",
      background:disabled?"#2a2a2e":T.accent,color:disabled?"#555":"#000",
      transition:"all .15s",...style}}>
    {label}
  </button>
);

/* ── Screen 1: Welcome ── */
const OBWelcome = ({onNext, onSkipAll}) => {
  const t = useT();
  const features = [
    t("tool_pace"), t("nav_events"), t("home_plans"), t("tool_hr"), "Multi-sport"
  ];
  return (
  <div style={{flex:1,display:"flex",flexDirection:"column",
    background:`radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, ${T.bg} 65%)`}}>
    <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",
      width:300,height:300,borderRadius:"50%",background:T.accent,
      opacity:.04,filter:"blur(60px)",pointerEvents:"none"}}/>
    <div style={{padding:"52px 24px 0",display:"flex",justifyContent:"flex-end"}}>
      <div onClick={onSkipAll}
        style={{fontSize:13,color:T.textDim,fontWeight:600,cursor:"pointer",
          padding:"6px 10px",borderRadius:8,border:`1px solid ${T.border}`,background:T.surface}}>
        {t("ob_skip")}
      </div>
    </div>
    <div style={{flex:1,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"20px 32px 0",textAlign:"center"}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
        fontSize:52,letterSpacing:8,color:T.text,lineHeight:1}}>
        SPORT<span style={{color:T.accent}}>IK</span>
      </div>
      <div style={{width:48,height:3,background:T.accent,borderRadius:2,margin:"16px 0 24px"}}/>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
        fontSize:22,color:T.textMid,letterSpacing:1,lineHeight:1.4,whiteSpace:"pre-line"}}>
        {t("ob_tagline")}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginTop:32}}>
        {features.map(f=>(
          <span key={f} style={{fontSize:12,fontWeight:700,padding:"6px 12px",borderRadius:20,
            background:`${T.accent}18`,color:T.accent,border:`1px solid ${T.accent}33`,letterSpacing:.3}}>
            {f}
          </span>
        ))}
      </div>
      <div style={{display:"flex",gap:20,marginTop:36}}>
        {[{icon:"🏊",color:T.swim},{icon:"🚴",color:T.bike},{icon:"🏃",color:T.run},{icon:"🔱",color:T.tri}].map((s,i)=>(
          <div key={i} style={{width:52,height:52,borderRadius:16,
            background:`${s.color}18`,border:`1px solid ${s.color}33`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
            {s.icon}
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:"0 24px 48px"}}>
      <OBBtn label={t("ob_get_started")} onClick={onNext}/>
      <div style={{textAlign:"center",marginTop:14,fontSize:12,color:T.textDim}}>
        {t("ob_takes")}
      </div>
    </div>
  </div>
  );
};

/* ── Screen 2: Sport Focus ── */
const OBSportFocus = ({onNext, onBack, data, setData}) => {
  const t = useT();
  const sports = [
    {id:"tri",  icon:"🔱", label:t("ob_sport_tri"), sub:t("ob_sport_tri_sub"), color:T.tri,     bg:T.triBg},
    {id:"run",  icon:"🏃", label:t("ob_sport_run"), sub:t("ob_sport_run_sub"), color:T.run,     bg:T.runBg},
    {id:"bike", icon:"🚴", label:t("ob_sport_bike"),sub:t("ob_sport_bike_sub"),color:T.bike,    bg:T.bikeBg},
    {id:"swim", icon:"🏊", label:t("ob_sport_swim"),sub:t("ob_sport_swim_sub"),color:T.swim,    bg:T.swimBg},
    {id:"tbd",  icon:"🤔", label:t("ob_sport_tbd"), sub:t("ob_sport_tbd_sub"), color:T.textMid, bg:T.surface},
  ];
  const toggle = id => setData(d => ({...d,
    sports: d.sports.includes(id) ? d.sports.filter(s=>s!==id) : [...d.sports, id]
  }));
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <OBProgress step={1} total={5} onBack={onBack} showBack showSkip={false}/>
      <div style={{padding:"24px 20px 0"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:32,color:T.text,letterSpacing:.5,lineHeight:1.1}}>{t("ob_sport_q")}</div>
        <div style={{fontSize:14,color:T.textMid,marginTop:8,lineHeight:1.5}}>{t("ob_sport_sub")}</div>
      </div>
      <div style={{flex:1,padding:"20px 20px 0",display:"flex",flexDirection:"column",gap:10,overflowY:"auto",scrollbarWidth:"none"}}>
        {sports.map(s => {
          const sel = data.sports.includes(s.id);
          return (
            <div key={s.id} onClick={()=>toggle(s.id)}
              style={{background:sel?s.bg:T.card,border:`2px solid ${sel?s.color:T.border}`,
                borderRadius:20,padding:"16px 18px",display:"flex",alignItems:"center",gap:16,
                cursor:"pointer",transition:"all .15s"}}>
              <div style={{width:52,height:52,borderRadius:15,background:`${s.color}22`,
                border:`1px solid ${s.color}33`,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:26,flexShrink:0}}>{s.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:18,color:sel?s.color:T.text}}>{s.label}</div>
                <div style={{fontSize:12,color:T.textMid,marginTop:2}}>{s.sub}</div>
              </div>
              <div style={{width:24,height:24,borderRadius:8,
                background:sel?s.color:"transparent",border:`2px solid ${sel?s.color:T.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"all .15s",flexShrink:0}}>
                {sel && <span style={{color:s.color===T.accent||s.id==="tbd"?"#000":"#fff",fontSize:14,fontWeight:800}}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{padding:"16px 20px 36px"}}>
        <OBBtn label={t("ob_continue")} onClick={onNext} disabled={data.sports.length===0}/>
      </div>
    </div>
  );
};

/* ── Screen 3: Goal Race ── */
const OBGoalRace = ({onNext, onBack, onSkip, data, setData}) => {
  const t = useT();
  const [hasRace, setHasRace] = useState(data.raceType ? true : null);
  const raceTypes = [
    {id:"sprint",  label:"Sprint Tri",    detail:"750m · 20km · 5km",    color:T.tri},
    {id:"olympic", label:"Olympic Tri",   detail:"1.5km · 40km · 10km",  color:T.tri},
    {id:"703",     label:"Ironman 70.3",  detail:"1.9km · 90km · 21km",  color:T.tri},
    {id:"ironman", label:"Ironman",       detail:"3.8km · 180km · 42km", color:T.tri},
    {id:"marathon",label:"Marathon",      detail:"42.2km",                color:T.run},
    {id:"hm",      label:"Half Marathon", detail:"21.1km",                color:T.run},
    {id:"fondo",   label:"Gran Fondo",    detail:"80–200km",              color:T.bike},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <OBProgress step={2} total={5} onBack={onBack} onSkip={onSkip} showBack showSkip/>
      <div style={{padding:"24px 20px 0"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:32,color:T.text,letterSpacing:.5,lineHeight:1.1}}>{t("ob_race_q")}</div>
        <div style={{fontSize:14,color:T.textMid,marginTop:8}}>{t("ob_race_sub")}</div>
      </div>
      <div style={{display:"flex",gap:10,padding:"20px 20px 0"}}>
        {[{v:true,l:t("ob_race_yes")},{v:false,l:t("ob_race_no")}].map(opt=>(
          <div key={String(opt.v)} onClick={()=>{setHasRace(opt.v);if(!opt.v)setData(d=>({...d,raceType:"",raceDate:""}));}}
            style={{flex:1,padding:"14px 10px",borderRadius:16,textAlign:"center",cursor:"pointer",
              border:`2px solid ${hasRace===opt.v?T.accent:T.border}`,
              background:hasRace===opt.v?`${T.accent}18`:T.card,
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,
              color:hasRace===opt.v?T.accent:T.textMid,transition:"all .15s"}}>
            {opt.l}
          </div>
        ))}
      </div>
      {hasRace===true && (
        <div style={{flex:1,padding:"16px 20px 0",overflowY:"auto",scrollbarWidth:"none"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,
            textTransform:"uppercase",marginBottom:10}}>{t("ob_race_type")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {raceTypes.map(r=>{
              const sel=data.raceType===r.id;
              return(
                <div key={r.id} onClick={()=>setData(d=>({...d,raceType:r.id}))}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                    borderRadius:14,border:`1.5px solid ${sel?r.color:T.border}`,
                    background:sel?`${r.color}18`:T.card,cursor:"pointer",transition:"all .15s"}}>
                  <div style={{flex:1}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                      fontSize:15,color:sel?r.color:T.text}}>{r.label}</span>
                    <span style={{fontSize:12,color:T.textDim,marginLeft:8}}>{r.detail}</span>
                  </div>
                  {sel&&<span style={{color:r.color,fontSize:16}}>✓</span>}
                </div>
              );
            })}
          </div>
          <div style={{fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:2,
            textTransform:"uppercase",marginBottom:8}}>{t("ob_race_date")}</div>
          <input type="date" value={data.raceDate||""} onChange={e=>setData(d=>({...d,raceDate:e.target.value}))}
            style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,
              borderRadius:12,padding:"12px 14px",fontFamily:"'Barlow',sans-serif",
              fontWeight:600,fontSize:15,color:T.text,outline:"none",colorScheme:"dark"}}/>
        </div>
      )}
      {hasRace===false && (
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",
          flexDirection:"column",gap:12,padding:"0 32px",textAlign:"center"}}>
          <div style={{fontSize:40}}>🗓</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
            fontSize:18,color:T.textMid}}>{t("ob_race_none")}</div>
          <div style={{fontSize:13,color:T.textDim,lineHeight:1.5}}>{t("ob_race_none_sub")}</div>
        </div>
      )}
      <div style={{padding:"16px 20px 36px"}}>
        <OBBtn label={t("ob_continue")} onClick={onNext}
          disabled={hasRace===null||(hasRace===true&&!data.raceType)}/>
      </div>
    </div>
  );
};

/* ── Screen 4: Baseline Numbers ── */
const OBBaseline = ({onNext, onBack, onSkip, data, setData}) => {
  const t = useT();
  const showFTP = data.sports.includes("bike") || data.sports.includes("tri");
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <OBProgress step={3} total={5} onBack={onBack} onSkip={onSkip} showBack showSkip/>
      <div style={{padding:"24px 20px 0"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:32,color:T.text,letterSpacing:.5,lineHeight:1.1}}>{t("ob_baseline_q")}</div>
        <div style={{fontSize:14,color:T.textMid,marginTop:8,lineHeight:1.5}}>{t("ob_baseline_sub")}</div>
      </div>
      <div style={{flex:1,padding:"24px 20px 0",display:"flex",flexDirection:"column",gap:20}}>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:36,height:36,borderRadius:10,background:"#200010",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>❤️</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                fontSize:15,color:T.text}}>{t("hr_max")}</div>
              <div style={{fontSize:11,color:T.textDim,marginTop:1}}>{t("hr_estimate")}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={data.maxHR||""} onChange={e=>setData(d=>({...d,maxHR:e.target.value}))}
              placeholder="185"
              style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,
                borderRadius:12,padding:"14px",fontFamily:"'Barlow Condensed',sans-serif",
                fontWeight:700,fontSize:28,color:T.text,textAlign:"center",outline:"none"}}/>
            <div style={{display:"flex",alignItems:"center",padding:"0 16px",
              background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,
              fontWeight:700,fontSize:13,color:T.textMid}}>bpm</div>
          </div>
          <div style={{display:"flex",gap:6,marginTop:10}}>
            {[{l:"25",v:"195"},{l:"30",v:"190"},{l:"35",v:"185"},{l:"40",v:"180"},{l:"45",v:"175"}].map(p=>(
              <button key={p.l} onClick={()=>setData(d=>({...d,maxHR:p.v}))}
                style={{flex:1,padding:"6px 2px",borderRadius:8,cursor:"pointer",
                  border:`1px solid ${data.maxHR===p.v?T.accent:T.border}`,
                  background:data.maxHR===p.v?`${T.accent}22`:T.surface,
                  color:data.maxHR===p.v?T.accent:T.textDim,
                  fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,
                  textAlign:"center",lineHeight:1.3}}>
                age<br/>{p.l}
              </button>
            ))}
          </div>
        </div>
        {showFTP && (
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:20,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:36,height:36,borderRadius:10,background:"#1a1400",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:15,color:T.text}}>{t("ftp_title")}</div>
                <div style={{fontSize:11,color:T.textDim,marginTop:1}}>{t("ftp_hint").split(".")[0]}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <input value={data.ftp||""} onChange={e=>setData(d=>({...d,ftp:e.target.value}))}
                placeholder="245"
                style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,
                  borderRadius:12,padding:"14px",fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:700,fontSize:28,color:T.text,textAlign:"center",outline:"none"}}/>
              <div style={{display:"flex",alignItems:"center",padding:"0 16px",
                background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,
                fontWeight:700,fontSize:13,color:T.textMid}}>W</div>
            </div>
          </div>
        )}
      </div>
      <div style={{padding:"20px 20px 36px"}}>
        <OBBtn label={t("ob_continue")} onClick={onNext}/>
      </div>
    </div>
  );
};

/* ── Screen 5: Training Hours ── */
const OBTrainingHours = ({onNext, onBack, onSkip, data, setData}) => {
  const t = useT();
  const hrs = data.hoursPerWeek || 8;
  const setHrs = v => setData(d=>({...d, hoursPerWeek:v}));
  const level = hrs <= 5  ? {l:t("ob_level_base"),  c:T.run,  sub:t("ob_level_base_sub")}
              : hrs <= 10 ? {l:t("ob_level_inter"), c:T.swim, sub:t("ob_level_inter_sub")}
              : hrs <= 15 ? {l:t("ob_level_adv"),   c:T.bike, sub:t("ob_level_adv_sub")}
                          : {l:t("ob_level_elite"),  c:T.tri,  sub:t("ob_level_elite_sub")};
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <OBProgress step={4} total={5} onBack={onBack} onSkip={onSkip} showBack showSkip/>
      <div style={{padding:"24px 20px 0"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:32,color:T.text,letterSpacing:.5,lineHeight:1.1}}>{t("ob_hours_q")}</div>
        <div style={{fontSize:14,color:T.textMid,marginTop:8}}>{t("ob_hours_sub")}</div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",padding:"0 28px"}}>

        {/* Big number */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:96,color:T.text,lineHeight:1}}>
            {hrs >= 20 ? "20+" : hrs}
          </div>
          <div style={{fontSize:14,fontWeight:600,color:T.textMid,letterSpacing:1,
            textTransform:"uppercase",marginTop:4}}>{t("ob_hours_unit")}</div>
        </div>

        {/* Slider */}
        <input type="range" min={3} max={20} value={hrs}
          onChange={e=>setHrs(Number(e.target.value))}
          style={{width:"100%",WebkitAppearance:"none",appearance:"none",
            height:6,borderRadius:3,background:`linear-gradient(to right, ${T.accent} 0%, ${T.accent} ${((hrs-3)/17)*100}%, #2a2a2e ${((hrs-3)/17)*100}%, #2a2a2e 100%)`,
            outline:"none",marginBottom:12}}/>
        <div style={{display:"flex",justifyContent:"space-between",width:"100%",
          marginBottom:32}}>
          <span style={{fontSize:12,color:T.textDim}}>3h</span>
          <span style={{fontSize:12,color:T.textDim}}>20h+</span>
        </div>

        {/* Level badge */}
        <div style={{background:`${level.c}18`,border:`1px solid ${level.c}44`,
          borderRadius:20,padding:"18px 24px",textAlign:"center",width:"100%"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:22,color:level.c,marginBottom:6}}>{level.l}</div>
          <div style={{fontSize:13,color:T.textMid,lineHeight:1.4}}>{level.sub}</div>
        </div>

        {/* Day breakdown */}
        <div style={{display:"flex",gap:8,marginTop:20,width:"100%"}}>
          {[
            {sport:"swim",color:T.swim,bg:T.swimBg,icon:"🏊",pct:.25},
            {sport:"bike",color:T.bike,bg:T.bikeBg,icon:"🚴",pct:.45},
            {sport:"run", color:T.run, bg:T.runBg, icon:"🏃",pct:.30},
          ].map(s=>{
            const h = Math.round(hrs * s.pct * 10)/10;
            const show = data.sports.includes(s.sport) ||
              (data.sports.includes("tri") && (s.sport==="swim"||s.sport==="bike"||s.sport==="run")) ||
              data.sports.includes("tbd");
            if (!show && data.sports.length > 0) return null;
            return(
              <div key={s.sport} style={{flex:1,background:s.bg,border:`1px solid ${s.color}33`,
                borderRadius:14,padding:"10px 8px",textAlign:"center"}}>
                <div style={{fontSize:16}}>{s.icon}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,
                  fontSize:16,color:s.color,marginTop:4}}>{h}h</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{padding:"16px 20px 36px"}}>
        <OBBtn label={t("ob_continue")} onClick={onNext}/>
      </div>
    </div>
  );
};

/* ── Screen 6: Ready ── */
const OBReady = ({onFinish, onBack, data, setData}) => {
  const t = useT();
  const [name, setName] = useState(data.name||"");
  const sportLabels = {
    tri:t("ob_sport_tri"), run:t("ob_sport_run"), bike:t("ob_sport_bike"),
    swim:t("ob_sport_swim"), tbd:t("ob_sport_tbd"),
  };
  const raceLabels = {sprint:"Sprint Tri",olympic:"Olympic Tri","703":"Ironman 70.3",
    ironman:"Ironman",marathon:"Marathon",hm:"Half Marathon",fondo:"Gran Fondo"};

  const filled = [
    data.sports.length > 0, !!data.raceType, !!data.maxHR, !!data.ftp, !!data.hoursPerWeek,
  ].filter(Boolean).length;
  const mostlySkipped = filled <= 1;

  const summaryItems = [
    {icon:"🎯", label:t("ob_sport_focus"), val: data.sports.map(s=>sportLabels[s]).join(" · ")||null},
    {icon:"🏁", label:t("ob_goal_race"),   val: data.raceType ? `${raceLabels[data.raceType]}${data.raceDate?` · ${data.raceDate}`:""}` : null},
    {icon:"❤️", label:t("hr_max"),         val: data.maxHR ? `${data.maxHR} bpm` : null},
    {icon:"⚡", label:"FTP",               val: data.ftp ? `${data.ftp} W` : null},
    {icon:"⏱",  label:t("ob_weekly_hours"),val: data.hoursPerWeek ? `${data.hoursPerWeek >= 20 ? "20+" : data.hoursPerWeek}h` : null},
  ];
  const filledItems  = summaryItems.filter(i => i.val !== null);
  const skippedItems = summaryItems.filter(i => i.val === null);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <OBProgress step={5} total={5} onBack={onBack} showBack showSkip={false}/>
      <div style={{padding:"24px 20px 0"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
          fontSize:32,color:T.text,letterSpacing:.5,lineHeight:1.1}}>
          {mostlySkipped ? t("ob_ready_q_skipped") : t("ob_ready_q")}
        </div>
        <div style={{fontSize:14,color:T.textMid,marginTop:8}}>
          {mostlySkipped ? t("ob_ready_sub_skipped") : t("ob_ready_sub")}
        </div>
      </div>

      <div style={{flex:1,padding:"20px 20px 0",overflowY:"auto",scrollbarWidth:"none"}}>
        <input value={name} onChange={e=>setName(e.target.value)}
          placeholder={t("ep_name")}
          style={{width:"100%",background:T.card,
            border:`1px solid ${name?T.accent:T.border}`,
            borderRadius:14,padding:"16px",fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:700,fontSize:22,color:T.text,outline:"none",
            marginBottom:20,transition:"border-color .2s"}}/>

        {/* What was filled */}
        {filledItems.length > 0 && (
          <div style={{background:T.card,border:`1px solid ${T.border}`,
            borderRadius:20,overflow:"hidden",marginBottom:12}}>
            <div style={{padding:"12px 16px 8px",fontSize:11,fontWeight:700,
              color:T.textDim,letterSpacing:2,textTransform:"uppercase"}}>
              {mostlySkipped ? t("ob_ready_set") : t("ob_ready_profile")}
            </div>
            {filledItems.map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,
                padding:"12px 16px",borderTop:`1px solid ${T.borderSub}`}}>
                <span style={{fontSize:16,width:22,textAlign:"center"}}>{item.icon}</span>
                <span style={{flex:1,fontSize:13,color:T.textMid,fontWeight:500}}>{item.label}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
                  fontSize:14,color:T.text,textAlign:"right",maxWidth:160,
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skipped items — shown as "set up later" nudge */}
        {skippedItems.length > 0 && (
          <div style={{background:T.surface,border:`1px solid ${T.border}`,
            borderRadius:16,padding:"14px 16px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.textDim,
              letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>
              {t("ob_ready_later")}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {skippedItems.map(item=>(
                <span key={item.label} style={{fontSize:12,fontWeight:600,
                  padding:"5px 10px",borderRadius:8,
                  background:T.card,color:T.textDim,
                  border:`1px solid ${T.border}`}}>
                  {item.icon} {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Promise */}
        <div style={{background:`${T.accent}0f`,border:`1px solid ${T.accent}22`,
          borderRadius:16,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:18,flexShrink:0}}>🏅</span>
          <div style={{fontSize:13,color:T.textMid,lineHeight:1.5}}>
          <div style={{fontSize:13,color:T.textMid,lineHeight:1.5}}>{t("ob_ready_promise")}</div>
          </div>
        </div>
      </div>

      <div style={{padding:"16px 20px 36px"}}>
        <OBBtn
          label={`${t("ob_lets_go")}${name ? ", " + name.split(" ")[0] : ""} →`}
          onClick={()=>{ setData(d=>({...d,name})); onFinish(name||"Athlete"); }}
          disabled={!name.trim()}/>
      </div>
    </div>
  );
};

/* ── Onboarding Shell ── */
const Onboarding = ({onComplete, onSkipAll}) => {
  const t = useT();
  const [step, setStep] = useState(0);
  const [dir,  setDir]  = useState("fwd");
  const [data, setData] = useState({
    sports:[], raceType:"", raceDate:"",
    maxHR:"", ftp:"", hoursPerWeek:8, name:"",
  });

  const go = (nextStep) => { setDir(nextStep > step ? "fwd" : "bwd"); setStep(nextStep); };
  const next = () => go(step + 1);
  const back = () => go(step - 1);
  const skip = () => go(step + 1);

  const screens = [
    <OBWelcome onNext={next} onSkipAll={onSkipAll}/>,
    <OBSportFocus onNext={next} onBack={back} data={data} setData={setData}/>,
    <OBGoalRace   onNext={next} onBack={back} onSkip={skip} data={data} setData={setData}/>,
    <OBBaseline   onNext={next} onBack={back} onSkip={skip} data={data} setData={setData}/>,
    <OBTrainingHours onNext={next} onBack={back} onSkip={skip} data={data} setData={setData}/>,
    <OBReady onFinish={name=>onComplete({...data,name})} onBack={back} data={data} setData={setData}/>,
  ];

  return (
    <div style={{position:"absolute",inset:0,background:T.bg,zIndex:200,
      display:"flex",flexDirection:"column",overflow:"hidden",borderRadius:50}}>
      <style>{OB_KEYFRAMES}</style>
      <div style={{position:"relative",flex:1,overflow:"hidden"}}>
        <Slide key={step} dir={dir}>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column"}}>
            {screens[step]}
          </div>
        </Slide>
      </div>
      {step > 0 && step < 5 && (
        <div style={{position:"absolute",bottom:0,left:0,right:0,
          display:"flex",justifyContent:"center",paddingBottom:16,pointerEvents:"none"}}>
          <div onClick={onSkipAll}
            style={{fontSize:12,color:T.textDim,cursor:"pointer",pointerEvents:"all",
              padding:"6px 16px",borderRadius:20,
              background:`${T.surface}ee`,border:`1px solid ${T.border}`}}>
            {t("ob_skip_all")}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function Sportik() {
  const [screen,         setScreen]         = useState("home");
  const [overlay,        setOverlay]        = useState(null);
  const [isDark,         setIsDark]         = useState(true);
  const [onboarded,      setOnboarded]      = useState(false);
  const [profile,        setProfile]        = useState(null);
  const [lang,           setLang]           = useState("en");

  /* ── Shared state lifted from child screens ── */
  const [favs,           setFavs]           = useState([1]);
  const [personalEvents, setPersonalEvents] = useState([EVENTS_DATA[6]]);
  const [doneSessions,   setDoneSessions]   = useState({});
  const [qi,             setQi]             = useState(0);

  /* ── Derived: nearest upcoming favourited event ── */
  const allEvents = [
    ...EVENTS_DATA.filter(e => e.global),
    ...personalEvents,
  ];
  const nextRace = allEvents
    .filter(e => favs.includes(e.id) && e.days > 0)
    .sort((a, b) => a.days - b.days)[0] || null;

  /* ── Derived: live date string ── */
  const dateStr = new Date().toLocaleDateString("en-GB", {
    weekday:"long", day:"numeric", month:"long"
  });

  /* ── Greeting based on time of day ── */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";

  const [prevScreen, setPrevScreen] = useState("home");

  const navigateTo = (id) => {
    setPrevScreen(screen);
    setScreen(id);
    setOverlay(null);
  };

  /* direction: going right in nav order = slide from right, going left = slide from left */
  const screenDir = NAV_ORDER.indexOf(screen) >= NAV_ORDER.indexOf(prevScreen)
    ? "scr-enter" : "scr-enter-back";

  const handleOpenTool = (tool) => { navigateTo("tools"); setOverlay({type:"tool",tool}); };

  const handleOnboardingComplete = (data) => {
    setProfile(data);
    setOnboarded(true);
  };

  const renderOverlay = () => {
    if (!overlay) return null;
    const close = () => setOverlay(null);
    const wrap = (child) => (
      <div className="ov-slide-up" style={{position:"absolute",inset:0,zIndex:80}}>
        {child}
      </div>
    );
    switch(overlay.type) {
      case "tool":        return wrap(<ToolDetail tool={overlay.tool} onBack={close}/>);
      case "pr":          return wrap(<PRDetail pr={overlay.pr} onBack={close}/>);
      case "plan":        return wrap(<PlanOverlay onBack={close}/>);
      case "about":       return wrap(<AboutOverlay onBack={close}/>);
      case "editProfile": return wrap(<EditProfileOverlay profile={overlay.profile} onSave={overlay.onSave} onBack={close}/>);
      case "hrZones":     return wrap(<HRZonesOverlay maxHR={overlay.maxHR} hrMethod={overlay.hrMethod} onSave={overlay.onSave} onBack={close}/>);
      default:            return null;
    }
  };

  return (
    <LangCtx.Provider value={lang}>
    <ThemeCtx.Provider value={isDark}>
      <style>{CSS}</style>
      <style>{ANIM_CSS}</style>
      <div className="outer">
        <div style={{textAlign:"center"}}>
          <div className="wm">SPORT<span>IK</span></div>
          <div className="wmsub">
            {onboarded
              ? `Welcome, ${profile?.name||"Athlete"} · Full App`
              : "Complete onboarding or skip to enter the app"}
          </div>
        </div>

        {onboarded && (
          <button onClick={()=>setOnboarded(false)}
            style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,
              padding:"8px 16px",fontFamily:"'Barlow',sans-serif",fontWeight:600,
              fontSize:12,color:T.textMid,cursor:"pointer",letterSpacing:.5}}>
            ← Preview Onboarding Again
          </button>
        )}

        <div className={`phone ${isDark?"":"light"}`}>
          <div className="notch"/>

          {!onboarded && (
            <Onboarding
              onComplete={handleOnboardingComplete}
              onSkipAll={()=>handleOnboardingComplete({
                name:"Athlete",sports:[],raceType:"",raceDate:"",maxHR:"",ftp:"",hoursPerWeek:8
              })}
            />
          )}

          {onboarded && (<>
            <div className="sbar">
              <span className="st">9:41</span>
              <div className="sdots"><div className="sdot"/><div className="sdot"/><div className="sdot"/></div>
            </div>

            {/* animated screen wrapper — key forces remount on screen change */}
            <div key={screen} className={screenDir}
              style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>

              {screen==="home" && (
                <HomeScreen
                  onOpenTool={handleOpenTool}
                  onOpenPlan={()=>setOverlay({type:"plan"})}
                  profile={profile}
                  nextRace={nextRace}
                  dateStr={dateStr}
                  greeting={greeting}
                  doneSessions={doneSessions}
                  setDoneSessions={setDoneSessions}
                  qi={qi}
                  setQi={setQi}
                />
              )}
              {screen==="tools" && (
                <ToolsScreen onSelect={t=>setOverlay({type:"tool",tool:t})}/>
              )}
              {screen==="events" && (
                <EventsScreen
                  favs={favs}
                  setFavs={setFavs}
                  personalEvents={personalEvents}
                  setPersonalEvents={setPersonalEvents}
                />
              )}
              {screen==="account" && (
                <AccountScreen
                  setOverlay={setOverlay}
                  isDark={isDark}
                  setIsDark={setIsDark}
                  profile={profile || {name:"Athlete",city:"Kyiv",focus:"Triathlete",avatar:"🧑"}}
                  setProfile={setProfile}
                  lang={lang}
                  setLang={setLang}
                />
              )}
            </div>

            {renderOverlay()}
            <BottomNav screen={screen} setScreen={navigateTo} setOverlay={setOverlay}/>
          </>)}
        </div>

        <div style={{fontSize:12,color:"#404050",textAlign:"center",maxWidth:390,lineHeight:1.6}}>
          {onboarded
            ? "Screen transitions · Slide-up overlays · Nav indicator · Sheet animations"
            : "Complete onboarding · All data feeds into your profile"}
        </div>
      </div>
    </ThemeCtx.Provider>
    </LangCtx.Provider>
  );
}
