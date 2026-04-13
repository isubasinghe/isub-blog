import{d as i,e as o,o as m,g as t,h as u,r as h,t as a,s as p}from"./web.BYgSEeKP.js";var w=a("<textarea>"),x=a("<p>"),$=a("<textarea class=output-area readonly>"),f=a(`<style>
        textarea {
          max-width: 90%;
          width: 750px;
          height: 200px;
        }
        .output-area {
          border: none;
          resize: none;
        }
        .output-area:focus {
          outline: none;
        }
      `);function g(){const[l,n]=o(""),[c,r]=o(""),s=e=>{window.parseScheme?(r(e),window.parseScheme(e).then(n)):(r(""),n("wasm not loaded yet"))};return m(()=>{const e=document.createElement("script");e.src="/ischeme-wasm.js",e.onload=()=>{s("(+ 1 2)")},document.head.appendChild(e)}),[(()=>{var e=t(w);return e.$$input=d=>s(d.currentTarget.value),u(()=>p(e,"value",c())),h(),e})(),t(x),(()=>{var e=t($);return u(()=>p(e,"value",l())),e})(),t(f)]}i(["input"]);export{g as default};
