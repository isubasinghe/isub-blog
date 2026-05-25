import{a as y,o as T,j as h,g as d,i,b as R,m as k,e as p,f as A,t as u,c as f,F as C}from"./web.CW-alu3a.js";import{c as I}from"./store.eDu274m8.js";var D=u("<style>"),N=u("<div class=circle_container><div></div><!$><!/>"),L=u("<div class=delta_local>");function w(e,n){return Math.floor(Math.random()*(n-e+1)+e)}function $(e){const n=w(500,1200),[r,s]=y(0),[l,t]=y(0);T(()=>{e.dispatch({type:"UPDATE_DELTA",id:e.id,delta:0}),e.dispatch({type:"REPORT_COUNTER",id:e.id,value:0});const a=setInterval(()=>{const c=e.deltas[e.id];c!==void 0&&c!==0&&(s(m=>m+c),t(c),setTimeout(()=>t(0),300),e.dispatch({type:"RESET_DELTA",id:e.id}));const _=r()+1;s(_),e.dispatch({type:"REPORT_COUNTER",id:e.id,value:_})},n);h(()=>clearInterval(a))});const o=()=>{const a=l();return a>0?`+ ${a}`:`${a}`};return[(()=>{var a=d(D);return i(a,()=>`
        .circle_${e.colour} {
          background: ${e.colour};
          width: 100px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          transition: box-shadow 0.2s ease;
        }
        .circle_${e.colour}.syncing {
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.8),
                      0 0 0 10px rgba(0, 0, 0, 0.4);
        }
        .circle_container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .delta_local {
          margin-left: 20px;
        }
      `),a})(),(()=>{var a=d(N),c=a.firstChild,_=c.nextSibling,[m,S]=R(_.nextSibling);return i(c,r),i(a,(()=>{var b=k(()=>l()!==0);return()=>b()&&(()=>{var v=d(L);return i(v,o),v})()})(),m,S),p(()=>A(c,`circle_${e.colour}${e.syncing?" syncing":""}`)),a})()]}function M(e){const n=Object.keys(e).map(Number);if(n.length===0)return{};const r=n.reduce((t,o)=>t+e[o],0),s=Math.round(r/n.length),l={};for(const t of n)l[t]=s-e[t];return l}var O=u(`<style>
        .master {
          display: flex;
          justify-content: center;
          width: 500px;
          margin-bottom: 100px;
        }
        .clocks {
          display: flex;
          justify-content: space-between;
          width: 500px;
        }
      `),j=u("<div class=master>"),P=u("<div class=clocks>");const x=[1,2,3],E=0,g=[E,...x],U=5e3;function B(){const[e,n]=I({counters:{},deltas:{}}),[r,s]=y(!1),l=t=>{switch(t.type){case"UPDATE_DELTA":n("deltas",t.id,t.delta);break;case"RESET_DELTA":n("deltas",t.id,0);break;case"REPORT_COUNTER":n("counters",t.id,t.value);break;case"START_SYNC":{if(!g.every(c=>e.counters[c]!==void 0))break;const a=M({...e.counters});for(const c of g)n("deltas",c,a[c]??0);s(!0),setTimeout(()=>s(!1),300);break}}};return T(()=>{const t=setInterval(()=>l({type:"START_SYNC"}),U);h(()=>clearInterval(t))}),[d(O),(()=>{var t=d(j);return i(t,f($,{id:E,colour:"red",get deltas(){return e.deltas},get syncing(){return r()},dispatch:l})),t})(),(()=>{var t=d(P);return i(t,f(C,{each:x,children:o=>f($,{id:o,colour:"yellow",get deltas(){return e.deltas},dispatch:l})})),t})()]}export{B as default};
