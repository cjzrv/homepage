import { randomVertices } from './random-shapes.js';

const zh=document.documentElement.lang.startsWith('zh');
const t=(a,b)=>zh?a:b;
const $=id=>document.getElementById(`demo-${id}`);
const status=$('status'), canvas=$('canvas');
const pageTitle=document.title;
const groups=[$('controls'),$('playback'),$('edit')];
let engine, snapshot, revision=-1, timer, resize, clientError='', caseNotice='', annotationKey='';
const stages=[t('初始覆蓋','Initial fill'),t('角落 V 字形填補','V-shaped corner fill'),t('最小筆刷沿邊填補','Minimum-radius border')];
const errors={
  brush_fit:t('筆刷無法放入此圖形，請縮小半徑或調整頂點。','The brush does not fit. Reduce its radius or adjust the vertices.'),
  convex:t('請使用凸三角形或凸梯形，頂點須依邊界順序排列。','Use a convex triangle or trapezoid with vertices in boundary order.'),
  degenerate:t('頂點重疊或圖形過於扁平，請調整座標。','Vertices overlap or the shape is too flat. Adjust the coordinates.'),
  trapezoid:t('四邊形須為上下底水平的凸梯形。','A quadrilateral must be a convex trapezoid with horizontal bases.'),
  coordinates:t('座標須為有限數值，x 在 20–580、y 在 35–445 之間。','Coordinates must be finite: x = 20–580, y = 35–445.'),
  random_shape:t('未能產生符合目前筆刷設定的圖形，請再試一次或縮小半徑。','Could not generate a shape for these brush settings. Try again or reduce the radius.'),
  integer_radius:t('原始取整模式的最小半徑須為正整數。','Original rounding mode requires a positive integer minimum radius.'),
  step_limit:t('此設定產生過多筆劃，請增加最小筆刷半徑。','Too many strokes. Increase the minimum brush radius.'),
};
function message(text) { if(status.textContent!==text) status.textContent=text; }
function decode(pointer) { return JSON.parse(engine.UTF8ToString(pointer)); }
function state() { return decode(engine._lc_state()); }
function fullResult() { return decode(engine._lc_export()); }
function number(value) { return value.toLocaleString(zh?'zh-TW':'en',{maximumFractionDigits:2,minimumFractionDigits:2}); }
function showError(code) { clientError=errors[code] || t('無法套用此設定，請檢查圖形與筆刷半徑。','Cannot apply these settings. Check the shape and brush radius.'); message(clientError); }
function annotations(s) {
  const key=JSON.stringify([s.revision,s.progress,s.view]);
  if(key===annotationKey) return;
  annotationKey=key;
  const svg=$('annotations'), ns='http://www.w3.org/2000/svg';
  svg.setAttribute('viewBox',`0 0 ${s.view.width} ${s.view.height}`);
  const fragment=document.createDocumentFragment();
  function element(tag,attributes,text) {
    const node=document.createElementNS(ns,tag);
    for(const [name,value] of Object.entries(attributes)) node.setAttribute(name,String(value));
    if(text!==undefined) node.textContent=text;
    fragment.append(node);
  }
  s.view.panels.forEach((panel,index)=>{
    element('text',{x:panel.x+14,y:panel.y+28,class:'demo-panel-heading'},index===0?(s.cornerZigzag?t('A. V 字形覆蓋法 · 逐角折返','A. V-shaped · corners in turn'):t('A. V 字形覆蓋法','A. V-shaped method')):t('B. 比較方法（2020）','B. Reference method (2020)'));
    panel.vertices.forEach((point,i)=>{
      element('circle',{cx:point.x,cy:point.y,r:5,'data-panel':index,'data-vertex':i});
      element('text',{x:point.labelX,y:point.labelY,class:'demo-vertex-label','data-panel':index,'data-vertex':i},i+1);
    });
    element('text',{x:panel.x+14,y:panel.y+panel.height-12,class:'demo-panel-count'},`${Math.min(s.progress,s.counts[index])} / ${s.counts[index]}`);
  });
  svg.replaceChildren(fragment);
}
function rebuildEditor() {
  const vertices=snapshot.improved.vertices, fragment=document.createDocumentFragment();
  vertices.forEach((vertex,i)=>{
    const row=document.createElement('div'); row.className='demo-vertex';
    const name=document.createElement('span'); name.textContent=`${t('頂點','Vertex')} ${i+1}`; row.append(name);
    for(let axis=0;axis<2;axis++) {
      const label=document.createElement('label'); label.textContent=axis===0?'x ':'y ';
      const input=document.createElement('input');
      Object.assign(input,{type:'number',min:axis===0?'20':'35',max:axis===0?'580':'445',step:'any',value:String(Number(vertex[axis].toFixed(3)))});
      input.dataset.vertex=String(i); input.dataset.axis=String(axis);
      input.setAttribute('aria-label',`${t('頂點','Vertex')} ${i+1}, ${axis===0?'x':'y'}`);
      if(axis===1 && vertices.length===4) input.addEventListener('input',()=>{
        const other=$('vertices').querySelector(`[data-vertex="${[1,0,3,2][i]}"][data-axis="1"]`);
        if(other) other.value=input.value;
      });
      label.append(input); row.append(label);
    }
    fragment.append(row);
  });
  $('vertices').replaceChildren(fragment);
}
function compareMetric(key,a,b) {
  const change=(b-a)/b*100;
  const tied=Math.abs(change)<1e-9;
  for(let i=0;i<2;i++) document.getElementById(`metric-${key}-${i}`).classList.toggle('demo-lower-value',!tied && (i===0?change>0:change<0));
  document.getElementById(`metric-${key}-comparison`).textContent=tied?t('與 B 相同','Same as B'):Math.abs(change)<0.005?t('與 B 差異小於 0.01%','Difference from B < 0.01%'):t(`較 B ${change>0?'減少':'增加'} ${number(Math.abs(change))}%`,`${number(Math.abs(change))}% ${change>0?'less':'more'} than B`);
}
function refresh() {
  if(!engine) return;
  const s=state();
  annotations(s);
  $('travel').checked=s.travel;
  if(s.revision!==revision) {
    clientError=''; caseNotice='';
    snapshot=fullResult(); revision=s.revision;
    $('case').value=String(s.sample); $('radius').value=String(snapshot.minimumRadius);
    $('precision').value=snapshot.precision==='continuous'?'0':'1';
    $('zigzag').checked=snapshot.cornerZigzag===true;
    if(snapshot.cornerZigzag) {
      const before=snapshot.perimeterFirstTotal, after=snapshot.improved.metrics.drawingLength+snapshot.improved.metrics.liftedLength;
      const change=(before-after)/before*100;
      $('zigzag-summary').textContent=t(`逐角折返：含抬筆的總移動 ${number(before)} → ${number(after)}，相對原順序${change>=0?'減少':'增加'} ${number(Math.abs(change))}%。`,`Corners in turn: total travel including lifts ${number(before)} → ${number(after)}, ${number(Math.abs(change))}% ${change>=0?'less':'more'} than the original order.`);
    } else $('zigzag-summary').textContent=t('目前覆蓋順序：先以最大筆刷沿內側繞一圈，再填補各角。','Current order: draw the initial perimeter, then fill the corners.');
    for(const [i,result] of [snapshot.improved,snapshot.reference].entries()) {
      document.getElementById(`metric-count-${i}`).textContent=String(result.strokes.length);
      document.getElementById(`metric-overlap-${i}`).textContent=`${number(result.metrics.overlapRatio*100)}%`;
      document.getElementById(`metric-perimeter-${i}`).textContent=number(result.metrics.perimeter);
      document.getElementById(`metric-drawing-length-${i}`).textContent=number(result.metrics.drawingLength);
      document.getElementById(`metric-drawing-${i}`).textContent=`${number(result.metrics.drawingRatio*100)}%`;
      document.getElementById(`metric-total-${i}`).textContent=`${number((result.metrics.drawingLength+result.metrics.liftedLength)/result.metrics.perimeter*100)}%`;
      document.getElementById(`metric-lifted-${i}`).textContent=number(result.metrics.liftedLength);
    }
    compareMetric('overlap',snapshot.improved.metrics.overlapRatio,snapshot.reference.metrics.overlapRatio);
    compareMetric('total',(snapshot.improved.metrics.drawingLength+snapshot.improved.metrics.liftedLength)/snapshot.improved.metrics.perimeter,(snapshot.reference.metrics.drawingLength+snapshot.reference.metrics.liftedLength)/snapshot.reference.metrics.perimeter);
    rebuildEditor();
  }
  $('progress').max=String(s.maximum); $('progress').value=String(s.progress);
  $('progress-text').textContent=`${s.progress} / ${s.maximum}`;
  $('play').textContent=s.playing?t('暫停','Pause'):t('播放','Play');
  $('play').setAttribute('aria-pressed',String(s.playing));
  $('back').disabled=s.progress===0; $('next').disabled=s.progress===s.maximum;
  $('step').textContent=s.current.map((stroke,i)=>`${i===0?'A':'B'}: ${stroke?`${stages[stroke.stage]}${stroke.corner>=0?` (${t('角','corner')} ${stroke.corner+1}${stroke.side>=0?`, ${t('側','side')} ${stroke.side+1}`:''})`:''}, r = ${number(stroke.radius)}`:t('尚未開始','Not started')}`).join(' · ');
  if(s.error) showError(s.error);
  else if(clientError) message(clientError);
  else message(caseNotice || t('已就緒。計算在你的瀏覽器執行，案例檔案不會上傳。','Ready. Computation runs in your browser; case files are not uploaded.'));
}
function finishAndRefresh() { clientError=''; engine._lc_seek(state().maximum); refresh(); }
function loadVertices(vertices,minimum,original,zigzag=$('zigzag').checked) {
  if(!Array.isArray(vertices) || ![3,4].includes(vertices.length) || !vertices.every(p=>Array.isArray(p)&&p.length===2&&p.every(v=>typeof v==='number'&&Number.isFinite(v)))) throw new Error('coordinates');
  if(!Number.isFinite(minimum) || minimum<1 || minimum>40) throw new Error('radius');
  const coordinates=new Float64Array(vertices.flat()), ptr=engine._malloc(coordinates.byteLength);
  if(!ptr) throw new Error('memory');
  try {
    engine.HEAPF64.set(coordinates,ptr/8);
    if(!engine._lc_load(ptr,vertices.length,minimum,original,zigzag?1:0)) throw new Error(state().error);
  } finally { engine._free(ptr); }
  finishAndRefresh();
}
async function start() {
  try {
    const {default:createLinecover}=await import('./linecover.js');
    engine=await createLinecover({canvas,print:()=>{},printErr:text=>console.error(text),onAbort:()=>message(t('示範執行中斷，請重新整理頁面。','The demonstration stopped. Reload the page.'))});
    document.title=pageTitle;
    groups.forEach(group=>{group.disabled=false;});
    const resizeCanvas=()=>{
      engine._lc_resize(Math.round($('canvas-wrap').clientWidth),Math.max(2,Math.min(3,window.devicePixelRatio||1)));
      refresh();
    };
    resize=new ResizeObserver(resizeCanvas); resize.observe($('canvas-wrap'));
    window.addEventListener('resize',resizeCanvas);
    $('apply').addEventListener('click',()=>{
      if(!$('radius').reportValidity()) return;
      try {
        const minimum=Number($('radius').value), original=Number($('precision').value), sample=Number($('case').value);
        if(sample===-1) loadVertices(snapshot.improved.vertices,minimum,original);
        else { if(!engine._lc_configure(sample,minimum,original,$('zigzag').checked?1:0)) throw new Error(state().error); finishAndRefresh(); }
      } catch(e) { showError(e.message); }
    });
    for(const kind of ['triangle','trapezoid']) $('random-'+kind).addEventListener('click',()=>{
      if(!$('radius').reportValidity()) return;
      const minimum=Number($('radius').value), original=Number($('precision').value);
      try {
        // Rejected candidates never replace the displayed case. Both methods must succeed.
        for(let attempt=0;attempt<128;attempt++) {
          try {
            loadVertices(randomVertices(kind),minimum,original);
            const shape=kind==='triangle'?t('三角形','triangle'):t('梯形','trapezoid');
            caseNotice=t(`已產生隨機${shape}，周長 ${number(snapshot.improved.metrics.perimeter)}。按「播放」觀察，或再次產生新圖形。`,`Random ${shape} generated; perimeter ${number(snapshot.improved.metrics.perimeter)}. Select Play to inspect it, or generate another shape.`);
            refresh();
            return;
          } catch(e) {
            if(!['brush_fit','degenerate','convex','step_limit'].includes(e.message)) throw e;
          }
        }
        throw new Error('random_shape');
      } catch(e) {showError(e.message);}
    });
    $('zigzag').addEventListener('change',()=>{
      if(!engine._lc_zigzag($('zigzag').checked?1:0)) { showError(state().error); return; }
      finishAndRefresh();
    });
    $('play').addEventListener('click',()=>{engine._lc_play(state().playing?0:1);refresh();});
    $('next').addEventListener('click',()=>{engine._lc_step(1);refresh();});
    $('back').addEventListener('click',()=>{engine._lc_step(-1);refresh();});
    $('reset').addEventListener('click',()=>{engine._lc_seek(0);refresh();});
    $('finish').addEventListener('click',finishAndRefresh);
    $('progress').addEventListener('input',()=>{engine._lc_seek(Number($('progress').value));refresh();});
    $('speed').addEventListener('change',()=>engine._lc_rate(Number($('speed').value)));
    $('identify').addEventListener('change',()=>{engine._lc_display($('identify').checked?1:0);refresh();});
    $('travel').addEventListener('change',()=>{engine._lc_travel($('travel').checked?1:0);refresh();});
    $('update-vertices').addEventListener('click',()=>{
      const inputs=[...$('vertices').querySelectorAll('input')];
      if(inputs.some(input=>!input.reportValidity() || input.value==='')) return;
      const vertices=Array.from({length:snapshot.improved.vertices.length},()=>[]);
      inputs.forEach(input=>{vertices[Number(input.dataset.vertex)][Number(input.dataset.axis)]=Number(input.value);});
      try {loadVertices(vertices,Number($('radius').value),Number($('precision').value));} catch(e) {showError(e.message);}
    });
    $('download').addEventListener('click',()=>{
      const url=URL.createObjectURL(new Blob([JSON.stringify(fullResult(),null,2)+'\n'],{type:'application/json'}));
      const a=document.createElement('a'); a.href=url; a.download='linecover-case.json'; a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    $('upload').addEventListener('change',async()=>{
      try {
        const file=$('upload').files[0]; if(!file) return; if(file.size>1024*1024) throw new Error('file');
        const data=JSON.parse(await file.text());
        const vertices=Array.isArray(data)?data:data.improved?.vertices || data.vertices;
        const minimum=Array.isArray(data)?Number($('radius').value):data.minimumRadius ?? Number($('radius').value);
        const precision=Array.isArray(data)?snapshot.precision:data.precision ?? snapshot.precision;
        if(!['continuous','original-radius-rules'].includes(precision)) throw new Error('precision');
        const zigzag=Array.isArray(data)?$('zigzag').checked:data.cornerZigzag ?? false;
        if(typeof zigzag!=='boolean') throw new Error('zigzag');
        loadVertices(vertices,minimum,precision==='original-radius-rules'?1:0,zigzag);
      } catch(e) {showError(e.message);} finally {$('upload').value='';}
    });
    // GLFW listens globally; canvas shortcuts must not intercept coordinate editing.
    window.addEventListener('keydown',event=>{
      if(document.activeElement!==canvas && ['Space','ArrowLeft','ArrowRight','KeyR','KeyC','Escape'].includes(event.code)) event.stopImmediatePropagation();
      if(document.activeElement===canvas && ['Space','ArrowLeft','ArrowRight'].includes(event.code)) event.preventDefault();
    },true);
    canvas.addEventListener('pointerdown',()=>canvas.focus({preventScroll:true}));
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();engine._lc_play(0);groups.forEach(g=>{g.disabled=true;});message(t('圖形環境已中斷，請重新整理頁面。','The graphics context was lost. Reload the page.'));clearInterval(timer);});
    finishAndRefresh(); timer=setInterval(refresh,100);
  } catch(e) {
    console.error(e); groups.forEach(group=>{group.disabled=true;});
    message(t('無法載入示範。請確認瀏覽器支援 WebAssembly 與 WebGL，或改閱論文介紹頁。','Could not load the demonstration. Check WebAssembly and WebGL support, or read the research page.'));
  }
}
start();
