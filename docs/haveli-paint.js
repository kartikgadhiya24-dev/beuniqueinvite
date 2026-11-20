const W=720,H=1280,last=6.85;
const cuts=['The wedding house','The haveli doors','The invitation','Mehendi courtyard','The four celebrations','Wedding ceremony','With compliments'];
const art={};
const transitionLayers=new WeakMap();
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
function smooth(n){const t=clamp(n);return t*t*(3-2*t)}

// Coordinates in the portrait paintings, before any camera movement.
const doorway={left:.4234,right:.5851,top:.6938,base:.8852};
const banners=[[.192,.479],[.552,.834]];
const bannerY=[.132,.366];
function paint(g,p,d,paid){
 function picture(name,zoom=1,anchorX=.5,anchorY=.5){
  g.save();g.translate(W*anchorX,H*anchorY);g.scale(zoom,zoom);
  g.drawImage(art[name],-W*anchorX,-H*anchorY,W,H);g.restore()
 }
 // Each paragraph has a fixed space on the artwork. Shrink only if it cannot fit.
 function type(str,x,top,width,height,size,{italic=false,color='#4e3026'}={}){
  if(!str)return;
  const lines=[];let lineHeight;
  for(;;size-=1){
   g.font=(italic?'italic ':'')+size+'px Georgia,serif';lineHeight=size*1.18;lines.length=0;
   for(const para of String(str).split('\n')){
    let line='';for(const word of para.trim().split(/\s+/)){
     const combined=line?line+' '+word:word;
     if(line&&g.measureText(combined).width>width){lines.push(line);line=word}else line=combined
    }lines.push(line)
   }
   if(lines.length*lineHeight<=height||size<=12)break
  }
  g.fillStyle=color;g.textBaseline='middle';g.textAlign='center';
  let y=top+(height-(lines.length-1)*lineHeight)/2;
  for(const line of lines){g.fillText(line,x,y,width);y+=lineHeight}
 }
 function fade(amount,draw){g.save();g.globalAlpha*=clamp(amount);draw();g.restore()}
 function door(t){
  const {left,right,top,base}=doorway,l=W*left,r=W*right,m=(l+r)/2,y=H*top,b=H*base;
  // Move the camera into the same painted room that is seen between the door leaves.
  const approach=smooth(t/.54),enter=smooth((t-.54)/.46);
  const opening=smooth((t-.25)/.43),firstZoom=1+1.45*approach;
  const mix=(a,b,f)=>a+(b-a)*f;
  const viewW=mix(W/firstZoom,r-l,enter),viewH=mix(H/firstZoom,b-y,enter);
  const centerX=mix(W*.5,m,approach),centerY=mix(mix(H*.5,H*.72,approach),(y+b)/2,enter);
  g.save();g.scale(W/viewW,H/viewH);g.translate(viewW/2-centerX,viewH/2-centerY);
  function outline(){
   g.rect(l,y,r-l,b-y)
  }
  g.save();g.beginPath();g.rect(-1,-1,W+2,H+2);outline();g.clip('evenodd');picture('gate');g.restore();
  g.save();g.beginPath();outline();g.clip();g.drawImage(art.room,l,y,r-l,b-y);
  for(const [edge,a] of [[l,l],[r,m]]){
   g.save();g.translate(edge,0);g.scale(Math.max(.00001,1-opening),1);g.translate(-edge,0);
   g.beginPath();g.rect(a,y,(r-l)/2,b-y);g.clip();picture('gate');g.restore()
  }
  g.restore();
  if(d.entrance){const signY=y-H*.115;g.fillStyle='#f5d390';g.fillRect(m-W*.15,signY,W*.3,H*.043);g.strokeStyle='#97622e';g.strokeRect(m-W*.15,signY,W*.3,H*.043);type(d.entrance,m,signY,W*.28,H*.043,31)}
  g.restore()
 }
 function program(t){
  const reveal=smooth(t/.58);
  // Pan from the left programme into both columns, as the next musicians enter.
  g.save();const z=1+.35*(1-reveal);g.translate(W*.22,H*.44);g.scale(z,z);g.translate(-W*.22,-H*.44);
  picture('events');
  for(let i=0;i<4;i++){
   const col=Math.floor(i/2),row=i%2,[l,r]=banners[col],cx=W*(l+r)/2,width=W*(r-l)*.91,y=H*bannerY[row];
   fade(col?smooth((t-.13)/.36):1,()=>{
    type(d['event'+i],cx,y,width,76,41,{italic:true});
    type(d['info'+i],cx,y+79,width,116,25)
   })
  }
  g.restore()
 }
 function scene(i,t){
  if(i===0){
   picture('street',1+.14*smooth(t),.48,.6);
   fade(1-smooth((t-.24)/.42),()=>type(d.title,W/2,72,640,114,66,{italic:true,color:'#733b37'}));
  }else if(i===1){door(t)}
  else if(i===2){
   picture('room');fade(smooth(t/.14),()=>{
    type(d.weddingHeading,W*.49,108,430,65,34);
    type(d.blessing,W*.49,177,450,75,25);
    type(d.first,W*.49,251,460,85,54,{italic:true});type(d.firstFamily,W*.49,331,470,66,23);
    type('&',W*.49,402,80,54,36,{italic:true});
    type(d.second,W*.49,452,460,84,54,{italic:true});type(d.secondFamily,W*.49,536,470,66,23);
    type(d.dates,W*.49,602,470,68,26)
   })
  }else if(i===3){picture('mehendi',1+.045*smooth(t),.5,.62)}
  else if(i===4){program(t)}
  else if(i===5){
   picture('mandap');fade(smooth(t/.27),()=>{
    type(d.weddingHeading,W/2,60,520,45,23);
    type(d.ceremony,W/2,110,555,90,61,{italic:true});
    type(d.when,W/2,208,535,64,27);
    type(d.schedule.split(/\s*·\s*/).join('\n'),W/2,276,525,118,25);
    type(d.dress,W/2,397,500,52,23,{italic:true});
    type(d.venue,W/2,451,500,82,32,{italic:true})
   })
  }else{
   picture('closing');type(d.endTitle,W/2,144,500,105,47,{italic:true});
   type(d.endText,W/2,255,480,125,31,{italic:true});
   type(d.signed||d.first+' & '+d.second,W/2,387,520,145,47,{italic:true});
   type(d.compliments,W/2,545,500,65,21);type(d.family,W/2,617,490,213,32);
   type(d.rsvp,W/2,846,485,142,27)
  }
 }
 // Adjacent paintings travel in one camera move. Blend only the narrow strip
 // where they meet, so the two complete illustrations never ghost over one another.
 function travel(index,t,progress,vertical,direction){
  const u=smooth(progress),length=vertical?H:W;
  const edge=length*.09*Math.sin(Math.PI*u),out=(-length*u+edge)*direction;
  const incoming=length*(1-u)*direction;
  const dest=g;
  dest.save();dest.translate(vertical?0:out,vertical?out:0);scene(index,t);dest.restore();
  let layer=transitionLayers.get(dest);
  if(!layer){
   const surface=document.createElement('canvas');surface.width=W;surface.height=H;
   layer=surface.getContext('2d');transitionLayers.set(dest,layer)
  }
  layer.save();layer.clearRect(0,0,W,H);
  g=layer;
  try{scene(index+1,0)}finally{g=dest}
  if(edge>.25){
   const start=direction>0?0:length,end=start+edge*direction;
   const mask=vertical?layer.createLinearGradient(0,start,0,end):layer.createLinearGradient(start,0,end,0);
   mask.addColorStop(0,'transparent');mask.addColorStop(1,'black');
   layer.globalCompositeOperation='destination-in';layer.fillStyle=mask;layer.fillRect(0,0,W,H);
  }
  layer.restore();dest.drawImage(layer.canvas,vertical?0:incoming,vertical?incoming:0)
 }
 g.save();g.fillStyle='#eedaba';g.fillRect(0,0,W,H);
 const i=Math.floor(p),t=p-i;
 const start=[.52,1,.70,.63,.68,.70,1][i];
 if(i!==1&&i<6&&t>start){
  travel(i,t,(t-start)/(1-start),i===3||i===5,i===4?-1:1)
 }else{scene(i,t)}
 if(!paid){
  const parts=[['be','#99464a'],['unique','#476a5b'],['invite','#946026']];
  g.font='bold 24px Georgia';g.textBaseline='middle';g.textAlign='left';
  const width=parts.reduce((sum,[s])=>sum+g.measureText(s).width,0);let x=(W-width)/2;
  g.fillStyle='#fff5dff0';g.fillRect(x-13,H-57,width+26,36);
  for(const [s,color] of parts){g.fillStyle=color;g.fillText(s,x,H-39);x+=g.measureText(s).width}
 }
 g.restore()
}
