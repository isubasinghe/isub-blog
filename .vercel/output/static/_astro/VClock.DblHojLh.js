import{d as H,c as p,g as a,a as _,i as s,F as S,b as x,r as E,m as L,S as q,t as k}from"./web.BYgSEeKP.js";import{c as z}from"./store._BsIvE3o.js";var B=k(`<style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
        .buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      `),M=k("<table><thead><tr><th>State</th><!$><!/></tr></thead><tbody><tr><td></td><!$><!/>"),N=k("<div class=buttons><button>Add One</button><button>Minus One</button><button>Send to other"),V=k("<th>V[<!$><!/>]"),A=k("<td>");function F(l,c){const[o,u]=z({[l]:{state:c,counter:0}});return{clocks:o,updateSelf:i=>{u(l,{state:i,counter:(o[l]?.counter??0)+1})},receiveUpdate:(i,$)=>{},sendUpdate:i=>{u(l,"counter",$=>$+1),i(o[l].state,{...o})}}}function I(){const l=F(0,0),c=F(1,0),o=(e,t)=>()=>e.updateSelf(e.clocks[t].state+1),u=(e,t)=>()=>e.updateSelf(e.clocks[t].state-1);return p(q,{get when(){return L(()=>!!l.clocks[0])()&&c.clocks[1]},get children(){return[a(B),(()=>{var e=a(M),t=e.firstChild,r=t.firstChild,i=r.firstChild,$=i.nextSibling,[f,m]=_($.nextSibling),v=t.nextSibling,b=v.firstChild,g=b.firstChild,C=g.nextSibling,[y,U]=_(C.nextSibling);return s(r,p(S,{get each(){return Object.keys(l.clocks)},children:d=>(()=>{var n=a(V),O=n.firstChild,j=O.nextSibling,[h,w]=_(j.nextSibling);return h.nextSibling,s(n,d,h,w),n})()}),f,m),s(g,()=>l.clocks[0].state),s(b,p(S,{get each(){return Object.keys(l.clocks)},children:d=>(()=>{var n=a(A);return s(n,()=>l.clocks[Number(d)].counter),n})()}),y,U),e})(),(()=>{var e=a(N),t=e.firstChild,r=t.nextSibling,i=r.nextSibling;return x(t,"click",o(l,0)),x(r,"click",u(l,0)),i.$$click=()=>l.sendUpdate(c.receiveUpdate),E(),e})(),(()=>{var e=a(M),t=e.firstChild,r=t.firstChild,i=r.firstChild,$=i.nextSibling,[f,m]=_($.nextSibling),v=t.nextSibling,b=v.firstChild,g=b.firstChild,C=g.nextSibling,[y,U]=_(C.nextSibling);return s(r,p(S,{get each(){return Object.keys(c.clocks)},children:d=>(()=>{var n=a(V),O=n.firstChild,j=O.nextSibling,[h,w]=_(j.nextSibling);return h.nextSibling,s(n,d,h,w),n})()}),f,m),s(g,()=>c.clocks[1].state),s(b,p(S,{get each(){return Object.keys(c.clocks)},children:d=>(()=>{var n=a(A);return s(n,()=>c.clocks[Number(d)].counter),n})()}),y,U),e})(),(()=>{var e=a(N),t=e.firstChild,r=t.nextSibling,i=r.nextSibling;return x(t,"click",o(c,1)),x(r,"click",u(c,1)),i.$$click=()=>c.sendUpdate(l.receiveUpdate),E(),e})()]}})}H(["click"]);export{I as default};
