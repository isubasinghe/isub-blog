import{e as h,o as b,f as p,g as s,i as r,a as m,m as S,h as E,j as k,t as o,c as u}from"./web.BYgSEeKP.js";import{c as T}from"./store._BsIvE3o.js";var w=o("<style>"),C=o("<div class=circle_container><div></div><!$><!/>"),D=o("<div class=delta_local>");function A(e,c){return Math.floor(Math.random()*(c-e+1)+e)}function _(e){const c=A(500,1200),[i,t]=h(0),[$,d]=h(0);b(()=>{e.dispatch({type:"UPDATE_DELTA",id:e.id,delta:0});const l=setInterval(()=>{const a=e.deltas[e.id];a!==void 0&&a!==0&&(t(n=>n+a),d(a),setTimeout(()=>d(0),300),e.dispatch({type:"RESET_DELTA",id:e.id})),t(n=>n+1)},c);p(()=>clearInterval(l))});const f=()=>{const l=$();return l>0?`+ ${l}`:`${l}`};return[(()=>{var l=s(w);return r(l,()=>`
        .circle_${e.colour} {
          background: ${e.colour};
          width: 100px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
        .circle_container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .delta_local {
          margin-left: 20px;
        }
      `),l})(),(()=>{var l=s(C),a=l.firstChild,n=a.nextSibling,[g,x]=m(n.nextSibling);return r(a,i),r(l,(()=>{var v=S(()=>$()!==0);return()=>v()&&(()=>{var y=s(D);return r(y,f),y})()})(),g,x),E(()=>k(a,`circle_${e.colour}`)),l})()]}var L=o(`<style>
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
      `),j=o("<div class=master>"),I=o("<div class=clocks><!$><!/><!$><!/><!$><!/>");function R(){const[e,c]=T({deltas:{}}),i=t=>{switch(t.type){case"UPDATE_DELTA":c("deltas",t.id,t.delta);break;case"RESET_DELTA":c("deltas",t.id,0);break}};return[s(L),(()=>{var t=s(j);return r(t,u(_,{id:0,colour:"red",get deltas(){return e.deltas},dispatch:i})),t})(),(()=>{var t=s(I),$=t.firstChild,[d,f]=m($.nextSibling),l=d.nextSibling,[a,n]=m(l.nextSibling),g=a.nextSibling,[x,v]=m(g.nextSibling);return r(t,u(_,{id:1,colour:"yellow",get deltas(){return e.deltas},dispatch:i}),d,f),r(t,u(_,{id:2,colour:"yellow",get deltas(){return e.deltas},dispatch:i}),a,n),r(t,u(_,{id:3,colour:"yellow",get deltas(){return e.deltas},dispatch:i}),x,v),t})()]}export{R as default};
