import { useState } from 'react';
import { usePartners, useDeletePartner, usePartnerStats } from '../hooks/usePartners';
import { useSessions } from '../hooks/useSessions';
import { Card,Avatar,Badge,Button,Spinner,EmptyState,StatCard,Modal } from '../components/ui';
import { ordinal } from '../utils/constants';
import PartnerModal from '../components/partners/PartnerModal';
import PeriodCard from '../components/period/PeriodCard';
import SessionModal from '../components/sessions/SessionModal';

function PartnerDetail({ partner, onClose, onEdit }) {
  const [tab,setTab]=useState('overview');
  const {data:stats}=usePartnerStats(partner._id);
  const {data:sessions=[]}=useSessions({partner:partner._id});
  const del=useDeletePartner();
  return (
    <Modal title={ordinal(partner.ordinal)+' — '+partner.name} onClose={onClose} wide>
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['overview','sessions','period','health'].map(t=><button key={t} onClick={()=>setTab(t)} className={'px-4 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all '+(tab===t?'bg-[#6C63FF] text-white':'bg-white/5 text-gray-400 hover:text-white')}>{t}</button>)}
      </div>
      {tab==='overview'&&<div className="space-y-4">
        <div className="flex gap-4 items-center p-4 rounded-xl bg-white/3 border border-[#2A2A45]">
          <Avatar name={partner.name} color={partner.color} size={60}/>
          <div>
            <h2 className="text-xl font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>{partner.name}</h2>
            {partner.nickname&&<p className="text-gray-400 text-sm">"{partner.nickname}"</p>}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1.5">
              {partner.birthday&&<span>🎂 {partner.birthday}</span>}{partner.heightCm&&<span>📏 {partner.heightCm}cm</span>}
              {partner.weightKg&&<span>⚖️ {partner.weightKg}kg</span>}{partner.bloodType&&<span>🩸 {partner.bloodType}</span>}
              {partner.metOn&&<span>💬 {partner.metOn}</span>}
            </div>
          </div>
        </div>
        {stats&&<div className="grid grid-cols-3 gap-3"><StatCard label="Sessions" value={stats.totalSessions} color="#6C63FF"/><StatCard label="Calories" value={(stats.totalCalories||0).toLocaleString()} color="#F9C74F"/><StatCard label="Avg Rating" value={(stats.avgRating||0)+'★'} color="#90BE6D"/></div>}
        {partner.notes&&<div className="p-4 rounded-xl bg-white/3 border border-[#2A2A45]"><div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">📝 Notes</div><p className="text-sm text-gray-200 leading-relaxed">{partner.notes}</p></div>}
        {partner.tags?.length>0&&<div><div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Tags</div><div>{partner.tags.map(t=><Badge key={t} label={'#'+t}/>)}</div></div>}
        <div className="flex gap-2 pt-1">
          <Button variant="secondary" onClick={onEdit} className="flex-1">✏️ Edit</Button>
          <Button variant="danger" onClick={async()=>{ if(!window.confirm('Delete '+partner.name+'?'))return; await del.mutateAsync(partner._id); onClose(); }} className="flex-1">🗑 Delete</Button>
        </div>
      </div>}
      {tab==='sessions'&&<div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {sessions.length===0?<p className="text-center text-gray-500 py-10">No sessions yet.</p>:sessions.map(s=>(
          <div key={s._id} className="p-3 rounded-xl bg-white/3 border border-[#2A2A45]">
            <div className="flex justify-between"><span className="text-sm font-semibold text-white">{s.date}{s.time?' · '+s.time:''}</span><span style={{color:'#F9C74F'}} className="text-sm">{'★'.repeat(s.rating||3)}</span></div>
            <div className="text-xs text-gray-400 mt-0.5">{s.durationMin}min · {s.calories}kcal · {s.intensity} · {s.mood}</div>
            {s.positions?.length>0&&<div className="mt-1.5">{s.positions.map(p=><Badge key={p} label={p}/>)}</div>}
          </div>
        ))}
      </div>}
      {tab==='period'&&<PeriodCard partner={partner}/>}
      {tab==='health'&&stats&&<div className="space-y-3">
        <div className="grid grid-cols-2 gap-3"><StatCard label="Avg Rating" value={(stats.avgRating||0)+'★'} color="#90BE6D"/><StatCard label="Avg Duration" value={(stats.avgDuration||0)+'m'} color="#6C63FF"/></div>
      </div>}
    </Modal>
  );
}

