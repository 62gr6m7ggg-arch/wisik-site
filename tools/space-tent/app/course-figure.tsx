'use client';
import Geometry from './geometry';
import type {Scene} from './model';
export default function CourseFigure({scene,guidance,fixed=false,selected=[],selectable=[],onPoint,onExplore}:{scene:Scene;guidance?:boolean;fixed?:boolean;selected?:string[];selectable?:string[];onPoint?:(p:string)=>void;onExplore?:()=>void}){
 return <Geometry {...scene} guidance={guidance} view={scene.view==='side'?'right':scene.view} fitToContent fixed={fixed} selected={selected} selectable={selectable} onPoint={onPoint} onExplore={onExplore}/>;
}
