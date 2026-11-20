function drawBaraat(ctx,time,d){
 const ease=n=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n)};
 // Floating blossoms follow the reader's movement, including a swipe back.
 ctx.save();
 for(let i=0;i<14;i++){
  const f=(time*.085+i*.277)%1,x=(i*173+48+Math.sin(f*6+i)*32)%720,y=80+f*920;
  ctx.save();ctx.translate(x,y);ctx.rotate(f*5+i);
  ctx.globalAlpha=Math.sin(Math.PI*f)*.68;ctx.fillStyle=i%2?'#dd936e':'#d6a33f';
  ctx.beginPath();ctx.ellipse(0,0,3.2,7.2,0,0,Math.PI*2);ctx.fill();ctx.restore()
 }
 if(time<1.4){
  ctx.globalAlpha=1-ease((time-.35)/1.05);ctx.fillStyle='#724435';ctx.textAlign='center';
  ctx.font='italic 62px Georgia,serif';ctx.fillText('The Palace Baraat',360,270,600);
 }
 ctx.restore();
 const chapters=[
  {start:.45,end:7.5,eyebrow:'THE WEDDING PROCESSION',lines:[d.one,'&',d.two],detail:'Together with their families'},
  {start:8.15,end:15.7,eyebrow:'THE PALACE COURTYARD',lines:['Wedding ceremony'],detail:d.when},
  {start:16.3,end:24,eyebrow:'WITH LOVE AND BLESSINGS',lines:[d.one+' & '+d.two],detail:d.venue}
 ];
 const scene=chapters.find(c=>time>=c.start&&time<=c.end);if(!scene)return;
 const open=ease((time-scene.start)/1.6),close=scene===chapters[2]?1:ease((scene.end-time)/.7);
 const h=432*open*close;if(h<1)return;
 const dark=scene===chapters[2],top=85,left=72,width=576;
 ctx.save();ctx.translate(left,top);
 ctx.beginPath();ctx.rect(-7,-8,width+14,h+22);ctx.clip();
 const grad=ctx.createLinearGradient(0,0,width,0);
 grad.addColorStop(0,dark?'#172638':'#d8ba83');grad.addColorStop(.12,dark?'#263b4d':'#f5e9cd');grad.addColorStop(.88,dark?'#263b4d':'#f5e9cd');grad.addColorStop(1,dark?'#172638':'#d8ba83');ctx.fillStyle=grad;ctx.fillRect(0,0,width,h);
 ctx.strokeStyle='#ac854f';ctx.lineWidth=2;ctx.strokeRect(9,9,width-18,412);ctx.strokeRect(14,14,width-28,402);
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=dark?'#ffe5ac':'#653c32';
 function text(s,y,size,italic=false){
  ctx.font=(italic?'italic ':'')+size+'px Georgia,serif';ctx.fillText(s,width/2,y,width-75)
 }
 text(scene.eyebrow,65,22);text('◆',110,16);
 if(scene.lines.length===3){text(scene.lines[0],176,59,true);text('&',225,31,true);text(scene.lines[2],283,59,true)}
 else{text(scene.lines[0],215,58,true)}
 const words=scene.detail.split(/\s+/);let lines=[''];ctx.font='32px Georgia,serif';
 for(const word of words){let i=lines.length-1,next=(lines[i]+' '+word).trim();if(lines[i]&&ctx.measureText(next).width>width-76)lines.push(word);else lines[i]=next}
 const font=Math.min(32,76/lines.length);
 lines.forEach((line,i)=>text(line,349+(i-(lines.length-1)/2)*font*1.1,font));
 ctx.fillStyle='#956d35';ctx.fillRect(-6,h-2,width+12,8);ctx.fillStyle='#e6c58c';ctx.fillRect(-6,h,width+12,2);
 ctx.restore()
}
