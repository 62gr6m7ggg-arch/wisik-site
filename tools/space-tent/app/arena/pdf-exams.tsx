const PDF_EXAMS = [
  {letter:'A',pages:14,points:56,size:'6,1',theme:'Lijnen, kubusdoorsneden en afstanden tot vlakken; een zeszijdige piramide.'},
  {letter:'B',pages:12,points:56,size:'6,3',theme:'Torenspits, prisma, afgeknotte piramide, staalconstructie en vlakhoeken.'},
  {letter:'C',pages:15,points:58,size:'6,2',theme:'Vlakken in een kubus, hoeken in een balk, piramides en loodrechte projectie.'},
  {letter:'D',pages:12,points:56,size:'6,3',theme:'Doorsneden op ware grootte, prismahoeken en afstanden tussen kruisende lijnen.'},
] as const;

export default function PdfExams({locked=false}:{locked?:boolean}){
  return <section className="arena-pdf-exams" aria-labelledby="arena-pdf-title">
    <span className="arena-eyebrow">OEFENEN OP PAPIER</span>
    <h2 id="arena-pdf-title">Oefententamens A, B, C en D</h2>
    {locked?<p className="arena-notice">De PDF’s bevatten uitwerkingen achterin. Rond je lopende zelfstandige poging eerst af om ze te openen.</p>:<>
      <p>Vier zelfstandig samengestelde oefententamens Ruimtemeetkunde 1, met bronvermeldingen, werkbladen en uitwerkingen achterin. Dit zijn geen officiële HAN-toetsen. De richttijd van 150 minuten is een oefenkeuze; controleer de duur en stof van je eigen tentamen.</p>
      <p className="arena-source-note">Maak de opgaven eerst op papier en bekijk daarna de uitwerkingen. Deze PDF’s gebruik je los van de twee digitale oefenroutes; er wordt geen Arena-poging of score voor opgeslagen.</p>
      <div className="arena-pdf-grid">
        {PDF_EXAMS.map(({letter,pages,points,size,theme})=>{
          const file=`Ruimtemeetkunde_1_Oefententamen_${letter}.pdf`;
          const href=`/apps/ruimteklaar/tentamenarena/${file}`;
          return <article className="arena-pdf-card" key={letter} data-exam-id={letter} aria-labelledby={`arena-pdf-${letter}`}>
            <span className="arena-pdf-letter" aria-hidden="true">{letter}</span>
            <h3 id={`arena-pdf-${letter}`}>Oefententamen {letter}</h3>
            <p className="arena-pdf-theme">{theme}</p>
            <p className="arena-pdf-meta">5 opgaven · {points} punten<br/>{pages} pagina’s · PDF · {size} MB<br/>Richttijd: 150 minuten</p>
            <div className="arena-pdf-actions">
              <a className="arena-pdf-open" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open oefententamen ${letter} als PDF (nieuw tabblad)`}>Open PDF <span aria-hidden="true">↗</span></a>
              <a href={href} download={file} aria-label={`Download oefententamen ${letter} als PDF`}>Download PDF</a>
            </div>
          </article>;
        })}
      </div>
    </>}
  </section>;
}
