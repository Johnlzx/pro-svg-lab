(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const defaults={blur:7.3,grain:.12,period:4.4,palette:'original',stage:5,warp:0,light:0,intro:true};
  let state={...defaults},paused=matchMedia('(prefers-reduced-motion: reduce)').matches,svg;
  const stages=[['字形','路径决定结构；它不会随动画形变。'],['灰度轮廓','三个尺度的内边缘叠加，形成明暗坡度。'],['移动扫描','灰度渐变在移动，字形仍然固定。'],['柔化场','高斯模糊建立连续的灰度过渡。'],['颗粒调制','细噪声乘入灰度场，给色带增加质感。'],['色谱映射','深蓝 → 青 → 奶黄 → 橙红 → 洋红 → 白']];
  function render(time) {
    const t=time??svg?.getCurrentTime()??0;
    $('#art').innerHTML=SVGMaterial.create({...state,id:'live'});
    svg=$('#art svg');svg.setCurrentTime(t);if(paused)svg.pauseAnimations();
    $('#stage-label').textContent=`0${state.stage+1} / ${stages[state.stage][0]}`;
    $('#stage-caption').textContent=stages[state.stage][1];
    $('#render-tag').textContent=state.warp||state.light?'SVG + SMIL · 扩展材质':'SVG + SMIL · 原生循环';
    document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.stage===state.stage)));
    document.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===state.palette)));
    for(const key of ['blur','grain','period','warp','light']){
      $('#'+key).value=state[key];$('#'+key+'-value').textContent=state[key]+(key==='period'?'s':'');
    }
    $('#intro-toggle').checked=state.intro;$('#time').max=state.period;
    updatePlay();updateClock();
  }
  function updatePlay(){ $('#play').textContent=paused?'▶':'Ⅱ';$('#play').setAttribute('aria-label',paused?'播放动画':'暂停动画'); }
  function updateClock(){
    const t=svg.getCurrentTime()%state.period;
    $('#time').value=t;$('#clock').textContent=`${t.toFixed(2)} / ${state.period.toFixed(2)}s`;
  }
  function setPaused(value){paused=value;paused?svg.pauseAnimations():svg.unpauseAnimations();updatePlay();updateClock();}
  $('#play').addEventListener('click',()=>setPaused(!paused));
  $('#replay').addEventListener('click',()=>{svg.setCurrentTime(0);setPaused(false);});
  $('#time').addEventListener('input',e=>{
    const requested=+e.target.value;
    const cycle=Math.floor(svg.getCurrentTime()/state.period);
    setPaused(true);svg.setCurrentTime(cycle*state.period+requested);updateClock();
  });
  document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{state.stage=+b.dataset.stage;render();}));
  document.querySelectorAll('[data-palette]').forEach(b=>b.addEventListener('click',()=>{state.palette=b.dataset.palette;state.stage=5;render();}));
  for(const key of ['blur','grain','period','warp','light'])$('#'+key).addEventListener('input',e=>{
    const t=svg.getCurrentTime(),previous=state.period;
    state[key]=+e.target.value;if(key==='warp'||key==='light')state.stage=5;
    render(key==='period'?t*state.period/previous:t);
  });
  $('#intro-toggle').addEventListener('change',e=>{state.intro=e.target.checked;render(0);});
  $('#reset').addEventListener('click',()=>{state={...defaults};render(0);$('#status').textContent='已还原默认参数';});
  $('#download').addEventListener('click',()=>{
    const content=SVGMaterial.create({...state,stage:5,id:'pro-export'});
    const url=URL.createObjectURL(new Blob([content],{type:'image/svg+xml'}));
    const a=document.createElement('a');a.href=url;a.download=`pro-${state.palette}.svg`;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
    $('#status').textContent=`已导出完整材质 · ${(new Blob([content]).size/1024).toFixed(1)} KiB · 无 JavaScript`;
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)svg.pauseAnimations();else if(!paused)svg.unpauseAnimations();});
  render(paused?2.2:0);
  // This loop updates the inspector clock only. SVG/SMIL renders the material itself.
  let last=0;function tick(now){if(now-last>80&&!document.hidden){updateClock();last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);
  // Deterministic QA hook; useful for comparing reference timestamps.
  window.lab={seek(t){setPaused(true);svg.setCurrentTime(t);updateClock();},set(patch){state={...state,...patch};render();},get state(){return {...state}},get svg(){return svg}};
})();
