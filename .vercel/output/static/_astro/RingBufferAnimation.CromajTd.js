import{d as Nt,e as Wt,g as $,a as h,i as o,c as z,h as C,r as Pt,t as S,k as b,s as X,F as rt,j as jt}from"./web.BYgSEeKP.js";var Ft=S("<div class=rb-code-col><div class=rb-code-col-title></div><div class=rb-code>"),Ot=S("<div>"),Bt=S(`<style>
        .rb-container {
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
        .rb-step-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .rb-step-counter {
          font-size: 13px;
          color: #888;
          margin-bottom: 12px;
        }
        .rb-description {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #333;
          min-height: 4.8em;
        }
        .rb-code-columns {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) {
          .rb-code-columns {
            flex-direction: column;
          }
        }
        .rb-code-col {
          flex: 1;
          min-width: 0;
        }
        .rb-code-col-title {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .rb-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.5;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          padding: 10px;
          overflow-x: auto;
        }
        .rb-code-line {
          padding: 1px 4px;
          white-space: pre;
          border-left: 3px solid transparent;
          transition: background 0.2s ease;
        }
        .rb-code-line.hl {
          border-left-width: 3px;
          border-left-style: solid;
        }
        .rb-mid-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .rb-ring {
          position: relative;
          width: 220px;
          height: 220px;
          flex-shrink: 0;
        }
        .rb-slot {
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
        .rb-marker {
          position: absolute;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          padding: 2px 5px;
          border-radius: 3px;
        }
        .rb-atomic-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 160px;
        }
        .rb-atomic-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 4px;
          background: #fff;
          border: 1px solid #ddd;
        }
        .rb-atomic-label {
          color: #555;
        }
        .rb-atomic-val {
          font-weight: bold;
          font-family: monospace;
          font-size: 15px;
          display: inline-block;
          min-width: 2ch;
          text-align: right;
        }
        .rb-atomic-total {
          border-color: #e74c3c;
          background: #fdf2f2;
        }
        .rb-controls {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 16px;
        }
        .rb-controls button {
          padding: 6px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
        }
        .rb-controls button:hover:not(:disabled) {
          background: #eee;
        }
        .rb-controls button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .rb-legend {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-top: 14px;
          flex-wrap: wrap;
          font-size: 12px;
        }
        .rb-legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .rb-legend-swatch {
          width: 14px;
          height: 14px;
          border-radius: 3px;
        }
      `),Dt=S('<div class=rb-container><div class=rb-step-title></div><div class=rb-step-counter>Step <!$><!/> of <!$><!/></div><div class=rb-description></div><div class=rb-code-columns><!$><!/><!$><!/></div><div class=rb-mid-row><div class=rb-ring><!$><!/><!$><!/><!$><!/><div style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);text-align:center;font-size:12px;color:#999"><div><!$><!/>/8</div><div style=font-size:11px>used</div></div></div><div class=rb-atomic-panel><div class=rb-atomic-row><span class=rb-atomic-label>Atomic loads</span><span class=rb-atomic-val style=color:#8e44ad></span></div><div class=rb-atomic-row><span class=rb-atomic-label>Atomic stores</span><span class=rb-atomic-val style=color:#e67e22></span></div><div class="rb-atomic-row rb-atomic-total"><span class=rb-atomic-label style=font-weight:bold>Total</span><span class=rb-atomic-val style=color:#e74c3c></span></div></div></div><div class=rb-controls><button>&#x25C0; Prev</button><button>Next &#x25B6;</button><button>Reset</button></div><div class=rb-legend><div class=rb-legend-item><div class=rb-legend-swatch style=background:#ddd></div>Empty</div><div class=rb-legend-item><div class=rb-legend-swatch style=background:#3498db></div>Filled</div><div class=rb-legend-item><div class=rb-legend-swatch style=background:#e67e22></div>Writing</div><div class=rb-legend-item><div class=rb-legend-swatch style=background:#27ae60></div>Reading'),qt=S("<div class=rb-slot>"),Gt=S("<div class=rb-marker style=background:#e74c3c;color:#fff>H=<!$><!/>"),Qt=S("<div class=rb-marker style=background:#2980b9;color:#fff>T=<!$><!/>");const k=8,P=80,I=110,tt=36,Ut=["for (int i = 0; i < N; i++) {","    int h = load(&head);       // atomic","    int t = load(&tail);       // atomic","    if (h - t == 8) {","        spin_loop(); continue;","    }","    buffer[h & 7] = i;","    store(&head, h + 1);       // atomic","}"],Yt=["for (int i = 0; i < N; i++) {","    int t = load(&tail);       // atomic","    int h = load(&head);       // atomic","    if (h == t) {","        spin_loop(); continue;","    }","    sum += buffer[t & 7];","    store(&tail, t + 1);       // atomic","}"],T=[{title:"Initial state",description:"head = 0, tail = 0. Both threads are about to enter their loops. No atomic operations yet.",head:0,tail:0,writerHL:[0],readerHL:[0],atomicLoads:0,atomicStores:0},{title:"Writer: check if full",description:"Writer loads head (0) and tail (0). Two atomic loads. h - t = 0 < 8, so the queue is not full.",head:0,tail:0,writerHL:[1,2,3],readerHL:[],atomicLoads:2,atomicStores:0},{title:"Writer: write slot 0, advance head",description:"h & 7 = 0. Writer writes value into buffer[0]. Then atomically stores head = 1. One atomic store.",head:1,tail:0,writerHL:[6,7],readerHL:[],atomicLoads:2,atomicStores:1,activeSlot:0,activeAction:"write"},{title:"Writer writes 2 more items",description:"Same sequence twice: 2 atomic loads + 1 atomic store each. head advances to 3. Slots 0, 1, 2 are filled. That's 6 atomic loads and 3 atomic stores for 3 items.",head:3,tail:0,writerHL:[1,2,6,7],readerHL:[],atomicLoads:6,atomicStores:3,activeSlot:2,activeAction:"write"},{title:"Reader: check if empty",description:"Reader loads tail (0) and head (3). Two atomic loads. h == t? 3 == 0? No. Queue is not empty.",head:3,tail:0,writerHL:[],readerHL:[1,2,3],atomicLoads:8,atomicStores:3},{title:"Reader: read slot 0, advance tail",description:"t & 7 = 0. Reader reads buffer[0]. Atomically stores tail = 1. Slot 0 is freed. One atomic store.",head:3,tail:1,writerHL:[],readerHL:[6,7],atomicLoads:8,atomicStores:4,activeSlot:0,activeAction:"read"},{title:"Writer fills remaining slots",description:"Writer writes slots 3 through 7. Five iterations: 10 atomic loads + 5 atomic stores. head is now 8. Slots 1–7 are filled, slot 0 is free.",head:8,tail:1,writerHL:[1,2,6,7],readerHL:[],atomicLoads:18,atomicStores:9,activeSlot:7,activeAction:"write"},{title:"Writer wraps around to slot 0",description:"h & 7 = 8 & 7 = 0. The bitmask wraps in one instruction. Writer writes buffer[0] and stores head = 9. Every single queue operation cost 3 atomic ops: 2 loads + 1 store. For 9 writes and 1 read, that’s 30 total. Can we do better?",head:9,tail:1,writerHL:[6,7],readerHL:[],atomicLoads:20,atomicStores:10,activeSlot:0,activeAction:"write"}];function Zt(i,s){const t=new Set;for(let d=s;d<i;d++)t.add(d%k);return t}function Jt(i){const s=-Math.PI/2+i*2*Math.PI/k;return{x:I+P*Math.cos(s)-tt/2,y:I+P*Math.sin(s)-tt/2}}function et(i,s,t=0){const d=-Math.PI/2+i*2*Math.PI/k,v=P+s;return{x:I+v*Math.cos(d)+t*-Math.sin(d),y:I+v*Math.sin(d)+t*Math.cos(d)}}function it(i){return(()=>{var s=$(Ft),t=s.firstChild,d=t.nextSibling;return o(t,()=>i.title),o(d,z(rt,{get each(){return i.lines},children:(v,L)=>(()=>{var u=$(Ot);return o(u,v||" "),C(f=>{var g=`rb-code-line ${i.highlighted.includes(L())?"hl":""}`,m=i.highlighted.includes(L())?i.color:"transparent",a=i.highlighted.includes(L())?`${i.color}20`:"transparent";return g!==f.e&&jt(u,f.e=g),m!==f.t&&b(u,"border-left-color",f.t=m),a!==f.a&&b(u,"background",f.a=a),f},{e:void 0,t:void 0,a:void 0}),u})()})),C(v=>b(t,"color",i.color)),s})()}function Vt(){const[i,s]=Wt(0),t=()=>T[i()],d=()=>Zt(t().head,t().tail),v=()=>s(a=>Math.max(0,a-1)),L=()=>s(a=>Math.min(T.length-1,a+1)),u=a=>{const x=t();return x.activeSlot===a&&x.activeAction==="write"?"#e67e22":x.activeSlot===a&&x.activeAction==="read"?"#27ae60":d().has(a)?"#3498db":"#ddd"},f=a=>t().activeSlot===a||d().has(a)?"#fff":"#666",g=()=>t().head%k,m=()=>t().tail%k;return[$(Bt),(()=>{var a=$(Dt),x=a.firstChild,R=x.nextSibling,ot=R.firstChild,at=ot.nextSibling,[j,lt]=h(at.nextSibling),nt=j.nextSibling,st=nt.nextSibling,[dt,ct]=h(st.nextSibling),F=R.nextSibling,E=F.nextSibling,bt=E.firstChild,[O,ht]=h(bt.nextSibling),ft=O.nextSibling,[gt,mt]=h(ft.nextSibling),B=E.nextSibling,H=B.firstChild,xt=H.firstChild,[D,pt]=h(xt.nextSibling),vt=D.nextSibling,[q,ut]=h(vt.nextSibling),$t=q.nextSibling,[G,St]=h($t.nextSibling),_t=G.nextSibling,M=_t.firstChild,wt=M.firstChild,[Q,yt]=h(wt.nextSibling);Q.nextSibling,M.nextSibling;var Ct=H.nextSibling,U=Ct.firstChild,kt=U.firstChild,Lt=kt.nextSibling,Y=U.nextSibling,Ht=Y.firstChild,At=Ht.nextSibling,Rt=Y.nextSibling,Et=Rt.firstChild,Tt=Et.nextSibling,Z=B.nextSibling,N=Z.firstChild,W=N.nextSibling,zt=W.nextSibling,It=Z.nextSibling,J=It.firstChild;J.firstChild;var K=J.nextSibling;K.firstChild;var V=K.nextSibling;V.firstChild;var Mt=V.nextSibling;return Mt.firstChild,o(x,()=>t().title),o(R,()=>i()+1,j,lt),o(R,()=>T.length,dt,ct),o(F,()=>t().description),o(E,z(it,{title:"Thread A (Writer)",lines:Ut,get highlighted(){return t().writerHL},color:"#e74c3c"}),O,ht),o(E,z(it,{title:"Thread B (Reader)",lines:Yt,get highlighted(){return t().readerHL},color:"#3498db"}),gt,mt),o(H,z(rt,{get each(){return Array.from({length:k},(r,c)=>c)},children:r=>{const c=Jt(r);return(()=>{var e=$(qt);return o(e,r),C(l=>{var _=`${c.x}px`,w=`${c.y}px`,y=u(r),n=f(r),p=g()===r&&m()===r||g()===r?"#e74c3c":m()===r?"#2980b9":"transparent";return _!==l.e&&b(e,"left",l.e=_),w!==l.t&&b(e,"top",l.t=w),y!==l.a&&b(e,"background",l.a=y),n!==l.o&&b(e,"color",l.o=n),p!==l.i&&b(e,"border-color",l.i=p),l},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),e})()}}),D,pt),o(H,()=>{const r=g()===m(),c=et(g(),32,r?-20:0);return(()=>{var e=$(Gt),l=e.firstChild,_=l.nextSibling,[w,y]=h(_.nextSibling);return o(e,()=>t().head,w,y),C(n=>{var p=`${c.x}px`,A=`${c.y}px`;return p!==n.e&&b(e,"left",n.e=p),A!==n.t&&b(e,"top",n.t=A),n},{e:void 0,t:void 0}),e})()},q,ut),o(H,()=>{const r=g()===m(),c=et(m(),32,r?20:0);return(()=>{var e=$(Qt),l=e.firstChild,_=l.nextSibling,[w,y]=h(_.nextSibling);return o(e,()=>t().tail,w,y),C(n=>{var p=`${c.x}px`,A=`${c.y}px`;return p!==n.e&&b(e,"left",n.e=p),A!==n.t&&b(e,"top",n.t=A),n},{e:void 0,t:void 0}),e})()},G,St),o(M,()=>t().head-t().tail,Q,yt),o(Lt,()=>t().atomicLoads),o(At,()=>t().atomicStores),o(Tt,()=>t().atomicLoads+t().atomicStores),N.$$click=v,W.$$click=L,zt.$$click=()=>s(0),C(r=>{var c=i()===0,e=i()===T.length-1;return c!==r.e&&X(N,"disabled",r.e=c),e!==r.t&&X(W,"disabled",r.t=e),r},{e:void 0,t:void 0}),Pt(),a})()]}Nt(["click"]);export{Vt as default};
