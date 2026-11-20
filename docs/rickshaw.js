'use strict';
const find=id=>document.getElementById(id);
const film=find('film'),dialog=document.querySelector('dialog'),editor=find('editor');
const ctx=find('names').getContext('2d'),statusLine=find('status');
const palace=document.body.dataset.design==='palace';
const route=palace?'baraat':'rickshaw';
const original=palace?{one:'Ishaan',two:'Anaya',when:'12 December 2027 · 6 PM',venue:'The Palace Courtyard, Jaipur',approval:''}:{one:'Nikhil',two:'Manvi',approval:''};
const editKeys=Object.keys(original).filter(k=>k!=='approval');
const chapters=palace?[[0,0,'The procession'],[.17,3,'The invitation'],[.4,8.2,'The courtyard'],[.55,12,'The ceremony'],[.73,16.3,'The palace at dusk'],[1,23.9,'With blessings']]:[[0,0,'The rickshaw arrives'],[.19,15,'The invitation unfolds'],[.35,39,'The palace gates'],[.46,48,'Mayra'],[.57,59,'Sangeet'],[.67,74,'The painted arch'],[.76,81,'Haldi'],[.85,90,'Wedding vows'],[1,112.85,'Venue & blessings']];
const fields=new URLSearchParams(location.hash.slice(1));
let data=Object.fromEntries(Object.entries(original).map(([key,v])=>[key,fields.get(key)?.trim().slice(0,key==='approval'?160:key==='venue'?100:key==='when'?80:60)||v]));
let paid=false,revision=0,file=null,fileUrl='',busy=false;
function customised(d){return d.one!==original.one||d.two!==original.two}
function source(d){return palace?'baraat.mp4':customised(d)?'rickshaw-personal.mp4':'rickshaw.mp4'}
function identity(d){return palace?{one:'beuniqueinvite:baraat:v1',two:d.one,note:JSON.stringify([d.two,d.when,d.venue]),approval:d.approval}:{one:'beuniqueinvite:rickshaw:v1',two:d.one,note:d.two,approval:d.approval}}
function guestLink(){
 const url=new URL(route+'.html',location.href),q=new URLSearchParams();
 for(const k of Object.keys(original))if(data[k]!==original[k])q.set(k,data[k]);
 url.hash=q.toString();return url.href
}
function message(){return data.one+' & '+data.two+' invite you to their wedding. '+guestLink()}
function lettering(c,t,d){
 if(palace)drawBaraat(c,t,d);else if(customised(d))drawThirdNames(c,t,d.one,d.two)
}
function redraw(){ctx.clearRect(0,0,720,1280);lettering(ctx,film.currentTime,data)}
const journey=processionReader({film,chapters,onDraw:redraw});
function syncForm(){
 for(const k of editKeys)editor.elements[k].value=data[k];find('approval').value=data.approval;
}
function resetFile(){
 if(fileUrl)URL.revokeObjectURL(fileUrl);fileUrl='';file=null;find('save').hidden=find('send').hidden=true
}
async function sync(preview){
 const version=++revision;paid=false;document.querySelector('.wordmark').hidden=false;resetFile();
 find('couple').textContent=data.one+' & '+data.two;
 const chosen=palace?'baraat.mp4':customised(data)?'rickshaw-personal-seek.mp4':'rickshaw-seek.mp4';
 if(film.getAttribute('src')!==chosen){film.src=chosen;film.load()}
 if(preview)journey.showNames();else journey.refresh();
 redraw();
 const ok=await verifiedPaid(identity(data));if(version!==revision)return;
 paid=ok;document.querySelector('.wordmark').hidden=paid;
 find('plan').textContent=paid?'Paid invitation · branding removed':data.approval?'Approval code does not match these names.':'Branded preview';
}
function openEditor(share){
 film.pause();syncForm();statusLine.textContent='';dialog.showModal();(share?find('copy'):editor.elements.one).focus()
}
for(const btn of document.querySelectorAll('[data-open]'))btn.onclick=()=>openEditor(false);
for(const btn of document.querySelectorAll('[data-share]'))btn.onclick=()=>openEditor(true);
function apply(){
 if(!editor.reportValidity())return false;
 for(const input of editKeys.map(k=>editor.elements[k])){
  if(!input.value.trim()){input.focus();statusLine.textContent='Complete the invitation details.';return false}
 }
 const next={...Object.fromEntries(editKeys.map(k=>[k,editor.elements[k].value.trim()])),approval:find('approval').value.trim()};
 if(JSON.stringify(next)!==JSON.stringify(data)){
   data=next;history.replaceState(null,'',guestLink());sync(false);
 }
 return true
}
editor.onsubmit=e=>{e.preventDefault();if(apply()){dialog.close();sync(true)}};
async function copyText(value){
 try{await navigator.clipboard.writeText(value);statusLine.textContent='Copied.'}catch{statusLine.textContent=value}
}
find('approval').onchange=apply;
find('idCopy').onclick=async()=>{if(apply())copyText(await fingerprint(identity(data)))};
find('copy').onclick=()=>{if(apply())copyText(guestLink())};
find('wa').onclick=()=>{if(apply())window.open('https://wa.me/?text='+encodeURIComponent(message()),'_blank','noopener')};
function stamp(c){
 c.save();c.fillStyle='#fff6dfeb';c.fillRect(14,15,203,40);c.font='bold 25px Georgia';c.textBaseline='middle';let x=24;
 for(const [s,color] of [['be','#914348'],['unique','#47705f'],['invite','#97652b']]){c.fillStyle=color;c.fillText(s,x,35);x+=c.measureText(s).width}c.restore()
}
async function renderMovie(snapshot,version){
 const isPaid=await verifiedPaid(identity(snapshot));
 if(!palace&&isPaid&&!customised(snapshot)){
   const res=await fetch(source(snapshot));if(!res.ok)throw Error('Video unavailable.');return res.blob()
 }
 const mime=window.MediaRecorder&&['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
 if(!mime||!HTMLCanvasElement.prototype.captureStream)throw Error('To export a video, open this page in a browser with video recording support. You can also share the guest link.');
 const clip=document.createElement('video'),surface=document.createElement('canvas');
 surface.width=720;surface.height=1280;const c=surface.getContext('2d'),stream=surface.captureStream(25);
 const audio=new AudioContext();let rec,raf,timeout;
 try{
  await audio.resume();clip.playsInline=true;clip.preload='auto';
  await new Promise((resolve,reject)=>{clip.onloadeddata=resolve;clip.onerror=()=>reject(Error('Video could not load.'));clip.src=source(snapshot)});
  const output=audio.createMediaStreamDestination();audio.createMediaElementSource(clip).connect(output);
  for(const track of output.stream.getAudioTracks())stream.addTrack(track);
  rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2800000});const chunks=[];
  return await new Promise((resolve,reject)=>{
   rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
   rec.onstop=()=>chunks.length?resolve(new Blob(chunks,{type:mime.split(';')[0]})):reject(Error('No video recorded.'));
   rec.onerror=()=>reject(Error('Video recording failed.'));
   function draw(){
    if(version!==revision){reject(Error('Names changed. Prepare the video again.'));return}
    c.drawImage(clip,0,0,720,1280);
    lettering(c,clip.currentTime,snapshot);
    if(!isPaid)stamp(c);
    statusLine.textContent='Preparing video · '+Math.min(99,Math.floor(100*clip.currentTime/clip.duration))+'%';
    if(clip.ended){rec.stop();return}raf=requestAnimationFrame(draw)
   }
   rec.start(500);clip.play().then(draw,reject);
   timeout=setTimeout(()=>reject(Error('Video export timed out. Keep the page visible and try again.')),(clip.duration+60)*1000)
  });
 }finally{
  clearTimeout(timeout);cancelAnimationFrame(raf);clip.pause();
  if(rec?.state==='recording')rec.stop();stream.getTracks().forEach(t=>t.stop());await audio.close();clip.removeAttribute('src');clip.load()
 }
}
find('prepare').onclick=async()=>{
 if(busy||!apply())return;
 const version=revision;busy=true;find('prepare').disabled=true;resetFile();statusLine.textContent='Preparing the full film. Keep this page visible.';
 try{
  const blob=await renderMovie({...data},version);if(version!==revision)throw Error('Names changed. Prepare the video again.');
  file=new File([blob],(palace?'The-Palace-Baraat.':'The-Rickshaw-Wedding.')+(blob.type.includes('mp4')?'mp4':'webm'),{type:blob.type});
  fileUrl=URL.createObjectURL(file);find('save').href=fileUrl;find('save').download=file.name;find('save').hidden=find('send').hidden=false;statusLine.textContent='Video ready to share.'
 }catch(e){statusLine.textContent=e.message}finally{busy=false;find('prepare').disabled=false}
};
find('send').onclick=async()=>{
 if(!apply()||!file)return;
 try{if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],text:message()});return}}catch(e){if(e.name==='AbortError')return}
 statusLine.textContent='Download the video, open WhatsApp link, then attach the downloaded file.'
};
syncForm();sync(false);
