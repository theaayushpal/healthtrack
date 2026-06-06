import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import toast from 'react-hot-toast';
export default function LoginPage() {
  const [tab,setTab]=useState('login'), [f,setF]=useState({username:'',email:'',password:''}), [loading,setLoading]=useState(false);
  const { login,register }=useAuth(), navigate=useNavigate();
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const handle=async e=>{ e.preventDefault(); setLoading(true); try { tab==='login'?await login(f.email,f.password):await register(f.username,f.email,f.password); navigate('/'); } catch(err){ toast.error(err.response?.data?.message||'Something went wrong'); } finally { setLoading(false); } };
  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,#6C63FF15 0%,transparent 70%)'}}/>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,#FF658415 0%,transparent 70%)'}}/>
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8"><div className="text-5xl mb-4">❤️</div><h1 className="text-3xl font-bold text-gradient" style={{fontFamily:"'Syne',sans-serif"}}>HealthTrack</h1><p className="text-gray-500 text-sm mt-2">Your private health & wellness journal</p></div>
        <div className="bg-[#16162A] border border-[#2A2A45] rounded-2xl p-6">
          <div className="flex rounded-xl p-1 mb-6" style={{background:'rgba(255,255,255,.04)'}}>
            {['login','register'].map(t=><button key={t} onClick={()=>setTab(t)} className={'flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all '+(tab===t?'bg-[#6C63FF] text-white shadow-lg':'text-gray-400 hover:text-white')}>{t==='login'?'Sign In':'Sign Up'}</button>)}
          </div>
          <form onSubmit={handle} className="space-y-4">
            {tab==='register'&&<div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Username</label><input value={f.username} onChange={e=>set('username',e.target.value)} placeholder="johndoe" required minLength={3}/></div>}
            <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Email</label><input type="email" value={f.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required/></div>
            <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Password</label><input type="password" value={f.password} onChange={e=>set('password',e.target.value)} placeholder="••••••••" required minLength={6}/></div>
            <Button type="submit" disabled={loading} size="lg" className="w-full mt-2 justify-center">{loading?'⏳ Loading...':(tab==='login'?'Sign In':'Create Account')}</Button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-4">🔒 All data is private. Only you can see it.</p>
        </div>
      </div>
    </div>
  );
}
