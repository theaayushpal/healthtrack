import { useState } from 'react';
import { useSessions, useDeleteSession } from '../hooks/useSessions';
import { usePartners } from '../hooks/usePartners';
import { Card,Avatar,Badge,Button,Spinner,EmptyState } from '../components/ui';
import { PERIOD_FLOW } from '../utils/constants';
import SessionModal from '../components/sessions/SessionModal';

export default function SessionsPage() {
  const {data:partners=[]}=usePartners();
  const [filterPid,setFilterPid]=useState('');
  const {data:sessions=[],isLoading}=useSessions(filterPid?{partner:filterPid}:{});
  const del=useDeleteSession();
  const [showAdd,setShowAdd]=useState(false), [editS,setEditS]=useState(null), [expandId,setExpandId]=useState(null);
  if(isLoading)return <Spinner/>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>Sessions</h1><p className="text-gray-400 text-sm mt-1">{sessions.length} session{sessions.length!==1?'s':''}</p></div>
        <div className="flex gap-2 flex-wrap">
          <select value={filterPid} onChange={e=>setFilterPid(e.target.value)} className="!w-auto bg-[#16162A] border border-[#2A2A45] rounded-xl text-sm text-gray-300 px-3 py-2">
            <option value="">All Partners</option>
            {partners.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {partners.length>0&&<Button onClick={()=>setShowAdd(true)}>+ Log Session</Button>}
        </div>
      </div>

      {sessions.length===0
        ?<EmptyState icon="📋" title="No Sessions Yet" subtitle="Start logging sessions to track health patterns."
            action={partners.length>0?<Button onClick={()=>setShowAdd(true)} size="lg">Log First Session</Button>:<p className="text-gray-500 text-sm">Add a partner first</p>}/>
        :<div className="space-y-3">
          {sessions.map(s=>{
            const p=partners.find(x=>x._id===(s.partner?._id||s.partner));
            const exp=expandId===s._id;
            const fl=PERIOD_FLOW.find(f=>f.value===s.periodFlow);
            return (
              <Card key={s._id}>
                <div className="flex gap-3 items-start cursor-pointer" onClick={()=>setExpandId(exp?null:s._id)}>
                  <Avatar name={p?.name||'?'} color={p?.color||'#6C63FF'} size={42}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-white">{p?.name||'Unknown'}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span style={{color:'#F9C74F'}} className="text-sm">{'★'.repeat(s.rating||3)}</span>
                        <span className="text-gray-500 text-xs">{exp?'▲':'▼'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400 mt-1">
                      <span>📅 {s.date}{s.time?' · '+s.time:''}</span>
                      <span>⏱ {s.durationMin}min</span>
                      <span className="text-amber-400 font-semibold">🔥 {s.calories} kcal</span>
                      <span className="capitalize">⚡ {s.intensity}</span>
                      {s.mood&&<span>{s.mood}</span>}
                      {s.location&&<span>📍 {s.location}</span>}
                    </div>
                    {!exp&&s.positions?.length>0&&<div className="mt-1.5">{s.positions.slice(0,3).map(pos=><Badge key={pos} label={pos}/>)}{s.positions.length>3&&<span className="text-xs text-gray-600">+{s.positions.length-3}</span>}</div>}
                  </div>
                </div>

                {exp&&(
                  <div className="mt-4 pt-4 border-t border-[#2A2A45] space-y-3 animate-fade-up">
                    <div className="grid grid-cols-4 gap-2">
                      {[{l:'kcal',v:s.calories,c:'#6C63FF'},{l:'minutes',v:s.durationMin,c:'#F9C74F'},{l:'connection',v:(s.connectionLevel||'—')+'/10',c:'#43BCCD'},{l:'anxiety',v:(s.anxietyLevel||'—')+'/10',c:'#FF6584'}].map(x=>(
                        <div key={x.l} className="text-center p-2 rounded-xl bg-white/3">
                          <div className="text-sm font-bold" style={{color:x.c,fontFamily:"'Syne',sans-serif"}}>{x.v}</div>
                          <div className="text-[9px] text-gray-600">{x.l}</div>
                        </div>
                      ))}
                    </div>
                    {s.positions?.length>0&&<div><span className="text-xs text-gray-500 uppercase tracking-widest mr-2">Positions</span>{s.positions.map(pos=><Badge key={pos} label={pos}/>)}</div>}
                    {s.physicalTags?.length>0&&<div><span className="text-xs text-gray-500 uppercase tracking-widest mr-2">Physical</span>{s.physicalTags.map(t=><Badge key={t} label={t} color="#90BE6D"/>)}</div>}
                    {s.mentalTags?.length>0&&<div><span className="text-xs text-gray-500 uppercase tracking-widest mr-2">Mental</span>{s.mentalTags.map(t=><Badge key={t} label={t} color="#43BCCD"/>)}</div>}
                    {s.healthTags?.length>0&&<div><span className="text-xs text-gray-500 uppercase tracking-widest mr-2">Health</span>{s.healthTags.map(t=><Badge key={t} label={t} color="#F9C74F"/>)}</div>}
                    <div className="flex gap-4 text-xs">
                      {s.orgasm?.self&&<span className="text-green-400">💫 You: orgasm</span>}
                      {s.orgasm?.partner&&<span className="text-pink-400">✨ Partner: orgasm</span>}
                      {s.periodFlow&&s.periodFlow!=='none'&&<span style={{color:fl?.color||'#888'}}>🩸 {fl?.label} flow</span>}
                    </div>
                    {(s.notes||s.mentalNotes||s.physicalNotes)&&(
                      <div className="p-3 rounded-xl bg-white/3 border border-[#2A2A45] text-xs text-gray-400 space-y-1">
                        {s.notes&&<p>📝 {s.notes}</p>}
                        {s.physicalNotes&&<p>💪 {s.physicalNotes}</p>}
                        {s.mentalNotes&&<p>🧠 {s.mentalNotes}</p>}
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="secondary" onClick={()=>setEditS(s)}>✏️ Edit</Button>
                      <Button size="sm" variant="danger" onClick={()=>{ if(!window.confirm('Delete?'))return; del.mutate(s._id); }}>🗑 Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      }
      {showAdd&&<SessionModal onClose={()=>setShowAdd(false)} partners={partners}/>}
      {editS&&<SessionModal session={editS} onClose={()=>setEditS(null)} partners={partners}/>}
    </div>
  );
}
