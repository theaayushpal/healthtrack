import { useState } from 'react';
import { Modal, Button, MultiSelect, RatingStars, SliderInput, Toggle } from '../ui';
import { useCreateSession, useUpdateSession } from '../../hooks/useSessions';
import { POSITIONS,MOOD_OPTIONS,PHYSICAL_TAGS,MENTAL_TAGS,HEALTH_TAGS,PERIOD_FLOW,calcCalories } from '../../utils/constants';

export default function SessionModal({ onClose, partners=[], session }) {
  const isEdit=!!session;
  const [step,setStep]=useState(1);
  const [f,setF]=useState(session?{...session,partner:session.partner?._id||session.partner}:{
    partner:partners[0]?._id||'',date:new Date().toISOString().split('T')[0],time:new Date().toTimeString().slice(0,5),
    durationMin:30,intensity:'medium',bodyWeightKg:70,positions:[],physicalTags:[],mentalTags:[],healthTags:[],
    mood:'Good',rating:3,periodFlow:'none',orgasm:{self:false,partner:false},
    anxietyLevel:4,connectionLevel:7,location:'',notes:'',physicalNotes:'',mentalNotes:'',
  });
  const create=useCreateSession(), update=useUpdateSession();
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const kcal=calcCalories({durationMin:f.durationMin,intensity:f.intensity,bodyWeightKg:f.bodyWeightKg,positions:f.positions});
  const save=async()=>{ if(!f.partner)return; isEdit?await update.mutateAsync({id:session._id,data:f}):await create.mutateAsync(f); onClose(); };
  const STEPS=['Basic','Physical','Mental','Health'];

  return (
    <Modal title={isEdit?'Edit Session':'Log New Session'} onClose={onClose} wide>
      <div className="flex gap-2 mb-5">
        {STEPS.map((s,i)=><button key={i} onClick={()=>setStep(i+1)} className={'flex-1 py-2 rounded-xl text-xs font-bold transition-all '+(step===i+1?'bg-[#6C63FF] text-white':step>i+1?'bg-[#6C63FF]/20 text-[#6C63FF]':'bg-white/5 text-gray-500')}>{i+1}. {s}</button>)}
      </div>

      {step===1&&<div className="space-y-4">
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Partner *</label><select value={f.partner} onChange={e=>set('partner',e.target.value)}>{partners.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Date</label><input type="date" value={f.date} onChange={e=>set('date',e.target.value)}/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Time</label><input type="time" value={f.time} onChange={e=>set('time',e.target.value)}/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Duration (min)</label><input type="number" value={f.durationMin} min={1} onChange={e=>set('durationMin',+e.target.value||1)}/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Body Weight (kg)</label><input type="number" value={f.bodyWeightKg} onChange={e=>set('bodyWeightKg',+e.target.value||70)}/></div>
        </div>
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Intensity</label>
          <div className="flex gap-2">{[{v:'light',e:'🌿'},{v:'medium',e:'⚡'},{v:'intense',e:'🔥'}].map(({v,e})=><button key={v} onClick={()=>set('intensity',v)} className={'flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all '+(f.intensity===v?'bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/50':'bg-transparent text-gray-400 border border-[#2A2A45]')}>{e} {v}</button>)}</div></div>
        <div className="flex gap-5 p-4 rounded-xl" style={{background:'#6C63FF0F',border:'1px solid #6C63FF33'}}>
          <div><span className="text-2xl font-bold" style={{color:'#6C63FF',fontFamily:"'Syne',sans-serif"}}>{kcal}</span><span className="text-xs text-gray-500 ml-1.5">kcal burned</span></div>
          <div><span className="text-2xl font-bold text-amber-400" style={{fontFamily:"'Syne',sans-serif"}}>{f.durationMin}</span><span className="text-xs text-gray-500 ml-1.5">minutes</span></div>
        </div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Location</label><input value={f.location} onChange={e=>set('location',e.target.value)} placeholder="Home, Hotel, Her place..."/></div>
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Rating</label><RatingStars value={f.rating} onChange={v=>set('rating',v)}/></div>
      </div>}

      {step===2&&<div className="space-y-4">
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Positions</label><MultiSelect options={POSITIONS} selected={f.positions} onChange={v=>set('positions',v)}/></div>
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Physical Tags</label><MultiSelect options={PHYSICAL_TAGS} selected={f.physicalTags} onChange={v=>set('physicalTags',v)}/></div>
        <div className="rounded-xl border border-[#2A2A45] p-4 space-y-3">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Orgasm</div>
          {[{key:'self',label:'You reached orgasm'},{key:'partner',label:'Partner reached orgasm'}].map(({key,label})=>(
            <div key={key} className="flex items-center justify-between py-1"><span className="text-sm text-gray-200">{label}</span><Toggle value={f.orgasm[key]} onChange={v=>set('orgasm',{...f.orgasm,[key]:v})}/></div>
          ))}
        </div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Physical Notes</label><textarea value={f.physicalNotes} onChange={e=>set('physicalNotes',e.target.value)} rows={2} style={{resize:'vertical'}} placeholder="How your body felt..."/></div>
      </div>}

      {step===3&&<div className="space-y-4">
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Mood</label>
          <div className="flex flex-wrap gap-2">{MOOD_OPTIONS.map(m=><button key={m.value} onClick={()=>set('mood',m.value)} className={'px-3 py-2 rounded-xl text-sm font-semibold transition-all '+(f.mood===m.value?'bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/50':'bg-transparent text-gray-400 border border-[#2A2A45]')}>{m.label}</button>)}</div></div>
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Mental Tags</label><MultiSelect options={MENTAL_TAGS} selected={f.mentalTags} onChange={v=>set('mentalTags',v)}/></div>
        <div className="rounded-xl border border-[#2A2A45] p-4 space-y-4">
          <SliderInput label="Anxiety Level" value={f.anxietyLevel} onChange={v=>set('anxietyLevel',v)} color="#FF6584"/>
          <SliderInput label="Connection Level" value={f.connectionLevel} onChange={v=>set('connectionLevel',v)} color="#6C63FF"/>
        </div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Mental Notes</label><textarea value={f.mentalNotes} onChange={e=>set('mentalNotes',e.target.value)} rows={3} style={{resize:'vertical'}} placeholder="How you felt emotionally..."/></div>
      </div>}

      {step===4&&<div className="space-y-4">
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Health & Safety Tags</label><MultiSelect options={HEALTH_TAGS} selected={f.healthTags} onChange={v=>set('healthTags',v)}/></div>
        <div><label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Partner Period Flow</label>
          <div className="flex gap-2 flex-wrap">{PERIOD_FLOW.map(fl=><button key={fl.value} onClick={()=>set('periodFlow',fl.value)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={f.periodFlow===fl.value?{border:'1px solid '+fl.color+'66',background:fl.color+'22',color:fl.color}:{border:'1px solid #2A2A45',color:'#6B7280',background:'transparent'}}>{fl.label}</button>)}</div></div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Journal Notes</label><textarea value={f.notes} onChange={e=>set('notes',e.target.value)} rows={4} style={{resize:'vertical'}} placeholder="How was the overall experience?"/></div>
        <div className="p-4 rounded-xl text-xs text-gray-400 space-y-1" style={{background:'#6C63FF0D',border:'1px solid #6C63FF33'}}>
          <div className="font-semibold text-white text-sm mb-2">📋 Summary</div>
          <div>📅 {f.date}{f.time?' at '+f.time:''} · ⏱ {f.durationMin}min · 🔥 {kcal} kcal</div>
          <div>😊 {f.mood} · ⭐ {f.rating}/5 · ⚡ {f.intensity}</div>
          {f.location&&<div>📍 {f.location}</div>}
        </div>
      </div>}

      <div className="flex gap-3 mt-5">
        {step>1?<Button variant="secondary" onClick={()=>setStep(s=>s-1)} className="flex-1">← Back</Button>:<Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>}
        {step<4?<Button onClick={()=>setStep(s=>s+1)} className="flex-1">Next →</Button>
               :<Button onClick={save} disabled={create.isPending||update.isPending||!f.partner} className="flex-1">{create.isPending||update.isPending?'⏳ Saving...':(isEdit?'Update':'✅ Log Session')}</Button>}
      </div>
    </Modal>
  );
}
