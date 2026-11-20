const scrollSample = {
  one:'Arjun', two:'Meera', date:'2026-11-21',
  venue:'Sri Venkateswara Gardens, Hyderabad',
  note:'Muhurtham at 10:30 AM'
};
function paintPersonalScroll(track, details, canvas=document.querySelector('#lettering')) {
  const ctx=canvas.getContext('2d');
  function lines(text,limit){
    const out=[];let line='';
    for(const word of text.trim().split(/\s+/)){if(line && (line+' '+word).length>limit){out.push(line);line=word}else line=line?line+' '+word:word}
    if(line)out.push(line);return out;
  }
  return function paint(t){
    ctx.clearRect(0,0,720,1280);

    if(t<7 || t>25.9)return;
    const i=Math.max(0,Math.min(track.length-1,Math.floor((t-track[0][0])*10)));
    const a=track[i],b=track[Math.min(i+1,track.length-1)];
    const f=Math.max(0,Math.min(1,(t-a[0])/.1));
    const [x,y,w,h]=a.slice(1).map((v,j)=>(v+(b[j+1]-v)*f)*(j%2?1280:720));
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f7d39a';
    function text(str,pos,size,start,italic=false){
      ctx.globalAlpha=Math.min(1,Math.max(0,(t-start)*2))*Math.min(1,(25.9-t)*3);
      ctx.font=(italic?'italic ':'')+(w*size)+'px Georgia,serif';
      ctx.fillText(str,x+w/2,y+h*pos,w*.84);
    }
    text(details.monogram||Array.from(details.one)[0]+Array.from(details.two)[0],.074,.105,7,true);
    text(details.headline??'Two families, one celebration',.154,.043,7.7,true);
    text(details.blessing??'With the blessings of our elders',.22,.035,8.25);
    text(details.invitationLine??'we invite you to the wedding of',.26,.037,8.65);
    text(details.one,.345,.116,9.1,true);text('&',.414,.064,9.5,true);
    text(details.two,.484,.116,9.8,true);
    text(details.date,.568,.054,10.5);
    const program=lines(details.note,45),venue=lines(details.venue,40);
    const block=(list,top,depth,size,time)=>list.forEach((s,i)=>text(s,top+depth*(i+.5)/list.length,Math.min(size,depth*.85*h/w/list.length),time));
    block(program,.59,.073,.036,11);block(venue,.672,.074,.04,11.5);
    ctx.globalAlpha=1;
  }
}
function royalMovie(data,src,personal,sheets){
  const printableDate=new Date(data.date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const payload=JSON.stringify({...data,date:printableDate}).replace(/</g,'\\u003c');
  const guestUrl=new URL('guest.html',location.href).href+'#i='+inviteFragment(Object.fromEntries([...Object.keys(invitationFields),'approval'].map(k=>[k,data[k]??closingDefaults[k]??''])));
  const mark=data.paid?'':'<span class="brand"><b>be</b><i>unique</i><strong>invite</strong></span>';
  const ending=Object.assign({},closingDefaults,data);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeText(data.one)} &amp; ${escapeText(data.two)} · Royal Scroll</title><style>
  *{box-sizing:border-box}html{background:#281917;color:#ffefd3;font-family:Georgia,serif}body{margin:0;overscroll-behavior-y:contain}.journey{touch-action:pan-x pinch-zoom}.journey{height:800svh}.stage{height:100svh;position:sticky;top:0;display:grid;place-items:center;background:radial-gradient(ellipse at center,#624136,#281917 80%)}.film{position:relative;width:min(100%,56.25svh);aspect-ratio:9/16;background:#f3dfb5}.film video,.film canvas{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}.controls{position:absolute;bottom:max(10px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;max-width:98vw;padding:5px 10px;background:#371e1de8;border:1px solid #c1a271;border-radius:25px;color:#fff8eb;font:14px/1.2 Arial;white-space:nowrap}.controls button{cursor:pointer;background:#fff2d8;color:#522c26;border:0;border-radius:18px;padding:8px 12px;font:inherit}.progress{position:absolute;bottom:0;left:0;width:100%;height:3px;background:#e8ba69;transform:scaleX(0);transform-origin:left}.accessible{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}button:focus-visible{outline:3px solid #dba858;outline-offset:2px}
  .brand{position:fixed;z-index:8;top:12px;left:12px;font:bold 17px Georgia;background:#fff5dfed;padding:5px 12px;border-radius:18px;pointer-events:none}.brand b{color:#813b44}.brand i{color:#876522}.brand strong{color:#41604b}.accessible{position:fixed;top:0;left:0}.sharebox{width:min(90vw,350px);padding:22px;border:1px solid #b69160;border-radius:12px;background:#fff4de;color:#522c26}.sharebox::backdrop{background:#26171580}.sharebox h2{margin:0 0 14px}.sharebox button,.sharebox a{display:inline-block;padding:8px 12px;margin:3px;color:#522c26;background:#f5e2c0;border:1px solid #cba976;border-radius:20px;cursor:pointer;text-decoration:none}.sharebox [hidden]{display:none}.sharebox p:empty{display:none}@media(max-width:420px){.controls{gap:4px;font-size:12px}.controls button{padding:7px}}
  </style></head><body>${mark}<main class="journey"><div class="stage"><div class="film"><video playsinline preload="metadata" aria-label="Royal Scroll animation" src="${src}"></video><canvas id="scene" width="432" height="768" aria-hidden="true"></canvas>${personal?'<canvas id="lettering" width="720" height="1280" aria-hidden="true"></canvas>':''}</div><div class="controls"><span id="hint">Scroll to bring them together ↓</span><button id="play" type="button">Play with sound</button><button id="openShare" type="button">Share</button></div><div class="progress"></div></div></main><dialog class="sharebox"><h2>Share invitation</h2><button id="prep">Prepare video</button><button hidden id="send">Share video + link</button><a hidden id="save" download="Royal-Scroll.mp4">Download MP4</a><a id="wa" target="_blank" rel="noopener">WhatsApp link</a><p id="feedback" role="status"></p><form method="dialog"><button>Close</button></form></dialog><section class="accessible"><h1>${escapeText(data.one)} &amp; ${escapeText(data.two)}</h1><p>${escapeText(printableDate)} · ${escapeText(data.venue)}</p><p>${escapeText(data.note)}</p></section><script>const paintPersonalScroll=${paintPersonalScroll.toString()};const recordInvitation=${recordInvitation.toString()};const drawEnding=${drawEnding.toString()};const drawBrand=${drawBrand.toString()};const scrollTrack=${JSON.stringify(scrollTrack)};(${endShare.toString()})(${JSON.stringify(guestUrl)},${JSON.stringify(ending).replace(/</g,'\\u003c')},document.querySelector('video').src,${personal});const lettering=${personal?'('+paintPersonalScroll.toString()+')('+JSON.stringify(scrollTrack)+','+payload+')':'null'};(${driveScroll.toString()})(${JSON.stringify(sheets)},lettering);<\/script></body></html>`;
}
function driveScroll(sheets,paintLetters){
  const film=document.querySelector('video'),scene=document.querySelector('#scene');
  const ctx=scene.getContext('2d'),button=document.querySelector('#play'),hint=document.querySelector('#hint');
  const progress=document.querySelector('.progress'),cache=new Map();
  // Give the short approach and cord-pull more scroll space than the closing pose.
  const openStart=.22, openEnd=.52;
  const edges=[143,149,158,171,188,208,231,258,288,322,359,400,444,491,542,595,606];
  const beats=[[0,3.05],[.14,5.4],[openStart,98/15],[openEnd,114/15],[.61,9.1],[.71,10.5],[.77,11],[.84,11.9],[.94,19.3],[1,25.1]];
  const prompts=['Scroll to bring them together ↓','Scroll to pull the cord ↓','Scroll to unfurl the invitation ↓','Scroll to reveal the invitation ↓','Scroll to reveal the names ↓','Scroll to see the date ↓','Scroll to see the ceremony details ↓','Scroll through the celebration ↓','Scroll to see the full invitation ↓'];
  let edge=null,lastEdge=null,playing=false,raf=0,requested=-1,shown=-1,direction=1,lastScroll=scrollY;
  function map(value,from,to){
    for(let i=1;i<beats.length;i++){
      if(value<=beats[i][from]){
        const left=beats[i-1],right=beats[i];
        const weight=Math.max(0,(value-left[from])/(right[from]-left[from]));
        return left[to]+weight*(right[to]-left[to]);
      }
    }
    return beats[beats.length-1][to];
  }
  function imageFor(page){
    if(page<0||page>=sheets.length)return;
    if(!cache.has(page)){
      const img=new Image();cache.set(page,img);
      img.onload=()=>{if(Math.floor(requested/16)===page)draw(requested)};
      img.onerror=()=>{cache.delete(page);if(Math.floor(requested/16)===page){scene.hidden=true;film.currentTime=(requested+40)/15}};
      img.src=sheets[page];
    }
    return cache.get(page);
  }
  function draw(index){
    const page=Math.floor(index/16),img=imageFor(page);
    if(img&&img.complete&&img.naturalWidth&&(shown!==index||edge!==lastEdge)){
      const cell=index%16;
      const sx=(cell%4)*432,sy=Math.floor(cell/4)*768;
      ctx.drawImage(img,sx,sy,432,768,0,0,432,768);
      if(edge!==null){
        // Blend complete original poses. A rectangular warp here used to slice through both figures.
        const base=index+40-98;
        const next=base+1;
        if(next<edges.length&&edge>edges[base]){
          const nextIndex=index+1;
          const following=imageFor(Math.floor(nextIndex/16));
          if(following?.complete&&following.naturalWidth){
            const pos=nextIndex%16;
            ctx.globalAlpha=Math.min(1,(edge-edges[base])/(edges[next]-edges[base]));
            ctx.drawImage(following,(pos%4)*432,Math.floor(pos/4)*768,432,768,0,0,432,768);
            ctx.globalAlpha=1;
          }
        }
      }
      lastEdge=edge;
      scene.hidden=false;shown=index;
      if(paintLetters)paintLetters((index+40)/15);
    }
    imageFor(page+direction);
    imageFor(page+2*direction);
    for(const key of cache.keys())if(Math.abs(key-page)>2)cache.delete(key);
  }
  function range(){return Math.max(1,document.querySelector('.journey').offsetHeight-document.documentElement.clientHeight)}
  function update(){
    raf=0;
    if(playing&&film.currentTime>=25.1){film.pause();playing=false;button.textContent='Play with sound';scrollTo(0,range())}
    const fraction=playing?map(film.currentTime,1,0):Math.max(0,Math.min(1,scrollY/range()));
    if(playing)scrollTo(0,fraction*range());
    if(scrollY!==lastScroll)direction=scrollY>lastScroll?1:-1;
    lastScroll=scrollY;
    requested=Math.round(map(fraction,0,1)*15)-40;
    edge=null;
    if(fraction>=openStart&&fraction<=openEnd){
      // Treat scroll displacement as paper length, independent of the film's acceleration.
      const amount=(fraction-openStart)/(openEnd-openStart);
      edge=edges[0]+amount*(edges[edges.length-1]-edges[0]);
      let nearest=0;
      for(let i=1;i<edges.length;i++)if(edges[i]<=edge)nearest=i;
      requested=98+nearest-40;
    }
    draw(requested);
    progress.style.transform='scaleX('+fraction+')';
    const next=beats.findIndex(b=>b[0]>fraction);
    hint.textContent=next<0?'Scroll up to rewind ↑':prompts[Math.max(0,next-1)];
    if(playing)queue();
  }
  function queue(){if(!raf)raf=requestAnimationFrame(update)}
  function pause(){if(playing){playing=false;film.pause();button.textContent='Play with sound';queue()}}
  document.querySelector('#openShare').onclick=()=>{pause();document.querySelector('.sharebox').showModal()};
  button.onclick=async()=>{
    if(playing){pause();return}
    const p=Math.min(1,scrollY/range());
    film.currentTime=p>.995?beats[0][1]:map(p,0,1);
    playing=true;button.textContent='Pause';
    try{await film.play();queue()}catch{pause()}
  };
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);
  // Anchor the cap to the start of the gesture, across all of its input events.
  const maxGestureFraction=.04;
  function moveGesture(origin,distance){
    const total=range(),limit=total*maxGestureFraction;
    // A soft limit gives diminishing movement without a sudden stop mid-swipe.
    const delta=limit*distance/(limit+Math.abs(distance));
    scrollTo(0,Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,origin+delta)));
    queue();
  }
  let drag=null,wheel=null;
  addEventListener('touchstart',e=>{
    wheel=null;
    if(e.touches.length!==1||e.target.closest('button,.sharebox')){drag=null;return}
    pause();
    drag={y:e.touches[0].clientY,offset:scrollY};
  },{passive:true});
  addEventListener('touchmove',e=>{
    if(!drag||e.touches.length!==1){drag=null;return}
    if(e.cancelable)e.preventDefault();
    moveGesture(drag.offset,drag.y-e.touches[0].clientY);
  },{passive:false});
  for(const event of ['touchend','touchcancel'])addEventListener(event,()=>{drag=null},{passive:true});
  addEventListener('wheel',e=>{
    if(document.querySelector('.sharebox').open||e.ctrlKey||!e.deltaY||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
    if(e.cancelable)e.preventDefault();
    pause();
    const speed=Math.abs(e.deltaY);
    const elapsed=wheel?e.timeStamp-wheel.time:Infinity;
    // A sustained wheel movement keeps advancing after the initial gesture limit.
    if(wheel&&elapsed<150&&Math.sign(e.deltaY)===wheel.sign)wheel.offset+=wheel.sign*Math.min(elapsed,40)*.21;
    const newImpulse=wheel&&wheel.coasting&&speed>wheel.lastSpeed*1.6&&speed>3;
    if(!wheel||elapsed>150||newImpulse||Math.sign(e.deltaY)!==wheel.sign){
      wheel={offset:scrollY,distance:0,peak:speed,coasting:false,sign:Math.sign(e.deltaY)};
    }
    wheel.peak=Math.max(wheel.peak,speed);
    if(speed<wheel.peak*.45)wheel.coasting=true;
    wheel.lastSpeed=speed;
    wheel.time=e.timeStamp;
    const unit=e.deltaMode===1?16:e.deltaMode===2?innerHeight:1;
    wheel.distance+=e.deltaY*unit;
    moveGesture(wheel.offset,wheel.distance);
  },{passive:false});
  addEventListener('keydown',e=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].includes(e.key))pause()});
  update();
}
