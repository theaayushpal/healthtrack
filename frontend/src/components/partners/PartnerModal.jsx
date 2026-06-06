import { useState } from 'react';
import { Modal, Button, Avatar, Toggle } from '../ui';
import { useCreatePartner, useUpdatePartner } from '../../hooks/usePartners';
import { PARTNER_COLORS, BLOOD_TYPES, ordinal } from '../../utils/constants';

export default function PartnerModal({ onClose, partner, partnerCount=0 }) {
  const isEdit=!!partner;
  const [f,setF]=useState(partner||{name:'',nickname:'',color:PARTNER_COLORS[partnerCount%PARTNER_COLORS.length],birthday:'',heightCm:'',weightKg:'',bloodType:'',notes:'',tags:[],status:'active',metOn:'',periodTrack:false,avgCycleLen:28,lastPeriodStart:''});
  const [tagIn,setTagIn]=useState('');
  const create=useCreatePartner(), update=useUpdatePartner();
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const addTag=()=>{ const t=tagIn.trim().replace(/^#/,''); if(t&&!f.tags.includes(t))set('tags',[...f.tags,t]); setTagIn(''); };
  const save=async()=>{ if(!f.name.trim())return; isEdit?await update.mutateAsync({id:partner._id,data:f}):await create.mutateAsync(f); onClose(); };

  return (
    <Modal title={isEdit?'Edit — '+partner.name:'Add '+ordinal(partnerCount+1)+' Partner'} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <Avatar name={f.name||'?'} color={f.color} size={56}/>
          <div className="flex-1 space-y-3">
            <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Full Name *</label><input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="Her name"/></div>
            <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Nickname</label><input value={f.nickname} onChange={e=>set('nickname',e.target.value)} placeholder="Babe, Honey..."/></div>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Avatar Color</label>
          <div className="flex flex-wrap gap-2">{PARTNER_COLORS.map(c=><div key={c} onClick={()=>set('color',c)} className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{background:c,border:f.color===c?'3px solid #fff':'2px solid transparent'}}/>)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Birthday</label><input type="date" value={f.birthday} onChange={e=>set('birthday',e.target.value)}/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Status</label><select value={f.status} onChange={e=>set('status',e.target.value)}>{['active','past','complicated','other'].map(s=><option key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</option>)}</select></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Height (cm)</label><input type="number" value={f.heightCm} onChange={e=>set('heightCm',e.target.value)} placeholder="165"/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Weight (kg)</label><input type="number" value={f.weightKg} onChange={e=>set('weightKg',e.target.value)} placeholder="58"/></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Blood Type</label><select value={f.bloodType} onChange={e=>set('bloodType',e.target.value)}>{BLOOD_TYPES.map(b=><option key={b} value={b}>{b||'— select —'}</option>)}</select></div>
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Met On</label><input value={f.metOn} onChange={e=>set('metOn',e.target.value)} placeholder="Tinder, College..."/></div>
        </div>
        <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Notes / Description</label><textarea value={f.notes} onChange={e=>set('notes',e.target.value)} rows={3} style={{resize:'vertical'}} placeholder="How you met, personality, things not to forget..."/></div>
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
            {f.tags.map(t=><span key={t} className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold" style={{background:'#6C63FF22',color:'#6C63FF',border:'1px solid #6C63FF33'}}>#{t}<button type="button" onClick={()=>set('tags',f.tags.filter(x=>x!==t))} className="hover:text-red-400 font-bold">×</button></span>)}
          </div>
          <div className="flex gap-2"><input value={tagIn} onChange={e=>setTagIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder="Type tag + Enter (adventurous, college...)"/><Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button></div>
        </div>
        <div className="rounded-xl border border-[#2A2A45] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div><div className="text-sm font-semibold text-white">🩸 Track Menstrual Cycle</div><div className="text-xs text-gray-500 mt-0.5">Cycle predictions & fertility windows</div></div>
            <Toggle value={f.periodTrack} onChange={v=>set('periodTrack',v)}/>
          </div>
          {f.periodTrack&&<div className="grid grid-cols-2 gap-3 pt-1">
            <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Last Period Start</label><input type="date" value={f.lastPeriodStart} onChange={e=>set('lastPeriodStart',e.target.value)}/></div>
            <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Avg Cycle (days)</label><input type="number" value={f.avgCycleLen} onChange={e=>set('avgCycleLen',+e.target.value)} min={21} max={45}/></div>
          </div>}
        </div>
        <div className="flex gap-3 pt-1">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={save} disabled={create.isPending||update.isPending||!f.name.trim()} className="flex-1">
            {create.isPending||update.isPending?'⏳ Saving...':(isEdit?'Update Partner':'Add Partner')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
