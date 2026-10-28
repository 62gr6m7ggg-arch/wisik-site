// Vaste interne route; de oorspronkelijke inhoud en volgorde blijven ongewijzigd.
(()=>{
 const allowed=['A1','A2a','A2b','A3a','A3b','A4a','A4b','A5a','A5b','A6a','A6b','D1','D2a','D2b','D3a','D3b','D4','D5a','D5b','D6a','D6b'];
 const id=new URLSearchParams(location.search).get('oefening');
 if(!allowed.includes(id))return;
 const banner=document.createElement('div');banner.className='exercise-return';
 const a=document.createElement('a');a.href='/apps/meetkunde/#'+id;a.textContent='← Terug naar mijn opgave '+id;
 const text=document.createElement('span');text.textContent='Je notities en uitlegstap blijven in het oefenatelier bewaard.';
 banner.append(a,text);document.querySelector('.topbar').after(banner);
})();
