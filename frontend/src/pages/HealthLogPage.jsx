import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePartners } from '../hooks/usePartners';
import { Card, Button, Spinner, Modal, EmptyState } from '../components/ui';
import api from '../utils/api';
import toast from 'react-hot-toast';

const LOG_TYPES = [
  {v:'sti_test',   label:'STI Test',      icon:'🧪', color:'#6C63FF'},
  {v:'pill',       label:'Contraceptive', icon:'💊', color:'#FF6584'},
  {v:'checkup',    label:'Checkup',       icon:'🏥', color:'#43BCCD'},
  {v:'symptom',    label:'Symptom',       icon:'🤒', color:'#F9C74F'},
  {v:'vaccination',label:'Vaccination',   icon:'💉', color:'#90BE6D'},
  {v:'note',       label:'Note',          icon:'📝', color:'#94A3B8'},
];

const resultColors = {positive:'#F87171',negative:'#34D399',pending:'#F9C74F','N/A':'#6B7280'};

function AddLogModal({ partners, onClose }) {
  const qc = useQueryClient();
  const [f,setF] = useState({date:new Date().toISOString().split('T')[0],type:'sti_test',result:'N/A',notes:'',remindAt:'',partner:''});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const mut = useMutation({ mutationFn:d=>api.post('/health',d), onSuccess:()=>{qc.invalidateQueries(['healthLogs']);toast.success('Health log added!');onClose();}, onError:e=>toast.error(e.response?.data?.message||'Error') });

  return (
    <Modal title="Add Health Log" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {LOG_TYPES.map(t=>(
              <button key={t.v} type="button" onClick={()=>set('type',t.v)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all"
                style={f.type===t.v?{border:'1px solid '+t.color+'66',background:t.color+'22',color:t.color}:{border:'1px solid #2A2A45',color:'#6B7280',background:'transparent'}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Date</label><input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Result</label>
            <select value={f.result} onChange={e=>set('result',e.target.value)}>
              {['N/A','positive','negative','pending'].map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Related Partner (optional)</label>
          <select value={f.partner} onChange={e=>set('partner',e.target.value)}>
            <option value="">— None —</option>
            {partners.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Reminder Date</label><input type="date" value={f.remindAt} onChange={e=>set('remindAt',e.target.value)}/></div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Notes</label><textarea value={f.notes} onChange={e=>set('notes',e.target.value)} rows={3} style={{resize:'vertical'}}/></div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={()=>mut.mutate(f)} disabled={mut.isPending} className="flex-1">{mut.isPending?'⏳ Saving...':'Save Log'}</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function HealthLogPage() {
  const { data:partners=[] } = usePartners();
  const qc = useQueryClient();
  const { data:logs=[], isLoading } = useQuery({
    queryKey:['healthLogs'],
    queryFn:async()=>(await api.get('/health')).data.data
  });
  const [showAdd,setShowAdd] = useState(false);
  const delMut = useMutation({ mutationFn:id=>api.delete('/health/'+id), onSuccess:()=>{qc.invalidateQueries(['healthLogs']);toast.success('Log deleted');}, onError:e=>toast.error(e.response?.data?.message||'Error') });

  if(isLoading) return <Spinner/>;

  const upcoming = logs.filter(l=>l.remindAt&&new Date(l.remindAt+'T00:00:00')>=new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>Health Log 🏥</h1>
          <p className="text-gray-400 text-sm mt-1">STI tests, checkups & health events</p>
        </div>
        <Button onClick={()=>setShowAdd(true)}>+ Add Log</Button>
      </div>

      {upcoming.length>0&&(
        <Card style={{border:'1px solid #F9C74F33',background:'#F9C74F08'}}>
          <h3 className="font-bold text-amber-400 mb-3" style={{fontFamily:"'Syne',sans-serif"}}>⏰ Upcoming Reminders</h3>
          {upcoming.map(l=>{
            const t=LOG_TYPES.find(x=>x.v===l.type);
            return (
              <div key={l._id} className="flex items-center gap-3 py-2">
                <span className="text-xl">{t?.icon}</span>
                <div>
                  <div className="text-sm font-medium text-white">{t?.label}</div>
                  <div className="text-xs text-amber-400">Reminder: {l.remindAt}</div>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {logs.length===0
        ?<EmptyState icon="🏥" title="No Health Logs" subtitle="Track STI tests, checkups, vaccinations, and health events."
            action={<Button onClick={()=>setShowAdd(true)} size="lg">Add First Log</Button>}/>
        :<div className="space-y-3">
          {logs.map(l=>{
            const t=LOG_TYPES.find(x=>x.v===l.type);
            const p=partners.find(x=>x._id===l.partner);
            return (
              <Card key={l._id} className="group">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">{t?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm text-white">{t?.label}</h3>
                      <span className="text-xs font-semibold capitalize" style={{color:resultColors[l.result]||'#6B7280'}}>{l.result}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-0.5">
                      <span>📅 {l.date}</span>
                      {p&&<span>💑 {p.name}</span>}
                      {l.remindAt&&<span className="text-amber-400">⏰ Reminder: {l.remindAt}</span>}
                    </div>
                    {l.notes&&<p className="text-xs text-gray-400 mt-1.5 italic">"{l.notes}"</p>}
                  </div>
                  <button onClick={()=>{ if(!window.confirm('Delete?'))return; delMut.mutate(l._id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-400/10 text-sm shrink-0">
                    🗑
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      }
      {showAdd&&<AddLogModal partners={partners} onClose={()=>setShowAdd(false)}/>}
    </div>
  );
}
