const themes={haveli:['The Haveli Doors','Open the doors','#793c2f','#faebcc'],lilac:['The Lilac Letter','Open the envelope','#655076','#f2ebf9'],scroll:['The Royal Scroll','Unroll the invitation','#742c34','#f8e6be'],procession:['The Wedding Baraat','Join the procession','#325747','#f6e8c9'],classic:['The Olive Note','Read the invitation','#43573e','#f3f1e2']};
const selected=new URLSearchParams(location.search).get('t');
const theme=selected==='classic'?'classic':'scroll';
const [name,action,ink,paper]=themes[theme];
const form=document.querySelector('form'),statusLine=document.querySelector('#status');
document.querySelector('#title').textContent=name;
document.querySelector('#edition').textContent=theme==='classic'?'CLASSIC EDITION · ₹799':'PREMIUM EDITION · ₹1,499';
const key='beuniqueinvite.draft.'+theme;
if(theme==='scroll'){document.querySelector('#finalFields').hidden=false;for(const [k,v] of Object.entries(closingDefaults))form.elements[k].value=v}
if(theme==='scroll')for(const [key,value] of Object.entries(scrollSample))form.elements[key].value=value;
try{const saved=JSON.parse(localStorage.getItem(key));if(saved)for(const el of form.elements)if(el.name&&typeof saved[el.name]==='string')el.value=saved[el.name]}catch{}
function escapeText(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const motion={haveli:'.opened .left{transform:perspective(550px) rotateY(-98deg)}.opened .right{transform:perspective(550px) rotateY(98deg)}',lilac:'.cover:after{content:"";position:absolute;left:0;right:0;bottom:0;height:45%;background:linear-gradient(150deg,#ded0ea 49.5%,#bdaacb 50%,transparent 50.5%),linear-gradient(210deg,#d6c4e6 49.5%,#c5afd4 50%,#e8dfef 50.5%);z-index:1}.opened .cover{transform:translateY(105%) rotate(2deg)}',scroll:'.cover{transform-origin:top}.opened .cover{clip-path:inset(0 0 100% 0)}.opened .details{animation:unroll 1.2s ease-out}@keyframes unroll{from{clip-path:inset(0 0 95% 0)}to{clip-path:inset(0)}}',procession:'.opened .cover{transform:translateX(-100%)}.opened .details{animation:journey 1.2s ease-out}@keyframes journey{from{transform:translateX(18%)}to{transform:translateX(0)}}',classic:'.opened .cover{opacity:0}'};
function card(data,asset,inside,detail){if(theme==='scroll')return royalMovie(data,asset,inside,detail);const [one,two,venue,note]=[data.one,data.two,data.venue,data.note].map(escapeText);const date=new Date(data.date+'T12:00:00');const day=Number.isNaN(+date)?'':date.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});const journey=theme==='procession'||theme==='haveli';
const nextScene=theme==='procession'?'Follow the baraat':'Enter the courtyard';
const scene=journey?'<section class="ceremony" hidden><div class="sceneplate"><small>THE WEDDING CELEBRATION</small><h2>'+venue+'</h2><strong>'+day+'</strong><p class="note">'+note+'</p><button class="back">Back to invitation</button></div></section>':'';
const art=asset?'url("'+asset+'")':'repeating-linear-gradient(45deg,#e8eada,#e8eada 1px,#f1efe3 1px,#f1efe3 10px)';return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${one} &amp; ${two} · Wedding invitation</title><style>*{box-sizing:border-box}body{margin:0;background:${paper};color:${ink};font:16px/1.5 Georgia,serif}.stage{position:relative;overflow:hidden;width:100%;max-width:680px;margin:auto;min-height:100svh;background:${art} center/cover}.details{position:relative;min-height:100svh;display:grid;align-content:center;padding:32px 7%;text-align:center}.sheet{background:${paper}f5;padding:30px 15px;outline:1px solid currentColor;outline-offset:-8px;overflow-wrap:anywhere}.sheet small,.plaque small{font:10px/1.5 Arial;letter-spacing:2.1px}.names{font:italic clamp(32px,9vw,58px)/1.1 Georgia;margin:16px 0}.amp{display:block;font-size:.6em;margin:5px}.venue{font-size:21px;margin:12px 0}.note{white-space:pre-line}.cover{position:absolute;inset:0;z-index:2;transition:transform 1s,clip-path 1.1s,opacity .8s;clip-path:inset(0);overflow:hidden}.side{position:absolute;inset:0;background:${art} center/cover;transition:transform 1.2s;backface-visibility:hidden}.left{clip-path:inset(0 50% 0 0);transform-origin:left}.right{clip-path:inset(0 0 0 50%);transform-origin:right}.plaque{position:absolute;bottom:7%;left:7%;right:7%;padding:18px 12px;text-align:center;background:${paper}f3;outline:1px solid currentColor;outline-offset:-5px;z-index:2;transition:opacity .35s;overflow-wrap:anywhere}.plaque h1{font:italic clamp(26px,8vw,46px)/1.1 Georgia;margin:8px 0 12px}button{cursor:pointer;background:${ink};color:white;padding:10px 18px;border:0;border-radius:40px;font:14px Arial}.opened .cover{pointer-events:none}.opened .plaque{opacity:0}.replay{margin-top:14px}.ceremony{position:absolute;inset:0;z-index:4;background:${art} center / cover;overflow:auto}.ceremony:not([hidden]){display:grid;align-items:end;animation:sceneIn 1s ease}.sceneplate{margin:7%;background:${paper}f5;text-align:center;padding:22px;overflow-wrap:anywhere}.sceneplate h2{font:italic 30px Georgia}.sceneplate small{font:11px Arial;letter-spacing:2px}.forward{display:block;margin:12px auto 0}.motif{font-size:26px}@keyframes sceneIn{from{opacity:0;transform:scale(1.1)}to{opacity:1;transform:none}}.classic .side{border:14px double #869475}.classic .plaque{bottom:30%}${motion[theme]}@media(prefers-reduced-motion:reduce){*{animation-duration:.001s!important;transition-duration:.001s!important}}@media print{.cover,.replay{display:none!important}.stage,.details{min-height:0}.sheet{border:1px solid}}</style></head><body><main class="stage ${theme}"><section class="details" inert><div class="sheet"><div class="motif">❦</div><small>TOGETHER WITH THEIR FAMILIES</small><h2 class="names">${one}<span class="amp">&amp;</span>${two}</h2><p>invite you to celebrate their wedding</p><strong>${day}</strong><p class="venue">${venue}</p><p class="note">${note}</p>${journey?'<button class="forward">'+nextScene+'</button>':''}<button class="replay">Replay invitation</button></div></section><section class="cover"><div class="side left"></div><div class="side right"></div><div class="plaque"><small>THE WEDDING OF</small><h1>${one} &amp; ${two}</h1><button class="open">${action}</button></div></section>${scene}</main><script>const stage=document.querySelector('main'),cover=document.querySelector('.cover'),details=document.querySelector('.details');function reveal(v){stage.classList.toggle('opened',v);details.inert=!v;cover.inert=v;(v?document.querySelector('.replay'):document.querySelector('.open')).focus({preventScroll:true})}const ceremony=document.querySelector('.ceremony');if(ceremony){document.querySelector('.forward').onclick=()=>{ceremony.hidden=false;details.inert=true;document.querySelector('.back').focus()};document.querySelector('.back').onclick=()=>{ceremony.hidden=true;details.inert=false;document.querySelector('.forward').focus()}}document.querySelector('.open').onclick=()=>reveal(true);document.querySelector('.replay').onclick=()=>reveal(false);<\/script></body></html>`}
function values(){return Object.fromEntries(new FormData(form))}
const premium=theme!=='classic';
const browseUrl=new URL(location.href);
browseUrl.searchParams.delete('edit');
const editUrl=new URL(browseUrl);
editUrl.searchParams.set('edit','1');
const fullView=premium&&!new URLSearchParams(location.search).has('edit');
document.body.classList.toggle('guest',fullView);
document.querySelector('#personalise').href=editUrl.href;
const wide=document.querySelector('#wide');
wide.hidden=!premium;wide.href=browseUrl.href;
wide.href=browseUrl.href+(browseUrl.search?'&':'?')+'personal=1';
let paidIdentity='';
async function checkPlan(){
 const data=values(),identity=JSON.stringify([canonical(data),data.approval]);
 const verified=await verifiedPaid(data);
 if(identity!==JSON.stringify([canonical(values()),values().approval]))return;
 paidIdentity=verified?identity:'';
 document.querySelector('#planState').textContent=verified?'Verified paid invitation · branding removed':data.approval?'Code does not match this invitation':'Branded preview';
 update();
}
function selection(){
 const data=values();
 data.paid=Boolean(data.approval&&paidIdentity===JSON.stringify([canonical(data),data.approval]));
 const changed=premium&&Object.keys({...scrollSample,...closingDefaults}).some(k=>data[k]!==({...scrollSample,...closingDefaults})[k]);
 return {data,changed,file:changed?'personal-scroll.mp4':'royal-scroll.mp4'};
}
function sheetUrls(changed){
 return Array.from({length:22},(_,i)=>new URL('frames/'+(changed?'personal':'royal')+'-'+String(i).padStart(2,'0')+'.webp',location.href).href);
}
function update(){
 const {data,changed,file}=selection();
 document.querySelector('#preview').srcdoc=card(premium?data:values(),premium?new URL(file,location.href).href:'',changed,premium?sheetUrls(changed):[]);
}
form.oninput=()=>{if(paidIdentity){paidIdentity='';document.querySelector('#planState').textContent='Edited invitation · new paid code required';update()}try{localStorage.setItem(key,JSON.stringify(values()))}catch{}statusLine.textContent=''};
form.onsubmit=e=>{e.preventDefault();checkPlan();statusLine.textContent='Preview updated.'};checkPlan();
if(premium){form.elements.approval.addEventListener('change',checkPlan);document.querySelector('#copyFingerprint').onclick=async()=>{const id=await fingerprint(values());try{await navigator.clipboard.writeText(id);statusLine.textContent='Invitation fingerprint copied.'}catch{statusLine.textContent=id}}}
async function embedArt(path){
 const response=await fetch(path);
 if(!response.ok)throw Error('Artwork unavailable');
 const blob=await response.blob();
 return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
}
document.querySelector('#download').onclick=async()=>{
 if(!form.reportValidity())return;
 try{
  const {data,changed,file}=selection();
  const asset=premium?await embedArt(file):'';
  const sheets=premium?await Promise.all(sheetUrls(changed).map(embedArt)):[];
  const html=card(premium?data:values(),asset,changed,sheets);
  const url=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  const link=document.createElement('a');link.href=url;link.download='beuniqueinvite-'+theme+'.html';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),30000);statusLine.textContent='Invitation downloaded. Open the HTML file in a browser to view it.';
 }catch{statusLine.textContent='Download unavailable. Please try again.'}
};
