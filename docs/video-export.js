async function recordInvitation(data,path,onProgress,custom=true,uploaded=false){
 const format=window.MediaRecorder&&['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
 if(!format||!HTMLCanvasElement.prototype.captureStream)throw Error('MP4 export is unavailable in this browser. Use current Chrome or Safari, or attach your own MP4.');
 const video=document.createElement('video');video.playsInline=true;video.preload='auto';
 const output=document.createElement('canvas'),letters=document.createElement('canvas');
 output.width=letters.width=720;output.height=letters.height=1280;
 const painter=custom&&paintPersonalScroll(scrollTrack,{...data,date:new Date(data.date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})},letters);
 const ctx=output.getContext('2d'),stream=output.captureStream(30),audio=new AudioContext();
 let recorder,raf,timeout,endingAt=0;
 try{
   await audio.resume();
   await new Promise((resolve,reject)=>{video.onloadeddata=resolve;video.onerror=()=>reject(Error('Source video could not be loaded.'));video.src=path;video.load()});
   const source=audio.createMediaElementSource(video),out=audio.createMediaStreamDestination();source.connect(out);
   for(const track of out.stream.getAudioTracks())stream.addTrack(track);
   recorder=new MediaRecorder(stream,{mimeType:format,videoBitsPerSecond:3000000});
   const chunks=[];let last=-1;
   function paint(){
     if(endingAt)drawEnding(ctx,data);
     else{ctx.fillStyle='#302019';ctx.fillRect(0,0,720,1280);const scale=Math.min(720/video.videoWidth,1280/video.videoHeight),w=video.videoWidth*scale,h=video.videoHeight*scale;ctx.drawImage(video,(720-w)/2,(1280-h)/2,w,h);if(painter){painter(video.currentTime);ctx.drawImage(letters,0,0)}}
     if(!data.paid)drawBrand(ctx);
     const percent=Math.min(99,Math.floor(video.currentTime/25.1*100));
     if(percent!==last){last=percent;onProgress(percent)}
   }
   return await new Promise((resolve,reject)=>{
     recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
     recorder.onerror=()=>reject(Error('Could not encode this MP4. Try again or choose your own video.'));
     recorder.onstop=()=>chunks.length?resolve(new Blob(chunks,{type:'video/mp4'})):reject(Error('No video was recorded.'));
     function tick(){
       const end=uploaded?video.duration:Math.min(25.1,video.duration);
       if(!endingAt&&(video.ended||video.currentTime>=end-.05)){video.pause();endingAt=performance.now()}
       paint();if(endingAt&&performance.now()-endingAt>=5000){recorder.stop();return}raf=requestAnimationFrame(tick);
     }
     timeout=setTimeout(()=>reject(Error('Video export timed out. Keep this tab visible and try again.')),Math.max(90000,(video.duration+45)*1000));
     paint();recorder.start(500);video.play().then(tick,reject);
   });
 }finally{
   clearTimeout(timeout);cancelAnimationFrame(raf);video.pause();
   if(recorder?.state==='recording')recorder.stop();
   stream.getTracks().forEach(t=>t.stop());await audio.close();video.removeAttribute('src');video.load();
 }
}
function drawBrand(ctx){
 ctx.save();ctx.globalAlpha=.91;ctx.fillStyle='#fff4d9';ctx.fillRect(16,18,207,37);ctx.font='bold 26px Georgia';ctx.textAlign='left';ctx.textBaseline='middle';
 let x=24;for(const [word,color] of [['be','#843643'],['unique','#936e28'],['invite','#3d644e']]){ctx.fillStyle=color;ctx.fillText(word,x,37);x+=ctx.measureText(word).width}
 ctx.restore();
}
function drawEnding(ctx,d){
 ctx.fillStyle='#59212c';ctx.fillRect(0,0,720,1280);ctx.strokeStyle='#c7a467';ctx.strokeRect(28,52,664,1170);ctx.strokeRect(34,58,652,1158);
 const formatted=new Date(d.date+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
 const parts=[[d.closingTitle,58],[d.closingNote,33],[d.signoff||d.one+' & '+d.two,41],[formatted,34],[d.venue,32],[d.note,30]].filter(([v])=>v);
 function layout(scale){
  const rows=[];let y=0;
  for(const [text,size] of parts){
   const px=size*scale;ctx.font=px+'px Georgia';let line='';
   function flush(){if(line){rows.push({line,px,y:y+px});y+=px*1.4;line=''}}
   for(const token of String(text).split(/(\s+)/)){
    if(token.includes('\n')){flush();continue}
    if(ctx.measureText(line+token).width>590)flush();
    if(ctx.measureText(token).width>590){for(const ch of token){if(ctx.measureText(line+ch).width>590)flush();line+=ch}}else line+=token;
   }
   flush();y+=20*scale;
  }return {rows,y};
 }
 let scale=1,doc=layout(scale);while(doc.y>1030&&scale>.24){scale*=.92;doc=layout(scale)}
 ctx.fillStyle='#f7dfa8';ctx.textAlign='center';ctx.textBaseline='alphabetic';for(const r of doc.rows){ctx.font=r.px+'px Georgia';ctx.fillText(r.line.trim(),360,(1280-doc.y)/2+r.y,600)}
}
function endShare(url,data,src,custom){
 const prep=document.querySelector('#prep'),send=document.querySelector('#send'),save=document.querySelector('#save'),feedback=document.querySelector('#feedback');
 const text=data.one+' & '+data.two+' · Wedding invitation '+url;let file=null;
 document.querySelector('#wa').href='https://wa.me/?text='+encodeURIComponent(text);
 prep.onclick=async()=>{prep.disabled=true;feedback.textContent='Preparing your MP4. Keep the card open.';
 try{const blob=await recordInvitation(data,src,p=>feedback.textContent='Preparing video · '+p+'%',custom);file=new File([blob],'Royal-Scroll.mp4',{type:'video/mp4'});
 save.href=URL.createObjectURL(file);send.hidden=false;save.hidden=false;prep.hidden=true;feedback.textContent='Video ready. Select a recipient in WhatsApp.'}
 catch(e){feedback.textContent=e.message}finally{prep.disabled=false}};
 send.onclick=async()=>{if(navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],text});return}catch(e){if(e.name==='AbortError')return}}
 feedback.textContent='Download MP4, open WhatsApp link and attach the downloaded video.'};
}
