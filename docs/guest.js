function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function showGuest(){
 if(!location.hash||['#premium','#plans','#collection'].includes(location.hash)){location.replace('collection.html'+location.hash);return}
 const host=document.querySelector('#guest'),data=readInviteFragment(location.hash);
 host.replaceChildren();
 if(!data){const msg=document.createElement('p');msg.textContent='Open the complete invitation link from your WhatsApp message.';host.append(msg);const a=document.createElement('a');a.href='create.html?t=scroll&edit=1';a.textContent='Create your Royal Scroll invitation';a.style.color='inherit';msg.append(document.createElement('br'),a);return}
 const hash=location.hash;data.paid=await verifiedPaid(data);if(hash!==location.hash)return;
 const custom=Object.entries({...scrollSample,...closingDefaults}).some(([k,v])=>data[k]!==v);
 const kind=custom?'personal':'royal',movie=new URL(kind+'-scroll.mp4',location.href).href;
 const sheets=Array.from({length:22},(_,i)=>new URL('frames/'+kind+'-'+String(i).padStart(2,'0')+'.webp',location.href).href);
 const frame=document.createElement('iframe');frame.title=data.one+' & '+data.two+' · Wedding invitation';
 frame.srcdoc=royalMovie(data,movie,custom,sheets);host.append(frame);document.title=frame.title;
}
showGuest();addEventListener('hashchange',showGuest);
