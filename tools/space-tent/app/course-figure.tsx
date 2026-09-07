'use client';
import Geometry from './geometry';
import type {Scene} from './model';
export default function CourseFigure({scene,fixed=false,selected=[],selectable=[],onPoint,onExplore}:{scene:Scene;fixed?:boolean;selected?:string[];selectable?:string[];onPoint?:(p:string)=>void;onExplore?:()=>void}){
 return <Geometry {...scene} view={scene.view==='side'?'right':scene.view} fitToContent fixed={fixed} selected={selected} selectable={selectable} onPoint={onPoint} onExplore={onExplore}/>;
}
