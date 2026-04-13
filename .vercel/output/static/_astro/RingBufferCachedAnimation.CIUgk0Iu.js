import{d as Ve,e as Xe,g as $,a as b,i,c as A,h as y,r as et,t as C,k as h,j as O,s as ce,F as be}from"./web.BYgSEeKP.js";var tt=C("<div class=rbc-code-col><div class=rbc-code-col-title></div><div class=rbc-code>"),at=C("<div>"),it=C(`<style>
        .rbc-container {
          font-family: system-ui, -apple-system, sans-serif;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          background: #fafafa;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }
        .rbc-step-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .rbc-step-counter {
          font-size: 13px;
          color: #888;
          margin-bottom: 12px;
        }
        .rbc-description {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #333;
          min-height: 6.4em;
        }
        .rbc-code-columns {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) {
          .rbc-code-columns {
            flex-direction: column;
          }
        }
        .rbc-code-col {
          flex: 1;
          min-width: 0;
        }
        .rbc-code-col-title {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .rbc-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.5;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          padding: 10px;
          overflow-x: auto;
        }
        .rbc-code-line {
          padding: 1px 4px;
          white-space: pre;
          border-left: 3px solid transparent;
          transition: background 0.2s ease;
        }
        .rbc-code-line.hl {
          border-left-width: 3px;
          border-left-style: solid;
        }
        .rbc-mid-row {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .rbc-ring {
          position: relative;
          width: 220px;
          height: 220px;
          flex-shrink: 0;
        }
        .rbc-slot {
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid transparent;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .rbc-marker {
          position: absolute;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          padding: 2px 5px;
          border-radius: 3px;
        }
        .rbc-side-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 180px;
        }
        .rbc-cache-panel {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px;
          background: #fff;
        }
        .rbc-cache-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 6px;
          color: #555;
        }
        .rbc-cache-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-family: monospace;
          padding: 2px 0;
        }
        .rbc-cache-val {
          font-weight: bold;
          padding: 1px 6px;
          border-radius: 3px;
          min-width: 2ch;
          text-align: right;
          display: inline-block;
        }
        .rbc-cache-val.stale {
          background: #fdebd0;
          color: #e67e22;
        }
        .rbc-cache-val.fresh {
          background: #e8f8f5;
          color: #1a8a6a;
        }
        .rbc-atomic-panel {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .rbc-atomic-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 4px;
          background: #fff;
          border: 1px solid #ddd;
        }
        .rbc-atomic-label {
          color: #555;
        }
        .rbc-atomic-val {
          font-weight: bold;
          font-family: monospace;
          font-size: 15px;
          display: inline-block;
          min-width: 2ch;
          text-align: right;
        }
        .rbc-atomic-cross {
          border-color: #e74c3c;
          background: #fdf2f2;
        }
        .rbc-atomic-total {
          border-color: #555;
          background: #f5f5f5;
        }
        .rbc-controls {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 16px;
        }
        .rbc-controls button {
          padding: 6px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
        }
        .rbc-controls button:hover:not(:disabled) {
          background: #eee;
        }
        .rbc-controls button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .rbc-legend {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-top: 14px;
          flex-wrap: wrap;
          font-size: 12px;
        }
        .rbc-legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .rbc-legend-swatch {
          width: 14px;
          height: 14px;
          border-radius: 3px;
        }
      `),lt=C('<div class=rbc-container><div class=rbc-step-title></div><div class=rbc-step-counter>Step <!$><!/> of <!$><!/></div><div class=rbc-description></div><div class=rbc-code-columns><!$><!/><!$><!/></div><div class=rbc-mid-row><div class=rbc-ring><!$><!/><!$><!/><!$><!/><div style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);text-align:center;font-size:12px;color:#999"><div><!$><!/>/8</div><div style=font-size:11px>used</div></div></div><div class=rbc-side-panel><div class=rbc-cache-panel><div class=rbc-cache-title>Cached Counters</div><div class=rbc-cache-row><span style=color:#e74c3c>tail_cache</span><span></span></div><div class=rbc-cache-row><span style=color:#3498db>head_cache</span><span></span></div></div><div class=rbc-atomic-panel><div class=rbc-atomic-row><span class=rbc-atomic-label>Own loads</span><span class=rbc-atomic-val style=color:#1a8a6a></span></div><div class="rbc-atomic-row rbc-atomic-cross"><span class=rbc-atomic-label style=font-weight:bold>Cross-core loads</span><span class=rbc-atomic-val style=color:#e74c3c></span></div><div class=rbc-atomic-row><span class=rbc-atomic-label>Stores</span><span class=rbc-atomic-val style=color:#e67e22></span></div><div class="rbc-atomic-row rbc-atomic-total"><span class=rbc-atomic-label style=font-weight:bold>Total</span><span class=rbc-atomic-val></span></div></div></div></div><div class=rbc-controls><button>&#x25C0; Prev</button><button>Next &#x25B6;</button><button>Reset</button></div><div class=rbc-legend><div class=rbc-legend-item><div class=rbc-legend-swatch style=background:#ddd></div>Empty</div><div class=rbc-legend-item><div class=rbc-legend-swatch style=background:#3498db></div>Filled</div><div class=rbc-legend-item><div class=rbc-legend-swatch style=background:#e67e22></div>Writing</div><div class=rbc-legend-item><div class=rbc-legend-swatch style=background:#27ae60></div>Reading</div><div class=rbc-legend-item><div class=rbc-legend-swatch style="background:#e8f8f5;border:1px solid #1a8a6a"></div>Cache fresh</div><div class=rbc-legend-item><div class=rbc-legend-swatch style="background:#fdebd0;border:1px solid #e67e22"></div>Cache stale'),rt=C("<div class=rbc-slot>"),ot=C("<div class=rbc-marker style=background:#e74c3c;color:#fff>H=<!$><!/>"),st=C("<div class=rbc-marker style=background:#2980b9;color:#fff>T=<!$><!/>");const k=8,j=80,I=110,ne=36,ct=["for (int i = 0; i < N; i++) {","    int h = load(&head);            // own","    if (h - tail_cache == 8) {","        tail_cache = load(&tail);   // CROSS-CORE","        if (h - tail_cache == 8)","            { spin; continue; }","    }","    buffer[h & 7] = i;","    store(&head, h + 1);            // own","}"],nt=["for (int i = 0; i < N; i++) {","    int t = load(&tail);            // own","    if (head_cache == t) {","        head_cache = load(&head);   // CROSS-CORE","        if (head_cache == t)","            { spin; continue; }","    }","    sum += buffer[t & 7];","    store(&tail, t + 1);            // own","}"],N=[{title:"Initial state",description:"head = 0, tail = 0. The writer holds a local tail_cache (0), the reader holds a local head_cache (0). These are plain integers — no atomics, no cross-core traffic to read them.",head:0,tail:0,tailCache:0,headCache:0,tailCacheStale:!1,headCacheStale:!1,writerHL:[0],readerHL:[0],ownLoads:0,crossCoreLoads:0,stores:0},{title:"Writer writes 3 items",description:"Each iteration: load own head (Relaxed — L1 hit, ~1 cycle), check h - tail_cache. 0 < 8, 1 < 8, 2 < 8 — cache says not full every time. No cross-core load of tail needed. 3 own loads, 0 cross-core loads, 3 stores.",head:3,tail:0,tailCache:0,headCache:0,tailCacheStale:!1,headCacheStale:!0,writerHL:[1,2,7,8],readerHL:[],ownLoads:3,crossCoreLoads:0,stores:3,activeSlot:2,activeAction:"write"},{title:"Reader: head_cache says empty!",description:"Reader loads own tail (0). Checks: head_cache(0) == t(0). Looks empty — but the writer already wrote 3 items. head_cache is stale. The reader must pay for a cross-core load of head. Snoops it from the writer's L1. Gets 3. Updates head_cache = 3.",head:3,tail:0,tailCache:0,headCache:3,tailCacheStale:!1,headCacheStale:!1,writerHL:[],readerHL:[1,2,3],ownLoads:4,crossCoreLoads:1,stores:3},{title:"Reader reads slot 0",description:"head_cache(3) != t(0). Not empty. Reader reads buffer[0] directly via pointer. Stores tail = 1 (Release). One own load + one store, no cross-core load needed — head_cache was fresh.",head:3,tail:1,tailCache:0,headCache:3,tailCacheStale:!0,headCacheStale:!1,writerHL:[],readerHL:[7,8],ownLoads:4,crossCoreLoads:1,stores:4,activeSlot:0,activeAction:"read"},{title:"Writer fills remaining slots",description:"Writer writes slots 3–7. Each time: load own head, check h - tail_cache(0). 3 < 8, 4 < 8, 5 < 8, 6 < 8, 7 < 8 — all pass. The cache is stale (real tail is 1) but it doesn't matter — even with tail=0 the queue isn't full. 5 writes, 0 cross-core loads.",head:8,tail:1,tailCache:0,headCache:3,tailCacheStale:!0,headCacheStale:!0,writerHL:[1,2,7,8],readerHL:[],ownLoads:9,crossCoreLoads:1,stores:9,activeSlot:7,activeAction:"write"},{title:"Writer: tail_cache says full!",description:"h = 8. Check: 8 - tail_cache(0) = 8 = capacity. Cache says full! But tail is really 1. Writer pays for a cross-core load: snoops tail from the reader's L1. Gets 1. Updates tail_cache = 1. Now 8 - 1 = 7 < 8. Not full after all.",head:8,tail:1,tailCache:1,headCache:3,tailCacheStale:!1,headCacheStale:!0,writerHL:[1,2,3],readerHL:[],ownLoads:10,crossCoreLoads:2,stores:9},{title:"Writer wraps to slot 0",description:"h & 7 = 8 & 7 = 0. Writes buffer[0], stores head = 9. Done. 10 queue operations, 22 atomic ops total. Without caching it was 30. But the real win: cross-core loads dropped from 10 to 2. That's 80% less coherence traffic on the interconnect.",head:9,tail:1,tailCache:1,headCache:3,tailCacheStale:!1,headCacheStale:!0,writerHL:[7,8],readerHL:[],ownLoads:10,crossCoreLoads:2,stores:10,activeSlot:0,activeAction:"write"}];function dt(l,s){const e=new Set;for(let c=s;c<l;c++)e.add(c%k);return e}function ht(l){const s=-Math.PI/2+l*2*Math.PI/k;return{x:I+j*Math.cos(s)-ne/2,y:I+j*Math.sin(s)-ne/2}}function de(l,s,e=0){const c=-Math.PI/2+l*2*Math.PI/k,m=j+s;return{x:I+m*Math.cos(c)+e*-Math.sin(c),y:I+m*Math.sin(c)+e*Math.cos(c)}}function he(l){return(()=>{var s=$(tt),e=s.firstChild,c=e.nextSibling;return i(e,()=>l.title),i(c,A(be,{get each(){return l.lines},children:(m,L)=>(()=>{var _=$(at);return i(_,m||" "),y(f=>{var g=`rbc-code-line ${l.highlighted.includes(L())?"hl":""}`,x=l.highlighted.includes(L())?l.color:"transparent",H=l.highlighted.includes(L())?`${l.color}20`:"transparent";return g!==f.e&&O(_,f.e=g),x!==f.t&&h(_,"border-left-color",f.t=x),H!==f.a&&h(_,"background",f.a=H),f},{e:void 0,t:void 0,a:void 0}),_})()})),y(m=>h(e,"color",l.color)),s})()}function ft(){const[l,s]=Xe(0),e=()=>N[l()],c=()=>dt(e().head,e().tail),m=()=>s(n=>Math.max(0,n-1)),L=()=>s(n=>Math.min(N.length-1,n+1)),_=n=>{const v=e();return v.activeSlot===n&&v.activeAction==="write"?"#e67e22":v.activeSlot===n&&v.activeAction==="read"?"#27ae60":c().has(n)?"#3498db":"#ddd"},f=n=>e().activeSlot===n||c().has(n)?"#fff":"#666",g=()=>e().head%k,x=()=>e().tail%k,H=()=>e().ownLoads+e().crossCoreLoads+e().stores;return[$(it),(()=>{var n=$(lt),v=n.firstChild,z=v.nextSibling,fe=z.firstChild,pe=fe.nextSibling,[B,ge]=b(pe.nextSibling),xe=B.nextSibling,ve=xe.nextSibling,[ue,me]=b(ve.nextSibling),D=z.nextSibling,T=D.nextSibling,_e=T.firstChild,[G,$e]=b(_e.nextSibling),Ce=G.nextSibling,[we,Se]=b(Ce.nextSibling),F=T.nextSibling,R=F.firstChild,ye=R.firstChild,[U,ke]=b(ye.nextSibling),Le=U.nextSibling,[q,Re]=b(Le.nextSibling),Ee=q.nextSibling,[Y,He]=b(Ee.nextSibling),ze=Y.nextSibling,M=ze.firstChild,Te=M.firstChild,[Z,Ne]=b(Te.nextSibling);Z.nextSibling,M.nextSibling;var Ae=R.nextSibling,J=Ae.firstChild,Ie=J.firstChild,K=Ie.nextSibling,Me=K.firstChild,Q=Me.nextSibling,Pe=K.nextSibling,We=Pe.firstChild,V=We.nextSibling,Oe=J.nextSibling,X=Oe.firstChild,je=X.firstChild,Be=je.nextSibling,ee=X.nextSibling,De=ee.firstChild,Ge=De.nextSibling,te=ee.nextSibling,Fe=te.firstChild,Ue=Fe.nextSibling,qe=te.nextSibling,Ye=qe.firstChild,Ze=Ye.nextSibling,ae=F.nextSibling,P=ae.firstChild,W=P.nextSibling,Je=W.nextSibling,Ke=ae.nextSibling,ie=Ke.firstChild;ie.firstChild;var le=ie.nextSibling;le.firstChild;var re=le.nextSibling;re.firstChild;var oe=re.nextSibling;oe.firstChild;var se=oe.nextSibling;se.firstChild;var Qe=se.nextSibling;return Qe.firstChild,i(v,()=>e().title),i(z,()=>l()+1,B,ge),i(z,()=>N.length,ue,me),i(D,()=>e().description),i(T,A(he,{title:"Thread A (Writer)",lines:ct,get highlighted(){return e().writerHL},color:"#e74c3c"}),G,$e),i(T,A(he,{title:"Thread B (Reader)",lines:nt,get highlighted(){return e().readerHL},color:"#3498db"}),we,Se),i(R,A(be,{get each(){return Array.from({length:k},(t,d)=>d)},children:t=>{const d=ht(t);return(()=>{var a=$(rt);return i(a,t),y(r=>{var p=`${d.x}px`,w=`${d.y}px`,S=_(t),o=f(t),u=g()===t&&x()===t||g()===t?"#e74c3c":x()===t?"#2980b9":"transparent";return p!==r.e&&h(a,"left",r.e=p),w!==r.t&&h(a,"top",r.t=w),S!==r.a&&h(a,"background",r.a=S),o!==r.o&&h(a,"color",r.o=o),u!==r.i&&h(a,"border-color",r.i=u),r},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),a})()}}),U,ke),i(R,()=>{const t=g()===x(),d=de(g(),32,t?-20:0);return(()=>{var a=$(ot),r=a.firstChild,p=r.nextSibling,[w,S]=b(p.nextSibling);return i(a,()=>e().head,w,S),y(o=>{var u=`${d.x}px`,E=`${d.y}px`;return u!==o.e&&h(a,"left",o.e=u),E!==o.t&&h(a,"top",o.t=E),o},{e:void 0,t:void 0}),a})()},q,Re),i(R,()=>{const t=g()===x(),d=de(x(),32,t?20:0);return(()=>{var a=$(st),r=a.firstChild,p=r.nextSibling,[w,S]=b(p.nextSibling);return i(a,()=>e().tail,w,S),y(o=>{var u=`${d.x}px`,E=`${d.y}px`;return u!==o.e&&h(a,"left",o.e=u),E!==o.t&&h(a,"top",o.t=E),o},{e:void 0,t:void 0}),a})()},Y,He),i(M,()=>e().head-e().tail,Z,Ne),i(Q,()=>e().tailCache),i(V,()=>e().headCache),i(Be,()=>e().ownLoads),i(Ge,()=>e().crossCoreLoads),i(Ue,()=>e().stores),i(Ze,H),P.$$click=m,W.$$click=L,Je.$$click=()=>s(0),y(t=>{var d=`rbc-cache-val ${e().tailCacheStale?"stale":"fresh"}`,a=`rbc-cache-val ${e().headCacheStale?"stale":"fresh"}`,r=l()===0,p=l()===N.length-1;return d!==t.e&&O(Q,t.e=d),a!==t.t&&O(V,t.t=a),r!==t.a&&ce(P,"disabled",t.a=r),p!==t.o&&ce(W,"disabled",t.o=p),t},{e:void 0,t:void 0,a:void 0,o:void 0}),et(),n})()]}Ve(["click"]);export{ft as default};
