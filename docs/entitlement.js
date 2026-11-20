const invitationFields={one:60,two:60,date:10,venue:130,note:650,monogram:30,headline:120,blessing:160,invitationLine:160,closingTitle:120,closingNote:480,signoff:160};
const closingDefaults={monogram:'',headline:'Two families, one celebration',blessing:'With the blessings of our elders',invitationLine:'we invite you to the wedding of',closingTitle:'With love',closingNote:'Your presence will make our celebration complete.',signoff:''};
function canonical(d){return Object.keys(invitationFields).map(k=>String(d[k]??closingDefaults[k]??''))}
async function fingerprint(d){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(canonical(d))));return Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('')}
async function verifiedPaid(d){
 if(!d.approval)return false;
 try{const key=await crypto.subtle.importKey('jwk',{"kty":"EC","x":"Uv32M6YV-TWQh15QB0vPvsSJI-r0ZV6gDLx3Szv95f4","y":"XAduZtz5Uyj8ckneZA6Fk4zCJFdpmi1EH_KHW5mh1iU","crv":"P-256"},{name:'ECDSA',namedCurve:'P-256'},false,['verify']);return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,Uint8Array.from(atob(d.approval),c=>c.charCodeAt(0)),new TextEncoder().encode('royal-paid-v1:'+await fingerprint(d)))}catch{return false}
}
