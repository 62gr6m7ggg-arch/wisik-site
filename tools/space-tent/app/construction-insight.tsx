'use client';
import Geometry from './geometry';
import {WORKED_SECTION} from './insight-scenes';

export default function ConstructionInsight(){
 return <div className="construction-insight"><h3>Waarom mag je die evenwijdige lijn tekenen?</h3><p>Een uitgewerkt voorbeeld met andere puntposities dan je opgave.</p><Geometry fixed points={WORKED_SECTION} planes={[["A","B","F","E"],["D","C","G","H"]]} highlights={['PQ','SR']} segments={[{from:WORKED_SECTION.Q,to:WORKED_SECTION.R,color:'#a5bbca'},{from:WORKED_SECTION.S,to:WORKED_SECTION.P,color:'#a5bbca'}]} caption="Voorvlak en achtervlak zijn evenwijdig. PQ en SR horen bij één en hetzelfde snijvlak."/><p>Het vlak door P, Q en R snijdt het voorvlak langs PQ. Het snijdt het evenwijdige achtervlak langs een lijn met dezelfde richting: SR. Daarom construeer je door R een lijn evenwijdig aan PQ. Het snijpunt met DH levert S.</p></div>
}
