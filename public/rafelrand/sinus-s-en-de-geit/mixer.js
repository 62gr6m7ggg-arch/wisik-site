/* Wisik 0.2.1: phase, frequency and a real goat recording remain distinct experiments. */
(function(root){
'use strict';
const math={
  rate:semitones=>Math.pow(2,semitones/12),
  factor:degrees=>Math.abs(degrees-90)<1e-9?0:2*Math.cos(degrees*Math.PI/180),
  sample:(data,pos)=>{const i=Math.floor(pos);return i<0||i+1>=data.length?0:data[i]+(data[i+1]-data[i])*(pos-i);}
};
let view=null,session=null,generation=0,recording=null;
const $=id=>document.getElementById(id), num=(x,n=2)=>x.toFixed(n).replace('.',',');
const ASSET='./goat-bleat.wav?v=0.2.0';
function stop(){
  generation++;
  const old=session; session=null;
  if(old){clearTimeout(old.limit);old.abort.abort();old.ctx.onstatechange=null;
    try{old.source&&old.source.stop();}catch{}
    try{old.ctx.close().catch(()=>{});}catch{}
  }
  if(view){['sound','goatSound'].forEach(id=>{const b=$(id);if(b){b.setAttribute('aria-pressed','false');b.textContent=id==='sound'?'Luister naar de mix':'Laat de geit blèren';}});
    const status=$('audioStatus');if(status)status.textContent='Geluid gestopt. Start alleen met een luisterknop.';
  }
}
function status(){return session?{kind:session.kind,state:session.ctx.state,frequency:session.source&&session.source.frequency?session.source.frequency.value:null,rate:session.source&&session.source.playbackRate?session.source.playbackRate.value:null}:null;}
function ramp(param,value,ctx){param.cancelScheduledValues(ctx.currentTime);param.setTargetAtTime(value,ctx.currentTime,.025);}
function volume(){return Number($('listenVolume').value)/100;}
function updateSound(){
  if(!session||!session.source)return;
  const {ctx,source,gain,kind}=session;
  if(kind==='sine'){
    ramp(source.frequency,Number($('frequency').value),ctx);
    ramp(gain.gain,.35*volume()*math.factor(Number($('phase').value)),ctx);
  }else{
    ramp(source.playbackRate,math.rate(Number($('goatPitch').value)),ctx);
    ramp(gain.gain,.7*volume(),ctx);
  }
  announce();
}
function announce(){
  if(!session||!$('audioStatus'))return;
  if(!session.source){$('audioStatus').textContent='Geluid wordt klaargezet… Nogmaals klikken annuleert.';return;}
  const s=session;
  let text=s.kind==='sine'?'Sinusuitvoer actief: '+$('frequency').value+' Hz.':'Geitenuitvoer actief: '+num(math.rate(Number($('goatPitch').value)))+'× de oorspronkelijke afspeelsnelheid.';
  if(s.ctx.state!=='running')text='De browser heeft de audio gepauzeerd. Stop en start opnieuw.';
  else if(volume()===0)text+=' Het luistervolume staat op nul.';
  else if(s.kind==='sine'&&math.factor(Number($('phase').value))===0)text+=' Bewuste stilte: de twee sinussen heffen elkaar op.';
  $('audioStatus').textContent=text;
}
async function start(kind){
  if(session&&session.kind===kind){stop();return;}
  stop();const token=generation;
  const button=$(kind==='sine'?'sound':'goatSound');
  let ctx;
  try{
    const AC=root.AudioContext||root.webkitAudioContext;
    if(!AC)throw new Error('Web Audio ontbreekt');
    try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
    ctx=new AC();
    const own={ctx,kind,source:null,gain:null,abort:new AbortController(),limit:null};session=own;
    button.textContent='Annuleer het starten';button.setAttribute('aria-pressed','true');announce();
    const resume=ctx.resume();
    const timeout=new Promise((_,reject)=>{own.limit=setTimeout(()=>reject(new Error('start-timeout')),10000);});
    await Promise.race([resume,timeout]);
    if(token!==generation||session!==own)return;
    if(ctx.state!=='running')throw new Error('audio-context-not-running');
    const gain=ctx.createGain();gain.gain.value=0;gain.connect(ctx.destination);own.gain=gain;
    if(kind==='sine'){
      const source=ctx.createOscillator();source.type='sine';source.frequency.value=Number($('frequency').value);
      source.connect(gain);own.source=source;source.start();
    }else{
      if(!recording){
        const response=await Promise.race([fetch(ASSET,{signal:own.abort.signal,credentials:'same-origin'}),timeout]);
        if(!response.ok)throw new Error('goat-file-'+response.status);
        const bytes=await Promise.race([response.arrayBuffer(),timeout]);
        const decoded=await Promise.race([ctx.decodeAudioData(bytes),timeout]);
        if(token!==generation||session!==own)return;
        recording=decoded;
      }
      if(token!==generation||session!==own)return;
      // A short pause separates repeated bleats. No external request is made during playback.
      const pad=Math.round(recording.sampleRate*.35),buffer=ctx.createBuffer(1,recording.length+pad,recording.sampleRate);
      buffer.getChannelData(0).set(recording.getChannelData(0));
      const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
      source.playbackRate.value=math.rate(Number($('goatPitch').value));source.connect(gain);own.source=source;source.start();
      drawGoat();
    }
    if(token!==generation||session!==own)return;
    clearTimeout(own.limit);own.limit=null;
    ctx.onstatechange=()=>{if(session===own)announce();};
    button.textContent='Stop het geluid';updateSound();
  }catch(error){
    if(token!==generation)return;
    stop();
    if($('audioStatus'))$('audioStatus').textContent='Afspelen is niet gestart. Controleer media-/toestelvolume en probeer Safari of een andere browser. De grafieken blijven werken.';
    console.warn('Wisik audio:',error.message);
  }
}
function graph(el,series,caption,range=2.2){
  const width=620,height=260,left=46,right=598,top=25,bottom=221;
  const X=t=>left+(right-left)*t,Y=v=>(top+bottom)/2-v*(bottom-top)/(2*range);
  const lines=series.map(s=>'<path d="'+s.points.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(2)+' '+Y(p[1]).toFixed(2)).join(' ')+'" fill="none" stroke="'+s.color+'" stroke-width="'+(s.width||2)+'"'+(s.dash?' stroke-dasharray="5 5"':'')+'/>').join('');
  el.innerHTML='<line x1="'+left+'" y1="'+Y(0)+'" x2="'+right+'" y2="'+Y(0)+'" stroke="#899a9d"/><line x1="'+left+'" y1="'+top+'" x2="'+left+'" y2="'+bottom+'" stroke="#899a9d"/>'+lines+'<text x="46" y="246" font-size="14">0</text><text x="405" y="246" font-size="14">'+caption+'</text>';
}
function drawSine(){
  const f=Number($('frequency').value),d=Number($('phase').value)*Math.PI/180,c=math.factor(Number($('phase').value));
  const points=fn=>Array.from({length:700},(_,i)=>{const t=i/699;return[t,fn(2*Math.PI*f*.02*t)];});
  graph($('wavePlot'),[{points:points(t=>Math.sin(t+d)),color:'#15627b'},{points:points(t=>Math.sin(t-d)),color:'#ae3f32'},{points:points(t=>c*Math.sin(t)),color:'#216149',width:3.5}],'20 ms = 0,020 s');
  $('phaseOut').textContent=$('phase').value+'°; verschil = '+(2*Number($('phase').value))+'°';
  $('frequencyOut').textContent=f+' Hz';
  $('waveRead').innerHTML='sin(2πft+d) + sin(2πft−d) = 2cos d · sin(2πft)<br>f = '+f+' Hz; T = 1/f ≈ '+num(1000/f,3)+' ms.<br>Getekende factor ≈ '+num(c,3)+'; amplitude ≈ '+(c===0?'0':num(Math.abs(c),3))+'.';
  updateSound();
}
function drawGoat(){
  const n=Number($('goatPitch').value),rate=math.rate(n);
  $('goatPitchOut').textContent=(n>0?'+':'')+n+' halve tonen · '+num(rate)+'×';
  $('goatRead').innerHTML='g<sub>k</sub>(t) = g(k·t), met k = '+num(rate,3)+'.<br>'+ (n===0?'De oorspronkelijke toonhoogte en duur.':n===12?'Tweemaal zo snel: één octaaf hoger, de duur halveert.':n===-12?'Half zo snel: één octaaf lager, de duur verdubbelt.':'De tijdas wordt '+(rate>1?'samengedrukt':'uitgerekt')+'. De duur wordt '+num(1/rate)+'× zo lang.');
  if(recording){
    const data=recording.getChannelData(0),sr=recording.sampleRate;
    // Center a short view on the strongest 40 ms window; use the same source point and vertical scale.
    let center=0,best=-1;
    for(let i=0;i<data.length-2048;i+=512){let e=0;for(let j=0;j<2048;j++)e+=data[i+j]*data[i+j];if(e>best){best=e;center=(i+1024)/sr;}}
    const points=k=>Array.from({length:1200},(_,i)=>{const u=i/1199;return[u,math.sample(data,(center+(u-.5)*.04*k)*sr)];});
    graph($('goatPlot'),[{points:points(1),color:'#899a9d',dash:true},{points:points(rate),color:'#6a4a8c',width:2}],'40 ms = 0,040 s',.7);
    $('goatCaption').textContent='Echte opname, ingezoomd op hetzelfde klankfragment: grijs is origineel, paars is jouw toonhoogte. De tijd- en amplitudeschaal blijven gelijk.';
  }
  updateSound();
}
function mount(){
  stop();view=$('gonioMixer');if(!view)return;
  view.innerHTML=`
  <p class="callout"><strong>Je oren hebben gelijk:</strong> fase veranderen maakt de sinusmix zachter of harder, niet hoger of lager. Voor toonhoogte verander je de frequentie. Onder de sinusmix krijgt de geit een eigen stem.</p>
  <h3>1. Twee sinussen: fase én toonhoogte</h3>
  <figure class="plot"><svg id="wavePlot" viewBox="0 0 620 260" role="img" aria-label="Twee sinussen en hun som in hetzelfde tijdvenster van twintig milliseconden"></svg><figcaption>Blauw en rood zijn de afzonderlijke sinussen; groen is de som. De horizontale as blijft 20 ms breed: bij een hogere frequentie passen er meer trillingen in.</figcaption></figure>
  <div class="controls"><div class="control"><label for="phase">Halve faseafstand d <output id="phaseOut"></output></label><input id="phase" type="range" min="0" max="180" value="35"></div><div class="control"><label for="frequency">Toonhoogte van beide sinussen <output id="frequencyOut"></output></label><input id="frequency" type="range" min="110" max="880" value="220" step="10"></div></div>
  <div class="actions"><button type="button" id="quiet">Maak het stil: d = 90°</button><button type="button" id="together">Samen: d = 0°</button><button type="button" id="sound" aria-pressed="false">Luister naar de mix</button></div>
  <div class="formula" id="waveRead"></div>
  <details><summary>Waarom verandert de faseknop geen toonhoogte?</summary><p>Bij een vaste faseafstand d is 2cos d een constante factor vóór de sinus. Die verandert de amplitude. De factor 2πf <em>in</em> de sinus bepaalt hoe snel de golf trilt. Bij dubbele f halveert T=1/f. Bij d=90° verdwijnt de som bij iedere gekozen frequentie. Schuif tijdens het luisteren: het geluid loopt nu door.</p></details>
  <h3>2. Bèèèh! Van basgeit naar sopraangeit</h3>
  <p>Een echte geitenopname, geen pieptoon in vermomming. Voorspel eerst: wat gebeurt er met de toonhoogte als dezelfde opname tweemaal zo snel wordt afgespeeld?</p>
  <div class="controls"><div class="control"><label for="goatPitch">Toonhoogte van de geit <output id="goatPitchOut"></output></label><input id="goatPitch" type="range" min="-12" max="12" value="0" step="1"></div><div class="control"><label for="listenVolume">Luistervolume voor beide proeven <output id="listenVolumeOut">35%</output></label><input id="listenVolume" type="range" min="0" max="100" value="35" step="1"></div></div>
  <div class="actions"><button type="button" id="goatLow">Basgeit · lager</button><button type="button" id="goatOriginal">Origineel</button><button type="button" id="goatHigh">Sopraangeit · hoger</button><button type="button" id="goatSound" class="primary" aria-pressed="false">Laat de geit blèren</button></div>
  <p id="audioStatus" class="status" role="status">Start met een luisterknop. Begin met een bescheiden toestelvolume.</p>
  <div class="formula" id="goatRead"></div>
  <figure class="plot"><svg id="goatPlot" viewBox="0 0 620 260" role="img" aria-label="De echte geitengolf, na het starten van de opname"><text x="38" y="120" font-size="18">Start het bèèèh om de echte golfvorm te zien.</text></svg><figcaption id="goatCaption">De opname wordt pas na jouw klik geladen. Daarna zie je hoe de toonhoogte de golf horizontaal samendrukt of uitrekt.</figcaption></figure>
  <p class="note"><strong>De knoppen doen verschillende dingen.</strong> De geit reageert op haar eigen toonhoogteknop en het luistervolume, niet op de faseknop van de sinusproef. Er klinkt maximaal één proef tegelijk. Wisselen van onderdeel of tabblad stopt het geluid.</p>
  <details><summary>Waarom blijft een echte geit een aparte proef?</summary><p>Een bèèèh heeft een ingewikkelde golfvorm, met boventonen en veranderingen tijdens de klank. Het is geen enkele sinus met één vaste frequentie. Daarom doen we niet alsof een halve periode verschuiven automatisch de héle geitenopname uitdooft.</p><p>Hier veranderen we de afspeelsnelheid, zonder toonhoogtecorrectie. Dus g(t) wordt g(kt). Bij k=2 is de opname een octaaf hoger én half zo lang; bij k=½ een octaaf lager én tweemaal zo lang. Ook het ritme van het herhaalde bèèèh verandert mee. De amplitude van de opgeslagen opname wordt niet vergroot door deze knop, maar ervaren luidheid kan verschillen.</p><p><strong>Zelf verklaren:</strong> bij a·sin(bt+c), welke parameter verandert de amplitude en welke de periode? Wat blijft hetzelfde als je alleen b verdubbelt?</p></details>
  <p class="note">Geitenopname: <a href="https://freesound.org/people/TheKingOfGeeks360/sounds/842307/" target="_blank" rel="noopener noreferrer">TheKingOfGeeks360, Goats — Goat Bleat; Close Perspective, Take 2</a> · CC0. Lokaal op Wisik opgeslagen; omgezet naar mono en het piekniveau begrensd. De geitenproef gebruikt geen externe speler of microfoon. De hosting voegt een Cloudflare-statistiekenscript toe. Versie 0.2.1.</p>`;
  $('phase').oninput=drawSine;$('frequency').oninput=drawSine;$('goatPitch').oninput=drawGoat;
  $('listenVolume').oninput=()=>{$('listenVolumeOut').textContent=$('listenVolume').value+'%';updateSound();};
  $('quiet').onclick=()=>{$('phase').value=90;drawSine();};$('together').onclick=()=>{$('phase').value=0;drawSine();};
  $('sound').onclick=()=>start('sine');$('goatSound').onclick=()=>start('goat');
  [['goatLow',-12],['goatOriginal',0],['goatHigh',12]].forEach(([id,value])=>{$(id).onclick=()=>{$('goatPitch').value=value;drawGoat();};});
  drawSine();drawGoat();
}
root.WisikGonioMixer={math,mount,stop,status};
if(typeof document!=='undefined'){
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  root.addEventListener('pagehide',stop);
}
})(globalThis);
