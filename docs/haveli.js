'use strict';
const $=s=>document.querySelector(s),canvas=$('canvas'),ctx=canvas.getContext('2d'),dialog=$('dialog');
const defaults={title:"You're Invited",blessing:'Together with their families',first:'Kabir Rathore',second:'Ananya Shekhawat',dates:'6–8 December 2027 · Jaipur',event0:'Haldi',info0:'6 December · 10 AM · The Courtyard',event1:'Mehendi',info1:'6 December · 4 PM · The Garden Terrace',event2:'Sangeet',info2:'7 December · 8 PM · The Durbar Hall',event3:'Cocktail',info3:'8 December · 8 PM · The Rooftop',ceremony:'Shubh Vivah',when:'Wednesday, 8 December 2027',schedule:'Baraat 4 PM · Varmala 6 PM · Pheras 7:30 PM',venue:'The Palace Lawns, Samode Haveli, Jaipur',endTitle:'With blessings',endText:'We look forward to celebrating with you.',signed:'',family:'The Rathore & Shekhawat families',rsvp:'RSVP · The wedding family',approval:''};
const originalFields=Object.keys(defaults).filter(key=>key!=='approval');
const extraFields={entrance:'शादी का घर',firstFamily:'Son of Vikram Singh and Meera Rathore',secondFamily:'Daughter of Rajendra and Kavita Shekhawat',weddingHeading:'॥ शुभ विवाह ॥',dress:'Dress code · Royal Rajputana',compliments:'With best compliments from'};
Object.assign(defaults,extraFields);
const labels={entrance:'Doorway sign',firstFamily:'First partner’s parents',secondFamily:'Second partner’s parents',weddingHeading:'Wedding blessing',dress:'Dress code',compliments:'Family heading',title:'Opening title',blessing:'Invitation line',first:'First partner',second:'Second partner',dates:'Wedding dates',ceremony:'Ceremony heading',when:'Ceremony date',schedule:'Wedding timings',venue:'Wedding venue',endTitle:'Closing heading',endText:'Closing message',signed:'Sign-off (optional)',family:'Family names',rsvp:'RSVP contacts'};
const data={...defaults}, editor=new URLSearchParams(location.search).has('edit'),storageKey='haveli-invitation-v1';
try{const incoming=location.hash.length>1?Object.fromEntries(new URLSearchParams(location.hash.slice(1))):editor?JSON.parse(localStorage.getItem(storageKey)||'{}'):{};for(const k of Object.keys(data))if(typeof incoming[k]==='string')data[k]=incoming[k].slice(0,k==='approval'?160:120)}catch{}
function signatureData(){return {one:'beuniqueinvite:shaadi-ka-ghar:v1',note:JSON.stringify([...originalFields.map(k=>data[k]),...Object.keys(extraFields).filter(k=>data[k]!==extraFields[k]).map(k=>[k,data[k]])]),approval:data.approval}}
let paid=false,revision=0,p=0,raf=0,loaded=false,busy=false,file=null,objectURL='';
function paintNow(){if(!loaded)return;paint(ctx,p,data,paid);$('#stage').textContent=cuts[Math.floor(p)];$('#position').value=Math.round(1000*p/last);$('#byline').textContent=data.first+' & '+data.second;canvas.setAttribute('aria-label',[cuts[Math.floor(p)],p>=6?[data.endTitle,data.endText,data.family,data.rsvp].join('. '):''].join('. '))}
const durationMs=39000;
let playing=false,startedAt=0;
function stopFilm(){
 playing=false;cancelAnimationFrame(raf);$('#playFilm').textContent=p>=last?'Replay':'Play';
}
function tick(now){
 if(!playing)return;
 p=clamp((now-startedAt)/durationMs)*last;paintNow();
 if(p>=last)stopFilm();else raf=requestAnimationFrame(tick)
}
function startFilm(){
 if(!loaded||playing||dialog.open)return;
 if(p>=last)p=0;
 startedAt=performance.now()-p/last*durationMs;
 playing=true;$('#playFilm').textContent='Pause';raf=requestAnimationFrame(tick)
}
$('#playFilm').onclick=()=>playing?stopFilm():startFilm();
$('#position').oninput=e=>{p=last*Number(e.target.value)/1000;startedAt=performance.now()-p/last*durationMs;paintNow()};
const groups=[['Opening',['title','entrance','blessing','first','firstFamily','second','secondFamily','dates']],['Four celebrations',Object.keys(data).filter(k=>/^(event|info)/.test(k))],['Wedding mandap',['weddingHeading','ceremony','when','schedule','dress','venue']],['Final invitation',['endTitle','endText','signed','compliments','family','rsvp']]];
function resetFile(){file=null;if(objectURL)URL.revokeObjectURL(objectURL);objectURL='';$('#send').hidden=$('#download').hidden=true}
async function changed(){let id=++revision;paid=false;resetFile();paintNow();try{localStorage.setItem(storageKey,JSON.stringify(data))}catch{}const ok=await verifiedPaid(signatureData());if(id!==revision)return;paid=ok;paintNow();$('#status').textContent=data.approval?(ok?'Paid plan verified.':'This approval code does not match the invitation.'):'Branded preview';}
for(const [heading,keys] of groups){let details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=heading;details.append(summary);for(const k of keys){let label=document.createElement('label'),input=document.createElement('input');label.textContent=labels[k]||((k.startsWith('event')?'Function ':'Date, time & venue ')+(1+Number(k.slice(-1))));input.maxLength=120;input.value=data[k];input.oninput=()=>{data[k]=input.value;changed()};label.append(input);details.append(label)}$('#fields').append(details)}
$('#approval').value=data.approval;$('#approval').oninput=e=>{data.approval=e.target.value.trim();changed()};
function openEditor(){stopFilm();dialog.showModal()}$('#edit').onclick=openEditor;if(editor)openEditor();dialog.addEventListener("close",startFilm);
function link(){let q=new URLSearchParams();for(const k of Object.keys(defaults))if(data[k]!==defaults[k])q.set(k,data[k]);return new URL('haveli.html',location.href).href+(q.size?'#'+q:'')}
async function copy(value){try{await navigator.clipboard.writeText(value);$('#status').textContent='Copied.'}catch{$('#status').textContent=value}}
$('#finger').onclick=async()=>copy(await fingerprint(signatureData()));$('#copy').onclick=()=>copy(link());const msg=()=>data.first+' & '+data.second+' invite you to their wedding. '+link();$('#wa').onclick=()=>window.open('https://wa.me/?text='+encodeURIComponent(msg()),'_blank','noopener');
$('#movie').onclick=async()=>{if(busy||!loaded)return;if(!window.MediaRecorder||!canvas.captureStream){$('#status').textContent='Video export requires a browser with MediaRecorder. Your guest link is ready to share.';return}busy=true;$('#movie').disabled=true;resetFile();let stream;try{const snap={...data},rev=revision,branding=await verifiedPaid(signatureData()),out=document.createElement('canvas');out.width=W;out.height=H;const context=out.getContext('2d');paint(context,0,snap,branding);stream=out.captureStream(25);const mime=['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));if(!mime)throw Error('No supported video encoder found.');const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3500000}),chunks=[];const done=new Promise((resolve,reject)=>{rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.onstop=resolve;rec.onerror=e=>reject(e.error)});rec.start();let start=performance.now();await new Promise(resolve=>{function tick(){let t=clamp((performance.now()-start)/39000);paint(context,last*t,snap,branding);$('#status').textContent='Preparing video · '+Math.round(100*t)+'%';if(t<1&&revision===rev)requestAnimationFrame(tick);else resolve()}tick()});rec.stop();await done;if(revision!==rev)throw Error('Details changed. Prepare the video again.');const ext=mime.includes('mp4')?'mp4':'webm';file=new File(chunks,'Shaadi-Ka-Ghar.'+ext,{type:'video/'+ext});objectURL=URL.createObjectURL(file);$('#download').href=objectURL;$('#download').download=file.name;$('#download').hidden=$('#send').hidden=false;$('#status').textContent='Video ready to share.'}catch(e){$('#status').textContent=e.message}finally{stream?.getTracks().forEach(t=>t.stop());busy=false;$('#movie').disabled=false}};
$('#send').onclick=async()=>{if(!file)return;try{if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],text:msg()});return}}catch(e){if(e.name==='AbortError')return}$('#status').textContent='Download the video, then use WhatsApp link and attach the video in chat.'};
Promise.all(['street','gate','room','mehendi','events','mandap','closing'].map(async name=>{let im=new Image();im.src='haveli-art/'+name+'.webp';await im.decode();art[name]=im})).then(async()=>{const id=revision,ok=await verifiedPaid(signatureData());if(revision===id)paid=ok;loaded=true;paintNow();startFilm()}).catch(()=>{$('#stage').textContent='Artwork could not load. Reload to try again.'});
