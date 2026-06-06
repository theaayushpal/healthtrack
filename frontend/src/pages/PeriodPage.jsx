import { useState } from 'react';
import { usePartners } from '../hooks/usePartners';
import { Card, Spinner, Avatar } from '../components/ui';
import PeriodCard from '../components/period/PeriodCard';

export default function PeriodPage() {
  const { data:partners=[], isLoading } = usePartners();
  const tracked = partners.filter(p=>p.periodTrack);
  const [selId, setSelId] = useState(null);
  const active = selId ? tracked.find(p=>p._id===selId) : tracked[0] || null;

  if(isLoading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin"/></div>;

  if(tracked.length===0) return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="text-5xl mb-4">🩸</div>
      <h3 className="text-xl font-bold text-white mb-2" style={{fontFamily:"'Syne',sans-serif"}}>No Cycle Tracking</h3>
      <p className="text-gray-400 text-sm max-w-xs">Enable menstrual cycle tracking in a partner's profile to see predictions here.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>Period Tracker 🩸</h1>
        <p className="text-gray-400 text-sm mt-1">Cycle predictions & fertility windows</p>
      </div>

      {tracked.length>1&&(
        <div className="flex gap-2 flex-wrap">
          {tracked.map(p=>(
            <button key={p._id} onClick={()=>setSelId(p._id)}
              className={'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all '+(active?._id===p._id?'text-white border':'border border-[#2A2A45] text-gray-400 hover:text-white')}
              style={active?._id===p._id?{background:p.color+'22',border:'1px solid '+p.color+'66',color:p.color}:{}}>
              <Avatar name={p.name} color={p.color} size={22}/>
              {p.name}
            </button>
          ))}
        </div>
      )}

      {active&&(
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <Avatar name={active.name} color={active.color} size={48}/>
            <div>
              <h2 className="font-bold text-white text-lg" style={{fontFamily:"'Syne',sans-serif"}}>{active.name}</h2>
              {active.nickname&&<p className="text-xs text-gray-400">"{active.nickname}"</p>}
              <p className="text-xs text-gray-500 mt-0.5">{active.avgCycleLen}-day average cycle</p>
            </div>
          </div>
          <PeriodCard partner={active}/>
        </Card>
      )}
    </div>
  );
}
