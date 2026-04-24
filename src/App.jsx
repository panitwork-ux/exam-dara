import { useState, useEffect, useCallback } from "react";

// ─── Google Font ───────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800;900&display=swap";
document.head.appendChild(fontLink);

// ─── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
  :root {
    --red: #C8102E; --red-d: #9B0C22; --red-m: #E8192F;
    --red-l: #FFF0F2; --red-s: #FFE4E8;
    --white: #fff; --bg: #F2F2F7; --surf: #fff; --surf2: #F2F2F7; --surf3: #E5E5EA;
    --t1: #1C1C1E; --t2: #3C3C43; --t3: #8E8E93; --t4: #C7C7CC;
    --ok: #30D158; --ok-bg: #F0FFF4;
    --warn: #FF9F0A; --warn-bg: #FFFBF0;
    --info: #0A84FF; --info-bg: #EFF6FF;
    --bad: #FF3B30; --bad-bg: #FFF1F0;
    --glass: rgba(255,255,255,0.78);
    --sh: 0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
    --sh-red: 0 8px 28px rgba(200,16,46,0.30);
    --sh-lg: 0 16px 48px rgba(0,0,0,0.13);
    --r: 14px; --r-lg: 20px; --r-xl: 26px; --r-2xl: 32px;
    --font: 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { font-family: var(--font); background: var(--bg); color: var(--t1);
    -webkit-font-smoothing: antialiased; overflow: hidden; height: 100vh; }
  #root { height: 100vh; overflow: hidden; }

  .app { height: 100vh; display: flex; flex-direction: column; max-width: 430px; margin: 0 auto;
    background: var(--bg); position: relative; overflow: hidden; }

  /* screens */
  .screen { position: absolute; inset: 0; display: flex; flex-direction: column;
    transform: translateY(100%); transition: transform 0.38s cubic-bezier(0.34,1.1,0.64,1);
    background: var(--bg); }
  .screen.active { transform: translateY(0); z-index: 10; }
  .screen.prev   { transform: translateY(-6%) scale(0.97); z-index: 5; }

  /* scroll */
  .scroll { flex: 1; overflow-y: auto; padding-bottom: 90px; }
  .scroll::-webkit-scrollbar { width: 0; }

  /* top hero bar */
  .hero-bar {
    background: linear-gradient(150deg, var(--red) 0%, var(--red-d) 100%);
    padding: 54px 20px 0; position: relative; overflow: hidden;
  }
  .hero-bar::before { content:''; position:absolute; top:-60px; right:-60px;
    width:200px; height:200px; background:rgba(255,255,255,0.07); border-radius:50%; }
  .hero-bar-inner { padding: 10px 0 20px; display: flex; align-items: center;
    justify-content: space-between; }
  .hero-bar-title { font-size: 19px; font-weight: 800; color: #fff; letter-spacing: -0.4px; }
  .hero-bar-back { background: rgba(255,255,255,0.18); border: none; color: #fff;
    width: 34px; height: 34px; border-radius: 50%; font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; }
  .hero-bar-pill { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
    color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 13px;
    font-weight: 700; cursor: pointer; border-width: 0; font-family: var(--font); }
  .tab-shelf { background: var(--bg); border-radius: 28px 28px 0 0; height: 18px; }

  /* tab bar */
  .tabbar { position: absolute; bottom: 0; left: 0; right: 0; z-index: 100;
    background: rgba(255,255,255,0.82); backdrop-filter: blur(20px) saturate(180%);
    border-top: 1px solid rgba(0,0,0,0.07);
    display: grid; grid-template-columns: repeat(5,1fr);
    padding: 10px 0 28px; }
  .tab { display: flex; flex-direction: column; align-items: center; gap: 3px;
    border: none; background: none; font-family: var(--font); cursor: pointer;
    padding: 2px 0; transition: transform .15s; }
  .tab:active { transform: scale(0.88); }
  .tab-ico { font-size: 22px; transition: transform .22s cubic-bezier(0.34,1.3,0.64,1); }
  .tab-lbl { font-size: 10px; font-weight: 500; color: var(--t3); }
  .tab.on .tab-lbl { color: var(--red); font-weight: 700; }
  .tab.on .tab-ico { transform: scale(1.12); }
  .tab-scan-wrap { background: linear-gradient(145deg,var(--red),var(--red-d));
    width: 52px; height: 52px; border-radius: 17px;
    display: flex; align-items: center; justify-content: center;
    margin-top: -22px; box-shadow: var(--sh-red); font-size: 26px; }
  .tab-scan-lbl { color: var(--red) !important; font-weight: 700 !important; }

  /* card */
  .card { background: var(--surf); border-radius: var(--r-lg); box-shadow: var(--sh); overflow: hidden; }
  .sec-lbl { font-size: 13px; font-weight: 600; color: var(--t3);
    text-transform: uppercase; letter-spacing: .6px; padding: 18px 20px 6px; }

  /* row */
  .row { display: flex; align-items: center; gap: 13px; padding: 13px 16px;
    background: var(--surf); cursor: pointer; transition: background .15s; min-height: 52px; }
  .row:active { background: var(--surf2); }
  .row-ico { width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .row-body { flex: 1; min-width: 0; }
  .row-title { font-size: 15px; font-weight: 500; }
  .row-sub { font-size: 12px; color: var(--t3); margin-top: 1px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .chev { color: var(--t4); font-size: 14px; }

  /* groups */
  .group { margin: 0 16px 18px; }
  .group .card { border-radius: 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .group .card:first-child { border-radius: var(--r-lg) var(--r-lg) 0 0; }
  .group .card:last-child  { border-radius: 0 0 var(--r-lg) var(--r-lg); border-bottom: none; }
  .group .card:only-child  { border-radius: var(--r-lg); }

  /* pill */
  .pill { display: inline-flex; align-items: center; padding: 3px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 700; }
  .pill-green { background: var(--ok-bg);   color: #15803D; }
  .pill-warn  { background: var(--warn-bg); color: #92400E; }
  .pill-gray  { background: var(--surf2);   color: var(--t3); }
  .pill-red   { background: var(--red-s);   color: var(--red-d); }
  .pill-blue  { background: var(--info-bg); color: #1D4ED8; }

  /* buttons */
  .btn { display: flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer; font-family: var(--font); font-weight: 700;
    border-radius: var(--r-2xl); transition: all .18s; letter-spacing: -.2px; }
  .btn:active { transform: scale(0.96); }
  .btn-primary { background: linear-gradient(145deg,var(--red),var(--red-d));
    color: #fff; padding: 15px 24px; font-size: 16px; width: 100%; box-shadow: var(--sh-red); }
  .btn-secondary { background: var(--red-l); color: var(--red); padding: 13px 24px;
    font-size: 15px; width: 100%; }
  .btn-ghost { background: var(--surf2); color: var(--t1); padding: 13px 24px;
    font-size: 15px; width: 100%; }
  .btn-sm { padding: 9px 18px; font-size: 13px; width: auto; border-radius: var(--r); }
  .btn-xs { padding: 7px 13px; font-size: 12px; width: auto; border-radius: 10px; }
  .btn-danger { background: var(--bad-bg); color: var(--bad); padding: 13px 24px;
    font-size: 15px; width: 100%; }

  /* field */
  .field { margin-bottom: 14px; }
  .flbl { font-size: 13px; font-weight: 600; color: var(--t2); margin-bottom: 6px; display: block; }
  .finp, .fsel { width: 100%; background: var(--surf); border: 1.5px solid var(--surf3);
    border-radius: var(--r); padding: 13px 15px; font-size: 15px;
    font-family: var(--font); color: var(--t1); outline: none;
    transition: border-color .2s, box-shadow .2s; appearance: none; }
  .finp:focus, .fsel:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(200,16,46,.11); }
  .fhint { font-size: 12px; color: var(--t3); margin-top: 4px; }
  .frow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* toggle chip */
  .tchip { padding: 8px 15px; border-radius: 20px; border: 2px solid var(--surf3);
    background: var(--surf); font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: var(--font); color: var(--t3); transition: all .18s; }
  .tchip.on { border-color: var(--red); background: var(--red-l);
    color: var(--red); font-weight: 700; }

  /* steps */
  .steps { display: flex; align-items: center; gap: 6px; padding: 14px 20px; }
  .sdot { width: 26px; height: 26px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
  .sdot-done   { background: var(--ok);   color: #fff; }
  .sdot-active { background: var(--red);  color: #fff; }
  .sdot-todo   { background: var(--surf2); color: var(--t3); }
  .sline { flex: 1; height: 2px; background: var(--surf2); }
  .sline-done  { background: var(--ok); }

  /* stats */
  .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0 16px 16px; }
  .stat-box { background: var(--surf); border-radius: var(--r-lg); padding: 16px;
    box-shadow: var(--sh); }
  .stat-num { font-size: 28px; font-weight: 800; letter-spacing: -1px; color: var(--red); }
  .stat-lbl { font-size: 12px; color: var(--t3); margin-top: 2px; }

  /* hero banner */
  .hero-banner { margin: 0 16px 18px; border-radius: var(--r-2xl);
    background: linear-gradient(145deg,var(--red),var(--red-d));
    padding: 22px; color: #fff; position: relative; overflow: hidden; }
  .hero-banner::before { content:''; position:absolute; top:-40px; right:-40px;
    width:150px; height:150px; background:rgba(255,255,255,0.07); border-radius:50%; }
  .hb-title { font-size: 18px; font-weight: 800; letter-spacing: -.4px; margin-bottom: 3px; }
  .hb-sub   { font-size: 13px; opacity: .8; margin-bottom: 16px; }
  .hb-btn   { display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.28);
    color: #fff; padding: 9px 16px; border-radius: 12px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: var(--font); transition: background .2s; }
  .hb-btn:hover { background: rgba(255,255,255,.25); }

  /* unassigned */
  .unassigned-banner { margin: 0 16px 16px;
    background: linear-gradient(135deg,#FF9F0A,#FF6B00);
    border-radius: var(--r-xl); padding: 16px 18px; color: #fff;
    display: flex; align-items: center; gap: 14px; cursor: pointer;
    transition: transform .15s; }
  .unassigned-banner:active { transform: scale(0.98); }

  /* quick grid */
  .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0 16px 18px; }
  .qbtn { background: var(--surf); border-radius: var(--r-xl); padding: 18px 14px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    box-shadow: var(--sh); border: none; cursor: pointer; font-family: var(--font);
    transition: all .2s; }
  .qbtn:active { transform: scale(0.96); background: var(--red-l); }
  .qbtn-ico { font-size: 28px; }
  .qbtn-t { font-size: 13px; font-weight: 700; color: var(--t1); }
  .qbtn-s { font-size: 11px; color: var(--t3); }

  /* avatar */
  .av { border-radius: 50%; background: linear-gradient(135deg,var(--red),var(--red-d));
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 800; flex-shrink: 0; }

  /* bottom sheet overlay */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45);
    backdrop-filter: blur(8px); z-index: 500;
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn .22s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .sheet { background: var(--bg); border-radius: 26px 26px 0 0;
    width: 100%; max-width: 430px; max-height: 90vh; overflow-y: auto;
    padding-bottom: 36px; animation: sheetUp .32s cubic-bezier(0.34,1.1,0.64,1); }
  @keyframes sheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  .sheet::-webkit-scrollbar { width: 0; }
  .sheet-handle { width: 38px; height: 4px; background: var(--surf3);
    border-radius: 2px; margin: 12px auto 0; }
  .sheet-title { font-size: 17px; font-weight: 800; padding: 18px 20px 12px;
    letter-spacing: -.3px; }

  /* bar chart */
  .bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .bar-lbl { font-size: 13px; font-weight: 700; width: 18px; text-align: right; }
  .bar-track { flex: 1; background: var(--surf2); border-radius: 4px; height: 26px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center;
    padding-left: 10px; font-size: 12px; font-weight: 700; color: #fff;
    transition: width 1.1s cubic-bezier(0.34,1.1,0.64,1); }
  .bar-cnt { font-size: 12px; color: var(--t3); min-width: 34px; }

  /* item analysis */
  .ia-row { display: flex; align-items: center; gap: 10px; padding: 6px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05); }
  .ia-row:last-child { border-bottom: none; }
  .ia-n { font-size: 12px; font-weight: 700; color: var(--t3); min-width: 22px; }
  .ia-track { flex: 1; background: var(--surf2); border-radius: 3px; height: 10px; overflow: hidden; }
  .ia-fill  { height: 100%; border-radius: 3px; }
  .ia-pct   { font-size: 11px; font-weight: 700; min-width: 34px; text-align: right; }

  /* answer grid */
  .ans-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 6px; }
  .ans-cell { aspect-ratio:1; border-radius: 10px; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    border: 1.5px solid rgba(0,0,0,0.08); }
  .ans-cell-n { font-size: 9px; color: var(--t3); }
  .ans-cell-a { font-size: 14px; font-weight: 800; }
  .ans-ok  { background: var(--ok-bg);  border-color: var(--ok);  color: #15803D; }
  .ans-bad { background: var(--bad-bg); border-color: var(--bad); color: var(--bad); }

  /* sheet preview (answer sheet) */
  .sheet-prev { background: #fff; border: 1.5px dashed #FFD6DC;
    border-radius: var(--r-lg); padding: 14px; font-size: 11px; }
  .bubble { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid #333;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; }
  .bubble-filled { background: #1C1C1E; color: #fff; border-color: #1C1C1E; }

  /* logo preview */
  .logo-prev { width: 100%; height: 100px; background: var(--surf2);
    border: 2px dashed var(--surf3); border-radius: var(--r);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: var(--t3); overflow: hidden; }
  .logo-prev img { width: 100%; height: 100%; object-fit: contain; }

  /* student pick */
  .pick-row { display: flex; align-items: center; gap: 12px; padding: 12px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.05); cursor: pointer; transition: background .15s; }
  .pick-row:active { background: var(--surf2); }
  .pick-check { width: 24px; height: 24px; border-radius: 50%;
    border: 2px solid var(--surf3); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 12px; }
  .pick-check-on { background: var(--ok); border-color: var(--ok); color: #fff; }

  /* toast */
  .toast { position: fixed; bottom: 100px; left: 50%;
    transform: translateX(-50%) translateY(16px);
    background: rgba(28,28,30,.92); color: #fff; backdrop-filter: blur(16px);
    padding: 11px 22px; border-radius: 22px; font-size: 14px; font-weight: 500;
    z-index: 9999; pointer-events: none; white-space: nowrap;
    opacity: 0; transition: all .28s; }
  .toast-show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* login */
  .login-screen { background: linear-gradient(160deg,var(--red-d) 0%,var(--red) 55%,#FF4D6A 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 40px 24px; min-height: 100vh; flex-direction: column; }
  .login-glass { background: rgba(255,255,255,.14); backdrop-filter: blur(28px) saturate(200%);
    border: 1px solid rgba(255,255,255,.22); border-radius: var(--r-2xl);
    padding: 32px 24px; width: 100%; max-width: 380px; }
  .login-logo { width: 80px; height: 80px; background: rgba(255,255,255,.18);
    border-radius: 24px; margin: 0 auto 20px; display: flex; align-items: center;
    justify-content: center; font-size: 40px; border: 1.5px solid rgba(255,255,255,.25); }
  .login-title { color: #fff; font-size: 28px; font-weight: 900; text-align: center;
    letter-spacing: -.8px; }
  .login-sub   { color: rgba(255,255,255,.72); font-size: 14px; text-align: center; margin-top: 4px; }
  .google-btn  { width: 100%; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.28);
    color: #fff; padding: 14px 20px; font-size: 15px; font-weight: 700;
    font-family: var(--font); border-radius: var(--r-xl); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background .2s; margin-bottom: 10px; }
  .google-btn:hover { background: rgba(255,255,255,.25); }
  .demo-btn { width: 100%; background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.18);
    color: rgba(255,255,255,.9); padding: 13px; font-size: 14px; font-family: var(--font);
    border-radius: var(--r-xl); cursor: pointer; margin-bottom: 10px; }
  .admin-btn { width: 100%; background: rgba(100,0,200,.22); border: 1px solid rgba(200,150,255,.28);
    color: #E9D5FF; padding: 12px; font-size: 13px; font-family: var(--font);
    border-radius: var(--r-xl); cursor: pointer; }

  /* camera area */
  .cam-area { margin: 0 16px 14px; background: #1C1C1E; border-radius: var(--r-2xl);
    height: 290px; display: flex; flex-direction: column; align-items: center;
    justify-content: center; cursor: pointer; position: relative; overflow: hidden; }
  .cam-area::before { content:''; position:absolute; inset:0;
    background: repeating-linear-gradient(45deg,transparent,transparent 22px,
    rgba(255,255,255,.015) 22px,rgba(255,255,255,.015) 44px); }
  .cam-frame { position: absolute; inset: 18%; border: 2.5px solid var(--warn);
    border-radius: 16px; animation: camPulse 2s infinite; }
  @keyframes camPulse {
    0%,100%{border-color:var(--warn);box-shadow:0 0 0 0 rgba(255,159,10,.4)}
    50%{border-color:#FFD60A;box-shadow:0 0 0 8px rgba(255,159,10,0)}
  }
  .cam-corner { position: absolute; width: 18px; height: 18px; border-color: var(--warn); border-style: solid; }
  .cam-tl { top:18%;left:18%; border-width:3px 0 0 3px; border-radius:4px 0 0 0; }
  .cam-tr { top:18%;right:18%; border-width:3px 3px 0 0; border-radius:0 4px 0 0; }
  .cam-bl { bottom:18%;left:18%; border-width:0 0 3px 3px; border-radius:0 0 0 4px; }
  .cam-br { bottom:18%;right:18%; border-width:0 3px 3px 0; border-radius:0 0 4px 0; }

  /* profile hero */
  .prof-hero { background: linear-gradient(145deg,var(--red),var(--red-d));
    padding: 60px 20px 28px; text-align: center; color: #fff; }
  .prof-av { width: 72px; height: 72px; border-radius: 50%;
    background: rgba(255,255,255,.2); border: 2.5px solid rgba(255,255,255,.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 800; margin: 0 auto 12px; }
  .admin-badge { background: linear-gradient(135deg,#7C3AED,#5B21B6);
    color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }

  /* drop zone */
  .drop-zone { border: 2px dashed var(--red-s); border-radius: var(--r-lg);
    background: var(--red-l); padding: 26px; text-align: center; cursor: pointer; transition: all .2s; }
  .drop-zone:hover { border-color: var(--red); background: #FFECEF; }

  /* chip */
  .chip { display: inline-flex; align-items: center; gap: 5px; background: var(--red-l);
    color: var(--red-d); padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 3px; }

  /* prog */
  .prog-t { background: var(--surf2); border-radius: 6px; height: 8px; overflow: hidden; }
  .prog-f { height: 100%; border-radius: 6px;
    background: linear-gradient(90deg,var(--red),var(--red-m)); transition: width .7s ease; }

  @media (prefers-color-scheme: dark) { /* keep light for medical/school feel */ }
`;

// ─── Inject CSS ────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = CSS;
document.head.appendChild(style);

// ─── Data ──────────────────────────────────────────────────────────────────
const STUDENTS = [
  { id:"66001", name:"นายสมชาย ใจดี",         room:"ม.3/1", no:1, score:86 },
  { id:"66002", name:"น.ส.วิภา สวยงาม",       room:"ม.3/1", no:2, score:93 },
  { id:"66003", name:"ด.ช.ปิยะ มีสุข",        room:"ม.3/1", no:3, score:54 },
  { id:"66004", name:"น.ส.กนกวรรณ ดีมาก",     room:"ม.3/1", no:4, score:78 },
  { id:"66005", name:"นายอนันต์ รักเรียน",     room:"ม.3/1", no:5, score:70 },
  { id:"66006", name:"น.ส.สุภาพร แสนดี",      room:"ม.3/2", no:1, score:88 },
  { id:"66007", name:"ด.ช.ภานุพงศ์ เก่งมาก",  room:"ม.3/2", no:2, score:62 },
];
const COLORS = ["#C8102E","#EC4899","#F59E0B","#10B981","#8B5CF6","#0A84FF","#FF6B00","#06B6D4"];
const ITEM_DATA = [85,70,90,45,80,60,75,88,35,92,65,78,55,82,70,45,88,76,60,92,80,70,65,85,50,78,90,62,88,75];

// ─── Utils ─────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  let timer;
  const toast = useCallback((m, dur = 2600) => {
    setMsg(m); setShow(true);
    clearTimeout(timer);
    timer = setTimeout(() => setShow(false), dur);
  }, []);
  return { msg, show, toast };
}

function useClock() {
  const [time, setTime] = useState(() => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`;
  });
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setTime(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`);
    }, 10000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function TabBar({ tab, setTab, setScreen }) {
  const tabs = [
    { id:"home",     icon:"🏠", label:"หน้าหลัก" },
    { id:"design",   icon:"🎨", label:"ออกแบบ" },
    { id:"scan",     icon:"📷", label:"สแกน",    scan:true },
    { id:"students", icon:"👥", label:"นักเรียน" },
    { id:"report",   icon:"📊", label:"รายงาน" },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <button key={t.id} className={`tab${tab===t.id?" on":""}`}
          onClick={() => { setTab(t.id); setScreen(t.id); }}>
          {t.scan
            ? <div className="tab-scan-wrap">{t.icon}</div>
            : <span className="tab-ico">{t.icon}</span>}
          <span className={`tab-lbl${t.scan?" tab-scan-lbl":""}`}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function HeroBar({ title, onBack, action, onAction }) {
  return (
    <div className="hero-bar">
      <div className="hero-bar-inner">
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="hero-bar-back" onClick={onBack}>←</button>
          <span className="hero-bar-title">{title}</span>
        </div>
        {action && <button className="hero-bar-pill" onClick={onAction}>{action}</button>}
      </div>
      <div className="tab-shelf"/>
    </div>
  );
}

function Sheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle"/>
        {title && <div className="sheet-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}

function StudentAvatar({ name, idx, size=44 }) {
  const c1 = COLORS[idx % COLORS.length], c2 = COLORS[(idx+2) % COLORS.length];
  return (
    <div className="av" style={{width:size,height:size,fontSize:size*0.36,
      background:`linear-gradient(135deg,${c1},${c2})`}}>
      {name[3] || name[0] || "?"}
    </div>
  );
}

// ─── SCREENS ───────────────────────────────────────────────────────────────

// LOGIN
function LoginScreen({ onLogin, onAdmin }) {
  return (
    <div className="login-screen">
      <div className="login-glass">
        <div className="login-logo">🏫</div>
        <div className="login-title">ExamScan</div>
        <div className="login-sub">โรงเรียนดาราวิทยาลัย</div>
        <div style={{height:28}}/>
        <button className="google-btn" onClick={() => onLogin("google")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          เข้าสู่ระบบด้วย Google (เมลโรงเรียน)
        </button>
        <button className="demo-btn" onClick={() => onLogin("demo")}>🎯 ทดลองใช้งาน (Demo)</button>
        <button className="admin-btn" onClick={onAdmin}>🔑 Admin Panel</button>
        <div style={{marginTop:20,textAlign:"center",fontSize:11,color:"rgba(255,255,255,.5)"}}>
          รองรับ Google Workspace for Education<br/>ข้อมูลบันทึกใน Google Drive ของคุณ
        </div>
      </div>
    </div>
  );
}

// HOME
function HomeScreen({ setScreen, setTab, queue, user }) {
  return (
    <>
      {/* Top curved header */}
      <div style={{background:"linear-gradient(150deg,var(--red),var(--red-d))",paddingTop:54,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,
          background:"rgba(255,255,255,.07)",borderRadius:"50%"}}/>
        <div style={{padding:"10px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.75)",marginBottom:2}}>สวัสดีครับ</div>
            <div style={{fontSize:20,fontWeight:800,color:"#fff",letterSpacing:"-.5px"}}>
              {user?.name?.split(" ")[0] || "คุณครู"} 👋
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{position:"relative"}}>
              <span style={{fontSize:22,cursor:"pointer"}}>🔔</span>
              <div style={{position:"absolute",top:-2,right:-2,width:8,height:8,
                background:"#FF3B30",borderRadius:"50%",border:"2px solid var(--red-d)"}}/>
            </div>
            <div className="av" style={{width:38,height:38,fontSize:15,cursor:"pointer",
              background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.3)"}}
              onClick={() => { setScreen("profile"); setTab(""); }}>
              {user?.initial || "S"}
            </div>
          </div>
        </div>
        <div className="stats-row" style={{paddingTop:16}}>
          {[["248","👥 นักเรียน"],["12","📋 ข้อสอบ"],["1,840","✅ ตรวจแล้ว"],["73%","📊 เฉลี่ย"]].map(([n,l],i)=>(
            <div key={i} className="stat-box">
              <div className="stat-num" style={i===3?{color:"var(--ok)"}:{}}>{n}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>
        <div style={{background:"var(--bg)",borderRadius:"28px 28px 0 0",height:18}}/>
      </div>

      <div className="scroll" style={{paddingTop:0}}>
        {/* Unassigned banner */}
        {queue.length > 0 && (
          <div className="unassigned-banner" onClick={() => setScreen("queue")}>
            <div style={{fontSize:32}}>⚠️</div>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:800}}>กระดาษรอระบุชื่อ</div>
              <div style={{fontSize:13,opacity:.85}}>QR อ่านไม่ได้ / ไม่มีชื่อ — แตะเพื่อจัดการ</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:34,fontWeight:900}}>{queue.length}</div>
              <div style={{fontSize:11,opacity:.8}}>ใบ</div>
            </div>
          </div>
        )}

        {/* Hero scan */}
        <div className="hero-banner">
          <div className="hb-title">📷 พร้อมตรวจข้อสอบ?</div>
          <div className="hb-sub">ผลออกภายใน 3 วินาที • Plan B รองรับ QR อ่านไม่ได้</div>
          <button className="hb-btn" onClick={() => { setScreen("scan"); setTab("scan"); }}>
            เริ่มสแกนเลย →
          </button>
        </div>

        {/* Quick actions */}
        <div className="quick-grid">
          {[
            ["🎨","ออกแบบกระดาษ","สร้างใหม่","design"],
            ["👥","รายชื่อนักเรียน","import / จัดการ","students"],
            ["📊","รายงานคะแนน","วิเคราะห์ผล","report"],
            ["📋","ชุดข้อสอบ","ดูทั้งหมด","exams"],
          ].map(([ico,t,s,sc]) => (
            <button key={sc} className="qbtn" onClick={() => { setScreen(sc); setTab(sc); }}>
              <span className="qbtn-ico">{ico}</span>
              <span className="qbtn-t">{t}</span>
              <span className="qbtn-s">{s}</span>
            </button>
          ))}
        </div>

        {/* Recent exams */}
        <div className="sec-lbl">ข้อสอบล่าสุด</div>
        <div className="group">
          {[
            ["🧮","คณิตศาสตร์ ม.3 ปลายภาค","ม.3/1 • 30 ข้อ",<span className="pill pill-green">✅ เสร็จ</span>],
            ["🔬","วิทยาศาสตร์ ม.2","ม.2/2 • 40 ข้อ • กำลังตรวจ",<span className="pill pill-warn">🔄 ตรวจ</span>],
            ["📚","ภาษาไทย ม.1","ม.1/3 • 50 ข้อ • รอตรวจ",<span className="pill pill-gray">⏳ รอ</span>],
          ].map(([ico,name,sub,badge],i) => (
            <div key={i} className="row card" onClick={() => { setScreen("report"); setTab("report"); }}>
              <div className="row-ico" style={{background:["var(--red-l)","var(--info-bg)","var(--warn-bg)"][i]}}>{ico}</div>
              <div className="row-body">
                <div className="row-title">{name}</div>
                <div className="row-sub">{sub}</div>
              </div>
              <div className="row-right">{badge}<span className="chev">›</span></div>
            </div>
          ))}
        </div>
        <div style={{height:8}}/>
      </div>
    </>
  );
}

// DESIGN
function DesignScreen({ onBack, toast, schoolLogo, schoolName }) {
  const [step, setStep] = useState(1);
  const [numQ, setNumQ] = useState(30);
  const [choice, setChoice] = useState("ก-ง");
  const [fills, setFills] = useState([]);
  const [fillFrom, setFillFrom] = useState("");
  const [fillTo, setFillTo] = useState("");
  const [examName, setExamName] = useState("");
  const [answerKey, setAnswerKey] = useState({});

  const choices = { "ก-ง":["ก","ข","ค","ง"], "A-D":["A","B","C","D"], "A-E":["A","B","C","D","E"], "1-4":["1","2","3","4"] }[choice];

  const addFill = () => {
    if (!fillFrom) return;
    setFills(f => [...f, fillTo ? `ข้อ ${fillFrom}–${fillTo}` : `ข้อ ${fillFrom}`]);
    setFillFrom(""); setFillTo("");
  };

  const StepDot = ({ n }) => {
    const cls = n < step ? "sdot sdot-done" : n === step ? "sdot sdot-active" : "sdot sdot-todo";
    return <div className={cls}>{n < step ? "✓" : n}</div>;
  };
  const StepLine = ({ n }) => <div className={`sline${n < step ? " sline-done" : ""}`}/>;

  return (
    <>
      <HeroBar title="ออกแบบกระดาษคำตอบ" onBack={onBack}/>
      <div className="scroll" style={{paddingTop:0}}>
        {/* Steps */}
        <div className="steps">
          <StepDot n={1}/><StepLine n={1}/><StepDot n={2}/><StepLine n={2}/><StepDot n={3}/>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="sec-lbl">ข้อมูลข้อสอบ</div>
            <div style={{padding:"0 16px 4px"}}>
              <div className="card" style={{padding:16}}>
                <div className="field">
                  <label className="flbl">ชื่อวิชา / ชุดข้อสอบ</label>
                  <input className="finp" placeholder="เช่น คณิตศาสตร์ ม.3 ปลายภาค"
                    value={examName} onChange={e => setExamName(e.target.value)}/>
                </div>
                <div className="frow">
                  <div className="field"><label className="flbl">ห้องเรียน</label><input className="finp" placeholder="ม.3/1"/></div>
                  <div className="field"><label className="flbl">ปีการศึกษา</label><input className="finp" defaultValue="2568"/></div>
                </div>
                <div className="field">
                  <label className="flbl">จำนวนข้อ</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                    {[10,20,30,40,50,100].map(n => (
                      <button key={n} className={`tchip${numQ===n?" on":""}`}
                        onClick={() => setNumQ(n)}>{n}</button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="flbl">รูปแบบตัวเลือก</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>
                    {["ก-ง","A-D","A-E","1-4"].map(c => (
                      <button key={c} className={`tchip${choice===c?" on":""}`}
                        onClick={() => setChoice(c)}>
                        {{"ก-ง":"ก ข ค ง","A-D":"A B C D","A-E":"A B C D E","1-4":"1 2 3 4"}[c]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="sec-lbl">ช่องเติมตัวเลข (วิชาคำนวณ)</div>
            <div style={{padding:"0 16px 4px"}}>
              <div className="card" style={{padding:16}}>
                <div style={{display:"flex",gap:8}}>
                  <input className="finp" style={{flex:1}} placeholder="ข้อที่เริ่ม"
                    value={fillFrom} onChange={e => setFillFrom(e.target.value)}/>
                  <input className="finp" style={{flex:1}} placeholder="ถึงข้อ"
                    value={fillTo} onChange={e => setFillTo(e.target.value)}/>
                  <button className="btn btn-secondary btn-sm" onClick={addFill}>เพิ่ม</button>
                </div>
                <div className="fhint" style={{marginTop:6}}>ระบุช่วงข้อที่เติมตัวเลข เช่น 26–30</div>
                <div style={{marginTop:10}}>
                  {fills.map((f,i) => (
                    <span key={i} className="chip">{f}
                      <span style={{cursor:"pointer",color:"var(--red)"}}
                        onClick={() => setFills(arr => arr.filter((_,j) => j!==i))}>✕</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{padding:"16px 16px 20px"}}>
              <button className="btn btn-primary" onClick={() => setStep(2)}>ถัดไป: ดูตัวอย่าง →</button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div className="sec-lbl">ตัวอย่างกระดาษคำตอบ</div>
            <div style={{margin:"0 16px 16px"}}>
              <div className="sheet-prev">
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  {[0,1,2].map(i => <div key={i} style={{width:10,height:10,background:"#000",borderRadius:2}}/>)}
                </div>
                <div style={{textAlign:"center",marginBottom:10}}>
                  {schoolLogo
                    ? <img src={schoolLogo} style={{height:30,marginBottom:4}} alt="logo"/>
                    : <div style={{fontSize:12,fontWeight:800,color:"var(--red)"}}>{schoolName}</div>}
                  <div style={{fontSize:13,fontWeight:800,marginTop:2}}>{examName||"ชุดข้อสอบ"}</div>
                  <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>ชื่อ................ รหัส................ ห้อง........</div>
                  <div style={{marginTop:4,fontSize:9,border:"1px solid #ddd",display:"inline-block",padding:"2px 8px",borderRadius:4}}>[ QR Code ]</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
                  {Array.from({length:Math.min(numQ,20)},(_,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 0"}}>
                      <span style={{fontSize:10,fontWeight:700,minWidth:18,color:"var(--t3)"}}>{i+1}.</span>
                      {choices.map((c,j) => (
                        <div key={j} className={`bubble${Math.random()>.75?" bubble-filled":""}`}>{c}</div>
                      ))}
                    </div>
                  ))}
                  {numQ>20 && <div style={{fontSize:10,color:"var(--t3)",gridColumn:"span 2",textAlign:"center",padding:4}}>…อีก {numQ-20} ข้อ</div>}
                </div>
              </div>
            </div>

            <div className="sec-lbl">ตั้งเฉลยรายข้อ</div>
            <div style={{margin:"0 16px 16px",background:"var(--surf)",borderRadius:"var(--r-lg)",
              padding:16,boxShadow:"var(--sh)"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                {Array.from({length:numQ},(_,i) => (
                  <div key={i}>
                    <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",textAlign:"center",marginBottom:3}}>{i+1}</div>
                    <select className="fsel" style={{padding:"7px 4px",fontSize:12,textAlign:"center"}}
                      value={answerKey[i+1]||choices[0]}
                      onChange={e => setAnswerKey(k => ({...k,[i+1]:e.target.value}))}>
                      {choices.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div style={{padding:"0 16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← ย้อนกลับ</button>
              <button className="btn btn-primary" onClick={() => { setStep(3); toast("✅ บันทึกใน Google Drive แล้ว!"); }}>บันทึก ✓</button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{margin:"24px 16px",background:"var(--surf)",borderRadius:"var(--r-2xl)",
            padding:"32px 20px",textAlign:"center",boxShadow:"var(--sh-lg)"}}>
            <div style={{fontSize:64,marginBottom:16}}>✅</div>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>สร้างกระดาษสำเร็จ!</div>
            <div style={{fontSize:14,color:"var(--t3)",marginBottom:24}}>บันทึกใน Google Drive แล้ว</div>
            <div style={{background:"var(--ok-bg)",borderRadius:"var(--r)",padding:16,textAlign:"left",marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"#15803D",marginBottom:8}}>📁 ไฟล์ที่บันทึก</div>
              {["📄 กระดาษคำตอบ.pdf","📊 เฉลย.json","☁️ Google Drive — บันทึกแล้ว"].map((f,i) => (
                <div key={i} style={{fontSize:12,color:"#15803D",marginTop:i?4:0}}>{f}</div>
              ))}
            </div>
            <button className="btn btn-primary" style={{marginBottom:10}}
              onClick={() => { onBack(); }}>📷 เริ่มสแกนเลย</button>
            <button className="btn btn-ghost" onClick={() => { setStep(1); onBack(); }}>กลับหน้าหลัก</button>
          </div>
        )}
      </div>
    </>
  );
}

// SCAN
function ScanScreen({ onBack, queue, setQueue, toast }) {
  const [showAssign, setShowAssign] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [pendingIdx, setPendingIdx] = useState(null);

  const doScan = () => {
    toast("📷 เปิดกล้อง...");
    setTimeout(() => {
      toast("🔍 วิเคราะห์กระดาษ...");
      setTimeout(() => {
        if (Math.random() > 0.35) {
          setScanData({ student: STUDENTS[0], score: 26, total: 30 });
          setShowResult(true);
        } else {
          const entry = { emoji:"📄", note:"QR อ่านไม่ได้ — เพิ่งถ่าย" };
          setQueue(q => {
            const nq = [...q, entry];
            setPendingIdx(nq.length - 1);
            return nq;
          });
          setSelected(null);
          setShowAssign(true);
          toast("⚠️ ระบุตัวนักเรียนไม่ได้ — เลือกชื่อ", 3500);
        }
      }, 1500);
    }, 700);
  };

  const confirmAssign = () => {
    if (!selected) { toast("⚠️ กรุณาเลือกนักเรียนก่อน"); return; }
    const s = STUDENTS.find(x => x.id === selected);
    setQueue(q => q.filter((_, i) => i !== pendingIdx));
    setShowAssign(false);
    toast(`✅ กำหนดให้ ${s.name} เรียบร้อย`);
  };

  const correct = [1,3,4,6,7,8,10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30];

  return (
    <>
      <HeroBar title="📷 สแกนกระดาษคำตอบ" onBack={onBack}/>
      <div className="scroll" style={{paddingTop:0}}>
        {/* Selected exam */}
        <div style={{margin:"0 16px 12px",background:"var(--surf)",borderRadius:"var(--r-lg)",
          padding:"13px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"var(--sh)"}}>
          <span style={{fontSize:20}}>📋</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:"var(--t3)"}}>ชุดข้อสอบที่เลือก</div>
            <div style={{fontSize:14,fontWeight:700}}>คณิตศาสตร์ ม.3 ปลายภาค</div>
          </div>
          <button className="btn btn-secondary btn-xs" onClick={() => toast("เลือกชุดข้อสอบ")}>เปลี่ยน</button>
        </div>

        {/* Camera */}
        <div className="cam-area" onClick={doScan}>
          <div className="cam-frame"/>
          <div className="cam-corner cam-tl"/><div className="cam-corner cam-tr"/>
          <div className="cam-corner cam-bl"/><div className="cam-corner cam-br"/>
          <div style={{position:"relative",textAlign:"center",color:"#fff"}}>
            <div style={{fontSize:46,marginBottom:8}}>📷</div>
            <div style={{fontSize:15,fontWeight:700}}>แตะเพื่อเปิดกล้อง</div>
            <div style={{fontSize:12,opacity:.6,marginTop:4}}>วางกระดาษในกรอบสีทอง</div>
          </div>
        </div>

        {/* Plan B box */}
        <div style={{margin:"0 16px 14px",background:"#FFFBF0",border:"1.5px solid #FCD34D",
          borderRadius:"var(--r-lg)",padding:"14px 16px"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#92400E",marginBottom:6}}>⚡ Plan B — QR อ่านไม่ได้?</div>
          <div style={{fontSize:12,color:"#78350F",marginBottom:10}}>
            ระบบจะเก็บกระดาษเข้า Queue อัตโนมัติ ครูระบุชื่อในภายหลังได้
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button className="btn btn-xs"
              style={{background:"#FF9F0A",color:"#fff",border:"none"}}
              onClick={() => {
                const entry = { emoji:"📄", note:"ทดสอบ QR อ่านไม่ได้" };
                setQueue(q => { setPendingIdx(q.length); return [...q, entry]; });
                setSelected(null); setShowAssign(true);
                toast("⚠️ ทดสอบ Plan B");
              }}>⚠️ ทดสอบ Plan B</button>
            <button className="btn btn-xs"
              style={{background:"var(--surf2)",color:"var(--t1)",border:"none"}}
              onClick={() => onBack("queue")}>
              📋 Queue ({queue.length})
            </button>
          </div>
        </div>

        <div style={{padding:"0 16px"}}>
          <button className="btn btn-ghost" style={{marginBottom:12}}
            onClick={() => { setScanData({student:STUDENTS[0],score:26,total:30}); setShowResult(true); }}>
            🖼️ เลือกจากคลังภาพ (ทดสอบ)
          </button>
        </div>

        {/* Tips */}
        <div style={{margin:"0 16px 20px",background:"var(--warn-bg)",border:"1px solid #FCD34D",
          borderRadius:"var(--r-lg)",padding:16}}>
          <div style={{fontSize:13,fontWeight:700,color:"#92400E",marginBottom:8}}>💡 เคล็ดลับถ่ายภาพ</div>
          {["📐 วางกระดาษให้ตรงกรอบ","💡 แสงเพียงพอ ไม่มีเงา","📏 ห่างประมาณ 20–30 ซม.","🚫 ไม่บิดเบี้ยว"].map((t,i) => (
            <div key={i} style={{fontSize:12,color:"#78350F",lineHeight:2}}>{t}</div>
          ))}
        </div>
      </div>

      {/* Sheet: Scan Result */}
      <Sheet open={showResult} onClose={() => setShowResult(false)} title="">
        <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:17,fontWeight:800}}>✅ ตรวจสำเร็จ!</div>
          <button onClick={() => setShowResult(false)}
            style={{background:"var(--surf2)",border:"none",width:28,height:28,
            borderRadius:"50%",fontSize:14,cursor:"pointer"}}>✕</button>
        </div>
        {scanData && (
          <>
            <div style={{padding:"14px 20px 14px",display:"flex",alignItems:"center",
              gap:14,borderBottom:"1px solid rgba(0,0,0,.06)"}}>
              <div style={{fontSize:44,fontWeight:900,color:"var(--red)",letterSpacing:-2}}>
                {scanData.score}<span style={{fontSize:17,color:"var(--t3)"}}>/{scanData.total}</span>
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:700}}>{scanData.student.name}</div>
                <div style={{fontSize:12,color:"var(--t3)"}}>รหัส: {scanData.student.id} • {scanData.student.room}</div>
                <div style={{fontSize:14,fontWeight:800,color:"var(--ok)",marginTop:2}}>
                  {((scanData.score/scanData.total)*100).toFixed(1)}% 🎉
                </div>
              </div>
            </div>
            <div style={{padding:"14px 20px"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10,color:"var(--t2)"}}>รายข้อ</div>
              <div className="ans-grid">
                {Array.from({length:scanData.total},(_,i) => {
                  const ok = correct.includes(i+1);
                  const ch = ["ก","ข","ค","ง"][(i)%4];
                  return (
                    <div key={i} className={`ans-cell ${ok?"ans-ok":"ans-bad"}`}>
                      <span className="ans-cell-n">{i+1}</span>
                      <span className="ans-cell-a">{ch}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 20px 20px"}}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowResult(false)}>📊 รายละเอียด</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowResult(false)}>📷 ถ่ายต่อ</button>
            </div>
          </>
        )}
      </Sheet>

      {/* Sheet: Assign (Plan B) */}
      <Sheet open={showAssign} onClose={() => setShowAssign(false)} title="">
        <div style={{padding:"16px 20px",background:"linear-gradient(135deg,#FF9F0A22,transparent)"}}>
          <div style={{fontSize:17,fontWeight:800,marginBottom:4}}>⚠️ ระบุตัวนักเรียน</div>
          <div style={{fontSize:13,color:"var(--t3)"}}>อ่าน QR ไม่ได้ — เลือกชื่อนักเรียนที่เป็นเจ้าของกระดาษนี้</div>
        </div>
        <div style={{padding:"8px 16px 12px"}}>
          <div style={{background:"var(--surf2)",borderRadius:12,display:"flex",
            alignItems:"center",gap:8,padding:"10px 14px"}}>
            <span style={{fontSize:14,color:"var(--t3)"}}>🔍</span>
            <input style={{flex:1,background:"none",border:"none",outline:"none",
              fontSize:15,fontFamily:"var(--font)",color:"var(--t1)"}}
              placeholder="ค้นหาชื่อหรือรหัส..."/>
          </div>
        </div>
        {STUDENTS.map((s,i) => (
          <div key={s.id} className="pick-row" onClick={() => setSelected(s.id)}>
            <div className={`pick-check${selected===s.id?" pick-check-on":""}`}>
              {selected===s.id ? "✓" : ""}
            </div>
            <StudentAvatar name={s.name} idx={i} size={36}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600}}>{s.name}</div>
              <div style={{fontSize:12,color:"var(--t3)"}}>รหัส: {s.id} • {s.room}</div>
            </div>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"16px 20px"}}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAssign(false)}>
            ยกเลิก — เข้า Queue
          </button>
          <button className="btn btn-primary btn-sm" onClick={confirmAssign}>✅ ยืนยัน</button>
        </div>
      </Sheet>
    </>
  );
}

// QUEUE
function QueueScreen({ onBack, queue, setQueue, toast }) {
  const [assignIdx, setAssignIdx] = useState(null);
  const [selected, setSelected] = useState(null);

  const openAssign = idx => { setAssignIdx(idx); setSelected(null); };
  const confirmAssign = () => {
    if (!selected) { toast("⚠️ กรุณาเลือกนักเรียนก่อน"); return; }
    const s = STUDENTS.find(x => x.id === selected);
    setQueue(q => q.filter((_,i) => i !== assignIdx));
    setAssignIdx(null);
    toast(`✅ กำหนดให้ ${s.name} เรียบร้อย`);
  };

  return (
    <>
      <HeroBar title="📋 กระดาษรอระบุชื่อ" onBack={onBack}/>
      <div className="scroll" style={{paddingTop:0}}>
        {queue.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:"var(--t3)"}}>
            <div style={{fontSize:56,marginBottom:16}}>🎉</div>
            <div style={{fontSize:17,fontWeight:700}}>ไม่มีกระดาษค้างระบุ</div>
            <div style={{fontSize:14,marginTop:6}}>ทุกกระดาษระบุตัวนักเรียนแล้ว</div>
          </div>
        ) : (
          <>
            <div style={{margin:"16px 16px 4px",background:"var(--warn-bg)",
              border:"1px solid #FCD34D",borderRadius:"var(--r-lg)",padding:"12px 16px"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#92400E"}}>
                มี {queue.length} ใบ รอระบุชื่อ — กดปุ่ม "ระบุชื่อ" เพื่อจับคู่กับนักเรียน
              </div>
            </div>
            {queue.map((q,i) => (
              <div key={i} style={{margin:"10px 16px",background:"var(--surf)",
                borderRadius:"var(--r-lg)",boxShadow:"var(--sh)",overflow:"hidden"}}>
                <div style={{background:"linear-gradient(135deg,#FF9F0A,#FF6B00)",
                  padding:"13px 16px",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:15,fontWeight:700}}>กระดาษ #{i+1}</div>
                    <div style={{fontSize:12,opacity:.85}}>{q.note}</div>
                  </div>
                  <button className="btn btn-xs"
                    style={{background:"rgba(255,255,255,.2)",color:"#fff",border:"none"}}
                    onClick={() => openAssign(i)}>ระบุชื่อ</button>
                </div>
                <div style={{height:120,background:"var(--surf2)",display:"flex",
                  alignItems:"center",justifyContent:"center",fontSize:48}}>{q.emoji}</div>
                <div style={{padding:"12px 16px",fontSize:13,color:"var(--t3)"}}>
                  แตะ "ระบุชื่อ" เพื่อเลือกนักเรียน
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Assign Sheet */}
      <Sheet open={assignIdx !== null} onClose={() => setAssignIdx(null)} title="⚠️ ระบุตัวนักเรียน">
        <div style={{padding:"0 20px 12px"}}>
          <div style={{fontSize:13,color:"var(--t3)"}}>เลือกชื่อนักเรียนที่เป็นเจ้าของกระดาษ #{assignIdx+1}</div>
        </div>
        {STUDENTS.map((s,i) => (
          <div key={s.id} className="pick-row" onClick={() => setSelected(s.id)}>
            <div className={`pick-check${selected===s.id?" pick-check-on":""}`}>{selected===s.id?"✓":""}</div>
            <StudentAvatar name={s.name} idx={i} size={36}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600}}>{s.name}</div>
              <div style={{fontSize:12,color:"var(--t3)"}}>รหัส: {s.id} • {s.room}</div>
            </div>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"16px 20px"}}>
          <button className="btn btn-ghost btn-sm" onClick={() => setAssignIdx(null)}>ยกเลิก</button>
          <button className="btn btn-primary btn-sm" onClick={confirmAssign}>✅ ยืนยัน</button>
        </div>
      </Sheet>
    </>
  );
}

// STUDENTS
function StudentsScreen({ onBack, toast }) {
  const [room, setRoom] = useState("all");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);

  const list = STUDENTS
    .filter(s => room==="all" || s.room===room)
    .filter(s => !q || s.name.includes(q) || s.id.includes(q));

  return (
    <>
      <HeroBar title="รายชื่อนักเรียน" onBack={onBack} action="+ Import"
        onAction={() => toast("เปิด Import Excel/CSV")}/>
      <div className="scroll" style={{paddingTop:0}}>
        {/* Import */}
        <div style={{margin:"16px 16px 12px"}}>
          <div className="drop-zone" onClick={() => toast("เปิดไฟล์ Excel/CSV")}>
            <div style={{fontSize:30,marginBottom:6}}>📤</div>
            <div style={{fontSize:14,fontWeight:700,color:"var(--red)"}}>Import รายชื่อนักเรียน</div>
            <div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>Excel / CSV • บันทึกลง Google Drive อัตโนมัติ</div>
          </div>
        </div>
        {/* Search */}
        <div style={{padding:"0 16px 10px"}}>
          <div style={{background:"var(--surf2)",borderRadius:12,display:"flex",alignItems:"center",gap:8,padding:"10px 14px"}}>
            <span style={{fontSize:15,color:"var(--t3)"}}>🔍</span>
            <input style={{flex:1,background:"none",border:"none",outline:"none",
              fontSize:15,fontFamily:"var(--font)",color:"var(--t1)"}}
              placeholder="ค้นหาชื่อหรือรหัสนักเรียน..."
              value={q} onChange={e => setQ(e.target.value)}/>
          </div>
        </div>
        {/* Room filter */}
        <div style={{display:"flex",gap:8,padding:"0 16px 14px",overflowX:"auto"}}>
          {[["all","ทั้งหมด"],["ม.3/1","ม.3/1"],["ม.3/2","ม.3/2"]].map(([r,l]) => (
            <button key={r} className={`tchip${room===r?" on":""}`}
              onClick={() => setRoom(r)} style={{whiteSpace:"nowrap"}}>{l}</button>
          ))}
        </div>
        {/* List */}
        {list.map((s,i) => (
          <div key={s.id} style={{margin:"0 16px 10px",background:"var(--surf)",
            borderRadius:"var(--r-lg)",boxShadow:"var(--sh)",display:"flex",
            alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",transition:"all .15s"}}
            onClick={() => setDetail(s)}>
            <StudentAvatar name={s.name} idx={i}/>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:600}}>{s.name}</div>
              <div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>รหัส {s.id} • {s.room}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:22,fontWeight:800,
                color:s.score>=80?"var(--ok)":s.score>=60?"var(--red)":"var(--bad)"}}>{s.score}</div>
              <div style={{fontSize:11,color:"var(--t3)"}}>คะแนน%</div>
            </div>
          </div>
        ))}
        {list.length===0 && (
          <div style={{textAlign:"center",padding:"40px 20px",color:"var(--t3)"}}>ไม่พบนักเรียน</div>
        )}
      </div>
      {/* Student Detail Sheet */}
      <Sheet open={!!detail} onClose={() => setDetail(null)} title="">
        {detail && (
          <>
            <div style={{textAlign:"center",padding:"20px 20px 16px"}}>
              <StudentAvatar name={detail.name} idx={STUDENTS.indexOf(detail)}
                size={64} style={{margin:"0 auto 12px"}}/>
              <div style={{width:64,height:64,margin:"0 auto 12px"}}>
                <StudentAvatar name={detail.name} idx={STUDENTS.indexOf(detail)} size={64}/>
              </div>
              <div style={{fontSize:18,fontWeight:800}}>{detail.name}</div>
              <div style={{fontSize:13,color:"var(--t3)",marginTop:4}}>
                รหัส: {detail.id} • {detail.room}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,margin:"0 20px 20px"}}>
              {[[`${Math.round(detail.score*30/100)}/30`,"คะแนนล่าสุด","var(--red)"],
                [`${detail.score}%`,"เปอร์เซ็นต์","var(--ok)"],
                ["5","ครั้งที่สอบ","var(--t1)"]].map(([v,l,c],i) => (
                <div key={i} style={{background:"var(--surf2)",borderRadius:"var(--r)",
                  padding:14,textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
                  <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"0 20px 20px"}}>
              <button className="btn btn-secondary btn-sm" onClick={() => { toast("ส่งผลให้นักเรียนแล้ว!"); setDetail(null); }}>📧 ส่งผลคะแนน</button>
              <button className="btn btn-primary btn-sm" onClick={() => { toast("ดูประวัติการสอบ"); setDetail(null); }}>📊 ประวัติ</button>
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}

// REPORT
function ReportScreen({ onBack, toast }) {
  const [showExport, setShowExport] = useState(false);
  return (
    <>
      <HeroBar title="📊 รายงานคะแนน" onBack={onBack} action="📤 Export"
        onAction={() => setShowExport(true)}/>
      <div className="scroll" style={{paddingTop:0}}>
        {/* Summary */}
        <div style={{margin:"0 16px 16px",background:"linear-gradient(145deg,var(--red),var(--red-d))",
          borderRadius:"var(--r-2xl)",padding:22,color:"#fff",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,
            background:"rgba(255,255,255,.07)",borderRadius:"50%"}}/>
          <div style={{fontSize:13,opacity:.8,marginBottom:4}}>คณิตศาสตร์ ม.3 ปลายภาค</div>
          <div style={{fontSize:58,fontWeight:900,letterSpacing:-2}}>
            73.4<span style={{fontSize:22,opacity:.7}}>%</span>
          </div>
          <div style={{fontSize:12,opacity:.75,marginBottom:16}}>ม.3/1 • 30 ข้อ • 22 เม.ย. 68 • 40 คน</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[["22","ผ่าน (≥60%)"],["8","ไม่ผ่าน"],["93%","สูงสุด"]].map(([v,l],i) => (
              <div key={i} style={{background:"rgba(255,255,255,.15)",borderRadius:14,padding:12}}>
                <div style={{fontSize:22,fontWeight:800}}>{v}</div>
                <div style={{fontSize:11,opacity:.85}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution */}
        <div className="sec-lbl">การกระจายคะแนน</div>
        <div className="group"><div className="card" style={{padding:16}}>
          {[["A","22%",9,"#30D158"],["B","30%",12,"var(--red)"],
            ["C","25%",10,"var(--warn)"],["D","13%",5,"#FF6B00"],["F","10%",4,"var(--bad)"]
          ].map(([l,p,n,c]) => (
            <div key={l} className="bar-row">
              <div className="bar-lbl">{l}</div>
              <div className="bar-track">
                <div className="bar-fill" style={{width:p,background:c}}>{p}</div>
              </div>
              <div className="bar-cnt">{n} คน</div>
            </div>
          ))}
        </div></div>

        {/* Item Analysis */}
        <div className="sec-lbl">วิเคราะห์รายข้อ</div>
        <div className="group"><div className="card" style={{padding:16}}>
          <div style={{fontSize:12,color:"var(--t3)",marginBottom:10}}>
            % นักเรียนที่ตอบถูก | 🟢≥80% 🔵≥60% 🟡≥40% 🔴&lt;40%
          </div>
          {ITEM_DATA.map((p,i) => {
            const col = p>=80?"var(--ok)":p>=60?"var(--info)":p>=40?"var(--warn)":"var(--bad)";
            const dot = p>=80?"🟢":p>=60?"🔵":p>=40?"🟡":"🔴";
            return (
              <div key={i} className="ia-row">
                <span className="ia-n">{i+1}</span>
                <div className="ia-track"><div className="ia-fill" style={{width:`${p}%`,background:col}}/></div>
                <span className="ia-pct" style={{color:col}}>{p}%</span>
                <span>{dot}</span>
              </div>
            );
          })}
        </div></div>

        {/* Top students */}
        <div className="sec-lbl">🏆 นักเรียนคะแนนสูงสุด</div>
        <div className="group">
          {[["น.ส.วิภา สวยงาม","66002",93,"#F59E0B","1"],
            ["น.ส.สุภาพร แสนดี","66006",88,"#94A3B8","2"],
            ["นายสมชาย ใจดี","66001",86,"#CD7F32","3"]
          ].map(([name,id,score,bg,rank]) => (
            <div key={id} className="row card">
              <div className="av" style={{width:36,height:36,fontSize:14,background:bg}}>{rank}</div>
              <div className="row-body">
                <div className="row-title">{name}</div>
                <div className="row-sub">รหัส: {id}</div>
              </div>
              <div style={{fontSize:20,fontWeight:800,
                color:score>=90?"var(--ok)":"var(--red)"}}>{score}%</div>
            </div>
          ))}
        </div>

        {/* Export grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"4px 16px 20px"}}>
          {[["📊","Excel (.xlsx)"],["📄","PDF Report"],["☁️","Google Drive"],["📧","ส่ง Email"]].map(([ico,lbl],i) => (
            <button key={i} onClick={() => toast(`${ico} กำลัง export...`)}
              style={{background:"var(--surf)",border:"1.5px solid rgba(0,0,0,.08)",
              borderRadius:"var(--r)",padding:14,display:"flex",flexDirection:"column",
              alignItems:"center",gap:6,cursor:"pointer",fontFamily:"var(--font)",transition:"all .2s"}}>
              <span style={{fontSize:26}}>{ico}</span>
              <span style={{fontSize:12,fontWeight:600}}>{lbl}</span>
            </button>
          ))}
        </div>
      </div>

      <Sheet open={showExport} onClose={() => setShowExport(false)} title="📤 Export รายงาน">
        <div style={{padding:"0 20px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["📊","Excel"],["📄","PDF"],["☁️","Drive"],["📧","Email"]].map(([ico,lbl]) => (
              <button key={lbl} onClick={() => { toast(`${ico} Export ${lbl} สำเร็จ!`); setShowExport(false); }}
                style={{background:"var(--surf)",border:"1.5px solid rgba(0,0,0,.08)",
                borderRadius:"var(--r)",padding:16,display:"flex",flexDirection:"column",
                alignItems:"center",gap:6,cursor:"pointer",fontFamily:"var(--font)"}}>
                <span style={{fontSize:28}}>{ico}</span>
                <span style={{fontSize:13,fontWeight:600}}>{lbl}</span>
              </button>
            ))}
          </div>
          <div style={{background:"var(--surf2)",borderRadius:"var(--r)",padding:12,marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>ตัวเลือก Export</div>
            {["รายชื่อพร้อมคะแนนรายข้อ","วิเคราะห์ Item Analysis","กราฟ Distribution"].map((o,i) => (
              <label key={i} style={{display:"flex",alignItems:"center",gap:8,
                fontSize:13,marginBottom:i<2?6:0,cursor:"pointer"}}>
                <input type="checkbox" defaultChecked={i<2}/> {o}
              </label>
            ))}
          </div>
        </div>
      </Sheet>
    </>
  );
}

// PROFILE
function ProfileScreen({ onBack, user, onAdminOpen, toast }) {
  return (
    <>
      <div style={{position:"relative"}}>
        <div className="prof-hero">
          <button onClick={onBack}
            style={{position:"absolute",left:20,top:60,background:"rgba(255,255,255,.15)",
            border:"none",color:"#fff",width:34,height:34,borderRadius:"50%",
            fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <div className="prof-av">{user?.initial||"S"}</div>
          <div style={{fontSize:18,fontWeight:800}}>{user?.name||"คุณครู"}</div>
          <div style={{fontSize:13,opacity:.8,marginTop:4}}>{user?.email||"teacher@daravit.ac.th"}</div>
          <div style={{marginTop:10}}>
            <span style={{background:"rgba(255,255,255,.2)",color:"#fff",
              padding:"4px 14px",borderRadius:20,fontSize:12,fontWeight:700}}>
              🏫 โรงเรียนดาราวิทยาลัย
            </span>
          </div>
        </div>
      </div>
      <div className="scroll" style={{paddingTop:0,paddingBottom:40}}>
        <div className="sec-lbl">บัญชีและข้อมูล</div>
        <div className="group">
          {[
            ["☁️","#EFF6FF","Google Drive","ใช้ไป 2.3 GB / 20 GB"],
            ["📥","var(--ok-bg)","นำเข้าข้อมูล","Import จาก Drive"],
            ["🏫","var(--red-l)","โรงเรียน","ดาราวิทยาลัย"],
          ].map(([ico,bg,t,s],i) => (
            <div key={i} className="row card">
              <div className="row-ico" style={{background:bg}}>{ico}</div>
              <div className="row-body">
                <div className="row-title">{t}</div>
                <div className="row-sub">{s}</div>
              </div>
              <span className="chev">›</span>
            </div>
          ))}
        </div>

        <div className="sec-lbl">การตั้งค่า</div>
        <div className="group">
          {[
            ["🔔","var(--warn-bg)","การแจ้งเตือน","เปิด"],
            ["🌐","var(--info-bg)","ภาษา","ภาษาไทย"],
          ].map(([ico,bg,t,v],i) => (
            <div key={i} className="row card">
              <div className="row-ico" style={{background:bg}}>{ico}</div>
              <div className="row-body"><div className="row-title">{t}</div></div>
              <div className="row-right">
                <span style={{fontSize:14,color:"var(--t3)"}}>{v}</span>
                <span className="chev">›</span>
              </div>
            </div>
          ))}
          <div className="row card" onClick={onAdminOpen}>
            <div className="row-ico" style={{background:"#F5F3FF"}}>🔑</div>
            <div className="row-body">
              <div className="row-title">Admin Panel</div>
              <div className="row-sub">ตั้งค่าระบบ, โลโก้โรงเรียน</div>
            </div>
            <div className="row-right">
              <span className="admin-badge">Admin</span>
              <span className="chev">›</span>
            </div>
          </div>
        </div>

        <div style={{padding:"0 16px 20px"}}>
          <button className="btn btn-danger" onClick={() => toast("ออกจากระบบ...")}>🚪 ออกจากระบบ</button>
        </div>
      </div>
    </>
  );
}

// ADMIN
function AdminScreen({ onBack, toast, schoolLogo, setSchoolLogo, schoolName, setSchoolName }) {
  const [logoUrl, setLogoUrl] = useState(schoolLogo);
  const [nameVal, setNameVal] = useState(schoolName);
  const [previewUrl, setPreviewUrl] = useState(schoolLogo);

  const save = () => {
    setSchoolLogo(logoUrl);
    setSchoolName(nameVal);
    localStorage.setItem("schoolLogo", logoUrl);
    localStorage.setItem("schoolName", nameVal);
    toast("💾 บันทึกการตั้งค่าแล้ว");
    setTimeout(onBack, 800);
  };

  return (
    <>
      <div style={{background:"linear-gradient(145deg,#7C3AED,#5B21B6)",paddingTop:54}}>
        <div style={{padding:"10px 16px 20px",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack}
            style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",
            width:34,height:34,borderRadius:"50%",fontSize:18,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>🔑 Admin Panel</span>
          <span className="admin-badge" style={{marginLeft:"auto"}}>รหัส: 100625</span>
        </div>
        <div style={{background:"var(--bg)",borderRadius:"28px 28px 0 0",height:18}}/>
      </div>

      <div className="scroll" style={{paddingTop:0}}>
        <div className="sec-lbl">ตั้งค่าโรงเรียน</div>
        <div style={{padding:"0 16px 4px"}}>
          <div className="card" style={{padding:16}}>
            <div className="field">
              <label className="flbl">ชื่อโรงเรียน</label>
              <input className="finp" value={nameVal} onChange={e => setNameVal(e.target.value)}
                placeholder="โรงเรียนดาราวิทยาลัย"/>
            </div>
            <div className="field">
              <label className="flbl">URL โลโก้โรงเรียน</label>
              <div style={{display:"flex",gap:8}}>
                <input className="finp" style={{flex:1}} value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"/>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => setPreviewUrl(logoUrl)}>ดูตัวอย่าง</button>
              </div>
              <div className="fhint">โลโก้จะแสดงบนกระดาษคำตอบและใบรายงาน</div>
            </div>
            <div className="field">
              <label className="flbl">ตัวอย่างโลโก้</label>
              <div className="logo-prev">
                {previewUrl
                  ? <img src={previewUrl} alt="logo"
                      onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }}/>
                  : null}
                <span style={{display: previewUrl?"none":"block"}}>🏫 ยังไม่มีโลโก้ — ใส่ URL แล้วกด "ดูตัวอย่าง"</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sec-lbl">สถิติระบบ</div>
        <div className="group">
          {[["👩‍🏫","var(--info-bg)","ครูที่ใช้งาน","24 คน"],
            ["✅","var(--ok-bg)","กระดาษตรวจแล้ว","8,432 ใบ"],
            ["⚠️","var(--warn-bg)","รอระบุชื่อ","3 ใบ","var(--warn)"],
            ["☁️","var(--red-l)","Drive รวม","18.4 GB"],
          ].map(([ico,bg,t,v,vc],i) => (
            <div key={i} className="row card">
              <div className="row-ico" style={{background:bg}}>{ico}</div>
              <div className="row-body"><div className="row-title">{t}</div></div>
              <span style={{fontSize:14,color:vc||"var(--t3)",fontWeight:vc?700:400}}>{v}</span>
            </div>
          ))}
        </div>

        <div className="sec-lbl">จัดการระบบ</div>
        <div className="group">
          <div className="row card" onClick={() => toast("💾 สร้าง Backup แล้ว!")}>
            <div className="row-ico" style={{background:"var(--info-bg)"}}>💾</div>
            <div className="row-body"><div className="row-title">Backup ข้อมูล</div><div className="row-sub">บันทึกสำรองใน Drive</div></div>
            <span className="chev">›</span>
          </div>
          <div className="row card" onClick={() => toast("🗑️ ล้าง Cache แล้ว!")}>
            <div className="row-ico" style={{background:"var(--warn-bg)"}}>🗑️</div>
            <div className="row-body"><div className="row-title">ล้าง Cache</div></div>
            <span className="chev">›</span>
          </div>
        </div>

        <div style={{padding:"0 16px 24px"}}>
          <button className="btn btn-primary"
            style={{background:"linear-gradient(145deg,#7C3AED,#5B21B6)",
            boxShadow:"0 8px 24px rgba(124,58,237,.35)"}}
            onClick={save}>💾 บันทึกการตั้งค่า</button>
        </div>
      </div>
    </>
  );
}

// EXAMS (sheet-like screen)
function ExamsScreen({ onBack, toast }) {
  return (
    <>
      <HeroBar title="📋 ชุดข้อสอบทั้งหมด" onBack={onBack}/>
      <div className="scroll" style={{paddingTop:0}}>
        {[
          {ico:"🧮",name:"คณิตศาสตร์ ม.3 ปลายภาค",meta:"30 ข้อ • ม.3/1",done:40,total:40,avg:73.4,status:"done"},
          {ico:"🔬",name:"วิทยาศาสตร์ ม.2",meta:"40 ข้อ • ม.3/2",done:28,total:38,avg:70,status:"inprogress"},
          {ico:"📚",name:"ภาษาไทย ม.1",meta:"50 ข้อ • ม.1/3",done:0,total:42,avg:0,status:"waiting"},
        ].map((e,i) => (
          <div key={i} style={{margin:"8px 16px",background:"var(--surf)",
            borderRadius:"var(--r-xl)",boxShadow:"var(--sh)",overflow:"hidden"}}>
            <div style={{background:`linear-gradient(135deg,${["var(--red)","#059669","#6366F1"][i]},${["var(--red-d)","#047857","#4F46E5"][i]})`,
              padding:"14px 16px",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:15,fontWeight:700}}>{e.ico} {e.name}</div>
                <div style={{fontSize:12,opacity:.85,marginTop:2}}>{e.meta}</div>
              </div>
              <span className="pill" style={{background:"rgba(255,255,255,.2)",color:"#fff",fontSize:11}}>
                {e.status==="done"?"✅ เสร็จ":e.status==="inprogress"?"🔄 ตรวจ":"⏳ รอ"}
              </span>
            </div>
            <div style={{padding:"12px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",
                fontSize:12,color:"var(--t3)",marginBottom:6}}>
                <span>ตรวจแล้ว {e.done}/{e.total} คน</span>
                <span>{e.avg>0?`${e.avg}% เฉลี่ย`:"ยังไม่มีข้อมูล"}</span>
              </div>
              <div className="prog-t">
                <div className="prog-f" style={{width:`${e.total>0?(e.done/e.total)*100:0}%`}}/>
              </div>
            </div>
          </div>
        ))}
        <div style={{padding:"8px 16px 20px"}}>
          <button className="btn btn-primary" onClick={onBack}>➕ สร้างชุดข้อสอบใหม่</button>
        </div>
      </div>
    </>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [prevScreen, setPrevScreen] = useState(null);
  const [tab, setTab] = useState("home");
  const [queue, setQueue] = useState([
    { emoji:"📄", note:"QR Code อ่านไม่ได้ — กระดาษย่น" },
    { emoji:"📋", note:"ไม่มีชื่อและไม่มี QR" },
    { emoji:"📃", note:"QR Code ถูกลบออก" },
  ]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminPinErr, setAdminPinErr] = useState(false);
  const [schoolLogo, setSchoolLogo] = useState(localStorage.getItem("schoolLogo")||"");
  const [schoolName, setSchoolName] = useState(localStorage.getItem("schoolName")||"โรงเรียนดาราวิทยาลัย");

  const { msg: toastMsg, show: toastShow, toast } = useToast();
  const clock = useClock();

  const navigate = useCallback((to) => {
    setPrevScreen(screen);
    setScreen(to);
  }, [screen]);

  const goBack = useCallback((to="home") => {
    setPrevScreen(screen);
    setScreen(to);
    setTab(to==="home"?"home":to==="scan"?"scan":to==="students"?"students":to==="report"?"report":"home");
  }, [screen]);

  const handleLogin = (type) => {
    if (type === "google") {
      toast("กำลังเชื่อมต่อ Google...");
      setTimeout(() => {
        setUser({ name:"คุณครูสมศรี มีสุข", email:"somsri@daravit.ac.th", initial:"ส" });
        setLoggedIn(true);
      }, 1000);
    } else {
      setUser({ name:"Demo Teacher", email:"demo@daravit.ac.th", initial:"D" });
      setLoggedIn(true);
      toast("Demo Mode — ข้อมูลตัวอย่าง");
    }
  };

  const tryAdmin = () => {
    if (adminPin === "100625") {
      setShowAdminLogin(false);
      setAdminPin(""); setAdminPinErr(false);
      navigate("admin");
    } else {
      setAdminPinErr(true);
    }
  };

  if (!loggedIn) {
    return (
      <div className="app">
        <LoginScreen onLogin={handleLogin} onAdmin={() => setShowAdminLogin(true)}/>
        <Sheet open={showAdminLogin} onClose={() => { setShowAdminLogin(false); setAdminPin(""); setAdminPinErr(false); }} title="">
          <div style={{padding:"20px 20px 0",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:8}}>🔑</div>
            <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>Admin Panel</div>
            <div style={{fontSize:13,color:"var(--t3)",marginBottom:20}}>ใส่รหัสผ่าน Admin 6 หลัก</div>
            <input className="finp" type="password" placeholder="••••••"
              style={{textAlign:"center",fontSize:22,letterSpacing:8,marginBottom:8}}
              maxLength={6} value={adminPin}
              onChange={e => { setAdminPin(e.target.value); setAdminPinErr(false); }}
              onKeyDown={e => e.key==="Enter" && tryAdmin()}/>
            {adminPinErr && <div style={{color:"var(--bad)",fontSize:13,marginBottom:8}}>❌ รหัสไม่ถูกต้อง</div>}
            <button className="btn btn-primary"
              style={{background:"linear-gradient(145deg,#7C3AED,#5B21B6)",
              boxShadow:"0 8px 24px rgba(124,58,237,.35)",marginBottom:20}}
              onClick={tryAdmin}>เข้าสู่ Admin Panel</button>
          </div>
        </Sheet>
        <div className={`toast${toastShow?" toast-show":""}`}>{toastMsg}</div>
      </div>
    );
  }

  const SCREENS = {
    home:     <HomeScreen setScreen={navigate} setTab={setTab} queue={queue} user={user}/>,
    design:   <DesignScreen onBack={() => goBack("home")} toast={toast} schoolLogo={schoolLogo} schoolName={schoolName}/>,
    scan:     <ScanScreen onBack={(t) => goBack(t||"home")} queue={queue} setQueue={setQueue} toast={toast}/>,
    students: <StudentsScreen onBack={() => goBack("home")} toast={toast}/>,
    report:   <ReportScreen onBack={() => goBack("home")} toast={toast}/>,
    profile:  <ProfileScreen onBack={() => goBack("home")} user={user}
                onAdminOpen={() => setShowAdminLogin(true)} toast={toast}/>,
    admin:    <AdminScreen onBack={() => goBack("home")} toast={toast}
                schoolLogo={schoolLogo} setSchoolLogo={setSchoolLogo}
                schoolName={schoolName} setSchoolName={setSchoolName}/>,
    queue:    <QueueScreen onBack={() => goBack("home")} queue={queue} setQueue={setQueue} toast={toast}/>,
    exams:    <ExamsScreen onBack={() => goBack("home")} toast={toast}/>,
  };

  return (
    <div className="app">
      {Object.entries(SCREENS).map(([id, el]) => (
        <div key={id} className={`screen${screen===id?" active":prevScreen===id?" prev":""}`}>
          {el}
        </div>
      ))}

      {/* Tab bar shown only on main screens */}
      {["home","design","scan","students","report"].includes(screen) && (
        <TabBar tab={tab} setTab={setTab} setScreen={navigate}/>
      )}

      {/* Admin login sheet */}
      <Sheet open={showAdminLogin} onClose={() => { setShowAdminLogin(false); setAdminPin(""); setAdminPinErr(false); }} title="">
        <div style={{padding:"20px 20px 0",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:8}}>🔑</div>
          <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>Admin Panel</div>
          <div style={{fontSize:13,color:"var(--t3)",marginBottom:20}}>ใส่รหัสผ่าน Admin 6 หลัก</div>
          <input className="finp" type="password" placeholder="••••••"
            style={{textAlign:"center",fontSize:22,letterSpacing:8,marginBottom:8}}
            maxLength={6} value={adminPin}
            onChange={e => { setAdminPin(e.target.value); setAdminPinErr(false); }}
            onKeyDown={e => e.key==="Enter" && tryAdmin()}/>
          {adminPinErr && <div style={{color:"var(--bad)",fontSize:13,marginBottom:8}}>❌ รหัสไม่ถูกต้อง</div>}
          <button className="btn btn-primary"
            style={{background:"linear-gradient(145deg,#7C3AED,#5B21B6)",
            boxShadow:"0 8px 24px rgba(124,58,237,.35)",marginBottom:20}}
            onClick={tryAdmin}>เข้าสู่ Admin Panel</button>
        </div>
      </Sheet>

      <div className={`toast${toastShow?" toast-show":""}`}>{toastMsg}</div>
    </div>
  );
}
