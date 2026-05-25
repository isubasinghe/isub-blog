import{d as T,c as S,a as q,g as b,b as m,i as d,F as v,e as w,f as E,h as y,r as F,m as z,S as B,t as x}from"./web.CW-alu3a.js";import{c as D}from"./store.eDu274m8.js";function G(l,n,r){const s={},t=new Set;for(const e of Object.keys(l))t.add(Number(e));for(const e of Object.keys(n))t.add(Number(e));t.add(r);for(const e of t)s[e]=Math.max(l[e]??0,n[e]??0);return s[r]=s[r]+1,s}var J=x(`<style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
          transition: background-color 0.4s ease;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
        tr.flash td {
          background-color: #fff3a3;
        }
        .buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      `),M=x("<table><thead><tr><th>State</th><!$><!/></tr></thead><tbody><tr><td></td><!$><!/>"),V=x("<div class=buttons><button>Add One</button><button>Minus One</button><button>Send to other"),A=x("<th>V[<!$><!/>]"),H=x("<td>");function L(l,n){const[r,s]=D({[l]:{state:n,counter:0}}),[t,e]=q(!1);return{id:l,clocks:r,flash:t,updateSelf:_=>{s(l,{state:_,counter:(r[l]?.counter??0)+1})},receiveUpdate:(_,h)=>{const k={};for(const a of Object.keys(r))k[Number(a)]=r[Number(a)].counter;const i={};for(const a of Object.keys(h))i[Number(a)]=h[Number(a)].counter;const u=G(k,i,l);for(const a of Object.keys(u)){const $=Number(a);r[$]?s($,"counter",u[$]):s($,{state:0,counter:u[$]})}e(!0),setTimeout(()=>e(!1),400)},sendUpdate:_=>{s(l,"counter",h=>h+1),_(r[l].state,{...r})}}}function Q(){const l=L(0,0),n=L(1,0),r=(t,e)=>()=>t.updateSelf(t.clocks[e].state+1),s=(t,e)=>()=>t.updateSelf(t.clocks[e].state-1);return S(B,{get when(){return z(()=>!!l.clocks[0])()&&n.clocks[1]},get children(){return[b(J),(()=>{var t=b(M),e=t.firstChild,o=e.firstChild,f=o.firstChild,C=f.nextSibling,[_,h]=m(C.nextSibling),k=e.nextSibling,i=k.firstChild,u=i.firstChild,a=u.nextSibling,[$,N]=m(a.nextSibling);return d(o,S(v,{get each(){return Object.keys(l.clocks)},children:g=>(()=>{var c=b(A),O=c.firstChild,j=O.nextSibling,[p,U]=m(j.nextSibling);return p.nextSibling,d(c,g,p,U),c})()}),_,h),d(u,()=>l.clocks[0].state),d(i,S(v,{get each(){return Object.keys(l.clocks)},children:g=>(()=>{var c=b(H);return d(c,()=>l.clocks[Number(g)].counter),c})()}),$,N),w(()=>E(i,l.flash()?"flash":"")),t})(),(()=>{var t=b(V),e=t.firstChild,o=e.nextSibling,f=o.nextSibling;return y(e,"click",r(l,0)),y(o,"click",s(l,0)),f.$$click=()=>l.sendUpdate(n.receiveUpdate),F(),t})(),(()=>{var t=b(M),e=t.firstChild,o=e.firstChild,f=o.firstChild,C=f.nextSibling,[_,h]=m(C.nextSibling),k=e.nextSibling,i=k.firstChild,u=i.firstChild,a=u.nextSibling,[$,N]=m(a.nextSibling);return d(o,S(v,{get each(){return Object.keys(n.clocks)},children:g=>(()=>{var c=b(A),O=c.firstChild,j=O.nextSibling,[p,U]=m(j.nextSibling);return p.nextSibling,d(c,g,p,U),c})()}),_,h),d(u,()=>n.clocks[1].state),d(i,S(v,{get each(){return Object.keys(n.clocks)},children:g=>(()=>{var c=b(H);return d(c,()=>n.clocks[Number(g)].counter),c})()}),$,N),w(()=>E(i,n.flash()?"flash":"")),t})(),(()=>{var t=b(V),e=t.firstChild,o=e.nextSibling,f=o.nextSibling;return y(e,"click",r(n,1)),y(o,"click",s(n,1)),f.$$click=()=>n.sendUpdate(l.receiveUpdate),F(),t})()]}})}T(["click"]);export{Q as default};
