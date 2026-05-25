import{d as wt,a as L,g as P,b,i as t,e as U,r as yt,t as A,k as Ct,s as kt}from"./web.CW-alu3a.js";var zt=A(`<style>
        .aoc-container {
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
        .aoc-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .aoc-inputs {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .aoc-input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .aoc-input-label {
          font-size: 13px;
          color: #555;
          font-weight: bold;
        }
        .aoc-input-val {
          font-size: 13px;
          color: #888;
          font-family: monospace;
        }
        .aoc-input-group input[type="range"] {
          width: 200px;
          cursor: pointer;
        }
        .aoc-input-group input[type="number"] {
          width: 120px;
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          font-family: monospace;
        }
        .aoc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin-bottom: 20px;
        }
        .aoc-table th, .aoc-table td {
          padding: 6px 10px;
          text-align: right;
          border-bottom: 1px solid #eee;
        }
        .aoc-table th {
          text-align: left;
          color: #555;
          font-weight: normal;
        }
        .aoc-table th:first-child {
          width: 50%;
        }
        .aoc-table td {
          font-family: monospace;
          font-weight: bold;
        }
        .aoc-table thead th {
          font-weight: bold;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        .aoc-table .cross-core {
          color: #e74c3c;
        }
        .aoc-bars {
          margin-bottom: 8px;
        }
        .aoc-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .aoc-bar-label {
          font-size: 12px;
          width: 80px;
          text-align: right;
          color: #555;
          flex-shrink: 0;
        }
        .aoc-bar-track {
          flex: 1;
          height: 24px;
          background: #eee;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .aoc-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          padding-left: 8px;
          font-size: 11px;
          font-weight: bold;
          color: #fff;
          white-space: nowrap;
          min-width: fit-content;
        }
        .aoc-reduction {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          padding: 8px;
          border-radius: 6px;
          background: #e8f8f5;
          color: #1a8a6a;
          border: 1px solid #a3d9cc;
        }
      `),Et=A('<div class=aoc-container><div class=aoc-title>Cross-core atomic load comparison</div><div class=aoc-inputs><div class=aoc-input-group><label class=aoc-input-label>Items transferred (N)</label><input type=number min=1 max=100000000></div><div class=aoc-input-group><label class=aoc-input-label>Buffer capacity</label><input type=range min=0 max=9 step=1><span class=aoc-input-val>2<sup></sup> = <!$><!/> slots</span></div></div><table class=aoc-table><thead><tr><th></th><th>Uncached</th><th>Cached</th></tr></thead><tbody><tr><th>Own loads (L1 hit)</th><td></td><td></td></tr><tr><th class=cross-core>Cross-core loads (snoop)</th><td class=cross-core></td><td class=cross-core></td></tr><tr><th>Stores</th><td></td><td></td></tr><tr style="border-top:2px solid #ddd"><th style=font-weight:bold>Total atomic ops</th><td></td><td></td></tr></tbody></table><div style=font-size:12px;font-weight:bold;color:#555;margin-bottom:6px>Cross-core loads (the expensive ones)</div><div class=aoc-bars><div class=aoc-bar-row><span class=aoc-bar-label>Uncached</span><div class=aoc-bar-track><div class=aoc-bar-fill style=width:100%;background:#e74c3c></div></div></div><div class=aoc-bar-row><span class=aoc-bar-label>Cached</span><div class=aoc-bar-track><div class=aoc-bar-fill style=background:#27ae60></div></div></div></div><div class=aoc-reduction><!$><!/>% fewer cross-core loads with caching (capacity = <!$><!/>)');function Nt(){const[x,H]=L(1e4),[s,K]=L(3),c=()=>Math.pow(2,s()),l=()=>x(),r=()=>2*l(),R=()=>6*l(),n=()=>2*Math.ceil(l()/c()),g=()=>2*l(),h=()=>2*l(),j=()=>g()+n()+h(),q=()=>{const e=r();return e===0?0:(e-n())/e*100},D=()=>Math.max(r(),1);function i(e){return e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(1)+"K":e.toString()}return[P(zt),(()=>{var e=P(Et),G=e.firstChild,f=G.nextSibling,u=f.firstChild,J=u.firstChild,$=J.nextSibling,Q=u.nextSibling,V=Q.firstChild,d=V.nextSibling,m=d.nextSibling,W=m.firstChild,_=W.nextSibling,X=_.nextSibling,Y=X.nextSibling,[v,Z]=b(Y.nextSibling);v.nextSibling;var S=f.nextSibling,tt=S.firstChild,et=tt.nextSibling,w=et.firstChild,it=w.firstChild,y=it.nextSibling,at=y.nextSibling,C=w.nextSibling,lt=C.firstChild,k=lt.nextSibling,ot=k.nextSibling,z=C.nextSibling,nt=z.firstChild,E=nt.nextSibling,rt=E.nextSibling,st=z.nextSibling,ct=st.firstChild,M=ct.nextSibling,dt=M.nextSibling,pt=S.nextSibling,N=pt.nextSibling,T=N.firstChild,bt=T.firstChild,xt=bt.nextSibling,gt=xt.firstChild,ht=T.nextSibling,ft=ht.firstChild,ut=ft.nextSibling,I=ut.firstChild,p=N.nextSibling,$t=p.firstChild,[F,mt]=b($t.nextSibling),_t=F.nextSibling,vt=_t.nextSibling,[O,St]=b(vt.nextSibling);return O.nextSibling,$.$$input=a=>{const o=parseInt(a.currentTarget.value);!isNaN(o)&&o>0&&H(o)},d.$$input=a=>K(parseInt(a.currentTarget.value)),t(_,s),t(m,c,v,Z),t(y,()=>i(2*l())),t(at,()=>i(g())),t(k,()=>i(r())),t(ot,()=>i(n())),t(E,()=>i(2*l())),t(rt,()=>i(h())),t(M,()=>i(R())),t(dt,()=>i(j())),t(gt,()=>i(r())),t(I,()=>i(n())),t(p,()=>q().toFixed(1),F,mt),t(p,c,O,St),U(a=>{var o=s(),B=`${Math.max(n()/D()*100,2)}%`;return o!==a.e&&(d.value=a.e=o),B!==a.t&&Ct(I,"width",a.t=B),a},{e:void 0,t:void 0}),U(()=>kt($,"value",x())),yt(),e})()]}wt(["input"]);export{Nt as default};
