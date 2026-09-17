/* Sorting: pointer capture on the handle only; buttons and keyboard are equivalent. */
let orderDragState=null;
function orderCanMove(){return Boolean(activeSession&&!activeSession.answered&&!activeSession.finished&&activeSession.current?.type==="order"&&Array.isArray(activeSession.order))}
function orderItemMarkup(item,i){
  const locked=!orderCanMove(),last=(activeSession?.order?.length||0)-1,label=escapeHtml(item);
  return `<div class="order-item" draggable="false" data-order-index="${i}"><button type="button" class="drag-handle" data-order-handle="${i}" aria-label="Verplaats ${label}; gebruik pijl omhoog of omlaag" aria-describedby="orderHelp" ${locked?"disabled":""}><span aria-hidden="true">☰</span></button><strong>${label}</strong><span class="order-controls"><button type="button" data-move="up" data-index="${i}" aria-label="${label} omhoog" ${locked||i===0?"disabled":""}>↑</button><button type="button" data-move="down" data-index="${i}" aria-label="${label} omlaag" ${locked||i===last?"disabled":""}>↓</button></span></div>`;
}
function renderOrderList(focusIndex=null,focusKind="handle"){
  const list=document.getElementById("orderList");if(!list||!activeSession?.order)return;
  list.innerHTML=activeSession.order.map((item,i)=>orderItemMarkup(item,i)).join("");
  if(focusIndex!==null){const row=list.querySelector(`[data-order-index="${focusIndex}"]`),wanted=focusKind==="handle"?row?.querySelector(".drag-handle"):row?.querySelector(`[data-move="${focusKind}"]:not(:disabled)`);(wanted||row?.querySelector(".drag-handle"))?.focus({preventScroll:true})}
}
function orderMoveTo(from,to,focusKind="handle"){
  if(!orderCanMove()||!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=activeSession.order.length||to<0||to>=activeSession.order.length)return false;
  const item=activeSession.order[from];activeSession.order=arrayMove(activeSession.order,from,to);renderOrderList(to,focusKind);
  const status=document.getElementById("orderStatus");if(status)status.textContent=`${item} staat op plaats ${to+1} van ${activeSession.order.length}.`;return true;
}
function moveOrderItem(index,direction){cancelOrderDrag();orderMoveTo(index,direction==="up"?index-1:index+1,direction)}
function clearOrderTargets(){document.querySelectorAll(".order-item[data-drop-position]").forEach(row=>row.removeAttribute("data-drop-position"))}
function updateOrderDrag(){
  const s=orderDragState;if(!s)return;
  if(!orderCanMove()||s.session!==activeSession||s.question!==activeSession.current||!s.handle.isConnected){cancelOrderDrag();return}
  s.ghost.style.top=`${s.y-s.offsetY}px`;
  const others=[...s.list.querySelectorAll(".order-item")].filter(row=>Number(row.dataset.orderIndex)!==s.from);
  s.to=others.filter(row=>{const r=row.getBoundingClientRect();return s.y>r.top+r.height/2}).length;
  clearOrderTargets();const target=others[s.to]||others.at(-1);if(target)target.dataset.dropPosition=s.to<others.length?"before":"after";
}
function orderDragScroll(){
  const s=orderDragState;if(!s)return;
  const topbar=document.querySelector(".topbar"),top=Math.min(window.innerHeight/2,(topbar?.getBoundingClientRect().bottom||0)+35),bottom=window.innerHeight-55;
  if(s.y<top)window.scrollBy(0,-Math.min(14,(top-s.y)/3));else if(s.y>bottom)window.scrollBy(0,Math.min(14,(s.y-bottom)/3));
  updateOrderDrag();if(orderDragState)orderDragState.frame=requestAnimationFrame(orderDragScroll);
}
function startOrderDrag(e){
  const handle=e.target.closest?.("[data-order-handle]");if(!handle||handle.disabled||!orderCanMove()||orderDragState||e.isPrimary===false||(e.pointerType==="mouse"&&e.button!==0))return;
  const row=handle.closest(".order-item"),list=handle.closest("#orderList");if(!row||!list)return;
  e.preventDefault();handle.focus({preventScroll:true});const rect=row.getBoundingClientRect(),ghost=row.cloneNode(true);
  ghost.classList.add("order-drag-ghost");ghost.setAttribute("aria-hidden","true");ghost.removeAttribute("data-order-index");ghost.querySelectorAll("button").forEach(button=>{button.disabled=true;button.tabIndex=-1});
  Object.assign(ghost.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`});document.body.appendChild(ghost);row.classList.add("dragging");
  orderDragState={pointerId:e.pointerId,from:Number(handle.dataset.orderHandle),to:Number(handle.dataset.orderHandle),x:e.clientX,y:e.clientY,offsetY:e.clientY-rect.top,handle,row,list,ghost,session:activeSession,question:activeSession.current,frame:null};
  try{handle.setPointerCapture(e.pointerId)}catch(error){/* Synthetic test events have no active pointer; document listeners still work. */}
  updateOrderDrag();orderDragState.frame=requestAnimationFrame(orderDragScroll);
}
function moveOrderDrag(e){const s=orderDragState;if(!s||e.pointerId!==s.pointerId)return;e.preventDefault();s.x=e.clientX;s.y=e.clientY;updateOrderDrag()}
function cancelOrderDrag(){
  const s=orderDragState;if(!s)return;orderDragState=null;cancelAnimationFrame(s.frame);s.row.classList.remove("dragging");s.ghost.remove();clearOrderTargets();
  try{if(s.handle.hasPointerCapture(s.pointerId))s.handle.releasePointerCapture(s.pointerId)}catch(error){/* Capture may already have ended on cancellation. */}
}
function endOrderDrag(e){
  const s=orderDragState;if(!s||e.pointerId!==s.pointerId)return;e.preventDefault();s.x=e.clientX;s.y=e.clientY;updateOrderDrag();
  if(!orderDragState)return;
  const bounds=s.list.getBoundingClientRect(),inside=s.x>=bounds.left-30&&s.x<=bounds.right+30&&s.y>=bounds.top-45&&s.y<=bounds.bottom+45,valid=inside&&s.session===activeSession&&s.question===activeSession?.current&&orderCanMove();
  cancelOrderDrag();if(valid)orderMoveTo(s.from,s.to);else s.handle.focus({preventScroll:true});
}
function bindOrderPointer(){
  document.addEventListener("pointerdown",startOrderDrag,{passive:false});document.addEventListener("pointermove",moveOrderDrag,{passive:false});document.addEventListener("pointerup",endOrderDrag,{passive:false});
  document.addEventListener("pointercancel",e=>{if(orderDragState?.pointerId===e.pointerId)cancelOrderDrag()});
  document.addEventListener("lostpointercapture",e=>{if(orderDragState?.pointerId===e.pointerId)cancelOrderDrag()});
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&orderDragState){e.preventDefault();const handle=orderDragState.handle;cancelOrderDrag();handle.focus({preventScroll:true});return}
    const handle=e.target.closest?.("[data-order-handle]");if(!handle||!["ArrowUp","ArrowDown"].includes(e.key)||!orderCanMove())return;
    e.preventDefault();const from=Number(handle.dataset.orderHandle);cancelOrderDrag();orderMoveTo(from,from+(e.key==="ArrowUp"?-1:1));
  });
  window.addEventListener("blur",cancelOrderDrag);window.addEventListener("pagehide",cancelOrderDrag);window.addEventListener("resize",cancelOrderDrag);
}
