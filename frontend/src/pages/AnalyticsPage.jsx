import { useState } from 'react';
import { useStats } from '../hooks/useStats';
import { useSessions } from '../hooks/useSessions';
import { usePartners } from '../hooks/usePartners';
import { Card, StatCard, Spinner } from '../components/ui';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#6C63FF','#FF6584','#43BCCD','#F9C74F','#90BE6D','#F8961E'];
const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return <div className="bg-[#16162A] border border-[#2A2A45] rounded-xl px-3 py-2 text-xs shadow-xl"><div className="text-gray-400 mb-1">{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||'#fff'}}>{p.name}: <b>{p.value}</b></div>)}</div>;
};

export default function AnalyticsPage() {
  const { data:stats, isLoading } = useStats();
  const { data:sessions=[] }     = useSessions();
  const { data:partners=[] }     = usePartners();
  const [filterPid, setFilterPid] = useState('');
  const filtered = filterPid ? sessions.filter(s=>(s.partner?._id||s.partner)===filterPid) : sessions;

  if(isLoading) return <Spinner/>;
  if(!sessions.length) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="text-5xl mb-4">📊</div>
      <h3 className="text-xl font-bold text-white mb-2" style={{fontFamily:"'Syne',sans-serif"}}>No Data Yet</h3>
      <p className="text-gray-400 text-sm">Log some sessions to see your analytics.</p>
    </div>
  );

  const totalCal  = filtered.reduce((a,b)=>a+(b.calories||0),0);
  const avgDur    = filtered.length ? Math.round(filtered.reduce((a,b)=>a+(b.durationMin||0),0)/filtered.length) : 0;
  const avgRating = filtered.length ? (filtered.reduce((a,b)=>a+(b.rating||3),0)/filtered.length).toFixed(1) : 0;

  // Intensity pie
  const intensityData = [
    {name:'Light',  value:filtered.filter(s=>s.intensity==='light').length,  color:'#43BCCD'},
    {name:'Medium', value:filtered.filter(s=>s.intensity==='medium').length, color:'#6C63FF'},
    {name:'Intense',value:filtered.filter(s=>s.intensity==='intense').length,color:'#FF6584'},
  ].filter(x=>x.value>0);

  // Mood bar
  const moodMap={};
  filtered.forEach(s=>{ moodMap[s.mood]=(moodMap[s.mood]||0)+1; });
  const moodData = Object.entries(moodMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([mood,count])=>({mood:mood.slice(0,8),count}));

  // Top positions
  const posMap={};
  filtered.forEach(s=>(s.positions||[]).forEach(p=>{ posMap[p]=(posMap[p]||0)+1; }));
  const topPos = Object.entries(posMap).sort((a,b)=>b[1]-a[1]).slice(0,6);

  // Radar
  const radarData = [
    {subject:'Physical', A:Math.min(filtered.filter(s=>s.intensity==='intense').length*15+20,100)},
    {subject:'Mental',   A:Math.min(filtered.filter(s=>s.mentalTags?.includes('Emotionally Connected')).length*15+20,100)},
    {subject:'Safety',   A:Math.min(filtered.filter(s=>s.healthTags?.includes('Safe')||s.healthTags?.includes('Condom')).length*15+20,100)},
    {subject:'Duration', A:Math.min(avgDur*1.5,100)},
    {subject:'Rating',   A:(+avgRating)*20},
    {subject:'Connect',  A:filtered.reduce((a,b)=>a+(b.connectionLevel||5),0)/Math.max(filtered.length,1)*10},
  ];

  const selfO    = filtered.filter(s=>s.orgasm?.self).length;
  const partnerO = filtered.filter(s=>s.orgasm?.partner).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>Analytics 📊</h1>
          <p className="text-gray-400 text-sm mt-1">Health insights & trends</p>
        </div>
        <select value={filterPid} onChange={e=>setFilterPid(e.target.value)} className="!w-auto bg-[#16162A] border border-[#2A2A45] rounded-xl text-sm text-gray-300 px-3 py-2">
          <option value="">All Partners</option>
          {partners.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="📋" label="Sessions"    value={filtered.length}                color="#6C63FF"/>
        <StatCard icon="🔥" label="Calories"    value={totalCal.toLocaleString()} sub="kcal" color="#F9C74F"/>
        <StatCard icon="⏱"  label="Avg Duration" value={avgDur+'m'}               color="#43BCCD"/>
        <StatCard icon="⭐" label="Avg Rating"   value={avgRating+'★'}              color="#90BE6D"/>
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-2 gap-5">
        {stats?.monthly?.length>0&&(
          <Card>
            <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Monthly Sessions</h3>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={stats.monthly}>
                <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6C63FF" stopOpacity={.25}/>
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                </linearGradient></defs>
                <XAxis dataKey="label" tick={{fontSize:10,fill:'#555'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#555'}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="count" name="Sessions" stroke="#6C63FF" strokeWidth={2} fill="url(#ga)"/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}
        {stats?.monthly?.length>0&&(
          <Card>
            <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Monthly Calories</h3>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={stats.monthly}>
                <XAxis dataKey="label" tick={{fontSize:10,fill:'#555'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#555'}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="calories" name="Calories" fill="#F9C74F" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-3 gap-5">
        {intensityData.length>0&&(
          <Card>
            <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Intensity Split</h3>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={intensityData} cx="50%" cy="50%" outerRadius={60} dataKey="value"
                  label={({name,percent})=>name+' '+Math.round(percent*100)+'%'} labelLine={false} fontSize={10}>
                  {intensityData.map((x,i)=><Cell key={i} fill={x.color}/>)}
                </Pie>
                <Tooltip content={<Tip/>}/>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
        {moodData.length>0&&(
          <Card>
            <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Mood Distribution</h3>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={moodData} layout="vertical">
                <XAxis type="number" tick={{fontSize:9,fill:'#555'}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="mood" tick={{fontSize:9,fill:'#aaa'}} axisLine={false} tickLine={false} width={50}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="count" name="Count" fill="#FF6584" radius={[0,4,4,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
        <Card>
          <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Orgasm Rates</h3>
          <div className="space-y-4 mt-2">
            {[{label:'You',color:'#6C63FF',pct:filtered.length?Math.round(selfO/filtered.length*100):0},
              {label:'Partner',color:'#FF6584',pct:filtered.length?Math.round(partnerO/filtered.length*100):0}].map(x=>(
              <div key={x.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300">{x.label}</span>
                  <span className="font-bold" style={{color:x.color}}>{x.pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#2A2A45] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{width:x.pct+'%',background:x.color}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 rounded-xl bg-white/3 text-xs text-gray-400">
            Weekly avg: <span className="font-bold text-white">{(filtered.length/Math.max(1,Math.ceil(filtered.length/7))).toFixed(1)}</span> sessions/week
          </div>
        </Card>
      </div>

      {/* Radar */}
      <Card>
        <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Health Dimensions</h3>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#2A2A45"/>
            <PolarAngleAxis dataKey="subject" tick={{fill:'#aaa',fontSize:11}}/>
            <Radar name="Score" dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={.2} strokeWidth={2}/>
            <Tooltip content={<Tip/>}/>
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top positions */}
      {topPos.length>0&&(
        <Card>
          <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Favourite Positions</h3>
          <div className="space-y-3">
            {topPos.map(([pos,cnt],i)=>{
              const max=topPos[0]?.[1]||1;
              return (
                <div key={pos}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-5">#{i+1}</span>
                      <span className="text-sm text-gray-200">{pos}</span>
                    </div>
                    <span className="text-xs font-bold" style={{color:'#6C63FF'}}>{cnt}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#2A2A45] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:(cnt/max*100)+'%',background:'linear-gradient(90deg,#6C63FF,#FF6584)'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* By partner */}
      {stats?.byPartner?.length>1&&(
        <Card>
          <h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>By Partner</h3>
          <div className="space-y-3">
            {stats.byPartner.map((p,i)=>{
              const max=Math.max(...stats.byPartner.map(x=>x.count));
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{background:p.color}}/>
                      <span className="text-sm text-gray-200 truncate w-28">{p.name}</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="font-bold" style={{color:p.color}}>{p.count} sessions</span>
                      <span className="text-gray-500">{p.calories.toLocaleString()} kcal</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#2A2A45] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{width:(p.count/max*100)+'%',background:p.color}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
