/** Navigation preference only. Never grants learning evidence, XP or passed levels. */
export const ENTRY_CHOICE_KEY='wisik-space-entry-v1';
export type EntryChoice={format:'wisik-space-entry';version:1;level:number};
type StorageAccess=()=>Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export function isEntryLevel(level:unknown):level is number{return typeof level==='number'&&Number.isInteger(level)&&level>=1&&level<=7}
export function readEntryChoice(access:StorageAccess):EntryChoice|null{
 try{const raw=access().getItem(ENTRY_CHOICE_KEY);if(!raw||raw.length>256)return null;const x=JSON.parse(raw);return x&&x.format==='wisik-space-entry'&&x.version===1&&isEntryLevel(x.level)?{format:'wisik-space-entry',version:1,level:x.level}:null}catch{return null}
}
export function writeEntryChoice(access:StorageAccess,level:number|null):boolean{
 try{if(level!==null&&!isEntryLevel(level))return false;const storage=access();if(level===null)storage.removeItem(ENTRY_CHOICE_KEY);else storage.setItem(ENTRY_CHOICE_KEY,JSON.stringify({format:'wisik-space-entry',version:1,level}));return true}catch{return false}
}
export function canEnterLevel(level:number,levels:Record<number,{passed:boolean}>,free:boolean):boolean{
 return isEntryLevel(level)&&(free||level===1||levels[level-1]?.passed===true);
}
