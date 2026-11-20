// A second tap after preparation keeps the native share action inside a user gesture.
if(premium)setupSharing();
function setupSharing(){
 const section=document.querySelector('#sharing'), own=document.querySelector('#ownMovie');
 const prepare=document.querySelector('#prepareMovie'),send=document.querySelector('#sendBoth');
 const download=document.querySelector('#downloadMovie'),link=document.querySelector('#sendLink');
 section.hidden=false;
 let ready=null,version=0,busy=false;
 function guestLink(){return new URL('guest.html',location.href).href+'#i='+inviteFragment(values())}
 function message(){const d=values();return d.one+' & '+d.two+' invite you to their wedding. Open the video invitation: '+guestLink()}
 function refresh(){
   version++;ready=null;send.hidden=true;download.hidden=true;
   link.href='https://wa.me/?text='+encodeURIComponent(message());
   prepare.textContent=own.files.length?'Prepare attachment':'Prepare video';
 }
 form.addEventListener('input',refresh);own.addEventListener('change',refresh);refresh();
 link.addEventListener('click',e=>{if(!form.reportValidity())e.preventDefault()});
 document.querySelector('#copyGuest').onclick=async()=>{
   if(!form.reportValidity())return;
   try{await navigator.clipboard.writeText(guestLink());statusLine.textContent='Guest invitation link copied.'}
   catch{statusLine.textContent='Copy the guest link: '+guestLink()}
 };
 prepare.onclick=async()=>{
   if(busy||!form.reportValidity())return;
   const revision=version,{data,changed,file}=selection();
   busy=true;prepare.disabled=true;
   try{
     const provided=own.files[0];
     if(provided&&!/\.mp4$/i.test(provided.name)&&provided.type!=='video/mp4')throw Error('Choose an MP4 video.');
     statusLine.textContent='Preparing the invitation video. Keep this tab open.';
     let blob;
     const upload=provided?URL.createObjectURL(provided):null;
     try{blob=await recordInvitation(data,upload||file,percent=>{if(revision===version)statusLine.textContent='Preparing your video · '+percent+'%'},changed&&!provided,Boolean(provided))}finally{if(upload)URL.revokeObjectURL(upload)}
     if(!blob){const res=await fetch(file);if(!res.ok)throw Error('Video could not be loaded.');blob=await res.blob()}
     if(version!==revision){statusLine.textContent='Details changed. Prepare the video again.';return}
     ready=new File([blob],'Royal-Scroll-Wedding.mp4',{type:'video/mp4'});
     send.hidden=false;download.hidden=false;
     statusLine.textContent='Video ready. Choose Share video + link, then select WhatsApp and your recipient.';
   }catch(e){statusLine.textContent=e.message||'Video preparation failed. Try again.'}
   finally{busy=false;prepare.disabled=false}
 };
 download.onclick=()=>{
   if(!ready)return;
   const url=URL.createObjectURL(ready),a=document.createElement('a');a.href=url;a.download=ready.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
 };
 send.onclick=async()=>{
   if(!ready)return;
   const data={files:[ready],text:message()};
   if(navigator.canShare?.({files:data.files})){
     try{await navigator.share(data);statusLine.textContent='If WhatsApp omitted the caption, send the guest link using WhatsApp link.';return}
     catch(e){if(e.name==='AbortError')return}
   }
   statusLine.textContent='This browser needs two steps. Download MP4, then choose WhatsApp link and attach the downloaded video in the chat.';
 };
}
