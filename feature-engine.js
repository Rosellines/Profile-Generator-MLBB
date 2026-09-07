/* MLBB Flex Profile Studio V4 — feature engine.  All features degrade gracefully. */
(() => {
  const F = window.MLBBFlexEngine = {};
  const $ = (id) => document.getElementById(id);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const safeText = (v, max = 160) => String(v ?? '').slice(0, max);
  const hex = (v, fallback = '#8eb7ff') => /^#[0-9a-f]{6}$/i.test(String(v)) ? String(v) : fallback;
  const storageKey = 'mlbb-flex:presets:v1';
  const settingsKey = 'mlbb-flex:engine-settings:v1';
  const accentKey = 'mlbb-flex:auto-accent:v1';
  const rarityMap = {
    Basic: { score: 10, color: '#9aa5b1', label: 'BASIC' },
    Elite: { score: 22, color: '#67d7ff', label: 'ELITE' },
    Rare: { score: 34, color: '#77a7ff', label: 'RARE' },
    Special: { score: 48, color: '#74f0b3', label: 'SPECIAL' },
    Epic: { score: 62, color: '#c38cff', label: 'EPIC' },
    Collector: { score: 78, color: '#ffb65c', label: 'COLLECTOR' },
    Legend: { score: 90, color: '#f6d66d', label: 'LEGEND' },
    Mythic: { score: 100, color: '#ff79d2', label: 'MYTHIC' }
  };
  const rankMap = {
    EPIC: 25, LEGENDS: 45, MYTHICAL: 60, 'MYTHICAL HONOR': 72, 'MYTHICAL GLORY': 84, 'MYTHICAL IMMORTAL': 100,
    MYTHIC: 60, 'MYTHIC HONOR': 72, 'MYTHIC GLORY': 84
  };
  const savedPresets = () => {
    try { const v = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(v) ? v.slice(0, 30) : []; } catch { return []; }
  };
  const savePresets = (items) => {
    const list = items.slice(0, 30);
    try { localStorage.setItem(storageKey, JSON.stringify(list)); return {saved:list, media:true}; } catch {}
    // localStorage is small; preserve the preset itself even when embedded media
    // would exceed the browser quota. Strip only embedded media as a fallback.
    const compact = list.map(p => ({...p, config:{...p.config, avatarDataUrl:'', artworkDataUrl:''}}));
    try { localStorage.setItem(storageKey, JSON.stringify(compact)); return {saved:compact, media:false}; } catch {}
    // Last resort: keep the newest presets until the browser accepts the payload.
    for(let n=Math.min(10,list.length); n>0; n--){
      const tail=compact.slice(0,n);
      try { localStorage.setItem(storageKey, JSON.stringify(tail)); return {saved:tail, media:false}; } catch {}
    }
    return {saved:[], media:false};
  };

  function getStats() {
    const n = id => Number($(id)?.value || 0);
    return { wr: clamp(n('wr'), 0, 100), matches: clamp(n('matches'), 0, 999999), mvp: clamp(n('mvp'), 0, 999999), savage: clamp(n('savage'), 0, 99999), legendary: clamp(n('legendary'), 0, 999999), emblemLevel: clamp(n('emblemLevel'), 0, 100) };
  }

  F.getFlexScore = () => {
    const s = getStats();
    const hero = typeof getHero === 'function' ? getHero() : null;
    const skin = typeof getSkin === 'function' ? getSkin() : null;
    const rarity = rarityMap[$('rarity')?.value] || rarityMap.Rare;
    const rank = rankMap[$('rank')?.value] || 25;
    const mastery = clamp((s.wr - 50) * 1.2, 0, 60);
    const volume = clamp(Math.log10(s.matches + 1) * 8, 0, 40);
    const mvps = clamp(Math.log10(s.mvp + 1) * 7, 0, 35);
    const savage = clamp(Math.log10(s.savage + 1) * 9, 0, 35);
    const legendary = clamp(Math.log10(s.legendary + 1) * 4, 0, 25);
    const emblem = clamp(s.emblemLevel * .25, 0, 25);
    const skinBonus = skin ? clamp((hero?.skins?.length || 1) * .35, 0, 10) : 0;
    const raw = rank * .28 + rarity.score * .22 + mastery * .24 + volume * .08 + mvps * .06 + savage * .04 + legendary * .03 + emblem * .03 + skinBonus;
    return Math.round(clamp(raw, 0, 100));
  };

  F.cardRarity = () => {
    const score = F.getFlexScore();
    if (score >= 92) return { key: 'MYTHIC', color: '#ff79d2' };
    if (score >= 82) return { key: 'LEGENDARY', color: '#f6d66d' };
    if (score >= 70) return { key: 'EPIC+', color: '#c38cff' };
    if (score >= 55) return { key: 'EPIC', color: '#67d7ff' };
    if (score >= 38) return { key: 'RARE', color: '#77a7ff' };
    return { key: 'STANDARD', color: '#9aa5b1' };
  };

  function skinDNA() {
    const skin = typeof getSkin === 'function' ? getSkin() : {};
    const style = String(skin?.style || '');
    const colors = [...new Set(style.match(/#[0-9a-f]{6}/gi) || [])].slice(0, 4);
    const c1 = hex($('skinColor1')?.value, colors[0] || '#8e7dff');
    const c2 = hex($('skinColor2')?.value, colors[1] || '#ffffff');
    const rarity = $('rarity')?.value || skin?.rarity || 'Rare';
    const r = rarityMap[rarity] || rarityMap.Rare;
    let h = 0, s = 0, l = 0;
    const rgb = (x) => { const n=parseInt(x.slice(1),16); return [(n>>16)&255,(n>>8)&255,n&255].map(v=>v/255); };
    const [a,b,c] = rgb(c1); const mx=Math.max(a,b,c), mn=Math.min(a,b,c), d=mx-mn; l=(mx+mn)/2; s=d===0?0:d/(1-Math.abs(2*l-1));
    if(d){if(mx===a)h=((b-c)/d)%6;else if(mx===b)h=(c-a)/d+2;else h=(a-b)/d+4;h=Math.round(h*60);if(h<0)h+=360;}
    const traits = [h < 45 || h >= 320 ? 'FIRE' : h < 160 ? 'NATURE' : h < 255 ? 'ARCANE' : 'VOID', s > .72 ? 'HIGH SATURATION' : s > .4 ? 'BALANCED' : 'MUTED', l > .68 ? 'LUMINOUS' : l < .28 ? 'DARKCORE' : 'CONTRAST'];
    return { hue:h, saturation:Math.round(s*100), lightness:Math.round(l*100), colors:[c1,c2], rarity:r.label, traits, dna:`${h.toString(36).toUpperCase()}-${Math.round(s*99).toString(36).toUpperCase()}-${Math.round(l*99).toString(36).toUpperCase()}-${r.label.slice(0,3)}` };
  }
  F.skinDNA = skinDNA;

  async function extractColors(url) {
    if (!url) return null;
    try {
      const img = new Image(); img.crossOrigin='anonymous'; img.src=url;
      await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;});
      const c=document.createElement('canvas'); c.width=32;c.height=32; const x=c.getContext('2d',{willReadFrequently:true}); x.drawImage(img,0,0,32,32);
      const data=x.getImageData(0,0,32,32).data; const bins=new Map();
      for(let i=0;i<data.length;i+=4){const a=data[i+3];if(a<100)continue;const r=data[i]>>4,g=data[i+1]>>4,b=data[i+2]>>4,key=`${r}${g}${b}`;bins.set(key,(bins.get(key)||0)+1);}
      const top=[...bins.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>`#${k[0]}${k[0]}${k[1]}${k[1]}${k[2]}${k[2]}`);
      return top.length?top:null;
    } catch { return null; }
  }
  F.autoSkinColor = async () => {
    const img = $('heroArt'); const style = getComputedStyle(img).backgroundImage; const match = style.match(/url\(["']?(.*?)["']?\)/i);
    const colors = await extractColors(match?.[1]); const dna = skinDNA(); const picked = colors || dna.colors;
    if (picked?.[0] && $('skinColor1')) $('skinColor1').value = picked[0];
    if (picked?.[1] && $('skinColor2')) $('skinColor2').value = picked[1];
    if (typeof render === 'function') render();
    return picked;
  };

  F.autoAccent = async () => {
    const img = $('heroArt');
    const style = getComputedStyle(img).backgroundImage;
    const match = style.match(/url\(["']?(.*?)["']?\)/i);
    const colors = await extractColors(match?.[1]);
    const dna = skinDNA();
    const chosen = colors?.[0] || dna.colors[0] || '#8eb7ff';
    if($('accent')) $('accent').value=chosen;
    if(typeof render==='function') render();
    try { localStorage.setItem(accentKey, chosen); } catch {}
    return chosen;
  };

  function localFlagSvg(region) {
    const item = (typeof regionOptions !== 'undefined' ? regionOptions : []).find(x=>x[0]===region);
    const emoji = item?.[2] || '🌐';
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="28" viewBox="0 0 40 28"><rect width="40" height="28" rx="6" fill="#101827"/><text x="20" y="21" text-anchor="middle" font-size="19">${emoji}</text></svg>`)}`;
  }
  F.localFlagSvg=localFlagSvg;

  function applyRarityVisuals() {
    const rarity=$('rarity')?.value || 'Rare'; const r=rarityMap[rarity]||rarityMap.Rare; const cardR=F.cardRarity();
    const card=$('card'); if(!card)return;
    card.style.setProperty('--rarity',r.color); card.style.setProperty('--card-rarity',cardR.color);
    card.dataset.rarity=r.label; card.dataset.cardRarity=cardR.key;
    [$('cardRarityOut'),$('cardRarityPanel')].forEach(chip=>{if(chip){chip.textContent=cardR.key;chip.style.color=cardR.color;chip.style.borderColor=`${cardR.color}88`;}})
    const dna=skinDNA(); const out=$('skinDnaOut'); if(out)out.textContent=dna.dna;
    const traits=$('skinTraitsOut'); if(traits)traits.textContent=dna.traits.join(' · ');
    const score=$('flexScoreOut'); if(score)score.textContent=String(F.getFlexScore());
    const score2=$('flexScoreStage'); if(score2)score2.textContent=`FLEX ${F.getFlexScore()}`;
  }

  function rankAura() {
    const rank=$('rank')?.value || 'EPIC'; const v=rankMap[rank]||25; const card=$('card');
    const color=rank.includes('IMMORTAL')?'#fff0a6':rank.includes('GLORY')?'#ffd76b':rank.includes('HONOR')?'#7df2ff':rank==='MYTHICAL'?'#d7a4ff':rank==='LEGENDS'?'#ffe08a':'#73e7ff';
    card?.style.setProperty('--rank-aura-color',color); card?.style.setProperty('--rank-aura-power',`${0.12+v/500}`);
  }

  F.smartLayout=()=>{
    if(typeof state==='undefined')return;
    const mode=state.selections.mode; const narrow=mode==='card';
    state.layers.avatar={x:narrow?0:-4,y:narrow?0:2,scale:narrow?96:100,rotate:0};
    state.layers.hero={x:narrow?0:4,y:narrow?-4:-2,scale:narrow?94:100,rotate:0};
    if(typeof syncLayerControls==='function')syncLayerControls(); if(typeof render==='function')render();
  };

  F.makeConfig=(includeMedia=false)=>({version:4,identity:{ign:safeText($('ign')?.value,40),pid:safeText($('pid')?.value,20),server:safeText($('server')?.value,20),bio:safeText($('bio')?.value,120),title:safeText($('title')?.value,80),rank:safeText($('rank')?.value,40),gender:safeText($('gender')?.value,20),region:safeText($('region')?.value,8),rankPoints:clamp(Number($('rankPoints')?.value||0),0,999999)},selections:JSON.parse(JSON.stringify(state.selections)),visual:{skinColor1:$('skinColor1')?.value,skinColor2:$('skinColor2')?.value,rarityColor:$('rarityColor')?.value,backgroundColor1:$('backgroundColor1')?.value,backgroundColor2:$('backgroundColor2')?.value,backgroundColor3:$('backgroundColor3')?.value,frameMode:$('frameMode')?.value,frameColor1:$('frameColor1')?.value,frameColor2:$('frameColor2')?.value,accent:$('accent')?.value,transparentExport:!!$('transparentExport')?.checked,fontMode:$('fontMode')?.value,fontScale:$('fontScale')?.value,holo:onHolo(),holoStrength:$('holoStrength')?.value},stats:getStats(),layers:JSON.parse(JSON.stringify(state.layers)),activeLayer:state.activeLayer,customBackground:!!state.customBackground,customFrame:!!state.customFrame,avatarDataUrl:includeMedia&&state.avatarDataUrl?.length<1500000?state.avatarDataUrl:'',artworkDataUrl:includeMedia&&state.artworkDataUrl?.length<1500000?state.artworkDataUrl:'',engine:{flexScore:F.getFlexScore(),cardRarity:F.cardRarity(),skinDNA:F.skinDNA()}});
  function onHolo(){const c=$('card');return c?.classList.contains('holo-on')?'on':'off';}
  F.applyConfig=(p)=>{
    if(!p||typeof p!=='object')throw new Error('Config tidak valid'); const i=p.identity||{};
    ['ign','pid','server','bio','title','rank','gender','region','rankPoints'].forEach(k=>{if($(k)&&i[k]!==undefined)$(k).value=String(i[k]);});
    if(p.stats)Object.entries(p.stats).forEach(([k,v])=>{if($(k))$(k).value=String(clamp(Number(v)||0,k==='wr'?0:0,k==='wr'?100:999999));});
    if(p.visual)Object.entries(p.visual).forEach(([k,v])=>{if(k==='transparentExport' && $('transparentExport')) $('transparentExport').checked=!!v; else if(k==='holo'){const c=$('card');c?.classList.toggle('holo-on',v==='on');} else if($(k) && v!==undefined)$(k).value=String(v);});
    if($('fontMode')){$('card').classList.remove('font-modern','font-mono');if($('fontMode').value==='modern')$('card').classList.add('font-modern');if($('fontMode').value==='mono')$('card').classList.add('font-mono');}
    if($('fontScale')){$('card').style.setProperty('--font-scale',String(Number($('fontScale').value||100)/100));$('card').classList.add('font-scale');}
    if($('holoStrength'))$('card').classList.toggle('holo-strong',$('card').classList.contains('holo-on')&&$('holoStrength').value==='strong');
    if($('holoBtn'))$('holoBtn').textContent=$('card').classList.contains('holo-on')?'✨ Holographic ON':'✨ Holographic OFF';
    if(p.engine?.holoStrength && $('holoStrength')) $('holoStrength').value=String(p.engine.holoStrength);
    if($('holoStrength'))$('card').classList.toggle('holo-strong',$('card').classList.contains('holo-on')&&$('holoStrength').value==='strong');
    if(p.selections)state.selections={...state.selections,...p.selections}; if(p.layers)state.layers={...state.layers,...p.layers}; state.activeLayer=p.activeLayer||state.activeLayer;
    state.customBackground=!!p.customBackground;state.customFrame=!!p.customFrame;state.avatarDataUrl=typeof p.avatarDataUrl==='string'&&p.avatarDataUrl.length<8e6?p.avatarDataUrl:'';state.artworkDataUrl=typeof p.artworkDataUrl==='string'&&p.artworkDataUrl.length<8e6?p.artworkDataUrl:'';
    if(typeof ensureSelectionsValid==='function')ensureSelectionsValid(); if(typeof paintControls==='function')paintControls(); if(typeof syncLayerControls==='function')syncLayerControls(); if(typeof render==='function')render(); persistEngineSettings();
  };

  function download(name, blobOrData){const a=document.createElement('a');a.download=name;a.href=typeof blobOrData==='string'?blobOrData:URL.createObjectURL(blobOrData);document.body.appendChild(a);a.click();a.remove();if(typeof blobOrData!=='string')setTimeout(()=>URL.revokeObjectURL(a.href),1500);}

  F.exportUltra=async()=>runExport(['pngUltraBtn','webpBtn','webmBtn','gifBtn','exportBtn'], async()=>{const url=await elementToPng($('card'),state.selections.mode,2);download(`mlbb-flex-${state.selections.mode}-ultra.png`,url);});
  F.exportWebP=async()=>runExport(['pngUltraBtn','webpBtn','webmBtn','gifBtn','exportBtn'], async()=>{const png=await elementToPng($('card'),state.selections.mode,1);const im=await new Promise((res,rej)=>{const x=new Image();x.onload=()=>res(x);x.onerror=rej;x.src=png;});const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.getContext('2d').drawImage(im,0,0);download(`mlbb-flex-${state.selections.mode}.webp`,c.toDataURL('image/webp',.92));});

  let exportBusy = false;
  async function runExport(buttonIds, task) {
    if (exportBusy) throw new Error('Export sedang diproses. Tunggu sampai selesai.');
    exportBusy = true;
    const buttons = buttonIds.map(id => $(id)).filter(Boolean);
    buttons.forEach(b => { b.disabled = true; b.setAttribute('aria-busy', 'true'); });
    document.body.classList.add('export-busy');
    try { return await task(); } finally {
      buttons.forEach(b => { b.disabled = false; b.removeAttribute('aria-busy'); });
      document.body.classList.remove('export-busy');
      exportBusy = false;
    }
  }
  function animationParams() {
    const seconds = clamp(Number($('animDuration')?.value ?? 4) || 4, 1, 8);
    const fps = clamp(Number($('animFps')?.value ?? 20) || 20, 8, 30);
    if($('animDuration')) $('animDuration').value = String(seconds);
    if($('animFps')) $('animFps').value = String(fps);
    return {seconds, fps};
  }

  async function exportAnimatedWebM() {
    return runExport(['pngUltraBtn','webpBtn','webmBtn','gifBtn','exportBtn'], async () => {
      if(!window.MediaRecorder) throw new Error('MediaRecorder tidak tersedia di browser ini.');
      const {seconds,fps}=animationParams();
      const card=$('card'); card.classList.add('exporting');
      try {
        const base=await elementToPng(card,state.selections.mode);
        const img=await new Promise((res,rej)=>{const x=new Image();x.onload=()=>res(x);x.onerror=rej;x.src=base;});
        const canvas=document.createElement('canvas'); canvas.width=540;canvas.height=Math.round(540*({story:16/9,feed:5/4,card:4/3}[state.selections.mode]||16/9));
        const ctx=canvas.getContext('2d');
        const stream=canvas.captureStream(fps);
        const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(x=>MediaRecorder.isTypeSupported(x))||'video/webm';
        const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5000000}); const chunks=[]; rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
        const done=new Promise((resolve,reject)=>{rec.onstop=()=>resolve(new Blob(chunks,{type:'video/webm'}));rec.onerror=e=>reject(e.error||new Error('Recorder error'));}); rec.start();
        const startTime=performance.now();
        while(performance.now()-startTime<seconds*1000){const t=(performance.now()-startTime)/1000,p=t/seconds,dx=Math.sin(p*Math.PI*2)*7,sc=1+Math.sin(p*Math.PI*2)*.012;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(canvas.width/2+dx,canvas.height/2);ctx.scale(sc,sc);ctx.drawImage(img,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);ctx.restore();await new Promise(r=>setTimeout(r,1000/fps));}
        rec.stop(); download(`mlbb-flex-${state.selections.mode}.webm`,await done);
      } finally { card.classList.remove('exporting'); }
    });
  }
  F.exportAnimatedWebM=exportAnimatedWebM;

  // Small dependency-free GIF encoder: quantize each frame to a shared 256-color palette and LZW-compress it.
  function gifLzw(pixels,minCode=8){let clear=1<<minCode,end=clear+1,next=end+1,size=minCode+1,dict=new Map(),out=[],bits=0,buf=0;const put=c=>{buf|=c<<bits;bits+=size;while(bits>=8){out.push(buf&255);buf>>=8;bits-=8;}};put(clear);let prefix=null;for(const k of pixels){if(prefix===null){prefix=k;continue;}const key=prefix+','+k;if(dict.has(key)){prefix=dict.get(key);continue;}put(prefix);if(next<4096){dict.set(key,next++);if(next===(1<<size)&&size<12)size++;}else{put(clear);dict=new Map();next=end+1;size=minCode+1;}prefix=k;}if(prefix!==null)put(prefix);put(end);if(bits)out.push(buf&255);return out;}
  function makePalette(frames){const bins=new Map();for(const pix of frames){for(let i=0;i<pix.length;i+=4){const r=pix[i]>>5,g=pix[i+1]>>5,b=pix[i+2]>>5,k=(r<<6)|(g<<3)|b;bins.set(k,(bins.get(k)||0)+1);}}const keys=[...bins.entries()].sort((a,b)=>b[1]-a[1]).slice(0,255).map(x=>x[0]);while(keys.length<255)keys.push(0);const pal=[];for(const k of keys){pal.push(((k>>6)&7)*36,((k>>3)&7)*36,(k&7)*36);}return pal;}
  function encodeGif(frames,w,h,delay){const pal=makePalette(frames);const lut=new Uint8Array(32768);for(let r=0;r<32;r++)for(let g=0;g<32;g++)for(let b=0;b<32;b++){let best=0,bd=1e9,rr=r*8+4,gg=g*8+4,bb=b*8+4;for(let j=0;j<255;j++){const dr=rr-pal[j*3],dg=gg-pal[j*3+1],db=bb-pal[j*3+2],d=dr*dr+dg*dg+db*db;if(d<bd){bd=d;best=j;}}lut[(r<<10)|(g<<5)|b]=best;}const idx=frames.map(pix=>{const a=new Uint8Array(pix.length/4);for(let i=0,j=0;i<pix.length;i+=4,j++){a[j]=lut[((pix[i]>>3)<<10)|((pix[i+1]>>3)<<5)|(pix[i+2]>>3)];}return a;});const bytes=[];const push=(...xs)=>bytes.push(...xs);const str=s=>[...s].forEach(c=>push(c.charCodeAt(0)));str('GIF89a');push(w&255,w>>8,h&255,h>>8,0xF7,0,0);for(let i=0;i<256;i++)push(pal[i*3]||0,pal[i*3+1]||0,pal[i*3+2]||0);push(0x21,0xFF,11);str('NETSCAPE2.0');push(3,1,0,0,0);for(let f=0;f<idx.length;f++){push(0x21,0xF9,4,0,delay&255,(delay>>8)&255,0,0);push(0x2C,0,0,0,0,w&255,w>>8,h&255,h>>8,0);const data=gifLzw(idx[f]);push(8);for(let i=0;i<data.length;i+=255){const n=Math.min(255,data.length-i);push(n,...data.slice(i,i+n));}push(0);}push(0x3B);return new Blob([new Uint8Array(bytes)],{type:'image/gif'});}
  F.exportAnimatedGIF=async()=>runExport(['pngUltraBtn','webpBtn','webmBtn','gifBtn','exportBtn'], async()=>{
    const {seconds,fps}=animationParams();
    const w=240,h=Math.round(w*({story:16/9,feed:5/4,card:4/3}[state.selections.mode]||16/9));
    const card=$('card'); card.classList.add('exporting');
    try {
      const base=await elementToPng(card,state.selections.mode);
      const im=await new Promise((res,rej)=>{const x=new Image();x.onload=()=>res(x);x.onerror=rej;x.src=base;});
      const frames=[]; const total=Math.max(1,Math.round(seconds*fps));
      for(let i=0;i<total;i++){const p=i/total,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.translate(w/2+Math.sin(p*Math.PI*2)*3,h/2);x.scale(1+Math.sin(p*Math.PI*2)*.012,1+Math.sin(p*Math.PI*2)*.012);x.drawImage(im,-w/2,-h/2,w,h);frames.push(x.getImageData(0,0,w,h).data);}
      download(`mlbb-flex-${state.selections.mode}.gif`,encodeGif(frames,w,h,Math.max(2,Math.min(100,Math.round(100/fps)))));
    } finally { card.classList.remove('exporting'); }
  });

  function applyShareHash(){const h=location.hash.replace(/^#flex=/,'');if(!h)return;try{const p=JSON.parse(decodeURIComponent(escape(atob(h))));F.applyConfig(p);}catch(e){console.warn('Invalid share config',e);}}
  F.share=async()=>{const raw=JSON.stringify(F.makeConfig(false));const encoded=btoa(unescape(encodeURIComponent(raw)));const url=`${location.origin}${location.pathname}#flex=${encoded}`;await navigator.clipboard?.writeText(url).catch(()=>{});return url;};

  F.mergeRemoteManifest = (remote) => {
    if (!remote?.heroes || typeof state === 'undefined') return;
    const localBy = new Map((state.manifest.heroes || []).map(h => [h.id, h]));
    remote.heroes.forEach(rh => {
      const lh = localBy.get(rh.id) || (state.manifest.heroes || []).find(h => h.name?.toLowerCase() === rh.name?.toLowerCase());
      if (!lh) return;
      const skins = Array.isArray(rh.skins) ? rh.skins : [];
      const bySkin = new Map((lh.skins || []).map(s => [s.id, s]));
      skins.forEach(rs => {
        const ls = bySkin.get(rs.id);
        if (ls) { ls.name = safeText(rs.name, 100); if (rs.rarity) ls.rarity = safeText(rs.rarity, 30); }
      });
    });
    try { writeStorage(STORAGE_KEYS.catalog, state.manifest); } catch {}
    if (typeof render === 'function') render();
  };

  function restoreEngineSettings(){try{const v=JSON.parse(localStorage.getItem(settingsKey)||'{}');if($('fontMode')&&v.fontMode)$('fontMode').value=v.fontMode;if($('fontScale')&&v.fontScale)$('fontScale').value=v.fontScale;if($('holoStrength')&&v.holoStrength)$('holoStrength').value=v.holoStrength;if($('transparentExport'))$('transparentExport').checked=!!v.transparentExport;const c=$('card');c?.classList.toggle('holo-on',v.holo==='on');c?.classList.toggle('holo-strong',v.holo==='on'&&v.holoStrength==='strong');c?.classList.toggle('font-modern',v.fontMode==='modern');c?.classList.toggle('font-mono',v.fontMode==='mono');c?.classList.add('font-scale');c?.style.setProperty('--font-scale',String(Number(v.fontScale||100)/100));if($('holoBtn'))$('holoBtn').textContent=v.holo==='on'?'✨ Holographic ON':'✨ Holographic OFF';}catch{}}
  function persistEngineSettings(){try{localStorage.setItem(settingsKey,JSON.stringify({fontMode:$('fontMode')?.value,fontScale:$('fontScale')?.value,holoStrength:$('holoStrength')?.value,transparentExport:!!$('transparentExport')?.checked,holo:onHolo()}));}catch{}}

  function bind() {
    if(!$('engine'))return;
    $('autoColorBtn')?.addEventListener('click',async()=>{try{await F.autoSkinColor();}catch(e){console.warn(e);}});
    $('pngUltraBtn')?.addEventListener('click',async()=>{try{await F.exportUltra();}catch(e){alert(`PNG Ultra gagal: ${e.message}`);}});
    $('webpBtn')?.addEventListener('click',async()=>{try{await F.exportWebP();}catch(e){alert(`WebP gagal: ${e.message}`);}});
    $('smartLayoutBtn')?.addEventListener('click',F.smartLayout);
    $('holoBtn')?.addEventListener('click',()=>{const c=$('card');const on=!c.classList.contains('holo-on');c.classList.toggle('holo-on',on);c.classList.toggle('holo-strong',on&&$('holoStrength')?.value==='strong');$('holoBtn').textContent=on?'✨ Holographic ON':'✨ Holographic OFF';persistEngineSettings();});
    $('holoStrength')?.addEventListener('change',()=>{const c=$('card');c.classList.toggle('holo-strong',c.classList.contains('holo-on')&&$('holoStrength').value==='strong');persistEngineSettings();});
    $('fontMode')?.addEventListener('change',()=>{$('card').classList.remove('font-modern','font-mono');if($('fontMode').value==='modern')$('card').classList.add('font-modern');if($('fontMode').value==='mono')$('card').classList.add('font-mono');persistEngineSettings();});
    $('fontScale')?.addEventListener('input',()=>{$('card').style.setProperty('--font-scale',String(Number($('fontScale').value)/100));$('card').classList.add('font-scale');persistEngineSettings();});$('transparentExport')?.addEventListener('change',persistEngineSettings);$('autoAccentBtn')?.addEventListener('click',F.autoAccent);$('webmBtn')?.addEventListener('click',async()=>{try{await F.exportAnimatedWebM();}catch(e){alert(`WebM gagal: ${e.message}`);}});$('gifBtn')?.addEventListener('click',async()=>{try{await F.exportAnimatedGIF();}catch(e){alert(`GIF gagal: ${e.message}`);}});$('shareBtn')?.addEventListener('click',async()=>{try{const u=await F.share();navigator.clipboard?.writeText(u);$('shareStatus').textContent='Share link copied.';}catch(e){$('shareStatus').textContent=e.message;}});$('qrBtn')?.addEventListener('click',()=>{const u=`${location.origin}${location.pathname}#flex=${btoa(unescape(encodeURIComponent(JSON.stringify(F.makeConfig()))))}`;const q=$('qrImage');if(!q)return;if(!window.confirm('Generate QR via QuickChart? Seluruh profile config di dalam share link akan dikirim ke layanan pihak ketiga tersebut.')){ $('qrStatus').textContent='QR dibatalkan — profile tetap lokal.'; return; }q.src=`https://quickchart.io/qr?size=320&text=${encodeURIComponent(u)}`;q.classList.remove('hidden');$('qrStatus').textContent='QR siap. QuickChart menerima share URL profile untuk membuat gambar QR.';});
    $('savePresetBtn')?.addEventListener('click',()=>{const name=prompt('Nama preset?','My Flex Preset');if(!name)return;const arr=savedPresets();arr.unshift({id:crypto.randomUUID?.()||String(Date.now()),name:safeText(name,40),config:F.makeConfig(true),createdAt:new Date().toISOString()});const result=savePresets(arr);paintMarketplace();$('presetStatus').textContent=result.media?'Preset tersimpan lokal + media.':'Preset tersimpan, tapi media dilepas karena batas storage browser.';});
    $('exportPresetBtn')?.addEventListener('click',()=>download('mlbb-flex-preset.json',new Blob([JSON.stringify(F.makeConfig(true),null,2)],{type:'application/json'})));
    $('importPresetInput')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{F.applyConfig(JSON.parse(await f.text()));$('presetStatus').textContent='Preset imported.';}catch(err){$('presetStatus').textContent=`Import gagal: ${err.message}`;}e.target.value='';});
    document.querySelectorAll('[data-market-preset]').forEach(b=>b.addEventListener('click',()=>{const p=savedPresets().find(x=>x.id===b.dataset.marketPreset);if(p)F.applyConfig(p.config);}));
    $('clearPresetsBtn')?.addEventListener('click',()=>{savePresets([]);paintMarketplace();$('presetStatus').textContent='Preset lokal dibersihkan.';});
    ['rarity','skinColor1','skinColor2','rank','wr','matches','mvp','savage','legendary','emblemLevel'].forEach(id=>$(id)?.addEventListener('input',()=>{applyRarityVisuals();rankAura();}));
    window.addEventListener('mlbb:render',()=>{applyRarityVisuals();rankAura();persistEngineSettings();});
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
    setTimeout(()=>{applyRarityVisuals();rankAura();applyShareHash();},0);
  }
  function paintMarketplace(){const box=$('marketplaceList');if(!box)return;box.innerHTML='';const arr=savedPresets();if(!arr.length){box.innerHTML='<div class="market-empty">Belum ada preset komunitas. Simpan preset pertama lo.</div>';return;}arr.forEach(p=>{const row=document.createElement('div');row.className='market-item';const b=document.createElement('button');b.className='ghost';b.textContent=p.name;b.addEventListener('click',()=>F.applyConfig(p.config));const del=document.createElement('button');del.className='ghost';del.textContent='×';del.addEventListener('click',()=>{savePresets(arr.filter(x=>x.id!==p.id));paintMarketplace();});row.append(b,del);box.appendChild(row);});}
  F.init=()=>{restoreEngineSettings();bind();paintMarketplace();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',F.init);else F.init();
})();
