export default {async fetch(req,env){
 const url=new URL(req.url);
 const page=result=>new Response('<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paid order approval</title><style>body{font:18px Georgia;max-width:600px;margin:60px auto;padding:20px;background:#faf5ea}input,button,textarea{display:block;font:16px sans-serif;padding:10px;margin:10px 0 20px;box-sizing:border-box;width:100%}</style><h1>Paid order approval</h1>'+result,{headers:{'content-type':'text/html;charset=utf-8','cache-control':'no-store','x-frame-options':'DENY'}});
 if(req.method==='GET')return page('<p>Confirm the ₹1,499 Royal Scroll payment in your payment records before issuing a code for this invitation.</p><form method="post"><label>Invitation fingerprint<input required name="digest" pattern="[a-f0-9]{64}"></label><label>Verified payment reference<input required name="payment" maxlength="120"></label><button>Confirm received payment and issue code</button></form>');
 if(req.method!=='POST'||req.headers.get('Origin')!==url.origin)return new Response('Forbidden',{status:403});
 const d=await req.formData(),digest=String(d.get('digest')||'');
 if(!/^[0-9a-f]{64}$/.test(digest)||!String(d.get('payment')||'').trim())return page('Enter the invitation fingerprint and verified payment reference.');
 const key=await crypto.subtle.importKey('jwk',JSON.parse(env.ORDER_SIGNING_KEY),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 const signature=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,new TextEncoder().encode('royal-paid-v1:'+digest));
 return page('<h2>Paid invitation code</h2><p>Paste this code into the matching invitation in the editor.</p><textarea readonly>'+btoa(String.fromCharCode(...new Uint8Array(signature)))+'</textarea>');
}};
