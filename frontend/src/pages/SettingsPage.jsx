import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Avatar } from '../components/ui';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [f,setF] = useState({username:user?.username||'',bodyWeightKg:user?.bodyWeightKg||70});
  const [loading,setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', f);
      updateUser(data.user);
      toast.success('Profile updated! ✅');
    } catch(e) { toast.error(e.response?.data?.message||'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{fontFamily:"'Syne',sans-serif"}}>Settings ⚙️</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your profile & preferences</p>
      </div>

      <Card>
        <h2 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>👤 Profile</h2>
        <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-white/3 border border-[#2A2A45]">
          <Avatar name={user?.username||'U'} color="#6C63FF" size={56}/>
          <div>
            <div className="font-semibold text-white">{user?.username}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Username</label><input value={f.username} onChange={e=>setF(p=>({...p,username:e.target.value}))}/></div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-widest">Default Body Weight (kg)</label>
            <input type="number" value={f.bodyWeightKg} onChange={e=>setF(p=>({...p,bodyWeightKg:+e.target.value||70}))}/>
            <p className="text-xs text-gray-600 mt-1">Used as default for calorie calculations</p>
          </div>
          <Button onClick={save} disabled={loading}>{loading?'⏳ Saving...':'💾 Save Changes'}</Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-white mb-4" style={{fontFamily:"'Syne',sans-serif"}}>🔒 Privacy & Security</h2>
        <div className="space-y-3">
          {[
            {icon:'🔐',title:'JWT Authentication',desc:'Sessions expire after 30 days. Always log out on shared devices.'},
            {icon:'🛡', title:'End-to-End Private',desc:'All data is stored encrypted. Only you can access it with your account.'},
            {icon:'👁', title:'No Data Sharing',desc:'Your data is never shared with third parties, ever.'},
          ].map(x=>(
            <div key={x.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/3">
              <span className="text-lg mt-0.5">{x.icon}</span>
              <div>
                <div className="text-sm font-medium text-white">{x.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{x.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-white mb-3" style={{fontFamily:"'Syne',sans-serif"}}>ℹ️ About</h2>
        <div className="text-sm text-gray-400 space-y-1">
          <p>HealthTrack v1.0.0</p>
          <p>MERN Stack — MongoDB · Express · React · Node.js</p>
          <p>Built for personal health & wellness tracking</p>
        </div>
      </Card>

      <Card style={{border:'1px solid #F8717122',background:'#F8717108'}}>
        <h2 className="font-bold text-white mb-2" style={{fontFamily:"'Syne',sans-serif"}}>🚪 Sign Out</h2>
        <p className="text-gray-400 text-sm mb-4">You'll be redirected to the login page.</p>
        <Button variant="danger" onClick={()=>{ logout(); navigate('/login'); }}>Sign Out</Button>
      </Card>
    </div>
  );
}
