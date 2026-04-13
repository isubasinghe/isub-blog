import{d as Ne,e as Fe,g as m,a as n,i as r,c as x,h as $,r as Te,t as h,j as E,s as X,F as J,m as A,S as K,k as D}from"./web.BYgSEeKP.js";var We=h('<div style="display:flex;align-items:center;gap:6px;padding:2px 6px;border-radius:4px;transition:background 0.3s ease"><span style="display:inline-block;width:18px;text-align:center;padding:1px 0;border-radius:3px;color:#fff;font-weight:bold;font-size:10px;transition:background 0.4s ease"></span><span style=font-family:monospace;font-size:11px;min-width:44px></span><span style=font-family:monospace;font-size:11px>'),je=h(`<style>
        .mesi-container {
          font-family: system-ui, -apple-system, sans-serif;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin: 24px auto;
          background: #fafafa;
          max-width: 760px;
        }
        .mesi-header {
          margin-bottom: 10px;
        }
        .mesi-step-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 2px;
        }
        .mesi-step-counter {
          font-size: 12px;
          color: #888;
        }
        .mesi-description {
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 12px;
          color: #333;
          min-height: 3em;
        }
        .mesi-body {
          display: flex;
          gap: 14px;
          margin-bottom: 12px;
        }
        @media (max-width: 600px) {
          .mesi-body {
            flex-direction: column;
          }
        }
        .mesi-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 10px;
          line-height: 1.45;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          padding: 8px;
          overflow-x: auto;
          flex: 1;
          min-width: 0;
        }
        .mesi-code-line {
          padding: 0 3px;
          white-space: pre;
        }
        .mesi-code-line.writer-highlight {
          background: rgba(231, 76, 60, 0.3);
          border-left: 2px solid #e74c3c;
        }
        .mesi-code-line.reader-highlight {
          background: rgba(52, 152, 219, 0.3);
          border-left: 2px solid #3498db;
        }
        .mesi-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          min-width: 340px;
        }
        .mesi-cores {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .mesi-core {
          border: 2px solid #555;
          border-radius: 6px;
          padding: 6px 8px;
          background: #fff;
          min-width: 130px;
        }
        .mesi-core-label {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 4px;
          text-align: center;
        }
        .mesi-transfer-area {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-width: 60px;
          min-height: 40px;
          gap: 2px;
        }
        .mesi-transfer-label {
          font-size: 10px;
          color: #e67e22;
          font-weight: bold;
        }
        .mesi-transfer-arrow {
          font-size: 16px;
          color: #e67e22;
        }
        .mesi-transfer-arrow.invalidate {
          color: #e74c3c;
        }
        .mesi-dram {
          border: 2px solid #8e44ad;
          border-radius: 6px;
          padding: 4px 14px;
          background: #f5eef8;
          text-align: center;
          transition: all 0.3s ease;
        }
        .mesi-dram-title {
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 2px;
        }
        .mesi-dram-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          font-family: monospace;
          font-size: 11px;
        }
        .mesi-dram-val.stale {
          color: #e67e22;
          text-decoration: line-through;
        }
        .mesi-dram-fetch {
          font-size: 11px;
          color: #8e44ad;
          font-weight: bold;
          min-height: 16px;
        }
        .mesi-controls {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 10px;
        }
        .mesi-controls button {
          padding: 4px 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
        }
        .mesi-controls button:hover:not(:disabled) {
          background: #eee;
        }
        .mesi-controls button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .mesi-legend {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .mesi-legend-item {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
        }
        .mesi-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      `),qe=h("<div class=mesi-container><div class=mesi-header><div class=mesi-step-title></div><div class=mesi-step-counter>Step <!$><!/> of <!$><!/></div></div><div class=mesi-description></div><div class=mesi-body><div class=mesi-code></div><div class=mesi-diagram><div class=mesi-cores><div class=mesi-core style=border-color:#e74c3c><div class=mesi-core-label style=color:#e74c3c>Writer L1</div><!$><!/><!$><!/></div><div class=mesi-transfer-area></div><div class=mesi-core style=border-color:#3498db><div class=mesi-core-label style=color:#3498db>Reader L1</div><!$><!/><!$><!/></div></div><div class=mesi-dram-fetch></div><div class=mesi-dram><div class=mesi-dram-title>DRAM</div><div class=mesi-dram-row><span>shared=<!$><!/></span><span>ready=<!$><!/></span></div></div></div></div><div class=mesi-controls><button>&#x25C0; Prev</button><button>Next &#x25B6;</button><button>Reset</button></div><div class=mesi-legend>"),Pe=h("<div>"),Q=h("<span class=mesi-transfer-label>"),Oe=h("<span>"),Ge=h("<span><!$><!/> <!$><!/> (<!$><!/>)"),Ue=h("<div class=mesi-legend-item><div class=mesi-legend-dot></div><!$><!/>");const He=["volatile long long shared = 0;","atomic_bool ready = 0;","","void *writer(void *_) {","    shared = 0xDEADBEEFCAFEBABE;","    atomic_store_explicit(","        &ready, 1, release);","    return NULL;","}","","void *reader(void *_) {","    while (!atomic_load_explicit(","        &ready, acquire));",'    printf("0x%llX\\n", shared);',"    return NULL;","}"],l={state:"I",value:"-"},L=[{title:"Initial state",description:"Both shared and ready live in DRAM, initialised to 0. Neither core has cached either line yet.",writerLine:null,readerLine:null,writer:{shared:{...l},ready:{...l}},reader:{shared:{...l},ready:{...l}},dram:{shared:"0x0",ready:"0",sharedStale:!1,readyStale:!1}},{title:"Reader spins on ready",description:"The reader fetches ready from DRAM. No other core has it, so it enters Exclusive. Value is 0 — loop continues.",writerLine:null,readerLine:11,writer:{shared:{...l},ready:{...l}},reader:{shared:{...l},ready:{state:"E",value:"0"}},dram:{shared:"0x0",ready:"0",sharedStale:!1,readyStale:!1},transfer:{from:"dram",to:"reader",line:"ready",label:"fetch"}},{title:"Writer stores shared",description:"Writer fetches shared from DRAM (Exclusive), writes 0xDEADBEEFCAFEBABE. Line goes Modified. DRAM is stale.",writerLine:4,readerLine:11,writer:{shared:{state:"M",value:"0xDEAD..BABE"},ready:{...l}},reader:{shared:{...l},ready:{state:"E",value:"0"}},dram:{shared:"0x0",ready:"0",sharedStale:!0,readyStale:!1},transfer:{from:"dram",to:"writer",line:"shared",label:"fetch + write"}},{title:"Writer stores ready = 1 (release)",description:"Writer needs ready, but reader holds it Exclusive. Invalidation sent — reader's copy goes Invalid. Writer writes 1 (Modified). Release guarantees shared is visible first.",writerLine:5,readerLine:11,writer:{shared:{state:"M",value:"0xDEAD..BABE"},ready:{state:"M",value:"1"}},reader:{shared:{...l},ready:{...l}},dram:{shared:"0x0",ready:"0",sharedStale:!0,readyStale:!0},transfer:{from:"writer",to:"reader",line:"ready",label:"invalidate"}},{title:"Reader sees ready = 1 (acquire)",description:"Reader's copy is Invalid. Snoops Modified line from writer's L1 — core-to-core, no DRAM. Gets 1, loop exits. Acquire guarantees subsequent reads see the writer's stores.",writerLine:null,readerLine:11,writer:{shared:{state:"M",value:"0xDEAD..BABE"},ready:{state:"S",value:"1"}},reader:{shared:{...l},ready:{state:"S",value:"1"}},dram:{shared:"0x0",ready:"1",sharedStale:!0,readyStale:!1},transfer:{from:"writer",to:"reader",line:"ready",label:"snoop"}},{title:"Reader loads shared",description:"Reader snoops shared from writer's L1. Core-to-core transfer. Gets 0xDEADBEEFCAFEBABE. DRAM was only touched at startup — everything since was cache-to-cache.",writerLine:null,readerLine:13,writer:{shared:{state:"S",value:"0xDEAD..BABE"},ready:{state:"S",value:"1"}},reader:{shared:{state:"S",value:"0xDEAD..BABE"},ready:{state:"S",value:"1"}},dram:{shared:"0xDEAD..BABE",ready:"1",sharedStale:!1,readyStale:!1},transfer:{from:"writer",to:"reader",line:"shared",label:"snoop"}}],Y={M:"#e74c3c",E:"#3498db",S:"#2ecc71",I:"#95a5a6"},Ve={M:"Modified",E:"Exclusive",S:"Shared",I:"Invalid"};function C(s){const p=()=>Y[s.line.state];return(()=>{var e=m(We),u=e.firstChild,_=u.nextSibling,y=_.nextSibling;return r(u,()=>s.line.state),r(_,()=>s.name),r(y,()=>s.line.value),$(o=>{var a=s.highlight?"#fff3cd":"transparent",b=p(),v=s.line.state==="I"?"#aaa":"#333";return a!==o.e&&D(e,"background",o.e=a),b!==o.t&&D(u,"background",o.t=b),v!==o.a&&D(y,"color",o.a=v),o},{e:void 0,t:void 0,a:void 0}),e})()}function Je(){const[s,p]=Fe(0),e=()=>L[s()],u=()=>p(a=>Math.max(0,a-1)),_=()=>p(a=>Math.min(L.length-1,a+1)),y=()=>{const a=e().transfer;return!a||a.from==="dram"||a.to==="dram"?null:a},o=()=>{const a=e().transfer;return a&&(a.from==="dram"||a.to==="dram")?a:null};return[m(je),(()=>{var a=m(qe),b=a.firstChild,v=b.firstChild,B=v.nextSibling,Z=B.firstChild,ee=Z.nextSibling,[z,re]=n(ee.nextSibling),ie=z.nextSibling,te=ie.nextSibling,[ae,ne]=n(te.nextSibling),N=b.nextSibling,F=N.nextSibling,T=F.firstChild,le=T.nextSibling,W=le.firstChild,S=W.firstChild,se=S.firstChild,de=se.nextSibling,[j,oe]=n(de.nextSibling),ce=j.nextSibling,[me,fe]=n(ce.nextSibling),q=S.nextSibling,M=q.nextSibling,xe=M.firstChild,he=xe.nextSibling,[P,ge]=n(he.nextSibling),pe=P.nextSibling,[ue,be]=n(pe.nextSibling),O=W.nextSibling,ve=O.nextSibling,$e=ve.firstChild,_e=$e.nextSibling,w=_e.firstChild,ye=w.firstChild,Se=ye.nextSibling,[we,Ee]=n(Se.nextSibling),k=w.nextSibling,Ae=k.firstChild,Le=Ae.nextSibling,[Ce,De]=n(Le.nextSibling),G=F.nextSibling,R=G.firstChild,I=R.nextSibling,Be=I.nextSibling,Me=G.nextSibling;return r(v,()=>e().title),r(B,()=>s()+1,z,re),r(B,()=>L.length,ae,ne),r(N,()=>e().description),r(T,x(J,{each:He,children:(t,i)=>{const d=i(),c=()=>e().writerLine===d,f=()=>e().readerLine===d;return(()=>{var g=m(Pe);return r(g,t||" "),$(()=>E(g,`mesi-code-line ${c()?"writer-highlight":""} ${f()?"reader-highlight":""}`)),g})()}})),r(S,x(C,{name:"shared",get line(){return e().writer.shared},get highlight(){return A(()=>!!(e().transfer&&e().transfer.line==="shared"))()&&(e().transfer.from==="writer"||e().transfer.to==="writer")}}),j,oe),r(S,x(C,{name:"ready",get line(){return e().writer.ready},get highlight(){return A(()=>!!(e().transfer&&e().transfer.line==="ready"))()&&(e().transfer.from==="writer"||e().transfer.to==="writer")}}),me,fe),r(q,x(K,{get when(){return y()},children:t=>[(()=>{var i=m(Q);return r(i,()=>t().line),i})(),(()=>{var i=m(Oe);return r(i,()=>t().from==="writer"?"➡":"⬅"),$(()=>E(i,`mesi-transfer-arrow ${t().label==="invalidate"?"invalidate":""}`)),i})(),(()=>{var i=m(Q);return r(i,()=>t().label),i})()]})),r(M,x(C,{name:"shared",get line(){return e().reader.shared},get highlight(){return A(()=>!!(e().transfer&&e().transfer.line==="shared"))()&&(e().transfer.from==="reader"||e().transfer.to==="reader")}}),P,ge),r(M,x(C,{name:"ready",get line(){return e().reader.ready},get highlight(){return A(()=>!!(e().transfer&&e().transfer.line==="ready"))()&&(e().transfer.from==="reader"||e().transfer.to==="reader")}}),ue,be),r(O,x(K,{get when(){return o()},children:t=>(()=>{var i=m(Ge),d=i.firstChild,[c,f]=n(d.nextSibling),g=c.nextSibling,U=g.nextSibling,[H,ke]=n(U.nextSibling),Re=H.nextSibling,Ie=Re.nextSibling,[V,ze]=n(Ie.nextSibling);return V.nextSibling,r(i,()=>t().to==="dram"?"⬇":"⬆",c,f),r(i,()=>t().label,H,ke),r(i,()=>t().line,V,ze),i})()})),r(w,()=>e().dram.shared,we,Ee),r(k,()=>e().dram.ready,Ce,De),R.$$click=u,I.$$click=_,Be.$$click=()=>p(0),r(Me,x(J,{each:["M","E","S","I"],children:t=>(()=>{var i=m(Ue),d=i.firstChild,c=d.nextSibling,[f,g]=n(c.nextSibling);return r(i,()=>Ve[t],f,g),$(U=>D(d,"background",Y[t])),i})()})),$(t=>{var i=`mesi-dram-val ${e().dram.sharedStale?"stale":""}`,d=`mesi-dram-val ${e().dram.readyStale?"stale":""}`,c=s()===0,f=s()===L.length-1;return i!==t.e&&E(w,t.e=i),d!==t.t&&E(k,t.t=d),c!==t.a&&X(R,"disabled",t.a=c),f!==t.o&&X(I,"disabled",t.o=f),t},{e:void 0,t:void 0,a:void 0,o:void 0}),Te(),a})()]}Ne(["click"]);export{Je as default};
