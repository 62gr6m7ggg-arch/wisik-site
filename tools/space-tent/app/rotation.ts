export const hasDragged=(dx:number,dy:number)=>Math.hypot(dx,dy)>=6;
export function dragCamera(start:[number,number],dx:number,dy:number):[number,number]{
 return [((start[0]+dx*.45+180)%360+360)%360-180,Math.max(-80,Math.min(80,start[1]-dy*.35))];
}
