self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
function db(){return new Promise((ok,no)=>{const r=indexedDB.open("pt-share",1);r.onupgradeneeded=()=>r.result.createObjectStore("s");r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
  if(e.request.method==="POST"&&u.pathname.endsWith("/share-target")){
    e.respondWith((async()=>{try{const fd=await e.request.formData();const files=fd.getAll("files").filter(f=>f&&f.size!==undefined);
      const d=await db();await new Promise((ok,no)=>{const t=d.transaction("s","readwrite");t.objectStore("s").put({files:files,t:Date.now()},"last");t.oncomplete=ok;t.onerror=()=>no(t.error);});}catch(x){}
      return Response.redirect(new URL("./?share=1",self.registration.scope).href,303);})());}
});
