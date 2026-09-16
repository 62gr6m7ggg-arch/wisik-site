import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
export function createVariationContext(html){
  const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1];
  if(!script)throw new Error('Pabo inline script missing');
  const elements=new Map(),storage=new Map(),makeElement=()=>new Proxy({innerHTML:'',textContent:'',value:'',style:{setProperty(){},removeProperty(){}},dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},addEventListener(){},appendChild(){},remove(){},setAttribute(){},removeAttribute(){},focus(){},getContext(){return null},querySelector(){return null},querySelectorAll(){return []}}, {get:(t,k)=>k in t?t[k]:''});
  const body=makeElement();
  const context={console,Math:Object.assign(Object.create(Math),{random:Math.random}),Date,JSON,Object,Array,Number,String,Boolean,RegExp,Map,Set,Error,URL,URLSearchParams,TextEncoder,crypto:webcrypto,performance:{now:()=>Date.now()},location:{search:'',href:'https://wisik.nl/apps/pabo-rekenklaar/'},document:{body,documentElement:body,scripts:[{textContent:script}],getElementById(id){if(!elements.has(id))elements.set(id,makeElement());return elements.get(id)},querySelector(){return body},querySelectorAll(){return []},createElement:makeElement,addEventListener(){}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},sessionStorage:{getItem(){return null},setItem(){}},navigator:{},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},requestAnimationFrame(){},cancelAnimationFrame(){},confirm(){return true},speechSynthesis:{cancel(){}},SpeechSynthesisUtterance(){},AudioContext(){},addEventListener(){},scrollTo(){}};
  context.window=context;vm.createContext(context);vm.runInContext(script,context,{timeout:20000});return context;
}
export function runVariationExpression(context,expression,timeout=120000){return JSON.parse(JSON.stringify(vm.runInContext(expression,context,{timeout})))}