export default function PartnersPage() {
  const {data:partners=[],isLoading}=usePartners();
  const {data:allSessions=[]}=useSessions();
  const [showAdd,setShowAdd]=useState(false), [editP,setEditP]=useState(null), [viewP,setViewP]=useState(null), [showSession,setShowSession]=useState(false);
  if(isLoading)return <Spinner/>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>Partners</h1><p className="text-gray-400 text-sm mt-1">{partners.length} partner{partners.length!==1?'s':''}</p></div>
        <div className="flex gap-2">{partners.length>0&&<Button variant="secondary" onClick={()=>setShowSession(true)}>+ Session</Button>}<Button onClick={()=>setShowAdd(true)}>+ Add Partner</Button></div>
      </div>
      {partners.length===0?<EmptyState icon="💑" title="No Partners Yet" subtitle="Add your first partner to start tracking." action={<Button onClick={()=>setShowAdd(true)} size="lg">Add First Partner</Button>}/>:
      <div className="grid sm:grid-cols-2 gap-4">{partners.map((p,i)=>{ const ps=allSessions.filter(s=>(s.partner?._id||s.partner)===p._id); const cal=ps.reduce((a,b)=>a+(b.calories||0),0); const avg=ps.length?(ps.reduce((a,b)=>a+(b.rating||3),0)/ps.length).toFixed(1):null;
        return <Card key={p._id} onClick={()=>setViewP(p)} className="group hover:border-[#3A3A60]">
          <div className="flex items-start gap-3 mb-3">
            <div className="relative"><Avatar name={p.name} color={p.color} size={52}/>{p.status==='active'&&<div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#16162A]"/>}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><h3 className="font-bold text-white truncate" style={{fontFamily:"'Syne',sans-serif"}}>{p.name}</h3><span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{background:'#6C63FF22',color:'#6C63FF'}}>{ordinal(p.ordinal||i+1)}</span></div>
              {p.nickname&&<p className="text-xs text-gray-400">"{p.nickname}"</p>}
              {p.birthday&&<p className="text-xs text-gray-600 mt-0.5">🎂 {p.birthday}</p>}
            </div>
            <button onClick={e=>{e.stopPropagation();setEditP(p);}} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all text-sm">✏️</button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3 p-2.5 rounded-xl bg-white/3 border border-[#2A2A45] text-center">
            <div><div className="text-sm font-bold text-[#6C63FF]" style={{fontFamily:"'Syne',sans-serif"}}>{ps.length}</div><div className="text-[10px] text-gray-600">sessions</div></div>
            <div><div className="text-sm font-bold text-amber-400" style={{fontFamily:"'Syne',sans-serif"}}>{cal.toLocaleString()}</div><div className="text-[10px] text-gray-600">kcal</div></div>
            <div><div className="text-sm font-bold text-yellow-300" style={{fontFamily:"'Syne',sans-serif"}}>{avg?avg+'★':'—'}</div><div className="text-[10px] text-gray-600">rating</div></div>
          </div>
          {p.notes&&<p className="text-xs text-gray-400 italic mb-2 line-clamp-2">"{p.notes}"</p>}
          {p.tags?.length>0&&<div className="flex flex-wrap">{p.tags.slice(0,4).map(t=><Badge key={t} label={'#'+t}/>)}{p.tags.length>4&&<span className="text-xs text-gray-600 self-center">+{p.tags.length-4}</span>}</div>}
          {p.periodTrack&&<div className="mt-2 text-xs text-pink-400">🩸 Cycle tracked</div>}
        </Card>; })}
      </div>}
      {showAdd&&<PartnerModal onClose={()=>setShowAdd(false)} partnerCount={partners.length}/>}
      {editP&&<PartnerModal partner={editP} onClose={()=>setEditP(null)} partnerCount={partners.length}/>}
      {viewP&&<PartnerDetail partner={viewP} onClose={()=>setViewP(null)} onEdit={()=>{setEditP(viewP);setViewP(null);}}/>}
      {showSession&&<SessionModal onClose={()=>setShowSession(false)} partners={partners}/>}
    </div>
  );
}
