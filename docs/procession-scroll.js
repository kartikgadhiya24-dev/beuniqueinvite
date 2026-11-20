// The document scroll position is the timeline. No time advances while the reader is still.
function processionReader({film,chapters,onDraw}){
 const track=document.querySelector('.journey'),range=document.querySelector('#progress');
 const label=document.querySelector('#chapter'),dialog=document.querySelector('dialog');
 const prev=document.querySelector('#prevScene'),next=document.querySelector('#nextScene');
 let desired=0,scheduled=0;
 const maxScroll=()=>Math.max(1,track.offsetHeight-document.querySelector('.pin').offsetHeight);
 const map=(v,a,b)=>a.reduce((out,n,i)=>{
  if(i===0||v<a[i-1]||v>n)return out;
  const f=(v-a[i-1])/(n-a[i-1]);return b[i-1]+f*(b[i]-b[i-1])
 },v>=a[a.length-1]?b[b.length-1]:b[0]);
 const ticks=chapters.map(c=>c[0]),times=chapters.map(c=>c[1]);
 function seek(){
  if(!film.readyState||film.seeking||!Number.isFinite(film.duration))return;
  const time=Math.min(film.duration-.07,Math.max(0,desired));
  if(Math.abs(time-film.currentTime)>.038)film.currentTime=time;
  else onDraw()
 }
 function update(){
  scheduled=0;
  const p=Math.max(0,Math.min(1,window.scrollY/maxScroll()));
  desired=map(p,ticks,times);range.value=Math.round(p*1000);
  const active=chapters.filter(c=>p+.00015>=c[0]).pop()||chapters[0];
  label.textContent=active[2];prev.disabled=p<.0001;next.disabled=p>.9999;
  range.setAttribute('aria-valuetext',active[2]+' · '+Math.round(p*100)+'%');seek()
 }
 function schedule(){if(!scheduled)scheduled=requestAnimationFrame(update)}
 function jump(p){window.scrollTo(0,Math.round(Math.max(0,Math.min(1,p))*maxScroll()));schedule()}
 prev.onclick=()=>jump(ticks.filter(n=>n<Number(range.value)/1000-.004).pop()??0);
 next.onclick=()=>jump(ticks.find(n=>n>Number(range.value)/1000+.004)??1);
 range.oninput=()=>jump(Number(range.value)/1000);
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 window.addEventListener('wheel',e=>{
  if(dialog.open||e.ctrlKey||!e.deltaY||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);
  if(Math.abs(delta)>85){e.preventDefault();window.scrollBy(0,Math.sign(delta)*85)}
 },{passive:false});
 const art=document.querySelector('.film');let startY=0,startScroll=0;
 art.addEventListener('touchstart',e=>{startY=e.touches[0].clientY;startScroll=scrollY},{passive:true});
 art.addEventListener('touchmove',e=>{
  if(e.touches.length!==1||!e.cancelable)return;
  e.preventDefault();scrollTo(0,startScroll+(startY-e.touches[0].clientY)*1.25)
 },{passive:false});
 film.addEventListener('loadeddata',schedule);film.addEventListener('seeked',()=>{onDraw();schedule()});
 schedule();
 return {refresh:schedule,showNames:()=>jump(map(chapters[1][1]+1,times,ticks))}
}
