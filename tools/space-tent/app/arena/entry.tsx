import {Component,Suspense,lazy,type ReactNode} from 'react';
const Arena=lazy(()=>import('./arena'));
class ArenaBoundary extends Component<{children:ReactNode;onClose:()=>void},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<section role="alert" style={{position:'fixed',inset:'20% 10%',zIndex:1000,background:'#112633',color:'#edf7f8',padding:24,border:'2px solid #f0b879',borderRadius:12}}><h2>De Tentamenarena kon niet worden geopend.</h2><p>Je bestaande Spacetent en cursusvoortgang zijn niet vervangen. Sluit dit venster en laad de pagina opnieuw voordat je het nogmaals probeert.</p><button type="button" onClick={this.props.onClose}>Terug naar Spacetent</button></section>:this.props.children;}
}
export default function ArenaEntry({open,onClose,onStudy}:{open:boolean;onClose:()=>void;onStudy:(id:string)=>void}){
 if(!open)return null;
 return <ArenaBoundary onClose={onClose}><Suspense fallback={<section role="status" style={{position:'fixed',inset:'30% 12%',zIndex:1000,background:'#112633',color:'#edf7f8',padding:24,border:'1px solid #53707c',borderRadius:12}}><p>Tentamenarena laden…</p><button type="button" onClick={onClose}>Terug naar Spacetent</button></section>}><Arena onClose={onClose} onStudy={onStudy}/></Suspense></ArenaBoundary>;
}
