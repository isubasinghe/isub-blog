import{a as y,o as $,g as f,u as D,t as v,j as _}from"./web.CW-alu3a.js";import{D as N,N as S}from"./vis-network.BRpqIckS.js";var I=v(`<style>
        .form-container {
          border: 1px solid black;
          padding: 10px;
          width: 45%;
        }
        .forms-container {
          display: flex;
          justify-content: space-between;
        }
        @media only screen and (max-width: 600px) {
          .forms-container {
            flex-direction: column;
          }
          .form-container {
            width: auto;
          }
        }
      `),M=v("<div class=forms-container><form class=form-container><label>Node Management</label><hr><p>Id: <input name=id type=number required></p><select name=type required><option value=add>Add</option><option value=remove>Remove</option></select><div><input type=submit value=Submit></div></form><form class=form-container><label>Edge Management</label><hr><p>To: <input name=to type=number required></p><p>From: <input name=from type=number required></p><select name=type><option value=add>Add</option><option value=remove>Remove</option></select><div><input type=submit value=Submit>"),q=v("<div>");function F(s,p){return Math.floor(Math.random()*(p-s+1)+s)}function T(){const[s,p]=y([{id:0,state:!0,label:"Node 0"}]),[b,w]=y([]);let c,g,m,l;$(()=>{m=new N(s().map(e=>({id:e.id,label:e.label}))),l=new N([]),c&&(g=new S(c,{nodes:m,edges:l},{edges:{color:"#a0c1fd"},height:"500px"}));const t=setInterval(()=>{const e=s(),r=b(),n=F(0,e.length-1),a=e[n];a&&r.forEach(o=>{o.from,a.id})},500);_(()=>{clearInterval(t),g?.destroy()})});const h=()=>{if(!m||!l)return;const t=s(),e=b();m.clear(),m.add(t.map(r=>({id:r.id,label:r.label}))),l.clear(),l.add(e.map((r,n)=>({id:n,from:r.from,to:r.to})))},x=t=>{t.preventDefault();const e=t.currentTarget,r=new FormData(e),n=Number(r.get("id")),a=r.get("type");p(o=>{const i=o.some(d=>d.id===n);return i&&a==="add"?o:i&&a==="remove"&&n!==0?o.filter(d=>d.id!==n):a==="add"?[...o,{id:n,state:!0,label:`Node ${n}`}]:o}),h()},E=t=>{t.preventDefault();const e=t.currentTarget,r=new FormData(e),n=Number(r.get("to")),a=Number(r.get("from")),o=r.get("type");w(i=>{const d=i.some(u=>u.to===n&&u.from===a);return d&&o==="add"?i:d&&o==="remove"?i.filter(u=>!(u.from===a&&u.to===n)):o==="add"?[...i,{to:n,from:a}]:i}),h()};return[f(I),(()=>{var t=f(M),e=t.firstChild,r=e.nextSibling;return e.addEventListener("submit",x),r.addEventListener("submit",E),t})(),(()=>{var t=f(q),e=c;return typeof e=="function"?D(e,t):c=t,t})()]}export{T as default};
