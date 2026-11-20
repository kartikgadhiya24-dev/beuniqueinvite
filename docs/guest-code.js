function inviteFragment(data){
  const bytes=new TextEncoder().encode(JSON.stringify(data));
  return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replaceAll('/','_').replaceAll('+','-').replace(/=+$/,'');
}
function readInviteFragment(hash){
  if(!hash.startsWith('#i=')||hash.length>16000)return null;
  try{
    const raw=atob(hash.slice(3).replaceAll('_','/').replaceAll('-','+'));
    const data=JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));
    const limits=invitationFields; Object.assign(data,Object.fromEntries(Object.entries(closingDefaults).filter(([k])=>data[k]===undefined)));
    for(const [key,len] of Object.entries(limits))if(typeof data[key]!=='string'||data[key].length>len)return null;
    if(!data.one.trim()||!data.two.trim()||!/^\d{4}-\d\d-\d\d$/.test(data.date)||isNaN(Date.parse(data.date)))return null;
    return Object.fromEntries([...Object.keys(limits),"approval"].map(k=>[k,k==="approval"?String(data.approval||"").slice(0,150):data[k]]));
  }catch{return null}
}
