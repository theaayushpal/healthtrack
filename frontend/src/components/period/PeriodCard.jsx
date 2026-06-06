export default function PeriodCard({ partner }) {
  if (!partner?.periodTrack || !partner?.lastPeriodStart)
    return <div className="text-center py-10 text-gray-500"><div className="text-4xl mb-3">🩸</div><p>Period tracking not enabled. Edit partner profile to enable it.</p></div>;
  const cycle=partner.avgCycleLen||28, last=new Date(partner.lastPeriodStart+'T00:00:00'), today=new Date();
  today.setHours(0,0,0,0);
  const daysSince=Math.floor((today-last)/86400000), dayInCycle=(daysSince%cycle)+1, ovDay=Math.round(cycle/2);
  const fertile=dayInCycle>=ovDay-3&&dayInCycle<=ovDay+2;
  const nextStart=new Date(last.getTime()+(Math.floor(daysSince/cycle)+1)*cycle*86400000);
  const daysToNext=Math.max(0,Math.round((nextStart-today)/86400000));
  const phases=[
    {name:'Menstruation',days:'1–5',color:'#F87171',icon:'🩸',desc:'Period days',active:dayInCycle<=5},
    {name:'Follicular',days:'6–13',color:'#FBBF24',icon:'🌱',desc:'Rising energy',active:dayInCycle>=6&&dayInCycle<=13},
    {name:'Ovulation',days:'~'+ovDay,color:'#34D399',icon:'🌸',desc:'Peak fertility',active:Math.abs(dayInCycle-ovDay)<=1},
    {name:'Luteal',days:(ovDay+2)+'–'+cycle,color:'#A78BFA',icon:'🌙',desc:'Wind-down',active:dayInCycle>ovDay+1},
  ];
  const current=phases.find(p=>p.active)||phases[3];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{l:'Day in Cycle',v:dayInCycle,s:'of '+cycle,c:'#A78BFA'},{l:'Days to Period',v:daysToNext,s:nextStart.toLocaleDateString('en-IN',{day:'numeric',month:'short'}),c:'#F87171'},{l:'Fertile Window',v:fertile?'Yes':'No',c:fertile?'#34D399':'#4B5563'}].map(x=>(
          <div key={x.l} className="text-center p-3 rounded-xl bg-white/3 border border-[#2A2A45]">
            <div className="text-2xl font-bold" style={{color:x.c,fontFamily:"'Syne',sans-serif"}}>{x.v}</div>
            <div className="text-xs text-gray-500 mt-1">{x.l}</div>
            {x.s&&<div className="text-xs text-gray-600">{x.s}</div>}
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">Cycle Progress</span>
          <span className="font-semibold" style={{color:current.color}}>{current.name} · Day {dayInCycle}</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#2A2A45] overflow-hidden">
          <div className="h-full rounded-full" style={{width:((dayInCycle-1)/cycle*100)+'%',background:current.color,transition:'width .6s'}}/>
        </div>
      </div>
      {fertile&&<div className="p-3 rounded-xl text-sm font-semibold text-green-400" style={{background:'#34D39915',border:'1px solid #34D39933'}}>🌸 Currently in fertile window — ovulation around day {ovDay}</div>}
      <div className="p-3 rounded-xl text-sm" style={{background:'#F871711A',border:'1px solid #F8717133'}}>
        <span className="text-gray-400">Next period: </span>
        <span className="font-semibold text-white">{nextStart.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
        <span className="text-gray-400"> ({daysToNext} days)</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {phases.map(ph=>(
          <div key={ph.name} className="p-3 rounded-xl" style={{border:ph.active?'2px solid '+ph.color+'44':'1px solid #2A2A45',background:ph.active?ph.color+'14':'rgba(255,255,255,.02)'}}>
            <div className="flex items-center gap-1.5 mb-1">
              <span>{ph.icon}</span>
              <span className="text-xs font-bold" style={{color:ph.active?ph.color:'#8B8BAD'}}>{ph.name}</span>
              {ph.active&&<span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:ph.color+'33',color:ph.color}}>NOW</span>}
            </div>
            <div className="text-[10px] text-gray-600">Days {ph.days} · {ph.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
