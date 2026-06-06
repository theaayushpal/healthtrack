import { useState } from 'react';
import { useStats } from '../hooks/useStats';
import { useSessions } from '../hooks/useSessions';
import { usePartners } from '../hooks/usePartners';
import { StatCard,Card,Spinner,Button,Avatar,Badge } from '../components/ui';
import { ordinal } from '../utils/constants';
import SessionModal from '../components/sessions/SessionModal';
import PartnerModal from '../components/partners/PartnerModal';
import { AreaChart,Area,XAxis,YAxis,Tooltip,ResponsiveContainer } from 'recharts';
const Tip=({active,payload,label})=>{ if(!active||!payload?.length)return null; return <div className="bg-[#16162A] border border-[#2A2A45] rounded-xl px-3 py-2 text-xs shadow-xl"><div className="text-gray-400 mb-1">{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||'#fff'}}>{p.name}: <b>{p.value}</b></div>)}</div>; };
export default function DashboardPage() {
  const {data:stats,isLoading}=useStats(), {data:sessions=[]}=useSessions(), {data:partners=[]}=usePartners();
  const [showSession,setShowSession]=useState(false), [showPartner,setShowPartner]=useState(false);
  if(isLoading)return <Spinner/>;
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl p-7" style={{background:'linear-gradient(135deg,#6C63FF22,#FF658422)',border:'1px solid #2A2A45'}}>
        <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:"'Syne',sans-serif"}}>Welcome back 👋</h1>
        <p className="text-gray-400 text-sm mb-5">Your personal health overview</p>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={()=>partners.length?setShowSession(true):setShowPartner(true)} size="lg">+ Log Session</Button>
          <Button onClick={()=>setShowPartner(true)} variant="secondary" size="lg">+ Add Partner</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="💑" label="Partners"   value={partners.length} color="#6C63FF"/>
        <StatCard icon="📋" label="Sessions"   value={sessions.length} color="#FF6584"/>
        <StatCard icon="🔥" label="Calories"   value={(sessions.reduce((a,b)=>a+(b.calories||0),0)).toLocaleString()} sub="kcal" color="#F9C74F"/>
        <StatCard icon="⭐" label="Avg Rating" value={(sessions.length?(sessions.reduce((a,b)=>a+(b.rating||3),0)/sessions.length).toFixed(1):0)+'★'} color="#90BE6D"/>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {stats?.monthly?.length>0&&<Card><h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Monthly Sessions</h3><ResponsiveContainer width="100%" height={180}><AreaChart data={stats.monthly}><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6C63FF" stopOpacity={.3}/><stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="label" tick={{fontSize:10,fill:'#555'}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:'#555'}} axisLine={false} tickLine={false} allowDecimals={false}/><Tooltip content={<Tip/>}/><Area type="monotone" dataKey="count" name="Sessions" stroke="#6C63FF" strokeWidth={2} fill="url(#ga)"/></AreaChart></ResponsiveContainer></Card>}
        {stats?.byPartner?.length>0&&<Card><h3 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>By Partner</h3>{stats.byPartner.map((p,i)=>{ const mx=Math.max(...stats.byPartner.map(x=>x.count)); return <div key={i} className="flex items-center gap-3 mb-3"><Avatar name={p.name} color={p.color} size={28}/><div className="flex-1"><div className="flex justify-between text-sm mb-1"><span className="text-white">{p.name}</span><span className="text-gray-400">{p.count}</span></div><div className="h-1.5 rounded-full bg-[#2A2A45] overflow-hidden"><div className="h-full rounded-full" style={{width:(p.count/mx*100)+'%',background:p.color}}/></div></div></div>; })}</Card>}
      </div>
      {partners.length===0&&<Card className="text-center py-16"><div className="text-6xl mb-4">💑</div><h3 className="text-xl font-bold text-white mb-2" style={{fontFamily:"'Syne',sans-serif"}}>Get Started</h3><p className="text-gray-400 text-sm mb-6">Add your first partner to begin tracking</p><Button onClick={()=>setShowPartner(true)} size="lg">Add First Partner</Button></Card>}
      {showSession&&<SessionModal onClose={()=>setShowSession(false)} partners={partners}/>}
      {showPartner&&<PartnerModal onClose={()=>setShowPartner(false)} partnerCount={partners.length}/>}
    </div>
  );
}
